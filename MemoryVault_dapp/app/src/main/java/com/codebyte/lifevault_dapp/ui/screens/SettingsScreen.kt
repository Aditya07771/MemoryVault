// src/main/java/com/codebyte/lifevault_dapp/ui/screens/SettingsScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(viewModel: MainViewModel, navController: NavController) {
    var showLogoutDialog by remember { mutableStateOf(false) }
    val isLocked by viewModel.isAppLocked.collectAsState()

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
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite)
                }
                Text(
                    "Settings",
                    color = TextWhite,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Wallet & Security Section
        Text(
            "Wallet & Security",
            color = TextGrey,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        SettingsGroup {
            SettingsItem(
                "Manage Wallets",
                Icons.Rounded.AccountBalanceWallet,
                "Backup, import, or create new wallets"
            ) {
                navController.navigate("wallet_management")
            }

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItemWithToggle(
                "App Lock",
                Icons.Rounded.Lock,
                "Require PIN to open app",
                isEnabled = isLocked,
                onToggle = { viewModel.toggleAppLock() }
            )

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItem(
                "Backup & Recovery",
                Icons.Rounded.Backup,
                "View recovery phrase"
            ) {
                navController.navigate("wallet_management")
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // App Settings Section
        Text(
            "App Settings",
            color = TextGrey,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        SettingsGroup {
            SettingsItem(
                "Notifications",
                Icons.Rounded.Notifications,
                "Manage notification preferences"
            ) {
                // TODO: Notifications screen
            }

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItem(
                "Network",
                Icons.Rounded.Public,
                "Currently: Aptos Devnet"
            ) {
                // TODO: Network selector
            }

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItem(
                "Language",
                Icons.Rounded.Language,
                "English (US)"
            ) {
                // TODO: Language selector
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Information Section
        Text(
            "Information",
            color = TextGrey,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        SettingsGroup {
            SettingsItem(
                "About LifeVault",
                Icons.Rounded.Info,
                "Version 1.0.0 (Hackathon Edition)"
            ) {
                // TODO: About screen
            }

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItem(
                "Help & Support",
                Icons.Rounded.Help,
                "Get help with the app"
            ) {
                // TODO: Help screen
            }

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItem(
                "Privacy Policy",
                Icons.Rounded.Policy,
                "Read our privacy policy"
            ) {
                // TODO: Privacy screen
            }

            Divider(color = BrandBlack, thickness = 1.dp)

            SettingsItem(
                "Terms of Service",
                Icons.Rounded.Description,
                "Read terms and conditions"
            ) {
                // TODO: Terms screen
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Danger Zone
        Text(
            "Danger Zone",
            color = BrandRed,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        SettingsGroup {
            SettingsItem(
                "Logout",
                Icons.Rounded.Logout,
                "Sign out from this wallet",
                isError = true
            ) {
                showLogoutDialog = true
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        // Version Info
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "LifeVault",
                color = TextGrey,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                "Powered by Aptos Blockchain",
                color = TextGrey.copy(0.6f),
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Version 1.0.0 (Build 2026)",
                color = TextGrey.copy(0.4f),
                fontSize = 10.sp
            )
        }
    }

    // Logout Dialog
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Rounded.Warning, null, tint = BrandRed, modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("Logout Warning", color = TextWhite)
                }
            },
            text = {
                Column {
                    Text(
                        "Are you sure you want to logout?",
                        color = TextWhite,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        "⚠️ Make sure you have backed up your 12-word recovery phrase!",
                        color = BrandRed,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Without it, you will permanently lose access to your wallet and all secured assets.",
                        color = TextGrey,
                        fontSize = 13.sp
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.logoutUser()
                        showLogoutDialog = false
                        navController.navigate("onboarding") {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandRed)
                ) {
                    Text("Logout Anyway")
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("Cancel", color = TextGrey)
                }
            },
            containerColor = BrandCard
        )
    }
}

@Composable
fun SettingsGroup(content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(BrandCard)
    ) {
        content()
    }
}

@Composable
fun SettingsItem(
    text: String,
    icon: ImageVector,
    subtitle: String = "",
    isError: Boolean = false,
    onClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            null,
            tint = if (isError) BrandRed else BrandOrange,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text,
                color = if (isError) BrandRed else TextWhite,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            if (subtitle.isNotEmpty()) {
                Text(
                    subtitle,
                    color = TextGrey,
                    fontSize = 12.sp
                )
            }
        }
        Icon(
            Icons.Rounded.ChevronRight,
            null,
            tint = TextGrey,
            modifier = Modifier.size(20.dp)
        )
    }
}

@Composable
fun SettingsItemWithToggle(
    text: String,
    icon: ImageVector,
    subtitle: String = "",
    isEnabled: Boolean,
    onToggle: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            null,
            tint = BrandOrange,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text,
                color = TextWhite,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            if (subtitle.isNotEmpty()) {
                Text(
                    subtitle,
                    color = TextGrey,
                    fontSize = 12.sp
                )
            }
        }
        Switch(
            checked = isEnabled,
            onCheckedChange = { onToggle() },
            colors = SwitchDefaults.colors(
                checkedThumbColor = BrandOrange,
                checkedTrackColor = BrandOrange.copy(0.5f),
                uncheckedThumbColor = TextGrey,
                uncheckedTrackColor = BrandBlack
            )
        )
    }
}