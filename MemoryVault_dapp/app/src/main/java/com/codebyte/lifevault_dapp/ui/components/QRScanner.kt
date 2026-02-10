// src/main/java/com/codebyte/lifevault_dapp/ui/components/QRScanner.kt
package com.codebyte.lifevault_dapp.ui.components

import android.Manifest
import android.util.Log
import android.util.Size
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.FlashOff
import androidx.compose.material.icons.rounded.FlashOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.codebyte.lifevault_dapp.ui.theme.*
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.accompanist.permissions.shouldShowRationale
import com.google.mlkit.vision.barcode.BarcodeScanner
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun QRScannerScreen(
    onQRCodeScanned: (String) -> Unit,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasFlash by remember { mutableStateOf(false) }
    var flashEnabled by remember { mutableStateOf(false) }
    var scannedCode by remember { mutableStateOf<String?>(null) }

    val cameraPermissionState = rememberPermissionState(Manifest.permission.CAMERA)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BrandBlack)
    ) {
        when {
            cameraPermissionState.status.isGranted -> {
                // Camera Preview
                var cameraProvider by remember { mutableStateOf<ProcessCameraProvider?>(null) }

                DisposableEffect(Unit) {
                    val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
                    cameraProviderFuture.addListener({
                        cameraProvider = cameraProviderFuture.get()
                    }, ContextCompat.getMainExecutor(context))

                    onDispose {
                        cameraProvider?.unbindAll()
                    }
                }

                cameraProvider?.let { provider ->
                    CameraPreviewWithAnalysis(
                        provider = provider,
                        lifecycleOwner = lifecycleOwner,
                        flashEnabled = flashEnabled,
                        onFlashAvailable = { hasFlash = it },
                        onQRCodeDetected = { code ->
                            if (scannedCode == null) {
                                scannedCode = code
                                onQRCodeScanned(code)
                            }
                        }
                    )
                }

                // Overlay UI
                Column(
                    modifier = Modifier.fillMaxSize()
                ) {
                    // Top Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = onDismiss,
                            colors = IconButtonDefaults.iconButtonColors(
                                containerColor = BrandBlack.copy(0.5f)
                            )
                        ) {
                            Icon(Icons.Rounded.Close, null, tint = TextWhite)
                        }

                        Text(
                            "Scan QR Code",
                            color = TextWhite,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )

                        if (hasFlash) {
                            IconButton(
                                onClick = { flashEnabled = !flashEnabled },
                                colors = IconButtonDefaults.iconButtonColors(
                                    containerColor = BrandBlack.copy(0.5f)
                                )
                            ) {
                                Icon(
                                    if (flashEnabled) Icons.Rounded.FlashOn else Icons.Rounded.FlashOff,
                                    null,
                                    tint = if (flashEnabled) BrandOrange else TextWhite
                                )
                            }
                        } else {
                            Spacer(modifier = Modifier.size(48.dp))
                        }
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    // Scan Frame
                    Box(
                        modifier = Modifier
                            .size(280.dp)
                            .align(Alignment.CenterHorizontally)
                            .border(3.dp, BrandOrange, RoundedCornerShape(24.dp))
                    )

                    Spacer(modifier = Modifier.weight(1f))

                    // Instructions
                    Text(
                        "Position the QR code within the frame",
                        color = TextWhite,
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 48.dp)
                    )
                }
            }

            cameraPermissionState.status.shouldShowRationale -> {
                // Permission rationale
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "Camera Permission Required",
                        color = TextWhite,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        "We need camera access to scan QR codes for receiving assets.",
                        color = TextGrey,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = { cameraPermissionState.launchPermissionRequest() },
                        colors = ButtonDefaults.buttonColors(containerColor = BrandOrange)
                    ) {
                        Text("Grant Permission", color = BrandBlack)
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    TextButton(onClick = onDismiss) {
                        Text("Cancel", color = TextGrey)
                    }
                }
            }

            else -> {
                // Request permission
                LaunchedEffect(Unit) {
                    cameraPermissionState.launchPermissionRequest()
                }

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    CircularProgressIndicator(color = BrandOrange)
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(
                        "Requesting camera permission...",
                        color = TextGrey
                    )
                }
            }
        }
    }
}

@Composable
private fun CameraPreviewWithAnalysis(
    provider: ProcessCameraProvider,
    lifecycleOwner: androidx.lifecycle.LifecycleOwner,
    flashEnabled: Boolean,
    onFlashAvailable: (Boolean) -> Unit,
    onQRCodeDetected: (String) -> Unit
) {
    val context = LocalContext.current
    val previewView = remember { PreviewView(context) }
    val executor = remember { Executors.newSingleThreadExecutor() }

    val barcodeScanner = remember {
        val options = BarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
            .build()
        BarcodeScanning.getClient(options)
    }

    DisposableEffect(provider, flashEnabled) {
        provider.unbindAll()

        val preview = Preview.Builder().build().also {
            it.setSurfaceProvider(previewView.surfaceProvider)
        }

        val imageAnalysis = ImageAnalysis.Builder()
            .setTargetResolution(Size(1280, 720))
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()
            .also { analysis ->
                analysis.setAnalyzer(executor) { imageProxy ->
                    processImage(imageProxy, barcodeScanner, onQRCodeDetected)
                }
            }

        val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

        try {
            val camera = provider.bindToLifecycle(
                lifecycleOwner,
                cameraSelector,
                preview,
                imageAnalysis
            )

            camera.cameraInfo.hasFlashUnit().let { hasFlash ->
                onFlashAvailable(hasFlash)
                if (hasFlash) {
                    camera.cameraControl.enableTorch(flashEnabled)
                }
            }
        } catch (e: Exception) {
            Log.e("QRScanner", "Camera binding failed", e)
        }

        onDispose {
            provider.unbindAll()
        }
    }

    AndroidView(
        factory = { previewView },
        modifier = Modifier.fillMaxSize()
    )
}

@androidx.annotation.OptIn(androidx.camera.core.ExperimentalGetImage::class)
private fun processImage(
    imageProxy: ImageProxy,
    scanner: BarcodeScanner,
    onQRCodeDetected: (String) -> Unit
) {
    val mediaImage = imageProxy.image
    if (mediaImage != null) {
        val image = InputImage.fromMediaImage(
            mediaImage,
            imageProxy.imageInfo.rotationDegrees
        )

        scanner.process(image)
            .addOnSuccessListener { barcodes ->
                barcodes.firstOrNull()?.rawValue?.let { code ->
                    onQRCodeDetected(code)
                }
            }
            .addOnCompleteListener {
                imageProxy.close()
            }
    } else {
        imageProxy.close()
    }
}