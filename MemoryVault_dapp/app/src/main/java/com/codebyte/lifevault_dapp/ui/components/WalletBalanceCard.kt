// src/main/java/com/codebyte/lifevault_dapp/ui/components/WalletBalanceCard.kt
package com.codebyte.lifevault_dapp.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.theme.*

@Composable
fun WalletBalanceCard(viewModel: MainViewModel) {
    val balance by viewModel.walletBalance.collectAsState()
    val address by viewModel.walletAddress.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var showDetails by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { showDetails = !showDetails },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = BrandCard)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.horizontalGradient(
                        listOf(BrandOrange.copy(0.3f), BrandCard)
                    )
                )
                .padding(20.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(BrandOrange.copy(0.3f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Rounded.AccountBalanceWallet,
                                null,
                                tint = BrandOrange,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                "Wallet Balance",
                                color = TextGrey,
                                fontSize = 12.sp
                            )
                            Text(
                                viewModel.getFormattedBalance(),
                                color = TextWhite,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    IconButton(
                        onClick = { viewModel.refreshBalance() },
                        enabled = !isLoading
                    ) {
                        Icon(
                            if (isLoading) Icons.Rounded.Sync else Icons.Rounded.Refresh,
                            null,
                            tint = BrandOrange
                        )
                    }
                }

                if (showDetails) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Divider(color = BrandOrange.copy(0.2f))
                    Spacer(modifier = Modifier.height(16.dp))

                    // USD Value
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("USD Value:", color = TextGrey, fontSize = 14.sp)
                        Text(
                            viewModel.getBalanceInUSD(),
                            color = BrandOrange,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Network
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Network:", color = TextGrey, fontSize = 14.sp)
                        Surface(
                            color = BrandGreen.copy(0.2f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                "Devnet",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                color = BrandGreen,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Address
                    Text("Address:", color = TextGrey, fontSize = 12.sp)
                    Text(
                        address?.let { "${it.take(10)}...${it.takeLast(8)}" } ?: "",
                        color = TextWhite,
                        fontSize = 11.sp,
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                    )
                }
            }
        }
    }
}