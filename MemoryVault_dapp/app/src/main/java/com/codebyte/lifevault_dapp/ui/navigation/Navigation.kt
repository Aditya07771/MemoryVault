// src/main/java/com/codebyte/lifevault_dapp/ui/navigation/Navigation.kt
package com.codebyte.lifevault_dapp.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.*
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.screens.*
import com.codebyte.lifevault_dapp.ui.theme.*
import com.codebyte.lifevault_dapp.ui.components.EnhancedUploadModal

@Composable
fun Navigation(viewModel: MainViewModel) {
    val navController = rememberNavController()
    var showModal by remember { mutableStateOf(false) }
    val hasWallet = viewModel.hasWallet()

    val startDestination = if (hasWallet) "timeline" else "onboarding"

    Scaffold(
        containerColor = BrandBlack,
        bottomBar = {
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = navBackStackEntry?.destination?.route

            val hideBottomBar = currentRoute in listOf(
                "onboarding",
                "unlock",
                "wallet_management",
                "settings"
            ) || currentRoute?.startsWith("memory_detail") == true

            if (!hideBottomBar) {
                BottomNavBar(navController) { showModal = true }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Auth
            composable("onboarding") {
                OnboardingScreen(viewModel) {
                    navController.navigate("timeline") {
                        popUpTo("onboarding") { inclusive = true }
                    }
                }
            }

            composable("unlock") {
                UnlockScreen(viewModel, navController)
            }

            // Main Screens
            composable("timeline") {
                TimelineScreen(viewModel, navController)
            }

            composable("home") {
                HomeScreen(viewModel, navController)
            }

            composable("share") {
                SharedScreen(viewModel, navController)
            }

            composable("profile") {
                ProfileScreen(viewModel, navController)
            }

            composable("settings") {
                SettingsScreen(viewModel, navController)
            }

            // ✅ ADD THIS MISSING ROUTE
            composable("wallet_management") {
                WalletManagementScreen(viewModel, navController)
            }

            composable("send") {
                SendScreen(viewModel, navController)
            }

            composable("memories") {
                MemoriesListScreen(viewModel, navController)
            }

            composable("memory_detail/{id}") { backStackEntry ->
                val id = backStackEntry.arguments?.getString("id")?.toIntOrNull() ?: 0
                MemoryDetailScreen(viewModel, id, navController)
            }
        }

        if (showModal) {
            EnhancedUploadModal(viewModel) { showModal = false }
        }
    }
}

@Composable
fun BottomNavBar(navController: NavController, onAddClick: () -> Unit) {
    val items = listOf(
        Triple("timeline", "Vault", Icons.Rounded.Shield),
        Triple("share", "Receive", Icons.Rounded.QrCode),
        Triple("add", "Add", Icons.Rounded.AddCircle),
        Triple("send", "Send", Icons.Rounded.Send),
        Triple("profile", "Profile", Icons.Rounded.Person)
    )

    NavigationBar(containerColor = BrandCard) {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route

        items.forEach { (route, label, icon) ->
            NavigationBarItem(
                icon = { Icon(icon, contentDescription = label) },
                label = { Text(label) },
                selected = currentRoute == route,
                onClick = {
                    if (route == "add") {
                        onAddClick()
                    } else {
                        navController.navigate(route) {
                            popUpTo(navController.graph.startDestinationId) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = BrandOrange,
                    unselectedIconColor = TextGrey,
                    selectedIconColor = BrandBlack,
                    unselectedTextColor = TextGrey,
                    selectedTextColor = BrandOrange
                )
            )
        }
    }
}