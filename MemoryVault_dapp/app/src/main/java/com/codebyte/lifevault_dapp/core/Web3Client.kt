//package com.codebyte.lifevault_dapp.core
//
//import android.util.Log
//import com.google.firebase.crashlytics.buildtools.reloc.org.apache.http.auth.Credentials
//import com.google.firebase.crashlytics.buildtools.reloc.org.apache.http.protocol.HttpService
//import kotlinx.coroutines.Dispatchers
//import kotlinx.coroutines.withContext
//import org.web3j.crypto.Credentials
//import org.web3j.protocol.Web3j
//import org.web3j.protocol.core.DefaultBlockParameterName
//import org.web3j.protocol.http.HttpService
//import org.web3j.tx.RawTransactionManager
//import java.math.BigInteger
//
//class Web3Client(private val credentials: Credentials) {
//
//    private val web3j = Web3j.build(HttpService("http://10.0.2.2:8545"))
//    private val contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//    private val chainId = 31337L
//    private val txManager = RawTransactionManager(web3j, credentials, chainId)
//    private val gasPrice = BigInteger.valueOf(20_000_000_000)
//    private val gasLimit = BigInteger.valueOf(500_000)
//
//    suspend fun registerMemory(memoryId: String): String = withContext(Dispatchers.IO) {
//        Log.d("Web3", "Attempting to mint memoryId: $memoryId with address: ${credentials.address}")
//
//        try {
//            val data = "" // Encoded contract function call would go here
//            val receipt = txManager.sendTransaction(
//                gasPrice,
//                gasLimit,
//                contractAddress,
//                data,
//                BigInteger.ZERO
//            )
//            Log.d("Web3", "Success! Tx Hash: ${receipt.transactionHash}")
//            receipt.transactionHash
//
//        } catch (e: Exception) {
//            Log.e("Web3", "Transaction Failed: ${e.message}", e)
//            throw e
//        }
//    }
//
//    suspend fun getBalance(): String = withContext(Dispatchers.IO) {
//        try {
//            // Fix: Use credentials.address and DefaultBlockParameterName.LATEST
//            val balance = web3j.ethGetBalance(credentials.address, DefaultBlockParameterName.LATEST).send()
//            balance.balance.toString()
//        } catch (e: Exception) {
//            Log.e("Web3", "Failed to get balance", e)
//            "0"
//        }
//    }
//}