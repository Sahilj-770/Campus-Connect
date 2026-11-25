package com.sahiljadhav.campusconnect.data.model

import com.google.gson.annotations.SerializedName

data class MenuItem(
    @SerializedName("id") val id: Long,
    @SerializedName("item_id") val itemId: String? = null,
    @SerializedName("canteen") val canteen: String,
    @SerializedName("item_name") val itemName: String,
    @SerializedName("category") val category: String,
    @SerializedName("price") val price: String,
    @SerializedName("availability") val availability: String? = null,
    @SerializedName("description") val description: String? = null,
    @SerializedName("is_available") val isAvailable: Int = 1,
    @SerializedName("favourite_count") val favouriteCount: Int? = null
) {
    val isItemAvailable: Boolean
        get() = isAvailable == 1 || availability.equals("Available", ignoreCase = true)

    val priceFormatted: String
        get() {
            val num = price.toDoubleOrNull() ?: 0.0
            return if (num % 1.0 == 0.0) "₹${num.toInt()}" else "₹${String.format("%.2f", num)}"
        }

    val priceValue: Double
        get() = price.toDoubleOrNull() ?: 0.0

    val slug: String
        get() = itemName.trim()
            .lowercase()
            .replace(Regex("[^a-z0-9]+"), "-")
            .trim('-')

    val imageUrl: String
        get() = "https://campus-connect-s85n.onrender.com/food-images/$slug.webp"

    val categoryIcon: String
        get() = when (category.lowercase()) {
            "breakfast" -> "🍳"
            "south indian" -> "🥞"
            "chinese" -> "🍜"
            "chapati / paratha", "paratha" -> "🫓"
            "rice" -> "🍚"
            "sandwich", "sandwiches" -> "🥪"
            "maggi" -> "🍜"
            "beverages" -> "☕"
            "pasta" -> "🍝"
            "thali" -> "🍛"
            "punjabi dishes" -> "🍲"
            "desserts" -> "🍰"
            "snacks" -> "🍟"
            "shakes" -> "🥤"
            else -> "🍽️"
        }
}
