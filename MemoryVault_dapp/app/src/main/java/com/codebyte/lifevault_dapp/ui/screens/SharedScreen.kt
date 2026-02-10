// src/main/java/com/codebyte/lifevault_dapp/ui/screens/SharedScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import android.content.Intent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.ContentCopy
import androidx.compose.material.icons.rounded.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.theme.*

@Composable
fun SharedScreen(viewModel: MainViewModel, navController: NavController) {
    val qrCode by viewModel.qrCodeBitmap.collectAsState()
    val address by viewModel.walletAddress.collectAsState()
    val shareState by viewModel.shareState.collectAsState()

    // Context needed for the Share Intent
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BrandBlack)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite)
            }

            Spacer(modifier = Modifier.width(16.dp))
            Text("Receive Assets", color = TextWhite, fontSize = 20.sp)

            Spacer(modifier = Modifier.weight(1f)) // Push next item to the right

            // --- TOP RIGHT SHARE BUTTON ---
            IconButton(
                onClick = {
                    address?.let { validAddress ->
                        val sendIntent = Intent(Intent.ACTION_SEND).apply {
                            putExtra(Intent.EXTRA_TEXT, validAddress)
                            type = "text/plain"
                        }
                        val shareIntent = Intent.createChooser(sendIntent, "Share Wallet Address")
                        context.startActivity(shareIntent)
                    }
                }
            ) {
                Icon(Icons.Rounded.Share, contentDescription = "Share", tint = BrandOrange)
            }
        }

        Spacer(modifier = Modifier.height(48.dp))

        // QR Code
        qrCode?.let {
            Image(
                bitmap = it.asImageBitmap(),
                contentDescription = "QR Code",
                modifier = Modifier
                    .size(250.dp)
                    .background(TextWhite)
                    .padding(16.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            "Your Wallet Address",
            color = TextGrey,
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = address ?: "Loading...",
            color = TextWhite,
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { viewModel.shareViaAddress() },
            colors = ButtonDefaults.buttonColors(containerColor = BrandCard)
        ) {
            Icon(Icons.Rounded.ContentCopy, null, tint = BrandOrange)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Copy Address", color = TextWhite)
        }

        shareState?.let {
            Spacer(modifier = Modifier.height(16.dp))
            Text(it, color = BrandGreen)
        }
    }
}