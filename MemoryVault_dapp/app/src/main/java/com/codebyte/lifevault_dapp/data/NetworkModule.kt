package com.codebyte.lifevault_dapp.data

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

// 1. Define the Shape of your Backend API
interface LifeVaultApiService {
    // ⚠️ FIXED: Changed endpoint to match your backend's relay route
    @POST("/api/memories/relay")
    suspend fun uploadFile(@Body request: UploadRequest): UploadResponse
}

// 2. The Real Network Object
object NetworkModule {
    // Your Vercel Backend URL
    private const val BACKEND_BASE_URL = "https://life-vault-backend-git-main-adityas-projects-e5e2af34.vercel.app/"

    // Real Aptos Devnet Node
    const val APTOS_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1"

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    // The Retrofit Instance
    val api: LifeVaultApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BACKEND_BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(LifeVaultApiService::class.java)
    }

    // Shared Client for Blockchain Calls
    val httpClient = client
}

// -----------------------------------------------------------
// 🚀 MISSING CLASSES ADDED BELOW
// -----------------------------------------------------------

// The data you send to the backend
data class UploadRequest(
    val title: String,
    val ipfsHash: String,
    val signature: String, // Hex string of the signature
    val category: String,
    val fileName: String,
    val fileSize: Long
)

// The data you get back from the backend
data class UploadResponse(
    val success: Boolean,
    val message: String,
    val data: UploadData?
)

data class UploadData(
    val memory: Any?, // Can be more specific if needed
    val tx: TxDetails?
)

data class TxDetails(
    val hash: String,
    val explorerUrl: String
)