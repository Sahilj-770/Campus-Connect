package com.sahiljadhav.campusconnect.data.model

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MenuItemTest {

    @Test
    fun testPriceFormatting() {
        val item = MenuItem(
            id = 1,
            canteen = "cafeteria",
            itemName = "Aloo Paratha",
            category = "Breakfast",
            price = "50.00",
            availability = "Available",
            isAvailable = 1
        )
        assertEquals("₹50", item.priceFormatted)
        assertEquals(50.0, item.priceValue, 0.001)
        assertTrue(item.isItemAvailable)
    }

    @Test
    fun testSlugAndImageUrl() {
        val item = MenuItem(
            id = 2,
            canteen = "timeless",
            itemName = "Cheese Garlic Bread",
            category = "Sandwich",
            price = "80.00"
        )
        assertEquals("cheese-garlic-bread", item.slug)
        assertEquals(
            "https://campus-connect-s85n.onrender.com/food-images/cheese-garlic-bread.webp",
            item.imageUrl
        )
    }

    @Test
    fun testCategoryIcon() {
        val burger = MenuItem(id = 3, canteen = "timeless", itemName = "Burger", category = "Sandwich", price = "60")
        assertEquals("🥪", burger.categoryIcon)

        val coffee = MenuItem(id = 4, canteen = "nescafe", itemName = "Cold Coffee", category = "Beverages", price = "40")
        assertEquals("☕", coffee.categoryIcon)
    }
}
