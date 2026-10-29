package com.sahiljadhav.campusconnect.data.model

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class LostFoundItemTest {

    @Test
    fun testLostFoundStatusAndFallbackIcon() {
        val wallet = LostFoundItem(
            serialNumber = 10,
            rawItemName = "Black Leather Wallet",
            rawLocation = "Library 1st Floor",
            rawDescription = "Contains campus card",
            rawStatus = "lost"
        )
        assertTrue(wallet.isLost)
        assertFalse(wallet.isFound)
        assertEquals("LOST", wallet.displayStatus)
        assertEquals("👛", wallet.fallbackIcon)
        assertEquals("Campus Student", wallet.displayReporter)
    }

    @Test
    fun testResolvedImageUrl() {
        val dataUriItem = LostFoundItem(
            serialNumber = 11,
            rawItemName = "Roller",
            rawLocation = "Lab",
            rawDescription = "Youva roller",
            rawStatus = "found",
            image = "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
        )
        assertEquals("data:image/jpeg;base64,/9j/4AAQSkZJRg==", dataUriItem.resolvedImageUrl)

        val relativeItem = LostFoundItem(
            serialNumber = 12,
            rawItemName = "pen",
            rawLocation = "Room 302",
            rawDescription = "Trimax",
            rawStatus = "lost",
            image = "/lost_and_found/uploads/items/trimax.jpeg"
        )
        assertEquals(
            "https://campus-connect-4n2t.onrender.com/uploads/items/trimax.jpeg",
            relativeItem.resolvedImageUrl
        )
    }

    @Test
    fun testDuplicateSerialNumbersDoNotCollideWithDisambiguatedKey() {
        // Reproduces the exact backend scenario where UNION ALL creates duplicate serial_number: 14
        val item1 = LostFoundItem(
            serialNumber = 14,
            rawItemName = "Ipad",
            rawLocation = "Cafetaria",
            rawDescription = "of apple",
            rawStatus = "found",
            createdAt = "2026-10-25T06:04:14.366Z"
        )

        val item2 = LostFoundItem(
            serialNumber = 14,
            rawItemName = "Lab File",
            rawLocation = "SL-2",
            rawDescription = "Yellow in colour",
            rawStatus = "found",
            createdAt = "2026-09-22T04:13:20.000Z"
        )

        // Raw IDs are identical
        assertEquals(item1.serialNumber, item2.serialNumber)

        // Semantic unique keys are distinct
        assertNotEquals(item1.uniqueKey, item2.uniqueKey)

        // Indexed Compose keys are guaranteed to be distinct
        val items = listOf(item1, item2)
        val keys = items.mapIndexed { index, item ->
            "${item.status}_${item.serialNumber}_${item.itemName}_$index"
        }
        assertEquals(2, keys.toSet().size)
    }

    @Test
    fun testGsonDeserializationWithNullAndMissingFields() {
        val gson = Gson()
        val json = """
            {
                "serial_number": 99,
                "item_name": null,
                "location": null,
                "description": null,
                "status": null
            }
        """.trimIndent()

        val item = gson.fromJson(json, LostFoundItem::class.java)
        // Verify null-safety fallback properties
        assertFalse(item.isLost)
        assertTrue(item.isFound)
        assertEquals("FOUND", item.displayStatus)
        assertEquals("Campus Item", item.itemName)
        assertEquals("Campus", item.location)
        assertEquals("", item.description)
    }

    @Test
    fun testGsonDeserializesArrayWithDuplicateSerials() {
        val gson = Gson()
        val jsonArray = """
            [
                {
                    "serial_number": 14,
                    "item_name": "Ipad",
                    "location": "Cafetaria",
                    "description": "of apple",
                    "status": "found",
                    "created_at": "2026-10-25T06:04:14.366Z"
                },
                {
                    "serial_number": 14,
                    "item_name": "Lab File",
                    "location": "SL-2",
                    "description": "Yellow in colour",
                    "status": "found",
                    "created_at": "2026-09-22T04:13:20.000Z"
                }
            ]
        """.trimIndent()

        val type = object : TypeToken<List<LostFoundItem>>() {}.type
        val items: List<LostFoundItem> = gson.fromJson(jsonArray, type)
        assertEquals(2, items.size)
        assertEquals(items[0].serialNumber, items[1].serialNumber)

        // Generate Compose keys and verify no collisions
        val composeKeys = items.mapIndexed { index, item ->
            "${item.status}_${item.serialNumber}_${item.itemName}_$index"
        }
        assertEquals(2, composeKeys.distinct().size)
    }
}
