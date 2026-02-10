// src/main/java/com/codebyte/lifevault_dapp/ui/screens/TimelineScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.components.MemoryCard
import com.codebyte.lifevault_dapp.ui.components.WalletBalanceCard
import com.codebyte.lifevault_dapp.ui.components.FaucetButton
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TimelineScreen(viewModel: MainViewModel, navController: NavController) {
    val memories by viewModel.memories.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var isRefreshing by remember { mutableStateOf(false) }

    LaunchedEffect(isLoading) {
        if (!isLoading) isRefreshing = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BrandBlack)
    ) {
        // Header - FIXED: Changed vertical: to vertical =
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),  // FIXED HERE
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    "Life Vault",
                    color = TextWhite,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "${memories.size} Secured Memories",
                    color = TextGrey,
                    fontSize = 14.sp
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconButton(
                    onClick = {
                        isRefreshing = true
                        viewModel.refreshData()
                    }
                ) {
                    Icon(
                        if (isRefreshing) Icons.Rounded.Sync else Icons.Rounded.Refresh,
                        null,
                        tint = BrandOrange
                    )
                }
                IconButton(onClick = { navController.navigate("settings") }) {
                    Icon(Icons.Rounded.Settings, null, tint = TextGrey)
                }
            }
        }

        // Wallet Balance Card
        /*Column(modifier = Modifier.padding(horizontal = 20.dp)) {
            WalletBalanceCard(viewModel)
            Spacer(modifier = Modifier.height(12.dp))
            FaucetButton(viewModel)
        }*/

        Spacer(modifier = Modifier.height(24.dp))

        // Status Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Rounded.Shield,
                                null,
                                tint = BrandOrange,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Vault Active",
                                color = BrandOrange,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Protected by\nAptos Blockchain",
                            color = TextWhite,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            lineHeight = 24.sp
                        )
                    }
                    Icon(
                        Icons.Rounded.Lock,
                        null,
                        tint = BrandOrange.copy(0.5f),
                        modifier = Modifier.size(48.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick Actions
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            QuickActionButton(
                icon = Icons.Rounded.Add,
                label = "Secure",
                color = BrandOrange
            ) { /* Upload handled by bottom nav */ }

            QuickActionButton(
                icon = Icons.Rounded.QrCode,
                label = "Receive",
                color = BrandCard
            ) { navController.navigate("share") }

            QuickActionButton(
                icon = Icons.Rounded.Send,
                label = "Send",
                color = BrandCard
            ) { navController.navigate("send") }

            QuickActionButton(
                icon = Icons.Rounded.History,
                label = "History",
                color = BrandCard
            ) { navController.navigate("memories") }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Assets Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Recent Assets",
                color = TextWhite,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            if (memories.isNotEmpty()) {
                Text(
                    "See All",
                    color = BrandOrange,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable {
                        navController.navigate("memories")
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Memory List
        if (isLoading && memories.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = BrandOrange)
            }
        } else if (memories.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Rounded.Inventory2,
                        null,
                        tint = TextGrey,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        "No assets secured yet",
                        color = TextGrey,
                        fontSize = 16.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Tap + to secure your first asset",
                        color = TextGrey.copy(0.7f),
                        fontSize = 14.sp
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(
                    start = 20.dp,
                    top = 0.dp,
                    end = 20.dp,
                    bottom = 100.dp
                ),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(memories) { memory ->
                    MemoryCard(memory) {
                        navController.navigate("memory_detail/${memory.id}")
                    }
                }
            }
        }
    }
}

@Composable
fun QuickActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    color: androidx.compose.ui.graphics.Color,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(CircleShape)
                .background(color)
                .clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icon,
                null,
                tint = if (color == BrandOrange) BrandBlack else TextWhite,
                modifier = Modifier.size(24.dp)
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            label,
            color = TextGrey,
            fontSize = 12.sp
        )
    }
}