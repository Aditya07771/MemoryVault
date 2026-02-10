// src/main/java/com/codebyte/lifevault_dapp/ui/components/FaucetButton.kt
package com.codebyte.lifevault_dapp.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun FaucetButton(viewModel: MainViewModel) {
    val scope = rememberCoroutineScope()
    var isFunding by remember { mutableStateOf(false) }
    var showSuccess by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    OutlinedButton(
        onClick = {
            scope.launch {  // ✅ Use coroutine scope from composable
                isFunding = true
                errorMessage = null
                try {
                    // ✅ Call suspend function correctly
                    val success = viewModel.requestFaucetFunds()

                    if (success) {
                        showSuccess = true
                        delay(5000) // Show success for 5 seconds
                        showSuccess = false
                    } else {
                        errorMessage = "Faucet failed. Try again."
                        delay(3000)
                        errorMessage = null
                    }
                } catch (e: Exception) {
                    errorMessage = e.message ?: "Network error"
                    delay(3000)
                    errorMessage = null
                } finally {
                    isFunding = false
                }
            }
        },
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = if (showSuccess) BrandGreen else BrandOrange
        ),
        border = ButtonDefaults.outlinedButtonBorder.copy(
            brush = androidx.compose.ui.graphics.SolidColor(
                if (showSuccess) BrandGreen else BrandOrange
            )
        ),
        shape = RoundedCornerShape(12.dp),
        enabled = !isFunding
    ) {
        when {
            isFunding -> {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = BrandOrange,
                    strokeWidth = 2.dp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Requesting funds...")
            }
            showSuccess -> {
                Icon(Icons.Rounded.CheckCircle, null, tint = BrandGreen)
                Spacer(modifier = Modifier.width(8.dp))
                Text("✓ Funded! Balance updating...", color = BrandGreen, fontWeight = FontWeight.Bold)
            }
            errorMessage != null -> {
                Icon(Icons.Rounded.Error, null, tint = BrandRed)
                Spacer(modifier = Modifier.width(8.dp))
                Text(errorMessage!!, color = BrandRed, fontSize = 12.sp)
            }
            else -> {
                Icon(Icons.Rounded.WaterDrop, null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Get 1 Free APT (Testnet)", fontWeight = FontWeight.Bold)
            }
        }
    }
}