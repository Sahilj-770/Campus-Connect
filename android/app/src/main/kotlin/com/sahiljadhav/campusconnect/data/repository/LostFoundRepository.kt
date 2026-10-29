package com.sahiljadhav.campusconnect.data.repository

import com.sahiljadhav.campusconnect.data.api.ApiClient
import com.sahiljadhav.campusconnect.data.model.LostFoundItem
import com.sahiljadhav.campusconnect.data.model.NetworkResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.io.IOException

class LostFoundRepository(
    private val apiClient: ApiClient = ApiClient
) {
    private var cachedLost: List<LostFoundItem> = emptyList()
    private var cachedFound: List<LostFoundItem> = emptyList()

    suspend fun getLostItems(forceRefresh: Boolean = false): NetworkResult<List<LostFoundItem>> =
        withContext(Dispatchers.IO) {
            if (!forceRefresh && cachedLost.isNotEmpty()) {
                return@withContext NetworkResult.Success(cachedLost)
            }
            try {
                val rawItems = try {
                    apiClient.lostFoundApi.getLostItems()
                } catch (e: Exception) {
                    apiClient.lostFoundFallbackApi.getLostItems()
                }
                val items = rawItems.filterNotNull()
                cachedLost = items
                NetworkResult.Success(items)
            } catch (e: IOException) {
                if (cachedLost.isNotEmpty()) {
                    NetworkResult.Success(cachedLost)
                } else {
                    NetworkResult.Error("Connecting to Lost & Found server...", isColdStart = true)
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Failed to fetch lost items")
            }
        }

    suspend fun getFoundItems(forceRefresh: Boolean = false): NetworkResult<List<LostFoundItem>> =
        withContext(Dispatchers.IO) {
            if (!forceRefresh && cachedFound.isNotEmpty()) {
                return@withContext NetworkResult.Success(cachedFound)
            }
            try {
                val rawItems = try {
                    apiClient.lostFoundApi.getFoundItems()
                } catch (e: Exception) {
                    apiClient.lostFoundFallbackApi.getFoundItems()
                }
                val items = rawItems.filterNotNull()
                cachedFound = items
                NetworkResult.Success(items)
            } catch (e: IOException) {
                if (cachedFound.isNotEmpty()) {
                    NetworkResult.Success(cachedFound)
                } else {
                    NetworkResult.Error("Connecting to Lost & Found server...", isColdStart = true)
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Failed to fetch found items")
            }
        }

    suspend fun reportItem(
        itemName: String,
        status: String,
        location: String,
        description: String,
        personName: String,
        rollNumber: String,
        contactNumber: String,
        imageFile: File? = null
    ): NetworkResult<String> = withContext(Dispatchers.IO) {
        try {
            val textPlain = "text/plain".toMediaTypeOrNull()
            val itemNamePart = itemName.toRequestBody(textPlain)
            val statusPart = status.lowercase().toRequestBody(textPlain)
            val locationPart = location.toRequestBody(textPlain)
            val descPart = description.toRequestBody(textPlain)
            val personPart = (if (personName.isBlank()) "Campus Student" else personName).toRequestBody(textPlain)
            val rollPart = (if (rollNumber.isBlank()) "N/A" else rollNumber).toRequestBody(textPlain)
            val contactPart = (if (contactNumber.isBlank()) "N/A" else contactNumber).toRequestBody(textPlain)

            val imagePart = imageFile?.let { file ->
                val mediaType = when (file.extension.lowercase()) {
                    "png" -> "image/png"
                    "webp" -> "image/webp"
                    else -> "image/jpeg"
                }.toMediaTypeOrNull()
                val requestFile = file.asRequestBody(mediaType)
                MultipartBody.Part.createFormData("image", file.name, requestFile)
            }

            try {
                apiClient.lostFoundApi.reportItem(
                    itemName = itemNamePart,
                    status = statusPart,
                    location = locationPart,
                    description = descPart,
                    personName = personPart,
                    rollNumber = rollPart,
                    contactNumber = contactPart,
                    image = imagePart
                )
            } catch (e: Exception) {
                apiClient.lostFoundFallbackApi.reportItem(
                    itemName = itemNamePart,
                    status = statusPart,
                    location = locationPart,
                    description = descPart,
                    personName = personPart,
                    rollNumber = rollPart,
                    contactNumber = contactPart,
                    image = imagePart
                )
            }

            // Invalidate cache so next fetch gets newly reported item
            cachedLost = emptyList()
            cachedFound = emptyList()

            NetworkResult.Success("Item reported successfully")
        } catch (e: Exception) {
            NetworkResult.Error(e.message ?: "Failed to submit report")
        }
    }
}
