package com.sahiljadhav.campusconnect.data.model

import com.google.gson.annotations.SerializedName

data class UserProfile(
    val id: Long? = null,
    @SerializedName("firebase_uid") val firebaseUid: String = "",
    val email: String = "",
    @SerializedName("full_name") val fullName: String? = null,
    val phone: String? = null,
    val department: String? = null,
    @SerializedName("roll_number") val rollNumber: String? = null,
    val year: String? = null,
    val division: String? = null,
    @SerializedName("avatar_url") val avatarUrl: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("updated_at") val updatedAt: String? = null
)

data class ProfileResponse(
    val success: Boolean = false,
    val message: String? = null,
    val user: UserProfile? = null,
    @SerializedName("completion_percentage") val completionPercentage: Int = 0,
    @SerializedName("is_complete") val isComplete: Boolean = false
)

data class UserOrder(
    val id: Long = 0,
    @SerializedName("user_uid") val userUid: String? = null,
    @SerializedName("razorpay_order_id") val razorpayOrderId: String = "",
    @SerializedName("razorpay_payment_id") val razorpayPaymentId: String? = null,
    val canteen: String = "",
    @SerializedName("customer_name") val customerName: String = "",
    val department: String = "",
    @SerializedName("customer_phone") val customerPhone: String = "",
    @SerializedName("total_amount") val totalAmount: Double = 0.0,
    val status: String = "PENDING",
    @SerializedName("created_at") val createdAt: String = "",
    val items: List<UserOrderItem> = emptyList()
)

data class UserOrderItem(
    @SerializedName("razorpay_order_id") val razorpayOrderId: String = "",
    @SerializedName("item_name") val itemName: String = "",
    val quantity: Int = 1,
    val price: Double = 0.0
)

data class MyOrdersResponse(
    val success: Boolean = false,
    val orders: List<UserOrder> = emptyList()
)

data class MyReportsResponse(
    val success: Boolean = false,
    val lost: List<LostFoundItem> = emptyList(),
    val found: List<LostFoundItem> = emptyList()
)

data class UpdateProfileRequest(
    @SerializedName("full_name") val fullName: String?,
    val phone: String?,
    val department: String?,
    @SerializedName("roll_number") val rollNumber: String?,
    val year: String?,
    val division: String?
)

data class UpdateReportRequest(
    @SerializedName("item_name") val itemName: String,
    val description: String,
    val location: String,
    @SerializedName("contact_number") val contactNumber: String
)

data class SimpleResponse(
    val success: Boolean = false,
    val message: String? = null,
    val error: String? = null
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    @SerializedName("full_name") val fullName: String,
    val email: String,
    val password: String
)

data class AuthResponse(
    val success: Boolean = false,
    val token: String? = null,
    val user: UserProfile? = null,
    val message: String? = null,
    val error: String? = null
)

data class SyncResponse(
    val success: Boolean = false,
    val synced: Int = 0
)
