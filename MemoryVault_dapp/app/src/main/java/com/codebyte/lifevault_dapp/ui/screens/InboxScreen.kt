//// src/main/java/com/codebyte/lifevault_dapp/ui/screens/InboxScreen.kt
//package com.codebyte.lifevault_dapp.ui.screens
//
//import androidx.compose.foundation.background
//import androidx.compose.foundation.clickable
//import androidx.compose.foundation.layout.*
//import androidx.compose.foundation.lazy.LazyColumn
//import androidx.compose.foundation.lazy.items
//import androidx.compose.material.icons.Icons
//import androidx.compose.material.icons.rounded.*
//import androidx.compose.material3.*
//import androidx.compose.runtime.*
//import androidx.compose.ui.Alignment
//import androidx.compose.ui.Modifier
//import androidx.compose.ui.text.font.FontWeight
//import androidx.compose.ui.unit.dp
//import androidx.compose.ui.unit.sp
//import androidx.navigation.NavController
//import com.codebyte.lifevault_dapp.MainViewModel
//import com.codebyte.lifevault_dapp.ui.components.MemoryCard
//import com.codebyte.lifevault_dapp.ui.theme.*
//
//@Composable
//fun InboxScreen(viewModel: MainViewModel, navController: NavController) {
//    val inboxItems by viewModel.inbox.collectAsState()
//
//    Column(
//        modifier = Modifier
//            .fillMaxSize()
//            .background(BrandBlack)
//    ) {
//        // Header
//        Row(
//            modifier = Modifier
//                .fillMaxWidth()
//                .padding(24.dp),
//            verticalAlignment = Alignment.CenterVertically
//        ) {
//            IconButton(onClick = { navController.popBackStack() }) {
//                Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite)
//            }
//            Spacer(modifier = Modifier.width(16.dp))
//            Text("Inbox", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
//        }
//
//        if (inboxItems.isEmpty()) {
//            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
//                Column(horizontalAlignment = Alignment.CenterHorizontally) {
//                    Icon(Icons.Rounded.Inbox, null, tint = TextGrey, modifier = Modifier.size(64.dp))
//                    Spacer(modifier = Modifier.height(16.dp))
//                    Text("No received files yet", color = TextGrey)
//                }
//            }
//        } else {
//            LazyColumn(contentPadding = PaddingValues(16.dp)) {
//                items(inboxItems) { item ->
//                    // Reusing MemoryCard for consistency
//                    Box(modifier = Modifier.padding(bottom = 12.dp)) {
//                        MemoryCard(item) {
//                            // Navigate to detail view to download/decrypt
//                            navController.navigate("memory_detail/${item.id}")
//                        }
//                    }
//                }
//            }
//        }
//    }
//}