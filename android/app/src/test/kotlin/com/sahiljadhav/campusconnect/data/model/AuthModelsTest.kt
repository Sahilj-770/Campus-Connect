package com.sahiljadhav.campusconnect.data.model

import org.junit.Assert.*
import org.junit.Test

class AuthModelsTest {

    @Test
    fun testUserProfileDefaults() {
        val profile = UserProfile(
            firebaseUid = "uid_test_123",
            email = "test@dypcoe.edu.in",
            fullName = "Sahil Jadhav",
            department = "Computer Engineering",
            rollNumber = "42",
            phone = "9876543210"
        )

        assertEquals("uid_test_123", profile.firebaseUid)
        assertEquals("test@dypcoe.edu.in", profile.email)
        assertEquals("Sahil Jadhav", profile.fullName)
        assertEquals("Computer Engineering", profile.department)
        assertEquals("42", profile.rollNumber)
        assertEquals("9876543210", profile.phone)
        assertNull(profile.year)
        assertNull(profile.division)
    }

    @Test
    fun testProfileResponseCompletion() {
        val responseComplete = ProfileResponse(
            success = true,
            user = UserProfile(
                firebaseUid = "uid_1",
                email = "s@dypcoe.edu.in",
                fullName = "Student Name",
                phone = "9876543210",
                department = "IT",
                rollNumber = "12",
                year = "BE",
                division = "B"
            ),
            completionPercentage = 100,
            isComplete = true
        )

        assertTrue(responseComplete.success)
        assertEquals(100, responseComplete.completionPercentage)
        assertTrue(responseComplete.isComplete)

        val responsePartial = ProfileResponse(
            success = true,
            user = UserProfile(
                firebaseUid = "uid_2",
                email = "p@dypcoe.edu.in",
                fullName = "Partial Student"
            ),
            completionPercentage = 17,
            isComplete = false
        )

        assertEquals(17, responsePartial.completionPercentage)
        assertFalse(responsePartial.isComplete)
    }

    @Test
    fun testUserOrderCalculations() {
        val items = listOf(
            UserOrderItem(itemName = "Samosa", quantity = 2, price = 20.0),
            UserOrderItem(itemName = "Tea", quantity = 1, price = 10.0)
        )
        val calculatedTotal = items.sumOf { it.price * it.quantity }
        val order = UserOrder(
            id = 101,
            userUid = "uid_test",
            canteen = "Cafeteria",
            customerName = "Sahil",
            department = "Computer",
            customerPhone = "9876543210",
            totalAmount = calculatedTotal,
            status = "PAID",
            items = items
        )

        assertEquals(50.0, order.totalAmount, 0.001)
        assertEquals(2, order.items.size)
        assertEquals("PAID", order.status)
        assertEquals("Cafeteria", order.canteen)
    }

    @Test
    fun testSharedAuthRequestsAndResponse() {
        val login = LoginRequest(email = "student@example.com", password = "secret123")
        val register = RegisterRequest(fullName = "Sahil Jadhav", email = "student@example.com", password = "secret123")
        val response = AuthResponse(
            success = true,
            token = "jwt.token.sig",
            user = UserProfile(firebaseUid = "cc_123", email = "student@example.com", fullName = "Sahil Jadhav")
        )

        assertEquals("student@example.com", login.email)
        assertEquals("Sahil Jadhav", register.fullName)
        assertTrue(response.success)
        assertEquals("jwt.token.sig", response.token)
        assertEquals("cc_123", response.user?.firebaseUid)
    }
}
