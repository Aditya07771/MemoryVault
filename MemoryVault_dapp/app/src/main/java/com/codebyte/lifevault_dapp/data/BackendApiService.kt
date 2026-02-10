package com.codebyte.lifevault_dapp.data

import com.codebyte.lifevault_dapp.core.AptosConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

// ---------------------------------------------------------------------------
// 🚀 DATA MODELS FOR RELAY (SPONSORED TRANSACTIONS)
// ---------------------------------------------------------------------------

data class RelayRequest(
    val title: String,
    val ipfsHash: String,
    val signature: String, // Hex string (e.g. "0x123...")
    val category: String,
    val fileName: String,
    val fileSize: Long
)

data class RelayResponse(
    val success: Boolean,
    val message: String,
    val data: RelayData?
)

data class RelayData(
    val memory: MemoryItem,
    val tx: TransactionDetails
)

data class TransactionDetails(
    val hash: String,      // The Real Aptos Tx Hash
    val explorerUrl: String
)

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T?
)

// ---------------------------------------------------------------------------
// 🌐 API INTERFACE
// ---------------------------------------------------------------------------

interface BackendApiService {

    // 🚀 NEW: The Relay Endpoint
    // Sends the file hash + signature to backend. Backend verifies and pays gas.
    @POST("api/memories/relay")
    suspend fun relayMemory(
        @Header("Authorization") token: String,
        @Body request: RelayRequest
    ): Response<RelayResponse>

    // Fetch user memories (Hybrid: DB + Chain)
    @GET("api/memories")
    suspend fun getMemories(
        @Header("Authorization") token: String
    ): Response<ApiResponse<List<MemoryItem>>>
}

// ---------------------------------------------------------------------------
// 🔌 SINGLETON INSTANCE
// ---------------------------------------------------------------------------

object BackendApi {
    // ❌ OLD (Localhost Emulator)
    // private const val BASE_URL = "http://10.0.2.2:5000/"

    // ✅ NEW (Deployed URL)
    // Replace this with your actual deployed link. Must end with '/'
    private const val BASE_URL = "https://lifevault-backend.onrender.com/"

    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(logging)
        .connectTimeout(30, TimeUnit.SECONDS) // Cloud might be slower than local
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    val service: BackendApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client)
            .build()
            .create(BackendApiService::class.java)
    }
}