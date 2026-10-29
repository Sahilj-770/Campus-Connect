package com.sahiljadhav.campusconnect.ui.lostfound.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AddPhotoAlternate
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.sahiljadhav.campusconnect.ui.components.CampusPrimaryButton
import com.sahiljadhav.campusconnect.ui.theme.AvailableGreen
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.CampusShapes
import java.io.File
import java.io.FileOutputStream

/**
 * Standardized Report Lost / Found Item Dialog
 */
@Composable
fun ReportItemDialog(
    initialStatus: String = "lost",
    onDismiss: () -> Unit,
    onSubmit: (
        itemName: String,
        status: String,
        location: String,
        description: String,
        personName: String,
        rollNumber: String,
        contactNumber: String,
        imageFile: File?
    ) -> Unit,
    isSubmitting: Boolean = false,
    errorMessage: String? = null
) {
    val context = LocalContext.current
    var status by remember { mutableStateOf(initialStatus.lowercase()) }
    var itemName by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var personName by remember { mutableStateOf("") }
    var rollNumber by remember { mutableStateOf("") }
    var contactNumber by remember { mutableStateOf("") }
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    var localError by remember { mutableStateOf<String?>(null) }

    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        selectedImageUri = uri
    }

    AlertDialog(
        onDismissRequest = { if (!isSubmitting) onDismiss() },
        shape = CampusShapes.dialog,
        containerColor = MaterialTheme.colorScheme.surface,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (status == "lost") "Report Lost Item" else "Report Found Item",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    ),
                    color = MaterialTheme.colorScheme.onSurface
                )
                IconButton(onClick = onDismiss, enabled = !isSubmitting) {
                    Icon(
                        imageVector = Icons.Rounded.Close,
                        contentDescription = "Close",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Segment Switch: Lost vs Found
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                        .padding(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (status == "lost") BrandOrange else Color.Transparent)
                            .clickable { status = "lost" }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Lost Item",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = if (status == "lost") Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (status == "found") AvailableGreen else Color.Transparent)
                            .clickable { status = "found" }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Found Item",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = if (status == "found") Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                    }
                }

                // Error alert
                val displayedError = localError ?: errorMessage
                if (displayedError != null) {
                    Text(
                        text = displayedError,
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(MaterialTheme.colorScheme.error.copy(alpha = 0.1f))
                            .padding(10.dp)
                    )
                }

                // Item Name
                OutlinedTextField(
                    value = itemName,
                    onValueChange = { itemName = it; localError = null },
                    label = { Text("Item Name *") },
                    placeholder = { Text("e.g. Scientific Calculator, College ID") },
                    singleLine = true,
                    shape = CampusShapes.button,
                    modifier = Modifier.fillMaxWidth()
                )

                // Location
                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it; localError = null },
                    label = { Text("Location *") },
                    placeholder = { Text("e.g. Library 2nd Floor, Cafeteria Table") },
                    singleLine = true,
                    shape = CampusShapes.button,
                    modifier = Modifier.fillMaxWidth()
                )

                // Description
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it; localError = null },
                    label = { Text("Description *") },
                    placeholder = { Text("Key details: color, brand, distinct marks...") },
                    maxLines = 3,
                    shape = CampusShapes.button,
                    modifier = Modifier.fillMaxWidth()
                )

                // Photo Upload Box
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp)
                        .clip(CampusShapes.button)
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                        .border(
                            1.dp,
                            MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f),
                            CampusShapes.button
                        )
                        .clickable {
                            photoPickerLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    if (selectedImageUri != null) {
                        Image(
                            painter = rememberAsyncImagePainter(model = selectedImageUri),
                            contentDescription = "Selected Item Photo",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    } else {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Rounded.AddPhotoAlternate,
                                contentDescription = "Add Photo",
                                tint = BrandOrange,
                                modifier = Modifier.size(32.dp)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Attach Item Photo (Optional)",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                // Student Details
                OutlinedTextField(
                    value = personName,
                    onValueChange = { personName = it; localError = null },
                    label = { Text("Your Name *") },
                    singleLine = true,
                    shape = CampusShapes.button,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = rollNumber,
                    onValueChange = { rollNumber = it },
                    label = { Text("Roll Number (Optional)") },
                    singleLine = true,
                    shape = CampusShapes.button,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = contactNumber,
                    onValueChange = { contactNumber = it; localError = null },
                    label = { Text("Contact Phone *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    singleLine = true,
                    shape = CampusShapes.button,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            CampusPrimaryButton(
                text = "Submit Report",
                isLoading = isSubmitting,
                enabled = !isSubmitting,
                onClick = {
                    if (itemName.isBlank() || location.isBlank() || description.isBlank() ||
                        personName.isBlank() || contactNumber.isBlank()
                    ) {
                        localError = "Please fill in all required fields (*)."
                        return@CampusPrimaryButton
                    }

                    // Convert URI to File if photo selected
                    var imageFile: File? = null
                    selectedImageUri?.let { uri ->
                        try {
                            val inputStream = context.contentResolver.openInputStream(uri)
                            val tempFile = File.createTempFile("lf_report_", ".jpg", context.cacheDir)
                            val outputStream = FileOutputStream(tempFile)
                            inputStream?.copyTo(outputStream)
                            inputStream?.close()
                            outputStream.close()
                            imageFile = tempFile
                        } catch (_: Exception) {
                            // Proceed without image if file stream fails
                        }
                    }

                    onSubmit(
                        itemName.trim(),
                        status,
                        location.trim(),
                        description.trim(),
                        personName.trim(),
                        rollNumber.trim(),
                        contactNumber.trim(),
                        imageFile
                    )
                },
                modifier = Modifier.fillMaxWidth()
            )
        },
        dismissButton = {
            TextButton(
                onClick = onDismiss,
                enabled = !isSubmitting
            ) {
                Text(
                    text = "Cancel",
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    )
}
