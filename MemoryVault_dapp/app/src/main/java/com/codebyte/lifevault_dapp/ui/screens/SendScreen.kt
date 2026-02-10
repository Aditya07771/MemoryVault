// src/main/java/com/codebyte/lifevault_dapp/ui/screens/SendScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.UiState
import com.codebyte.lifevault_dapp.data.MemoryItem
import com.codebyte.lifevault_dapp.ui.components.QRScannerScreen
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SendScreen(viewModel: MainViewModel, navController: NavController) {
    // Collect Shared Address
    val incomingAddress by viewModel.incomingSharedAddress.collectAsState()

    var recipientAddress by remember { mutableStateOf("") }
    var assetNote by remember { mutableStateOf("") }
    var showScanner by remember { mutableStateOf(false) }
    var expirationDuration by remember { mutableStateOf("Never") }

    var showAssetPicker by remember { mutableStateOf(false) }
    var selectedAsset by remember { mutableStateOf<MemoryItem?>(null) }

    val memories by viewModel.memories.collectAsState()
    val uiState by viewModel.uploadState.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val scrollState = rememberScrollState()

    // PRE-FILL logic: If coming from a share, fill and consume
    LaunchedEffect(incomingAddress) {
        incomingAddress?.let {
            recipientAddress = it
            viewModel.consumeIncomingAddress()
        }
    }

    DisposableEffect(Unit) {
        onDispose { viewModel.resetStates() }
    }

    if (showAssetPicker) {
        AlertDialog(
            onDismissRequest = { showAssetPicker = false },
            title = { Text("Select File to Send", color = TextWhite) },
            text = {
                Box(modifier = Modifier.height(300.dp)) {
                    LazyColumn {
                        items(memories) { memory ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedAsset = memory
                                        showAssetPicker = false
                                    }
                                    .padding(vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Rounded.Description, null, tint = BrandOrange)
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(memory.title, color = TextWhite)
                            }
                            Divider(color = BrandCard)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showAssetPicker = false }) { Text("Cancel", color = TextGrey) }
            },
            containerColor = BrandBlack
        )
    }

    Box(modifier = Modifier.fillMaxSize()) {
        if (showScanner) {
            QRScannerScreen(
                onQRCodeScanned = { code ->
                    if (viewModel.handleScannedQRCode(code)) {
                        recipientAddress = code
                        showScanner = false
                    }
                },
                onDismiss = { showScanner = false }
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(BrandBlack)
                    .padding(24.dp)
                    .verticalScroll(scrollState)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite)
                    }
                    Text("Send File", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    IconButton(onClick = { showScanner = true }) {
                        Icon(Icons.Rounded.QrCodeScanner, null, tint = BrandOrange)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                when (uiState) {
                    is UiState.Idle, is UiState.Error -> {
                        Text("Recipient Wallet Address", color = TextWhite, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = recipientAddress,
                            onValueChange = { recipientAddress = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("0x...", color = TextGrey) },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandOrange,
                                unfocusedBorderColor = BrandCard,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite,
                                focusedContainerColor = BrandBlack,
                                unfocusedContainerColor = BrandBlack
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        Text("Select File", color = TextWhite, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(8.dp))

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showAssetPicker = true },
                            colors = CardDefaults.cardColors(containerColor = BrandCard),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    if (selectedAsset != null) Icons.Rounded.CheckCircle else Icons.Rounded.Add,
                                    null,
                                    tint = BrandOrange
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(
                                    text = selectedAsset?.title ?: "Choose from Vault",
                                    color = if (selectedAsset != null) TextWhite else TextGrey
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Text("Message (Optional)", color = TextWhite, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = assetNote,
                            onValueChange = { assetNote = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("Secure note...", color = TextGrey) },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandOrange,
                                unfocusedBorderColor = BrandCard,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite,
                                focusedContainerColor = BrandBlack,
                                unfocusedContainerColor = BrandBlack
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        Text("Access Expiration", color = TextWhite, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            listOf("1 Hour", "1 Day", "1 Week", "Never").forEach { duration ->
                                FilterChip(
                                    selected = expirationDuration == duration,
                                    onClick = { expirationDuration = duration },
                                    label = { Text(duration) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = BrandOrange,
                                        selectedLabelColor = BrandBlack,
                                        containerColor = BrandCard,
                                        labelColor = TextWhite
                                    )
                                )
                            }
                        }

                        if (uiState is UiState.Error || errorMessage != null) {
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                (uiState as? UiState.Error)?.message ?: errorMessage ?: "",
                                color = BrandRed,
                                fontSize = 14.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(32.dp))

                        Button(
                            onClick = {
                                viewModel.sendAsset(recipientAddress, selectedAsset, assetNote, expirationDuration)
                            },
                            modifier = Modifier.fillMaxWidth().height(56.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                            shape = RoundedCornerShape(16.dp),
                            enabled = recipientAddress.length == 66 && selectedAsset != null
                        ) {
                            Text("Send Securely", color = BrandBlack, fontWeight = FontWeight.Bold)
                        }
                    }
                    is UiState.Loading -> {
                        Box(Modifier.fillMaxWidth().height(300.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = BrandOrange)
                        }
                    }
                    is UiState.Success -> {
                        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Rounded.CheckCircle, null, tint = BrandGreen, modifier = Modifier.size(80.dp))
                            Text("File Sent!", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(onClick = { navController.popBackStack() }) { Text("Done") }
                        }
                    }
                }
            }
        }
    }
}