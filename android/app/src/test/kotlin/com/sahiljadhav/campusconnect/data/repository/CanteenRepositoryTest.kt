package com.sahiljadhav.campusconnect.data.repository

import com.sahiljadhav.campusconnect.data.model.MenuItem
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class CanteenRepositoryTest {

    private lateinit var repository: CanteenRepository

    @Before
    fun setup() {
        repository = CanteenRepository()
    }

    @Test
    fun testTrayOperations() {
        val item1 = MenuItem(id = 101, canteen = "cafeteria", itemName = "Poha", category = "Breakfast", price = "30.00")
        val item2 = MenuItem(id = 102, canteen = "cafeteria", itemName = "Chai", category = "Beverages", price = "15.00")

        assertEquals(0, repository.tray.value.size)

        // Add item1
        repository.addToTray(item1)
        assertEquals(1, repository.tray.value.size)
        assertEquals(1, repository.getItemQuantityInTray(101))

        // Increase quantity of item1
        repository.addToTray(item1)
        assertEquals(1, repository.tray.value.size)
        assertEquals(2, repository.getItemQuantityInTray(101))

        // Add item2
        repository.addToTray(item2)
        assertEquals(2, repository.tray.value.size)
        assertEquals(1, repository.getItemQuantityInTray(102))

        // Total cost calculation: (2 * 30) + (1 * 15) = 75
        val total = repository.tray.value.sumOf { it.totalCost }
        assertEquals(75.0, total, 0.001)

        // Decrease quantity of item1
        repository.decreaseQuantity(101)
        assertEquals(1, repository.getItemQuantityInTray(101))

        // Remove item2
        repository.removeFromTray(102)
        assertEquals(1, repository.tray.value.size)

        // Clear tray
        repository.clearTray()
        assertTrue(repository.tray.value.isEmpty())
    }

    @Test
    fun testTraySameIdDifferentCanteensDoNotCollide() {
        val cafeteriaItem = MenuItem(id = 1, canteen = "cafeteria", itemName = "Poha", category = "Breakfast", price = "30.00")
        val nescafeItem = MenuItem(id = 1, canteen = "nescafe", itemName = "Coffee", category = "Beverages", price = "20.00")

        repository.addToTray(cafeteriaItem)
        repository.addToTray(nescafeItem)

        assertEquals(2, repository.tray.value.size)
        repository.decreaseQuantity(cafeteriaItem)
        assertEquals(1, repository.tray.value.size)
        assertEquals("nescafe", repository.tray.value.first().item.canteen)

        repository.setItemQuantity(nescafeItem, 4)
        assertEquals(4, repository.tray.value.first().quantity)

        repository.setItemQuantity(nescafeItem, 0)
        assertTrue(repository.tray.value.isEmpty())
    }

    @Test
    fun testFavourites() {
        assertEquals(false, repository.isFavourite(55))
        repository.toggleFavourite(55)
        assertEquals(true, repository.isFavourite(55))
        repository.toggleFavourite(55)
        assertEquals(false, repository.isFavourite(55))
    }
}
