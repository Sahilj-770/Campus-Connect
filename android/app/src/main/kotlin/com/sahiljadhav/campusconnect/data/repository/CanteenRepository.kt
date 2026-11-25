package com.sahiljadhav.campusconnect.data.repository

import com.sahiljadhav.campusconnect.data.api.ApiClient
import com.sahiljadhav.campusconnect.data.model.Canteen
import com.sahiljadhav.campusconnect.data.model.MenuItem
import com.sahiljadhav.campusconnect.data.model.NetworkResult
import com.sahiljadhav.campusconnect.data.model.TrayItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import java.io.IOException

class CanteenRepository(
    private val apiClient: ApiClient = ApiClient
) {
    // In-memory cache for menu items
    private var cachedMenu: List<MenuItem> = emptyList()
    private var cachedPicks: List<MenuItem> = emptyList()

    // Tray / Cart State
    private val _tray = MutableStateFlow<List<TrayItem>>(emptyList())
    val tray: StateFlow<List<TrayItem>> = _tray.asStateFlow()

    // Favourites State
    private val _favouriteItemIds = MutableStateFlow<Set<Long>>(emptySet())
    val favouriteItemIds: StateFlow<Set<Long>> = _favouriteItemIds.asStateFlow()

    // Verified default canteens as graceful baseline
    val defaultCanteens = listOf(
        Canteen(id = "cafeteria", name = "Cafeteria"),
        Canteen(id = "timeless", name = "Timeless"),
        Canteen(id = "nescafe", name = "Nescafe")
    )

    suspend fun getCanteens(): NetworkResult<List<Canteen>> = withContext(Dispatchers.IO) {
        try {
            val list = try {
                apiClient.canteenApi.getCanteens()
            } catch (e: Exception) {
                apiClient.canteenFallbackApi.getCanteens()
            }
            if (list.isNotEmpty()) {
                NetworkResult.Success(list)
            } else {
                NetworkResult.Success(defaultCanteens)
            }
        } catch (e: Exception) {
            // If offline or timeout, provide verified canteens
            NetworkResult.Success(defaultCanteens)
        }
    }

    suspend fun getMenu(canteenId: String? = null, forceRefresh: Boolean = false): NetworkResult<List<MenuItem>> =
        withContext(Dispatchers.IO) {
            if (!forceRefresh && cachedMenu.isNotEmpty()) {
                val filtered = if (canteenId.isNullOrBlank() || canteenId == "all") {
                    cachedMenu
                } else {
                    cachedMenu.filter { it.canteen.equals(canteenId, ignoreCase = true) }
                }
                if (filtered.isNotEmpty()) {
                    return@withContext NetworkResult.Success(filtered)
                }
            }

            try {
                val items = try {
                    if (canteenId.isNullOrBlank() || canteenId == "all") {
                        apiClient.canteenApi.getAllMenu()
                    } else {
                        apiClient.canteenApi.getMenuByCanteen(canteenId.lowercase())
                    }
                } catch (e: Exception) {
                    if (canteenId.isNullOrBlank() || canteenId == "all") {
                        apiClient.canteenFallbackApi.getAllMenu()
                    } else {
                        apiClient.canteenFallbackApi.getMenuByCanteen(canteenId.lowercase())
                    }
                }

                if (canteenId.isNullOrBlank() || canteenId == "all") {
                    cachedMenu = items
                }
                NetworkResult.Success(items)
            } catch (e: IOException) {
                if (cachedMenu.isNotEmpty()) {
                    val filtered = if (canteenId.isNullOrBlank() || canteenId == "all") {
                        cachedMenu
                    } else {
                        cachedMenu.filter { it.canteen.equals(canteenId, ignoreCase = true) }
                    }
                    NetworkResult.Success(filtered)
                } else {
                    NetworkResult.Error("Connecting to CampusConnect Canteen backend...", isColdStart = true)
                }
            } catch (e: Exception) {
                NetworkResult.Error(e.message ?: "Failed to load menu items")
            }
        }

    suspend fun getCampusPicks(): NetworkResult<List<MenuItem>> = withContext(Dispatchers.IO) {
        if (cachedPicks.isNotEmpty()) {
            return@withContext NetworkResult.Success(cachedPicks)
        }
        try {
            val picks = try {
                apiClient.canteenApi.getCampusPicks()
            } catch (e: Exception) {
                apiClient.canteenFallbackApi.getCampusPicks()
            }
            if (picks.isNotEmpty()) {
                cachedPicks = picks
                return@withContext NetworkResult.Success(picks)
            }
            // Fallback to available menu items when no campus favourites exist yet
            val menuRes = if (cachedMenu.isNotEmpty()) {
                NetworkResult.Success(cachedMenu)
            } else {
                getMenu()
            }
            val fallbackPicks = when (menuRes) {
                is NetworkResult.Success -> menuRes.data.filter { it.isItemAvailable }.take(6)
                else -> emptyList()
            }
            cachedPicks = fallbackPicks
            NetworkResult.Success(fallbackPicks)
        } catch (e: Exception) {
            // If top picks fail, return available items from cached menu
            val fallbackPicks = cachedMenu.take(6)
            if (fallbackPicks.isNotEmpty()) {
                NetworkResult.Success(fallbackPicks)
            } else {
                NetworkResult.Error("Couldn't load campus picks right now")
            }
        }
    }

    // Tray Operations
    fun addToTray(item: MenuItem) {
        val current = _tray.value.toMutableList()
        val index = current.indexOfFirst { it.item.uniqueKey == item.uniqueKey }
        if (index >= 0) {
            val existing = current[index]
            current[index] = existing.copy(quantity = existing.quantity + 1)
        } else {
            current.add(TrayItem(item = item, quantity = 1))
        }
        _tray.value = current
    }

    fun setItemQuantity(item: MenuItem, quantity: Int) {
        val current = _tray.value.toMutableList()
        val index = current.indexOfFirst { it.item.uniqueKey == item.uniqueKey }
        if (quantity <= 0) {
            if (index >= 0) current.removeAt(index)
        } else if (index >= 0) {
            current[index] = current[index].copy(quantity = quantity)
        } else {
            current.add(TrayItem(item = item, quantity = quantity))
        }
        _tray.value = current
    }

    fun decreaseQuantity(item: MenuItem) {
        val current = _tray.value.toMutableList()
        val index = current.indexOfFirst { it.item.uniqueKey == item.uniqueKey }
        if (index >= 0) {
            val existing = current[index]
            if (existing.quantity > 1) {
                current[index] = existing.copy(quantity = existing.quantity - 1)
            } else {
                current.removeAt(index)
            }
            _tray.value = current
        }
    }

    fun decreaseQuantity(itemId: Long) {
        val current = _tray.value.toMutableList()
        val index = current.indexOfFirst { it.item.id == itemId }
        if (index >= 0) {
            val existing = current[index]
            if (existing.quantity > 1) {
                current[index] = existing.copy(quantity = existing.quantity - 1)
            } else {
                current.removeAt(index)
            }
            _tray.value = current
        }
    }

    fun removeFromTray(item: MenuItem) {
        val current = _tray.value.toMutableList()
        current.removeAll { it.item.uniqueKey == item.uniqueKey }
        _tray.value = current
    }

    fun removeFromTray(itemId: Long) {
        val current = _tray.value.toMutableList()
        current.removeAll { it.item.id == itemId }
        _tray.value = current
    }

    fun clearTray() {
        _tray.value = emptyList()
    }

    fun getItemQuantityInTray(itemId: Long): Int {
        return _tray.value.firstOrNull { it.item.id == itemId }?.quantity ?: 0
    }

    // Favourites Operations
    fun toggleFavourite(itemId: Long) {
        val current = _favouriteItemIds.value.toMutableSet()
        if (current.contains(itemId)) {
            current.remove(itemId)
        } else {
            current.add(itemId)
        }
        _favouriteItemIds.value = current
    }

    fun isFavourite(itemId: Long): Boolean {
        return _favouriteItemIds.value.contains(itemId)
    }
}
