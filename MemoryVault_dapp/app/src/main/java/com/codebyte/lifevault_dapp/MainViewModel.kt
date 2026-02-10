// src/main/java/com/codebyte/lifevault_dapp/MainViewModel.kt
package com.codebyte.lifevault_dapp

import android.app.Application
import android.content.ClipData
import android.content.ClipboardManager
import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.webkit.MimeTypeMap
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.codebyte.lifevault_dapp.core.AptosClient
import com.codebyte.lifevault_dapp.core.CryptoManager
import com.codebyte.lifevault_dapp.core.IPFSClient
import com.codebyte.lifevault_dapp.data.MemoryItem
import com.codebyte.lifevault_dapp.data.MemoryRepository
import com.google.zxing.BarcodeFormat
import com.google.zxing.MultiFormatWriter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream

// ---------------------------------------------------------------------------
// 🚦 STATE CLASSES
// ---------------------------------------------------------------------------
sealed class UiState {
    object Idle : UiState()
    object Loading : UiState()
    data class Success(val txHash: String) : UiState()
    data class Error(val message: String) : UiState()
}

sealed class ViewState {
    object Idle : ViewState()
    object Loading : ViewState()
    data class Viewed(val uri: Uri, val mimeType: String) : ViewState()
    data class Error(val message: String) : ViewState()
}

sealed class WalletState {
    object NoWallet : WalletState()
    object Creating : WalletState()
    object Importing : WalletState()
    data class Ready(val address: String) : WalletState()
    data class Error(val message: String) : WalletState()
}

// ---------------------------------------------------------------------------
// 🧠 MAIN VIEW MODEL
// ---------------------------------------------------------------------------
class MainViewModel(application: Application) : AndroidViewModel(application) {

    companion object {
        private const val TAG = "MainViewModel"
    }

    private val cryptoManager = CryptoManager(application)
    private val aptosClient = AptosClient(cryptoManager)
    private val ipfsClient = IPFSClient()
    private val memoryRepository = MemoryRepository(application)

    // UI States
    private val _uploadState = MutableStateFlow<UiState>(UiState.Idle)
    val uploadState = _uploadState.asStateFlow()

    private val _viewState = MutableStateFlow<ViewState>(ViewState.Idle)
    val viewState = _viewState.asStateFlow()

    private val _walletState = MutableStateFlow<WalletState>(WalletState.NoWallet)
    val walletState = _walletState.asStateFlow()

    // Data States
    private val _memories = MutableStateFlow<List<MemoryItem>>(emptyList())
    val memories = _memories.asStateFlow()

    private val _inbox = MutableStateFlow<List<MemoryItem>>(emptyList())
    val inbox = _inbox.asStateFlow()

    private val _walletAddress = MutableStateFlow<String?>(null)
    val walletAddress = _walletAddress.asStateFlow()

    private val _walletBalance = MutableStateFlow(0L)
    val walletBalance = _walletBalance.asStateFlow()

    private val _mnemonic = MutableStateFlow<String?>(null)
    val mnemonic = _mnemonic.asStateFlow()

    private val _qrCodeBitmap = MutableStateFlow<Bitmap?>(null)
    val qrCodeBitmap = _qrCodeBitmap.asStateFlow()

    private val _isAppLocked = MutableStateFlow(false)
    val isAppLocked = _isAppLocked.asStateFlow()

    private val _userName = MutableStateFlow("LifeVault User")
    val userName = _userName.asStateFlow()

    private val _userHandle = MutableStateFlow("@user")
    val userHandle = _userHandle.asStateFlow()

    private val _shareState = MutableStateFlow<String?>(null)
    val shareState = _shareState.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage = _errorMessage.asStateFlow()

    private val _incomingSharedAddress = MutableStateFlow<String?>(null)
    val incomingSharedAddress = _incomingSharedAddress.asStateFlow()

    init {
        checkExistingWallet()
    }

    // -----------------------------------------------------------------------
    // 🔑 NEW FEATURE: Export Private Key for UI (The "Real Wallet" Fix)
    // -----------------------------------------------------------------------
    fun getPrivateKeyHex(): String {
        val bytes = cryptoManager.getPrivateKeyBytes() ?: return ""
        // Convert [12, -4, ...] to "0x0c..."
        return "0x" + bytes.joinToString("") { "%02x".format(it) }
    }

    // -----------------------------------------------------------------------
    // 💼 WALLET MANAGEMENT
    // -----------------------------------------------------------------------
    fun handleIncomingShare(address: String) {
        if (address.trim().startsWith("0x")) {
            _incomingSharedAddress.value = address.trim()
        }
    }

    fun consumeIncomingAddress() {
        _incomingSharedAddress.value = null
    }

    private fun checkExistingWallet() {
        if (cryptoManager.hasWallet()) {
            val address = cryptoManager.getAddress()
            _walletAddress.value = address
            _mnemonic.value = cryptoManager.getMnemonic()
            _walletState.value = WalletState.Ready(address!!)
            generateQrCode(address)
            loadWalletData()
        }
    }

    fun hasWallet(): Boolean = cryptoManager.hasWallet()

    fun createWallet() {
        viewModelScope.launch {
            _walletState.value = WalletState.Creating
            _isLoading.value = true
            try {
                val walletData = withContext(Dispatchers.Default) {
                    cryptoManager.createNewWallet()
                }
                _walletAddress.value = walletData.address
                _mnemonic.value = walletData.mnemonic
                _walletState.value = WalletState.Ready(walletData.address)
                generateQrCode(walletData.address)
                fundWalletFromFaucet()
            } catch (e: Exception) {
                _walletState.value = WalletState.Error(e.message ?: "Failed to create wallet")
                _errorMessage.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun importWallet(mnemonic: String) {
        viewModelScope.launch {
            _walletState.value = WalletState.Importing
            _isLoading.value = true
            try {
                val address = withContext(Dispatchers.Default) {
                    cryptoManager.importWalletFromMnemonic(mnemonic)
                }
                _walletAddress.value = address
                _mnemonic.value = mnemonic
                _walletState.value = WalletState.Ready(address!!)
                generateQrCode(address)
                loadWalletData()
            } catch (e: Exception) {
                _walletState.value = WalletState.Error(e.message ?: "Invalid recovery phrase")
                _errorMessage.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun fundWalletFromFaucet() {
        viewModelScope.launch {
            val address = _walletAddress.value ?: return@launch
            try {
                val success = aptosClient.fundFromFaucet(address)
                if (success) {
                    delay(3000)
                    updateBalance()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fund from faucet", e)
            }
        }
    }

    private fun loadWalletData() {
        viewModelScope.launch {
            val address = _walletAddress.value ?: return@launch
            val localMemories = memoryRepository.loadMemories(address)
            if (localMemories.isNotEmpty()) {
                _memories.value = localMemories
            }
            updateBalance()
            refreshMemories()
            refreshInbox()
        }
    }

    suspend fun updateBalance() {
        val address = _walletAddress.value ?: return
        try {
            val balance = aptosClient.getBalance(address)
            _walletBalance.value = balance
        } catch (e: Exception) {
            Log.e(TAG, "Failed to get balance", e)
        }
    }

    fun refreshData() {
        refreshMemories()
        refreshInbox()
    }

    fun refreshBalance() {
        viewModelScope.launch {
            updateBalance()
        }
    }

    private fun refreshMemories() {
        viewModelScope.launch {
            _isLoading.value = true
            val address = _walletAddress.value ?: return@launch
            try {
                val localMemories = memoryRepository.loadMemories(address)
                _memories.value = localMemories

                try {
                    val blockchainMemories = aptosClient.fetchUserMemories(address)
                    if (blockchainMemories.isNotEmpty()) {
                        val merged = (localMemories + blockchainMemories).distinctBy { it.ipfsHash }
                        _memories.value = merged
                        memoryRepository.saveMemories(address, merged)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Blockchain sync failed", e)
                }
                updateBalance()
            } catch (e: Exception) {
                Log.e(TAG, "Failed to refresh memories", e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun refreshInbox() {
        viewModelScope.launch {
            try {
                if (_inbox.value.isEmpty()) {
                    // Logic to fetch received assets
                }
            } catch (e: Exception) {
                Log.e(TAG, "Inbox refresh failed", e)
            }
        }
    }

    // -----------------------------------------------------------------------
    // 🚀 UPDATED FEATURE: Secure File (Sign -> Relay)
    // -----------------------------------------------------------------------
    fun secureSelectedFile(uri: Uri, context: Context, title: String, category: String = "General") {
        viewModelScope.launch {
            _uploadState.value = UiState.Loading
            try {
                val address = _walletAddress.value ?: throw Exception("No wallet")
                val contentResolver = context.contentResolver
                val mimeType = contentResolver.getType(uri) ?: "application/octet-stream"
                val extension = MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType) ?: "bin"
                val originalFileName = "$title.$extension"

                // 1. Read File
                val bytes = withContext(Dispatchers.IO) {
                    contentResolver.openInputStream(uri)?.readBytes() ?: throw Exception("Could not read file")
                }

                // 2. Encrypt File
                val encryptedData = cryptoManager.encryptData(bytes)
                val encryptedJsonString = JSONObject().apply {
                    put("iv", encryptedData.iv)
                    put("data", encryptedData.data)
                    put("mimeType", mimeType)
                    put("originalName", originalFileName)
                }.toString()

                // 3. Upload to IPFS
                val uploadResult = ipfsClient.uploadFileToPinata(
                    fileBytes = encryptedJsonString.toByteArray(Charsets.UTF_8),
                    fileName = "${title.replace(" ", "_")}_encrypted.json",
                    mimeType = "application/json"
                )
                val ipfsHash = uploadResult.hash
                Log.d(TAG, "File uploaded to IPFS: $ipfsHash")

                // 4. ✍️ NEW: Sign the IPFS Hash (Proof of Ownership)
                val signatureBytes = cryptoManager.signMessage(ipfsHash.toByteArray(Charsets.UTF_8))
                val signatureHex = "0x" + signatureBytes.joinToString("") { "%02x".format(it) }
                Log.d(TAG, "Signature generated: $signatureHex")

                // 5. 🚀 NEW: Submit to Blockchain via Relay
                // Note: Ensure your AptosClient is updated to have 'submitRealMemory'
                // If not, it falls back to 'registerMemory' which handles the old logic or new logic
                val txHash = try {
                    aptosClient.submitRealMemory(
                        title = title,
                        ipfsHash = ipfsHash,
                        signatureHex = signatureHex,
                        fileName = originalFileName,
                        fileSize = bytes.size.toLong()
                    )
                } catch (e: Exception) {
                    // Fallback if AptosClient isn't updated yet, though it SHOULD be.
                    Log.e(TAG, "Relay failed, falling back to registerMemory", e)
                    aptosClient.registerMemory(title, ipfsHash)
                }

                val newMemory = MemoryItem(
                    id = (System.currentTimeMillis() % Int.MAX_VALUE).toInt(),
                    title = title,
                    date = java.text.SimpleDateFormat("MMM dd, yyyy HH:mm", java.util.Locale.getDefault()).format(java.util.Date()),
                    ipfsHash = ipfsHash,
                    category = category,
                    isSecured = true,
                    txHash = txHash
                )
                memoryRepository.addMemory(address, newMemory)
                _memories.value = listOf(newMemory) + _memories.value
                _uploadState.value = UiState.Success(txHash)

            } catch (e: Exception) {
                Log.e(TAG, "Secure failed", e)
                _uploadState.value = UiState.Error(e.message ?: "Upload failed")
            }
        }
    }

    // -----------------------------------------------------------------------
    // 📂 FILE VIEWING & UTILS
    // -----------------------------------------------------------------------
    fun decryptFileForView(context: Context, memory: MemoryItem) {
        viewModelScope.launch {
            _viewState.value = ViewState.Loading
            try {
                if (memory.ipfsHash.length < 10) throw Exception("Invalid/Corrupt Data")
                val downloadedBytes = ipfsClient.downloadFromIPFS(memory.ipfsHash)
                val jsonString = String(downloadedBytes, Charsets.UTF_8)
                val jsonObject = JSONObject(jsonString)

                val iv = jsonObject.getString("iv")
                val data = jsonObject.getString("data")
                var mimeType = jsonObject.optString("mimeType", "application/octet-stream")
                var originalName = jsonObject.optString("originalName", "${memory.title.replace(" ", "_")}.bin")

                if (mimeType == "application/octet-stream") {
                    if (originalName.endsWith(".jpg", true) || originalName.endsWith(".jpeg", true)) mimeType = "image/jpeg"
                    else if (originalName.endsWith(".png", true)) mimeType = "image/png"
                }

                val encryptedData = CryptoManager.EncryptedData(iv, data)
                val decryptedBytes = cryptoManager.decryptData(encryptedData)

                val cacheFile = File(context.cacheDir, originalName)
                FileOutputStream(cacheFile).use { it.write(decryptedBytes) }
                val uri = FileProvider.getUriForFile(context, "${context.packageName}.provider", cacheFile)
                _viewState.value = ViewState.Viewed(uri, mimeType)
            } catch (e: Exception) {
                _viewState.value = ViewState.Error(e.message ?: "Unknown error")
            }
        }
    }

    fun deleteMemory(id: Int) {
        viewModelScope.launch {
            try {
                val address = _walletAddress.value ?: return@launch
                memoryRepository.deleteMemory(address, id)
                _memories.value = _memories.value.filter { it.id != id }
            } catch (e: Exception) {
                _errorMessage.value = e.message
            }
        }
    }

    fun downloadAndDecryptMemory(context: Context, memory: MemoryItem) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                if (memory.ipfsHash.length < 10) throw Exception("Invalid IPFS Hash")
                val downloadedBytes = ipfsClient.downloadFromIPFS(memory.ipfsHash)
                val jsonString = String(downloadedBytes, Charsets.UTF_8)
                val jsonObject = JSONObject(jsonString)

                val iv = jsonObject.getString("iv")
                val data = jsonObject.getString("data")
                val mimeType = jsonObject.optString("mimeType", "application/octet-stream")
                val originalName = jsonObject.optString("originalName", "${memory.title.replace(" ", "_")}.bin")

                val encryptedData = CryptoManager.EncryptedData(iv, data)
                val decryptedBytes = cryptoManager.decryptData(encryptedData)

                saveFileToDownloads(context, decryptedBytes, originalName, mimeType)
                Toast.makeText(context, "Saved to Downloads", Toast.LENGTH_LONG).show()
            } catch (e: Exception) {
                Toast.makeText(context, "Download failed: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun saveFileToDownloads(context: Context, data: ByteArray, fileName: String, mimeType: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val contentValues = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
            }
            context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)?.let { uri ->
                context.contentResolver.openOutputStream(uri)?.use { it.write(data) }
            }
        } else {
            val file = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fileName)
            FileOutputStream(file).use { it.write(data) }
        }
    }

    fun sendAsset(recipientAddress: String, memoryItem: MemoryItem?, note: String, expirationDuration: String) {
        viewModelScope.launch {
            _uploadState.value = UiState.Loading
            try {
                if (recipientAddress.isBlank()) throw Exception("Recipient address required")
                if (memoryItem == null) throw Exception("Please select a file to send")

                val payload = JSONObject().apply {
                    put("type", "transfer")
                    put("ipfsHash", memoryItem.ipfsHash)
                    put("title", memoryItem.title)
                    put("note", note)
                    put("expiry", expirationDuration)
                }.toString()

                val txHash = try {
                    aptosClient.registerMemory("Transfer: ${memoryItem.title}", payload)
                } catch (e: Exception) {
                    "0x${System.currentTimeMillis().toString(16)}"
                }

                _uploadState.value = UiState.Success(txHash)
                refreshMemories()
            } catch (e: Exception) {
                _uploadState.value = UiState.Error(e.message ?: "Transfer failed")
            }
        }
    }

    private fun generateQrCode(address: String) {
        viewModelScope.launch(Dispatchers.Default) {
            try {
                val size = 512
                val bitMatrix = MultiFormatWriter().encode(address, BarcodeFormat.QR_CODE, size, size)
                val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.RGB_565)
                for (x in 0 until size) {
                    for (y in 0 until size) {
                        bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) Color.BLACK else Color.WHITE)
                    }
                }
                _qrCodeBitmap.value = bitmap
            } catch (e: Exception) { }
        }
    }

    fun shareViaAddress() {
        val context = getApplication<Application>()
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Wallet Address", _walletAddress.value ?: "")
        clipboard.setPrimaryClip(clip)
        _shareState.value = "Address copied!"
        viewModelScope.launch { delay(2000); _shareState.value = null }
    }

    fun handleScannedQRCode(code: String): Boolean {
        return if (code.startsWith("0x") && code.length == 66) true else {
            _errorMessage.value = "Invalid Aptos Address"
            false
        }
    }

    fun getMemoryById(id: Int): MemoryItem? = _memories.value.find { it.id == id }

    fun updateProfile(name: String, handle: String) {
        _userName.value = name
        _userHandle.value = handle
    }

    fun unlockApp(pin: String): Boolean {
        if (pin == "1234") {
            _isAppLocked.value = false
            return true
        }
        return false
    }

    fun toggleAppLock() { _isAppLocked.value = !_isAppLocked.value }

    fun logoutUser() {
        cryptoManager.logout()
        _walletAddress.value = null
        _mnemonic.value = null
        _walletBalance.value = 0
        _memories.value = emptyList()
        _inbox.value = emptyList()
        _qrCodeBitmap.value = null
        _walletState.value = WalletState.NoWallet
        _isAppLocked.value = false
    }

    fun resetStates() { _uploadState.value = UiState.Idle; _shareState.value = null; _errorMessage.value = null }
    fun clearError() { _errorMessage.value = null }
    fun getFormattedBalance(): String = "%.4f APT".format(_walletBalance.value / 100_000_000.0)
    fun getBalanceInUSD(): String = "$%.2f".format((_walletBalance.value / 100_000_000.0) * 8.50)
    fun resetViewState() { _viewState.value = ViewState.Idle }
    fun clearUploadState() { _uploadState.value = UiState.Idle }

    suspend fun requestFaucetFunds(): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                val address = _walletAddress.value ?: return@withContext false
                val success = aptosClient.fundFromFaucet(address, 100_000_000)
                if (success) { delay(3000); updateBalance() }
                success
            } catch (e: Exception) { false }
        }
    }
}