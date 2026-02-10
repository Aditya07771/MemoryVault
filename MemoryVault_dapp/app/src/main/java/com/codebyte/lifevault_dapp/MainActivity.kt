// src/main/java/com/codebyte/lifevault_dapp/MainActivity.kt
package com.codebyte.lifevault_dapp

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.codebyte.lifevault_dapp.ui.navigation.Navigation
import com.codebyte.lifevault_dapp.ui.theme.BrandBlack
import com.codebyte.lifevault_dapp.ui.theme.LifeVaultDappTheme

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Handle if app started via Share Intent
        handleIncomingIntent(intent)

        setContent {
            LifeVaultDappTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = BrandBlack
                ) {
                    Navigation(viewModel = viewModel)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // Handle if app was already open and received Share Intent
        handleIncomingIntent(intent)
    }

    private fun handleIncomingIntent(intent: Intent?) {
        if (intent?.action == Intent.ACTION_SEND && intent.type == "text/plain") {
            intent.getStringExtra(Intent.EXTRA_TEXT)?.let { sharedText ->
                viewModel.handleIncomingShare(sharedText)
            }
        }
    }
}