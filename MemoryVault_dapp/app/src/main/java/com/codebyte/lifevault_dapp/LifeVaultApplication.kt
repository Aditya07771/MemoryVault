package com.codebyte.lifevault_dapp

import android.app.Application
import org.bouncycastle.jce.provider.BouncyCastleProvider
import java.security.Security
import android.util.Log

// This class runs once when the app first starts, before any Activity launches.
class LifeVaultApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        setupBouncyCastle()
    }

    private fun setupBouncyCastle() {
        try {
            // Remove the existing, stripped-down Android BC provider
            Security.removeProvider(BouncyCastleProvider.PROVIDER_NAME)
            // Add the full provider from the Web3j library as the LAST option
            Security.addProvider(BouncyCastleProvider())
            Log.d("LifeVaultApp", "Forcefully registered BouncyCastleProvider.")
        } catch (e: Exception) {
            Log.e("LifeVaultApp", "Failed to register BC provider", e)
        }
    }
}