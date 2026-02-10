// src/main/java/com/codebyte/lifevault_dapp/ui/screens/OnboardingScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.WalletState
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen(viewModel: MainViewModel, onComplete: () -> Unit) {
    if (viewModel.hasWallet()) {
        LaunchedEffect(Unit) { onComplete() }
        return
    }

    var step by remember { mutableStateOf(0) } // 0=Splash, 1=Selection, 2=Creating, 3=ShowMnemonic, 4=Import
    var importText by remember { mutableStateOf("") }
    var mnemonicConfirmed by remember { mutableStateOf(false) }

    val walletState by viewModel.walletState.collectAsState()
    val walletAddress by viewModel.walletAddress.collectAsState()
    val mnemonic by viewModel.mnemonic.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    // Navigate when wallet is ready and mnemonic is confirmed
    LaunchedEffect(walletState, mnemonicConfirmed) {
        if (walletState is WalletState.Ready && mnemonicConfirmed) {
            onComplete()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BrandBlack, BrandDarkGrey))),
        contentAlignment = Alignment.Center
    ) {
        when (step) {
            // SPLASH
            0 -> {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(32.dp)
                ) {
                    Icon(
                        Icons.Rounded.Shield,
                        null,
                        tint = BrandOrange,
                        modifier = Modifier.size(120.dp)
                    )
                    Spacer(modifier = Modifier.height(32.dp))
                    Text(
                        "LifeVault",
                        fontSize = 42.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        "Your life. Your memories.\nYour control.",
                        fontSize = 16.sp,
                        color = TextGrey,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(64.dp))
                    Button(
                        onClick = { step = 1 },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Text(
                            "Get Started",
                            color = BrandBlack,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                    }
                }
            }

            // SELECT ACTION
            1 -> {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(32.dp)
                ) {
                    Text(
                        "Welcome",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Choose how to access your vault", color = TextGrey)
                    Spacer(modifier = Modifier.height(48.dp))

                    // Create New
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                viewModel.createWallet()
                                step = 2
                            },
                        colors = CardDefaults.cardColors(containerColor = BrandCard),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(24.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(56.dp)
                                    .background(BrandOrange.copy(0.2f), RoundedCornerShape(16.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Rounded.Add, null, tint = BrandOrange, modifier = Modifier.size(28.dp))
                            }
                            Spacer(modifier = Modifier.width(20.dp))
                            Column {
                                Text("Create New Vault", fontWeight = FontWeight.Bold, color = TextWhite, fontSize = 18.sp)
                                Text("Generate a new secure wallet", fontSize = 14.sp, color = TextGrey)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Import
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { step = 4 },
                        colors = CardDefaults.cardColors(containerColor = BrandCard),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(24.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(56.dp)
                                    .background(TextGrey.copy(0.2f), RoundedCornerShape(16.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Rounded.Download, null, tint = TextGrey, modifier = Modifier.size(28.dp))
                            }
                            Spacer(modifier = Modifier.width(20.dp))
                            Column {
                                Text("Import Existing Vault", fontWeight = FontWeight.Bold, color = TextWhite, fontSize = 18.sp)
                                Text("Restore from recovery phrase", fontSize = 14.sp, color = TextGrey)
                            }
                        }
                    }
                }
            }

            // CREATING WALLET
            2 -> {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(32.dp)
                ) {
                    if (isLoading || walletAddress == null) {
                        CircularProgressIndicator(color = BrandOrange, modifier = Modifier.size(64.dp))
                        Spacer(modifier = Modifier.height(32.dp))
                        Text("Creating Your Vault...", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Generating secure Ed25519 keys", color = TextGrey)
                    } else {
                        // Show success, then move to mnemonic
                        LaunchedEffect(Unit) {
                            kotlinx.coroutines.delay(500)
                            step = 3
                        }
                        Icon(Icons.Rounded.CheckCircle, null, tint = BrandGreen, modifier = Modifier.size(80.dp))
                        Spacer(modifier = Modifier.height(24.dp))
                        Text("Wallet Created!", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // SHOW MNEMONIC (CRITICAL!)
            3 -> {
                val words = mnemonic?.split(" ") ?: emptyList()
                var showWarning by remember { mutableStateOf(true) }

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp)
                ) {
                    Text(
                        "Recovery Phrase",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    // Warning Card
                    Card(
                        colors = CardDefaults.cardColors(containerColor = BrandRed.copy(0.2f)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(modifier = Modifier.padding(16.dp)) {
                            Icon(Icons.Rounded.Warning, null, tint = BrandRed)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                "Write this down and store it safely. This is the ONLY way to recover your wallet!",
                                color = BrandRed,
                                fontSize = 14.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Mnemonic Grid
                    Card(
                        colors = CardDefaults.cardColors(containerColor = BrandCard),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(3),
                            modifier = Modifier.padding(16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            itemsIndexed(words) { index, word ->
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(BrandBlack)
                                        .padding(8.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            "${index + 1}.",
                                            color = TextGrey,
                                            fontSize = 12.sp
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            word,
                                            color = TextWhite,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Wallet Address
                    Text("Your Wallet Address:", color = TextGrey, fontSize = 14.sp)
                    Card(
                        colors = CardDefaults.cardColors(containerColor = BrandCard),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Text(
                            walletAddress ?: "",
                            modifier = Modifier.padding(12.dp),
                            color = BrandOrange,
                            fontSize = 11.sp
                        )
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    // Confirmation Checkbox
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { mnemonicConfirmed = !mnemonicConfirmed }
                            .padding(vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = mnemonicConfirmed,
                            onCheckedChange = { mnemonicConfirmed = it },
                            colors = CheckboxDefaults.colors(
                                checkedColor = BrandOrange,
                                uncheckedColor = TextGrey
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            "I have safely stored my recovery phrase",
                            color = TextWhite,
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = { onComplete() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = BrandOrange,
                            disabledContainerColor = BrandOrange.copy(0.3f)
                        ),
                        shape = RoundedCornerShape(16.dp),
                        enabled = mnemonicConfirmed
                    ) {
                        Text("Enter Life Vault", color = BrandBlack, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                }
            }

            // IMPORT WALLET
            4 -> {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(32.dp)
                ) {
                    Text("Restore Vault", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Enter your 12 or 24 word recovery phrase", color = TextGrey)
                    Spacer(modifier = Modifier.height(32.dp))

                    OutlinedTextField(
                        value = importText,
                        onValueChange = { importText = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(150.dp),
                        placeholder = { Text("word1 word2 word3 ...", color = TextGrey) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BrandOrange,
                            unfocusedBorderColor = BrandCard,
                            focusedContainerColor = BrandCard,
                            unfocusedContainerColor = BrandCard,
                            focusedTextColor = TextWhite,
                            unfocusedTextColor = TextWhite
                        ),
                        shape = RoundedCornerShape(16.dp)
                    )

                    val wordCount = importText.trim().split("\\s+".toRegex()).filter { it.isNotEmpty() }.size
                    Text(
                        "$wordCount words entered",
                        color = if (wordCount in listOf(12, 24)) BrandGreen else TextGrey,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(top = 8.dp)
                    )

                    if (walletState is WalletState.Error) {
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            (walletState as WalletState.Error).message,
                            color = BrandRed,
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Button(
                        onClick = { viewModel.importWallet(importText.trim()) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = BrandOrange,
                            disabledContainerColor = BrandOrange.copy(0.5f)
                        ),
                        shape = RoundedCornerShape(16.dp),
                        enabled = wordCount in listOf(12, 24) && !isLoading
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(color = BrandBlack, modifier = Modifier.size(24.dp))
                        } else {
                            Text("Restore Vault", color = BrandBlack, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    TextButton(onClick = { step = 1 }, enabled = !isLoading) {
                        Icon(Icons.Rounded.ArrowBack, null, tint = TextGrey)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Back", color = TextGrey)
                    }
                }
            }
        }
    }
}