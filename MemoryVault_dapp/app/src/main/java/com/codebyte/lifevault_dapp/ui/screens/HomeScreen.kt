package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.components.EnhancedUploadModal
import com.codebyte.lifevault_dapp.ui.theme.*

@Composable
fun HomeScreen(viewModel: MainViewModel, navController: NavController) {
    val memories by viewModel.memories.collectAsState()
    var showUploadModal by remember { mutableStateOf(false) }
    var isScanning by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize().background(BrandBlack)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Wallet 1", color = TextWhite, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                IconButton(onClick = { isScanning = true }) {
                    Icon(Icons.Rounded.QrCodeScanner, null, tint = TextWhite)
                }
            }

            // Asset Summary (Removed Currency)
            Column(Modifier.padding(horizontal = 20.dp)) {
                Text("${memories.size} Secured Memories", color = TextWhite, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                Text("Vault Status: Fully Encrypted", color = TextGrey, fontSize = 16.sp)
            }

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ActionCircle("New", Icons.Rounded.Add, BrandOrange) { showUploadModal = true }
                ActionCircle("Receive", Icons.Rounded.ArrowDownward, BrandCard) { navController.navigate("shared") }
                ActionCircle("Send", Icons.Rounded.ArrowUpward, BrandCard) { }
                ActionCircle("Sync", Icons.Rounded.Sync, BrandCard) { viewModel.refreshData() }
            }

            // Assets List Header
            Row(Modifier.padding(horizontal = 20.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Recent Assets", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                Text("See All", color = BrandOrange, fontSize = 14.sp, modifier = Modifier.clickable { navController.navigate("memories") })
            }

            Spacer(Modifier.height(16.dp))

            // Fixed PaddingValues Construction
            LazyColumn(
                contentPadding = PaddingValues(start = 20.dp, top = 0.dp, end = 20.dp, bottom = 100.dp)
            ) {
                items(memories) { memory ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp)
                            .clickable { navController.navigate("memory_detail/${memory.id}") },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(Modifier.size(40.dp).clip(CircleShape).background(BrandCard), Alignment.Center) {
                            Icon(Icons.Rounded.Lock, null, tint = TextWhite, modifier = Modifier.size(20.dp))
                        }
                        Spacer(Modifier.width(16.dp))
                        Column(Modifier.weight(1f)) {
                            Text(memory.title, color = TextWhite, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                            Text("Timestamp: ${memory.date.take(10)}", color = TextGrey, fontSize = 13.sp)
                        }
                        // Currency Front Display Removed
                    }
                    Divider(color = BrandCard, thickness = 0.5.dp)
                }
            }
        }

        if (showUploadModal) EnhancedUploadModal(viewModel) { showUploadModal = false }

        // Active Scanner Interface
        if (isScanning) {
            ScannerWorkableOverlay { isScanning = false }
        }
    }
}

@Composable
fun ActionCircle(text: String, icon: ImageVector, color: Color, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier.size(60.dp).clip(CircleShape).background(color).clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = if(color == BrandOrange) BrandBlack else TextWhite)
        }
        Spacer(Modifier.height(8.dp))
        Text(text, color = TextGrey, fontSize = 12.sp)
    }
}

@Composable
fun ScannerWorkableOverlay(onDismiss: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.95f)).clickable { onDismiss() },
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Rounded.QrCodeScanner, null, tint = BrandOrange, modifier = Modifier.size(120.dp))
            Spacer(Modifier.height(24.dp))
            Text("Align QR Code within frame", color = TextWhite, fontSize = 16.sp)
            Spacer(Modifier.height(48.dp))
            Button(onClick = onDismiss, colors = ButtonDefaults.buttonColors(containerColor = BrandCard)) {
                Text("Close Scanner", color = BrandOrange)
            }
        }
    }
}