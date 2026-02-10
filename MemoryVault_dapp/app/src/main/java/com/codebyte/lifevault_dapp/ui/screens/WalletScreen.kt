package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.theme.*

@Composable
fun WalletScreen(viewModel: MainViewModel, navController: NavController) {
    val address by viewModel.walletAddress.collectAsState()

    Column(modifier = Modifier.fillMaxSize().background(BrandBlack).padding(20.dp)) {
        // Header
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite, modifier = Modifier.clickable { navController.popBackStack() })
            Spacer(Modifier.width(16.dp))
            Text("Manage Wallets", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(24.dp))

        // Active Wallet Card
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(BrandCard)
                .border(1.dp, BrandOrange, RoundedCornerShape(16.dp)) // Active Border
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(Modifier.size(8.dp).clip(RoundedCornerShape(4.dp)).background(BrandOrange))
            Spacer(Modifier.width(16.dp))
            Column(Modifier.weight(1f)) {
                Text("Wallet 1", color = TextWhite, fontWeight = FontWeight.Bold)
                Text("12 words", color = TextGrey, fontSize = 12.sp)
            }
            Icon(Icons.Rounded.Warning, null, tint = BrandRed) // Simulate backup warning
        }

        Spacer(Modifier.height(24.dp))

        // Options
        WalletOption("New Wallet", Icons.Rounded.Add, BrandOrange)
        WalletOption("Import Wallet", Icons.Rounded.Download, BrandOrange)
        WalletOption("Watch Address", Icons.Rounded.Visibility, BrandOrange)
    }
}

@Composable
fun WalletOption(text: String, icon: androidx.compose.ui.graphics.vector.ImageVector, tint: androidx.compose.ui.graphics.Color) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, null, tint = tint)
        Spacer(Modifier.width(16.dp))
        Text(text, color = tint, fontSize = 16.sp, fontWeight = FontWeight.Medium)
    }
}