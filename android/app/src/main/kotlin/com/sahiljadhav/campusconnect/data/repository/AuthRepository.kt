package com.sahiljadhav.campusconnect.data.repository

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.sahiljadhav.campusconnect.data.api.ApiClient
import com.sahiljadhav.campusconnect.data.api.AuthApiService
import com.sahiljadhav.campusconnect.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import retrofit2.HttpException
import retrofit2.Response

data class AuthUser(
    val uid: String,
    val email: String,
    val displayName: String? = null
)

class AuthRepository(
    context: Context,
    private val authApi: AuthApiService = ApiClient.authApi
) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("campusconnect_auth_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    private val _currentUser = MutableStateFlow<AuthUser?>(null)
    val currentUser: StateFlow<AuthUser?> = _currentUser.asStateFlow()

    init {
        restoreSession()
    }

    private fun restoreSession() {
        // Purge legacy mock-auth keys from earlier builds
        if (prefs.contains("mock_uid") || prefs.contains("mock_email")) {
            prefs.edit()
                .remove("mock_uid")
                .remove("mock_email")
                .remove("mock_name")
                .apply()
        }

        val token = prefs.getString(KEY_TOKEN, null)
        val uid = prefs.getString(KEY_UID, null)
        val email = prefs.getString(KEY_EMAIL, null)
        val name = prefs.getString(KEY_NAME, null)

        if (!token.isNullOrBlank() && !uid.isNullOrBlank() && !email.isNullOrBlank()) {
            ApiClient.currentAuthToken = token
            _currentUser.value = AuthUser(uid = uid, email = email, displayName = name)
        } else {
            ApiClient.currentAuthToken = null
            _currentUser.value = null
        }
    }

    private fun saveSession(token: String, profile: UserProfile): AuthUser {
        val displayName = profile.fullName?.takeIf { it.isNotBlank() }
            ?: profile.email.substringBefore("@")
        val user = AuthUser(
            uid = profile.firebaseUid,
            email = profile.email,
            displayName = displayName
        )
        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putString(KEY_UID, user.uid)
            .putString(KEY_EMAIL, user.email)
            .putString(KEY_NAME, user.displayName)
            .apply()
        ApiClient.currentAuthToken = token
        _currentUser.value = user
        return user
    }

    private fun parseErrorMessage(response: Response<AuthResponse>, fallback: String): String {
        return try {
            val raw = response.errorBody()?.string()
            if (!raw.isNullOrBlank()) {
                val parsed = gson.fromJson(raw, AuthResponse::class.java)
                parsed?.error ?: parsed?.message ?: fallback
            } else {
                fallback
            }
        } catch (_: Exception) {
            fallback
        }
    }

    suspend fun signIn(email: String, pass: String): NetworkResult<AuthUser> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.login(LoginRequest(email = email.trim(), password = pass))
            val body = response.body()
            if (response.isSuccessful && body?.success == true && !body.token.isNullOrBlank() && body.user != null) {
                return@withContext NetworkResult.Success(saveSession(body.token, body.user))
            }
            NetworkResult.Error(body?.error ?: parseErrorMessage(response, "Invalid email or password."))
        } catch (e: Exception) {
            NetworkResult.Error("Sign in failed: ${e.localizedMessage ?: "Network error"}")
        }
    }

    suspend fun signUp(email: String, pass: String, name: String): NetworkResult<AuthUser> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.register(
                RegisterRequest(
                    fullName = name.trim(),
                    email = email.trim(),
                    password = pass
                )
            )
            val body = response.body()
            if (response.isSuccessful && body?.success == true && !body.token.isNullOrBlank() && body.user != null) {
                return@withContext NetworkResult.Success(saveSession(body.token, body.user))
            }
            NetworkResult.Error(body?.error ?: parseErrorMessage(response, "Could not create account."))
        } catch (e: Exception) {
            NetworkResult.Error("Registration failed: ${e.localizedMessage ?: "Network error"}")
        }
    }

    suspend fun sendPasswordReset(email: String): NetworkResult<Unit> = withContext(Dispatchers.IO) {
        NetworkResult.Error("Email password reset isn't enabled yet. Sign in to change your password or create a new account.")
    }

    suspend fun signOut(): Unit = withContext(Dispatchers.IO) {
        prefs.edit().clear().apply()
        ApiClient.currentAuthToken = null
        _currentUser.value = null
    }

    suspend fun fetchProfile(): NetworkResult<ProfileResponse> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.getProfile()
            val profile = response.user
            if (profile != null) {
                val token = ApiClient.currentAuthToken
                if (!token.isNullOrBlank()) {
                    saveSession(token, profile)
                }
            }
            NetworkResult.Success(response)
        } catch (e: HttpException) {
            if (e.code() == 401) {
                signOut()
                NetworkResult.Error("Session expired. Please sign in again.")
            } else {
                NetworkResult.Error("Could not load profile: ${e.localizedMessage}")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Could not load profile: ${e.localizedMessage}")
        }
    }

    suspend fun updateProfile(request: UpdateProfileRequest): NetworkResult<ProfileResponse> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.updateProfile(request)
            val profile = response.user
            val token = ApiClient.currentAuthToken
            if (profile != null && !token.isNullOrBlank()) {
                saveSession(token, profile)
            }
            NetworkResult.Success(response)
        } catch (e: Exception) {
            NetworkResult.Error("Could not update profile: ${e.localizedMessage}")
        }
    }

    suspend fun deleteAccount(): NetworkResult<Unit> = withContext(Dispatchers.IO) {
        try {
            authApi.deleteAccount()
            signOut()
            NetworkResult.Success(Unit)
        } catch (e: Exception) {
            NetworkResult.Error("Could not delete account: ${e.localizedMessage}")
        }
    }

    suspend fun fetchMyOrders(): NetworkResult<List<UserOrder>> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.getMyOrders()
            NetworkResult.Success(response.orders)
        } catch (e: Exception) {
            NetworkResult.Error("Could not load your orders: ${e.localizedMessage}")
        }
    }

    suspend fun fetchMyReports(): NetworkResult<MyReportsResponse> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.getMyReports()
            NetworkResult.Success(response)
        } catch (e: Exception) {
            NetworkResult.Error("Could not load your reports: ${e.localizedMessage}")
        }
    }

    suspend fun deleteReport(id: Long, type: String?): NetworkResult<Unit> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.deleteReport(id, type)
            if (response.success) {
                NetworkResult.Success(Unit)
            } else {
                NetworkResult.Error(response.error ?: "Could not delete report")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Delete report failed: ${e.localizedMessage}")
        }
    }

    suspend fun updateReport(id: Long, type: String?, request: UpdateReportRequest): NetworkResult<Unit> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.updateReport(id, type, request)
            if (response.success) {
                NetworkResult.Success(Unit)
            } else {
                NetworkResult.Error(response.error ?: "Could not update report")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Update report failed: ${e.localizedMessage}")
        }
    }

    suspend fun syncGuestFavourites(visitorId: String): NetworkResult<Int> = withContext(Dispatchers.IO) {
        try {
            val response = authApi.syncFavourites(mapOf("visitorId" to visitorId))
            NetworkResult.Success(response.synced)
        } catch (e: Exception) {
            NetworkResult.Error("Could not sync favourites: ${e.localizedMessage}")
        }
    }

    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_UID = "auth_uid"
        private const val KEY_EMAIL = "auth_email"
        private const val KEY_NAME = "auth_name"
    }
}
