package com.codebyte.lifevault_dapp.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Link
import androidx.compose.material.icons.rounded.Shield
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codebyte.lifevault_dapp.ui.theme.VaultBlue
import com.codebyte.lifevault_dapp.ui.theme.VaultPurple

@Composable
fun PremiumStatusCard(address: String) {
    Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(24.dp), elevation = CardDefaults.cardElevation(4.dp)) {
        Box(modifier = Modifier.background(Brush.linearGradient(listOf(VaultPurple, VaultBlue))).padding(24.dp).fillMaxWidth()) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Rounded.Shield, null, tint = Color.White.copy(0.8f), modifier= Modifier.size(18.dp)); Spacer(width=8.dp); Text("Vault Status: Active", color = Color.White.copy(0.8f), fontSize = 13.sp, fontWeight = FontWeight.Bold) }
                Spacer(height = 16.dp)
                Text("Protected by zero-knowledge cryptography.", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold, lineHeight = 30.sp)
                Spacer(height = 20.dp)
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.background(Color.Black.copy(0.2f), CircleShape).padding(horizontal = 12.dp, vertical = 8.dp)) {
                    Icon(Icons.Rounded.Link, null, tint = Color.White, modifier = Modifier.size(16.dp)); Spacer(width = 8.dp)
                    Text(address.take(6) + "..." + address.takeLast(4), color = Color.White, fontSize = 13.sp, fontFamily = FontFamily.Monospace)
                }
            }
        }
    }
}