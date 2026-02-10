package com.codebyte.lifevault_dapp.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.UiState
import com.codebyte.lifevault_dapp.ui.theme.ErrorRed
import com.codebyte.lifevault_dapp.ui.theme.Success
import com.codebyte.lifevault_dapp.ui.theme.VaultBlue
import com.codebyte.lifevault_dapp.ui.theme.VaultPurple

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnhancedUploadModal(viewModel: MainViewModel, onDismiss: () -> Unit) {
    // 1. Local State for the file selection
    var title by remember { mutableStateOf("") }
    var selectedUri by remember { mutableStateOf<Uri?>(null) }

    // 2. Collect ViewModel State properly
    val uiState by viewModel.uploadState.collectAsState()
    val context = LocalContext.current

    // 3. File Pickers
    val imagePicker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        selectedUri = uri
    }
    val docPicker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri: Uri? ->
        selectedUri = uri
    }

    ModalBottomSheet(
        onDismissRequest = {
            // Only allow dismiss if not loading
            if(uiState !is UiState.Loading) {
                viewModel.resetStates()
                onDismiss()
            }
        },
        containerColor = MaterialTheme.colorScheme.surface,
        dragHandle = { BottomSheetDefaults.DragHandle(color = VaultPurple.copy(0.5f)) }
    ) {
        Column(
            Modifier.padding(24.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                if(uiState is UiState.Success) "Secured Successfully!" else "Secure New Asset",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(height = 24.dp)

            when(uiState) {
                is UiState.Idle -> {
                    if (selectedUri == null) {
                        // Phase 1: Select File
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            UploadOptionCard("Photo/Video", Icons.Rounded.Image, VaultBlue) {
                                imagePicker.launch("image/*")
                            }
                            UploadOptionCard("Document", Icons.Rounded.Description, VaultPurple) {
                                docPicker.launch(arrayOf("application/pdf", "application/msword"))
                            }
                        }
                    } else {
                        // Phase 2: Enter Details & Confirm
                        Text("File Selected", color = VaultPurple, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(height = 16.dp)

                        OutlinedTextField(
                            value = title,
                            onValueChange = { title = it },
                            label = { Text("Asset Title") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = VaultPurple,
                                unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant,
                                focusedContainerColor = MaterialTheme.colorScheme.surface,
                                unfocusedContainerColor = MaterialTheme.colorScheme.surface
                            )
                        )
                        Spacer(height = 24.dp)

                        Button(
                            onClick = {
                                selectedUri?.let { uri ->
                                    // Pass the local 'title' state variable to the ViewModel
                                    viewModel.secureSelectedFile(uri, context, title)
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(54.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = VaultPurple),
                            enabled = title.isNotEmpty() // Ensures title isn't empty before calling
                        ) {
                            Row {
                                Icon(Icons.Rounded.Lock, null)
                                Spacer(width = 12.dp)
                                Text("Encrypt & Mint Now", fontSize = 16.sp)
                            }
                        }
                    }
                }
                is UiState.Loading -> {
                    CircularProgressIndicator(color = VaultPurple)
                    Spacer(height=24.dp)
                    Text("Encrypting & syncing to blockchain...", color = MaterialTheme.colorScheme.onBackground.copy(alpha=0.7f))
                }
                is UiState.Success -> {
                    Icon(Icons.Rounded.CheckCircle, null, tint = Success, modifier = Modifier.size(80.dp))
                    Spacer(height=24.dp)
                    Text("Ownership token minted.", color = MaterialTheme.colorScheme.onBackground.copy(alpha=0.7f), fontSize = 18.sp)
                    Spacer(height=32.dp)
                    Button(
                        onClick = {
                            viewModel.resetStates()
                            onDismiss()
                        },
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape=RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant, contentColor = MaterialTheme.colorScheme.onBackground)
                    ) { Text("Done", fontSize = 16.sp) }
                }
                is UiState.Error -> {
                    // Smart cast allows accessing .message
                    val msg = (uiState as UiState.Error).message
                    Icon(Icons.Rounded.Warning, null, tint = ErrorRed, modifier = Modifier.size(80.dp))
                    Spacer(height=24.dp)
                    Text(msg, color = ErrorRed, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                    Spacer(height=32.dp)
                    Button(
                        onClick = { viewModel.resetStates() },
                        modifier = Modifier.fillMaxWidth().height(54.dp),
                        shape=RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant, contentColor = MaterialTheme.colorScheme.onBackground)
                    ) { Text("Try Again", fontSize = 16.sp) }
                }
            }
            Spacer(height = 36.dp)
        }
    }
}

@Composable
fun UploadOptionCard(text: String, icon: ImageVector, color: Color, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.width(150.dp).height(110.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        elevation = CardDefaults.cardElevation(0.dp)
    ) {
        Column(
            Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, null, tint = color, modifier = Modifier.size(36.dp))
            Spacer(height = 12.dp)
            Text(text, color = MaterialTheme.colorScheme.onBackground, fontWeight = FontWeight.Medium, fontSize = 15.sp)
        }
    }
}

// Reusable Spacer helper
@Composable fun Spacer(height: androidx.compose.ui.unit.Dp = 0.dp, width: androidx.compose.ui.unit.Dp = 0.dp) {
    androidx.compose.foundation.layout.Spacer(Modifier.height(height).width(width))
}