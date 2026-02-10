package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel

@Composable
fun UnlockScreen(viewModel: MainViewModel, navController: NavController) {
    var pin by remember { mutableStateOf("") }

    // Specify the Boolean type explicitly to fix inference errors
    val isAppLocked by viewModel.isAppLocked.collectAsState()

    // Auto-navigate when unlocked
    LaunchedEffect(isAppLocked) {
        if (!isAppLocked) {
            navController.navigate("timeline") {
                popUpTo("onboarding") { inclusive = true }
            }
        }
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Enter PIN", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = pin,
            onValueChange = {
                pin = it
                viewModel.unlockApp(it) // Now resolved in ViewModel
            },
            label = { Text("PIN") }
        )
    }
}