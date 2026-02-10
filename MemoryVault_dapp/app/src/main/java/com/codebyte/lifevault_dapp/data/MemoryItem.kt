// src/main/java/com/codebyte/lifevault_dapp/data/MemoryItem.kt
package com.codebyte.lifevault_dapp.data

data class MemoryItem(
    val id: Int,
    val title: String,
    val date: String,
    val ipfsHash: String = "",
    val category: String = "General",
    val description: String = "",
    val isSecured: Boolean = true,
    val isShared: Boolean = false,
    val sharedWith: List<String> = emptyList(),
    val txHash: String = ""
)