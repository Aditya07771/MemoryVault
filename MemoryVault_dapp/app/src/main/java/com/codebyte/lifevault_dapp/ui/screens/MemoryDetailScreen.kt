// src/main/java/com/codebyte/lifevault_dapp/ui/screens/MemoryDetailScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ViewState
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemoryDetailScreen(viewModel: MainViewModel, memoryId: Int, navController: NavController) {
    val memory = viewModel.getMemoryById(memoryId)
    val context = LocalContext.current
    var showDeleteDialog by remember { mutableStateOf(false) }
    val scrollState = rememberScrollState()
    val viewState by viewModel.viewState.collectAsState()

    // Auto-Decrypt for viewing when screen loads
    LaunchedEffect(memoryId) {
        viewModel.resetViewState()
        memory?.let { viewModel.decryptFileForView(context, it) }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Asset Details", color = TextWhite) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, "Back", tint = TextWhite)
                    }
                },
                actions = {
                    IconButton(onClick = { showDeleteDialog = true }) {
                        Icon(Icons.Default.Delete, "Delete", tint = BrandRed)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BrandBlack)
            )
        },
        containerColor = BrandBlack
    ) { padding ->
        if (memory != null) {
            Column(
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize()
                    .verticalScroll(scrollState)
                    .padding(24.dp)
            ) {
                // --- PREVIEW AREA ---
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(300.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(BrandCard),
                    contentAlignment = Alignment.Center
                ) {
                    when (viewState) {
                        is ViewState.Loading -> CircularProgressIndicator(color = BrandOrange)
                        is ViewState.Viewed -> {
                            val uri = (viewState as ViewState.Viewed).uri
                            val mime = (viewState as ViewState.Viewed).mimeType

                            // Show Image or File Icon
                            if (mime.startsWith("image/")) {
                                AsyncImage(
                                    model = uri,
                                    contentDescription = "Decrypted Image",
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Fit
                                )
                            } else {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Rounded.InsertDriveFile, null, tint = BrandOrange, modifier = Modifier.size(64.dp))
                                    Spacer(modifier = Modifier.height(16.dp))
                                    Text("Type: $mime", color = TextGrey, fontSize = 12.sp)
                                    Spacer(modifier = Modifier.height(16.dp))
                                    Button(
                                        onClick = {
                                            val intent = Intent(Intent.ACTION_VIEW).apply {
                                                setDataAndType(uri, mime)
                                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                            }
                                            try { context.startActivity(intent) } catch (e: Exception) { }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = BrandOrange)
                                    ) {
                                        Text("Open File", color = BrandBlack)
                                    }
                                }
                            }
                        }
                        is ViewState.Error -> {
                            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(16.dp)) {
                                Icon(Icons.Rounded.BrokenImage, null, tint = BrandRed, modifier = Modifier.size(48.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Preview Unavailable", color = TextGrey, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(4.dp))
                                // SHOW THE ACTUAL ERROR MESSAGE
                                Text(
                                    text = (viewState as ViewState.Error).message,
                                    color = BrandRed,
                                    fontSize = 12.sp,
                                    lineHeight = 16.sp,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                                )
                            }
                        }
                        else -> CircularProgressIndicator(color = BrandOrange)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(memory.title, color = TextWhite, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Text(memory.date, color = TextGrey, fontSize = 14.sp)

                Spacer(modifier = Modifier.height(24.dp))

                Card(colors = CardDefaults.cardColors(containerColor = BrandCard), shape = RoundedCornerShape(16.dp)) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        DetailRow(Icons.Rounded.Shield, "Status", if (memory.isSecured) "Secured" else "Pending", if (memory.isSecured) BrandGreen else BrandOrange)
                        Divider(color = BrandBlack, modifier = Modifier.padding(vertical = 12.dp))
                        DetailRow(Icons.Rounded.Cloud, "Storage", "IPFS (Pinata)", TextWhite)
                        Divider(color = BrandBlack, modifier = Modifier.padding(vertical = 12.dp))
                        DetailRow(Icons.Rounded.Link, "Hash", memory.ipfsHash.take(12) + "...", TextGrey)
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedButton(
                        onClick = { viewModel.downloadAndDecryptMemory(context, memory) },
                        modifier = Modifier.weight(1f).height(56.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = BrandOrange),
                        border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(BrandOrange))
                    ) {
                        Icon(Icons.Rounded.Download, null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Save to Device")
                    }
                }
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Asset", color = TextWhite) },
            text = { Text("Are you sure you want to delete this asset? This action cannot be undone.", color = TextGrey) },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.deleteMemory(memoryId)
                        showDeleteDialog = false
                        navController.popBackStack()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandRed)
                ) { Text("Delete") }
            },
            dismissButton = { TextButton(onClick = { showDeleteDialog = false }) { Text("Cancel", color = TextGrey) } },
            containerColor = BrandCard
        )
    }
}

@Composable
fun DetailRow(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String, valueColor: androidx.compose.ui.graphics.Color) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = TextGrey, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(label, color = TextGrey, fontSize = 14.sp)
        }
        Text(value, color = valueColor, fontWeight = FontWeight.Bold, fontSize = 14.sp)
    }
}