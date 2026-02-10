// src/main/java/com/codebyte/lifevault_dapp/core/IPFSClient.kt
package com.codebyte.lifevault_dapp.core

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class IPFSClient {

    companion object {
        private const val TAG = "IPFSClient"
        private const val PINATA_API_URL = "https://api.pinata.cloud"
        // Ensure you use your valid Pinata keys here
        private const val PINATA_API_KEY = "92ce2780d1f3d7c245e7"
        private const val PINATA_SECRET_KEY = "859ec47bf1e4103ab4eaf2fe33db111e8f4821fe2b98a3859a06548d02541ac2"
        private const val IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/"
    }

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    suspend fun uploadFileToPinata(
        fileBytes: ByteArray,
        fileName: String,
        mimeType: String = "application/octet-stream"
    ): IPFSUploadResult = withContext(Dispatchers.IO) {
        try {
            val url = "$PINATA_API_URL/pinning/pinFileToIPFS"

            val requestBody = MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", fileName, fileBytes.toRequestBody(mimeType.toMediaType()))
                .addFormDataPart("pinataMetadata", JSONObject().put("name", fileName).toString())
                .build()

            val request = Request.Builder()
                .url(url)
                .post(requestBody)
                .header("pinata_api_key", PINATA_API_KEY)
                .header("pinata_secret_api_key", PINATA_SECRET_KEY)
                .build()

            httpClient.newCall(request).execute().use { response ->
                val responseBody = response.body?.string() ?: ""
                if (!response.isSuccessful) throw Exception("Upload failed: ${response.code} - $responseBody")

                val json = JSONObject(responseBody)
                val ipfsHash = json.getString("IpfsHash")

                Log.d(TAG, "File uploaded to IPFS: $ipfsHash")

                IPFSUploadResult(
                    hash = ipfsHash,
                    url = "$IPFS_GATEWAY$ipfsHash",
                    size = json.optLong("PinSize", 0)
                )
            }
        } catch (e: Exception) {
            Log.e(TAG, "IPFS file upload failed", e)
            throw e
        }
    }

    suspend fun downloadFromIPFS(ipfsHash: String): ByteArray = withContext(Dispatchers.IO) {
        try {
            val cleanHash = ipfsHash.trim()
            if (cleanHash.length < 5) throw Exception("Invalid Hash")

            val url = "$IPFS_GATEWAY$cleanHash"
            Log.d(TAG, "Downloading from: $url")

            val request = Request.Builder().url(url).get().build()

            httpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) throw Exception("Download failed: ${response.code}")
                response.body?.bytes() ?: throw Exception("Empty response")
            }
        } catch (e: Exception) {
            Log.e(TAG, "IPFS download failed: $ipfsHash", e)
            throw e
        }
    }

    data class IPFSUploadResult(val hash: String, val url: String, val size: Long)
}