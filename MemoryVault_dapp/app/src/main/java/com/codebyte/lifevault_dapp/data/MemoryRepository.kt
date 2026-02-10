// src/main/java/com/codebyte/lifevault_dapp/data/MemoryRepository.kt
package com.codebyte.lifevault_dapp.data

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class MemoryRepository(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(
        "lifevault_memories",
        Context.MODE_PRIVATE
    )

    private val gson = Gson()

    // Save memories
    fun saveMemories(address: String, memories: List<MemoryItem>) {
        val json = gson.toJson(memories)
        prefs.edit().putString("memories_$address", json).apply()
    }

    // Load memories
    fun loadMemories(address: String): List<MemoryItem> {
        val json = prefs.getString("memories_$address", null) ?: return emptyList()
        val type = object : TypeToken<List<MemoryItem>>() {}.type
        return try {
            gson.fromJson(json, type)
        } catch (e: Exception) {
            emptyList()
        }
    }

    // Add memory
    fun addMemory(address: String, memory: MemoryItem) {
        val current = loadMemories(address).toMutableList()
        current.add(0, memory) // Add at beginning
        saveMemories(address, current)
    }

    // Delete memory
    fun deleteMemory(address: String, memoryId: Int) {
        val current = loadMemories(address).filter { it.id != memoryId }
        saveMemories(address, current)
    }
}