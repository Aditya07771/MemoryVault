package com.codebyte.lifevault_dapp.core

import android.util.Log
import com.codebyte.lifevault_dapp.data.BackendApi
import com.codebyte.lifevault_dapp.data.MemoryItem
import com.codebyte.lifevault_dapp.data.RelayRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okio.BufferedSink
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class AptosClient(private val cryptoManager: CryptoManager) {

    companion object {
        private const val TAG = "AptosClient"
    }

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    // Custom RequestBody to handle JSON content types correctly
    private class JsonRequestBody(private val json: String) : RequestBody() {
        override fun contentType() = "application/json; charset=utf-8".toMediaType()
        override fun writeTo(sink: BufferedSink) {
            sink.writeUtf8(json)
        }
    }

    // -----------------------------------------------------------------------
    // 🚀 REAL: Submit Memory via Backend Relayer
    // This is the function that actually secures data on the blockchain
    // -----------------------------------------------------------------------
    suspend fun submitRealMemory(
        title: String,
        ipfsHash: String,
        signatureHex: String,
        fileName: String,
        fileSize: Long,
        authToken: String = ""
    ): String = withContext(Dispatchers.IO) {
        try {
            Log.d(TAG, "🚀 Initiating Sponsored Transaction via Relayer...")

            val request = RelayRequest(
                title = title,
                ipfsHash = ipfsHash,
                signature = signatureHex,
                category = "General",
                fileName = fileName,
                fileSize = fileSize
            )

            // Call your Backend API
            // If your backend is deployed, BackendApi.service uses that URL
            val response = BackendApi.service.relayMemory("Bearer $authToken", request)

            if (response.isSuccessful && response.body()?.success == true) {
                // ✅ SUCCESS: The backend returned the REAL transaction hash
                val txHash = response.body()?.data?.tx?.hash ?: ""
                Log.d(TAG, "✅ Transaction Confirmed on Aptos: $txHash")
                return@withContext txHash
            } else {
                // ❌ FAILURE: Parse error message
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    JSONObject(errorBody ?: "{}").optString("message", response.message())
                } catch (e: Exception) {
                    response.message()
                }
                throw Exception("Relay Failed: $errorMessage")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Submission failed", e)
            throw e
        }
    }

    // -----------------------------------------------------------------------
    // 💰 REAL: Get Balance
    // -----------------------------------------------------------------------
    suspend fun getBalance(address: String): Long = withContext(Dispatchers.IO) {
        try {
            // Check specific CoinStore resource on Aptos
            val resourceType = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
            val url = "${AptosConfig.NODE_URL}/accounts/$address/resource/$resourceType"

            val request = Request.Builder().url(url).get().build()

            httpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) return@withContext 0L

                val json = JSONObject(response.body?.string() ?: "{}")
                val data = json.optJSONObject("data") ?: return@withContext 0L
                val coin = data.optJSONObject("coin") ?: return@withContext 0L

                // Return value in Octas (1 APT = 100,000,000 Octas)
                coin.optString("value", "0").toLongOrNull() ?: 0L
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to get balance", e)
            0L
        }
    }

    // -----------------------------------------------------------------------
    // 💧 REAL: Fund from Faucet (Testnet Only)
    // -----------------------------------------------------------------------
    suspend fun fundFromFaucet(address: String, amount: Long = 100_000_000): Boolean = withContext(Dispatchers.IO) {
        try {
            val url = "${AptosConfig.FAUCET_URL}/mint?amount=$amount&address=$address"
            val request = Request.Builder()
                .url(url)
                .post(JsonRequestBody(""))
                .build()

            httpClient.newCall(request).execute().use { response ->
                Log.d(TAG, "Faucet Response Code: ${response.code}")
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.e(TAG, "Faucet failed", e)
            false
        }
    }

    // -----------------------------------------------------------------------
    // 📡 REAL: Fetch memories from Blockchain State
    // -----------------------------------------------------------------------
    suspend fun fetchUserMemories(address: String): List<MemoryItem> = withContext(Dispatchers.IO) {
        try {
            val url = "${AptosConfig.NODE_URL}/view"

            val payload = JSONObject().apply {
                put("function", "${AptosConfig.MODULE_ADDRESS}::${AptosConfig.MODULE_NAME}::get_memories")
                put("type_arguments", JSONArray())
                put("arguments", JSONArray().apply { put(address) })
            }

            val request = Request.Builder()
                .url(url)
                .post(JsonRequestBody(payload.toString()))
                .build()

            httpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) return@withContext emptyList()

                val jsonArray = JSONArray(response.body?.string() ?: "[]")
                // Move View functions return an array of results.
                // Result 0 is our vector<Memory>
                if (jsonArray.length() == 0) return@withContext emptyList()

                val memoriesArray = jsonArray.optJSONArray(0) ?: return@withContext emptyList()
                val list = mutableListOf<MemoryItem>()

                for (i in 0 until memoriesArray.length()) {
                    val mem = memoriesArray.getJSONObject(i)

                    // Decode fields from Move Struct
                    val rawTitle = mem.optString("title", "Secured Memory")
                    val rawHash = mem.optString("ipfs_hash", "")

                    // Convert Hex to String if title comes back as hex (common in Aptos)
                    val cleanTitle = if (rawTitle.startsWith("0x")) convertHexToString(rawTitle) else rawTitle
                    val cleanHash = if (rawHash.startsWith("0x")) convertHexToString(rawHash) else rawHash

                    list.add(MemoryItem(
                        id = (System.currentTimeMillis() + i).toInt(), // Generate local ID
                        title = cleanTitle,
                        date = "On-Chain",
                        ipfsHash = cleanHash,
                        isSecured = true
                    ))
                }
                list
            }
        } catch (e: Exception) {
            Log.e(TAG, "Fetch memories failed", e)
            emptyList()
        }
    }

    // Helper to convert Move Hex Strings back to Readable Strings
    private fun convertHexToString(hex: String): String {
        val cleanHex = if (hex.startsWith("0x")) hex.substring(2) else hex
        val output = StringBuilder()
        for (i in 0 until cleanHex.length step 2) {
            val str = cleanHex.substring(i, i + 2)
            output.append(str.toInt(16).toChar())
        }
        return output.toString()
    }

    // -----------------------------------------------------------------------
    // ⚠️ DEPRECATED: Old Fake Registration (Keep as fallback only)
    // -----------------------------------------------------------------------
    suspend fun registerMemory(title: String, ipfsHash: String): String = withContext(Dispatchers.IO) {
        Log.w(TAG, "⚠️ Using Deprecated registerMemory (Fake). Use submitRealMemory instead.")
        kotlinx.coroutines.delay(1000)
        "0x${System.currentTimeMillis().toString(16).padStart(64, '0')}"
    }
}