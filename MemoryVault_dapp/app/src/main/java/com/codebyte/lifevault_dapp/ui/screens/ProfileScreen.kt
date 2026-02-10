// src/main/java/com/codebyte/lifevault_dapp/ui/screens/ProfileScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.components.MemoryCard
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(viewModel: MainViewModel, navController: NavController) {
    val userName by viewModel.userName.collectAsState()
    val userHandle by viewModel.userHandle.collectAsState()
    val memories by viewModel.memories.collectAsState()
    val walletAddress by viewModel.walletAddress.collectAsState()

    var isEditing by remember { mutableStateOf(false) }
    var editedName by remember { mutableStateOf(userName) }
    var editedHandle by remember { mutableStateOf(userHandle) }
    var showLogoutDialog by remember { mutableStateOf(false) }

    LaunchedEffect(userName, userHandle) {
        editedName = userName
        editedHandle = userHandle
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BrandBlack),
        contentPadding = PaddingValues(bottom = 100.dp)
    ) {
        // 1. Header
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 24.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Profile", color = TextWhite, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                IconButton(onClick = { navController.navigate("settings") }) {
                    Icon(Icons.Rounded.Settings, null, tint = TextGrey)
                }
            }
        }

        // 2. Profile Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                colors = CardDefaults.cardColors(containerColor = BrandCard),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(BrandOrange.copy(0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Rounded.Person, null, modifier = Modifier.size(60.dp), tint = BrandOrange)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (isEditing) {
                        OutlinedTextField(
                            value = editedName,
                            onValueChange = { editedName = it },
                            label = { Text("Name") },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandOrange,
                                unfocusedBorderColor = TextGrey,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite
                            )
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = editedHandle,
                            onValueChange = { editedHandle = it },
                            label = { Text("Handle") },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandOrange,
                                unfocusedBorderColor = TextGrey,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite
                            )
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            OutlinedButton(onClick = { isEditing = false }) { Text("Cancel", color = TextGrey) }
                            Button(onClick = {
                                viewModel.updateProfile(editedName, editedHandle)
                                isEditing = false
                            }, colors = ButtonDefaults.buttonColors(containerColor = BrandOrange)) { Text("Save", color = BrandBlack) }
                        }
                    } else {
                        Text(userName, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                        Text(userHandle, fontSize = 16.sp, color = TextGrey)
                        Spacer(modifier = Modifier.height(16.dp))
                        Surface(color = BrandBlack, shape = RoundedCornerShape(12.dp)) {
                            Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Rounded.AccountBalanceWallet, null, tint = BrandOrange, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = walletAddress?.let { "${it.take(8)}...${it.takeLast(6)}" } ?: "No Wallet",
                                    color = BrandOrange,
                                    fontSize = 12.sp
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { isEditing = true },
                            colors = ButtonDefaults.buttonColors(containerColor = BrandOrange)
                        ) {
                            Text("Edit Profile", color = BrandBlack)
                        }
                    }
                }
            }
        }

        // 3. Stats Row
        item {
            Spacer(modifier = Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatCard("Assets", memories.size.toString())
                StatCard("Secured", memories.count { it.isSecured }.toString())
                StatCard("Shared", "0")
            }
        }

        // 4. Recent Activity Header
        item {
            Spacer(modifier = Modifier.height(24.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Recent Activity", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                if (memories.isNotEmpty()) {
                    TextButton(onClick = { navController.navigate("memories") }) {
                        Text("View All", color = BrandOrange)
                    }
                }
            }
        }

        // 5. Activity List
        if (memories.isEmpty()) {
            item {
                Box(modifier = Modifier.fillMaxWidth().height(120.dp), contentAlignment = Alignment.Center) {
                    Text("No recent activity", color = TextGrey)
                }
            }
        } else {
            items(memories.take(3)) { memory ->
                Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                    MemoryCard(memory) {
                        navController.navigate("memory_detail/${memory.id}")
                    }
                }
            }
        }

        // 6. Logout
        item {
            Spacer(modifier = Modifier.height(24.dp))
            OutlinedButton(
                onClick = { showLogoutDialog = true },
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = BrandRed),
                border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(BrandRed))
            ) {
                Text("Logout")
            }
        }
    }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Logout", color = TextWhite) },
            text = { Text("Are you sure you want to logout?", color = TextGrey) },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.logoutUser()
                        showLogoutDialog = false
                        navController.navigate("onboarding") { popUpTo(0) { inclusive = true } }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandRed)
                ) { Text("Logout") }
            },
            dismissButton = { TextButton(onClick = { showLogoutDialog = false }) { Text("Cancel", color = TextGrey) } },
            containerColor = BrandCard
        )
    }
}

// --- ADDED MISSING COMPOSABLE ---
@Composable
fun StatCard(label: String, value: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = BrandCard),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                value,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = BrandOrange
            )
            Text(
                label,
                fontSize = 12.sp,
                color = TextGrey
            )
        }
    }
}