// src/main/java/com/codebyte/lifevault_dapp/ui/screens/WalletManagementScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WalletManagementScreen(viewModel: MainViewModel, navController: NavController) {
    val address by viewModel.walletAddress.collectAsState()
    val mnemonic by viewModel.mnemonic.collectAsState()
    val context = LocalContext.current

    var showMnemonic by remember { mutableStateOf(false) }
    var showPrivateKey by remember { mutableStateOf(false) }
    var showCreateDialog by remember { mutableStateOf(false) }
    var showImportDialog by remember { mutableStateOf(false) }

    // Helper function to copy text
    fun copyToClipboard(label: String, text: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText(label, text)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "$label copied to clipboard", Toast.LENGTH_SHORT).show()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BrandBlack)
            .padding(20.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite)
            }
            Text(
                "Manage Wallets",
                color = TextWhite,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.width(48.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Current Wallet Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = BrandCard),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(RoundedCornerShape(4.dp))
                                .background(BrandGreen)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            "Active Wallet",
                            color = TextWhite,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                    Surface(
                        color = BrandGreen.copy(0.2f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            "Primary",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            color = BrandGreen,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text("Address:", color = TextGrey, fontSize = 12.sp)
                Text(
                    address ?: "No Address",
                    color = TextWhite,
                    fontSize = 13.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Backup & Recovery Section
        Text(
            "Backup & Recovery",
            color = TextWhite,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Recovery Phrase Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = BrandCard),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Key, null, tint = BrandOrange, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("Recovery Phrase", color = TextWhite, fontSize = 14.sp)
                    }
                    IconButton(onClick = { showMnemonic = !showMnemonic }) {
                        Icon(
                            if (showMnemonic) Icons.Rounded.VisibilityOff else Icons.Rounded.Visibility,
                            null,
                            tint = BrandOrange
                        )
                    }
                }

                if (showMnemonic) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Divider(color = BrandOrange.copy(0.2f))
                    Spacer(modifier = Modifier.height(12.dp))

                    // Warning
                    Surface(
                        color = BrandRed.copy(0.2f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(modifier = Modifier.padding(12.dp)) {
                            Icon(Icons.Rounded.Warning, null, tint = BrandRed, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Never share this phrase!",
                                color = BrandRed,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Mnemonic Display
                    val words = (mnemonic ?: "").split(" ").filter { it.isNotEmpty() }

                    if (words.isNotEmpty()) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(BrandBlack, RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            words.chunked(3).forEach { row ->
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    row.forEach { word ->
                                        Text(
                                            word,
                                            color = TextWhite,
                                            fontSize = 14.sp,
                                            fontFamily = FontFamily.Monospace,
                                            modifier = Modifier.weight(1f)
                                        )
                                    }
                                }
                                if (row != words.chunked(3).last()) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                }
                            }
                        }
                    } else {
                        Text("No recovery phrase available", color = BrandRed, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Copy Button
                    OutlinedButton(
                        onClick = {
                            mnemonic?.let { copyToClipboard("Recovery Phrase", it) }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = BrandOrange)
                    ) {
                        Icon(Icons.Rounded.ContentCopy, null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Copy Phrase")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Private Key Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = BrandCard),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.VpnKey, null, tint = BrandOrange, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("Private Key", color = TextWhite, fontSize = 14.sp)
                    }
                    IconButton(onClick = { showPrivateKey = !showPrivateKey }) {
                        Icon(
                            if (showPrivateKey) Icons.Rounded.VisibilityOff else Icons.Rounded.Visibility,
                            null,
                            tint = BrandOrange
                        )
                    }
                }

                if (showPrivateKey) {
                    Spacer(modifier = Modifier.height(12.dp))

                    // 🚀 FETCH REAL KEY
                    val realPrivateKey = viewModel.getPrivateKeyHex()

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(BrandBlack, RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    ) {
                        Text(
                            text = if (realPrivateKey.isNotEmpty()) realPrivateKey else "No Key Found",
                            color = TextWhite,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            lineHeight = 16.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Copy Button
                    OutlinedButton(
                        onClick = {
                            if (realPrivateKey.isNotEmpty()) {
                                copyToClipboard("Private Key", realPrivateKey)
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = BrandOrange)
                    ) {
                        Icon(Icons.Rounded.ContentCopy, null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Copy Private Key")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Wallet Actions
        Text(
            "Wallet Actions",
            color = TextWhite,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Create New Wallet
        WalletActionButton(
            icon = Icons.Rounded.Add,
            title = "Create New Wallet",
            subtitle = "Generate a new wallet address"
        ) {
            showCreateDialog = true
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Import Wallet
        WalletActionButton(
            icon = Icons.Rounded.Download,
            title = "Import Wallet",
            subtitle = "Restore from recovery phrase"
        ) {
            showImportDialog = true
        }
    }

    // Create Dialog
    if (showCreateDialog) {
        AlertDialog(
            onDismissRequest = { showCreateDialog = false },
            title = { Text("Create New Wallet?", color = TextWhite) },
            text = {
                Text(
                    "This will create a new wallet. Make sure to backup your current wallet's recovery phrase first.",
                    color = TextGrey
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.createWallet()
                        showCreateDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange)
                ) {
                    Text("Create", color = BrandBlack)
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateDialog = false }) {
                    Text("Cancel", color = TextGrey)
                }
            },
            containerColor = BrandCard
        )
    }

    // Import Dialog
    if (showImportDialog) {
        var importPhrase by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showImportDialog = false },
            title = { Text("Import Wallet", color = TextWhite) },
            text = {
                Column {
                    Text("Enter your 12 or 24 word recovery phrase:", color = TextGrey, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = importPhrase,
                        onValueChange = { importPhrase = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(120.dp),
                        placeholder = { Text("word1 word2 word3 ...", color = TextGrey) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BrandOrange,
                            unfocusedBorderColor = TextGrey,
                            focusedTextColor = TextWhite,
                            unfocusedTextColor = TextWhite
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.importWallet(importPhrase)
                        showImportDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                    enabled = importPhrase.split(" ").size >= 12
                ) {
                    Text("Import", color = BrandBlack)
                }
            },
            dismissButton = {
                TextButton(onClick = { showImportDialog = false }) {
                    Text("Cancel", color = TextGrey)
                }
            },
            containerColor = BrandCard
        )
    }
}

@Composable
fun WalletActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = BrandCard),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, null, tint = BrandOrange, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, color = TextWhite, fontWeight = FontWeight.Medium, fontSize = 14.sp)
                Text(subtitle, color = TextGrey, fontSize = 12.sp)
            }
            Icon(Icons.Rounded.ChevronRight, null, tint = TextGrey)
        }
    }
}