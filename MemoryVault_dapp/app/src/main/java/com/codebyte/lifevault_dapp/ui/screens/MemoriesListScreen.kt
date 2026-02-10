// src/main/java/com/codebyte/lifevault_dapp/ui/screens/MemoriesListScreen.kt
package com.codebyte.lifevault_dapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.codebyte.lifevault_dapp.MainViewModel
import com.codebyte.lifevault_dapp.ui.components.MemoryCard
import com.codebyte.lifevault_dapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemoriesListScreen(viewModel: MainViewModel, navController: NavController) {
    val memories by viewModel.memories.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var filterSecured by remember { mutableStateOf(false) }

    val filteredMemories = memories.filter { memory ->
        val matchesSearch = memory.title.contains(searchQuery, ignoreCase = true)
        val matchesFilter = if (filterSecured) memory.isSecured else true
        matchesSearch && matchesFilter
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BrandBlack)
    ) {
        // Header
        TopAppBar(
            title = {
                Text(
                    "All Memories",
                    color = TextWhite,
                    fontWeight = FontWeight.Bold
                )
            },
            navigationIcon = {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Rounded.ArrowBack, null, tint = TextWhite)
                }
            },
            actions = {
                IconButton(onClick = { viewModel.refreshData() }) {
                    Icon(
                        if (isLoading) Icons.Rounded.Sync else Icons.Rounded.Refresh,
                        null,
                        tint = BrandOrange
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = BrandBlack)
        )

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            placeholder = { Text("Search memories...", color = TextGrey) },
            leadingIcon = {
                Icon(Icons.Rounded.Search, null, tint = TextGrey)
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Rounded.Clear, null, tint = TextGrey)
                    }
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = BrandOrange,
                unfocusedBorderColor = BrandCard,
                focusedContainerColor = BrandCard,
                unfocusedContainerColor = BrandCard,
                focusedTextColor = TextWhite,
                unfocusedTextColor = TextWhite
            ),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Filter Chips
        Row(
            modifier = Modifier.padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = !filterSecured,
                onClick = { filterSecured = false },
                label = { Text("All") },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = BrandOrange,
                    selectedLabelColor = BrandBlack
                )
            )
            FilterChip(
                selected = filterSecured,
                onClick = { filterSecured = true },
                label = { Text("Secured") },
                leadingIcon = if (filterSecured) {
                    { Icon(Icons.Rounded.Check, null, Modifier.size(16.dp)) }
                } else null,
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = BrandOrange,
                    selectedLabelColor = BrandBlack
                )
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Results count
        Text(
            "${filteredMemories.size} memories found",
            modifier = Modifier.padding(horizontal = 16.dp),
            color = TextGrey,
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Memory List
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = BrandOrange)
            }
        } else if (filteredMemories.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Rounded.SearchOff,
                        null,
                        tint = TextGrey,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        if (searchQuery.isNotEmpty()) "No memories match your search"
                        else "No memories yet",
                        color = TextGrey
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredMemories) { memory ->
                    MemoryCard(memory) {
                        navController.navigate("memory_detail/${memory.id}")
                    }
                }
            }
        }
    }
}