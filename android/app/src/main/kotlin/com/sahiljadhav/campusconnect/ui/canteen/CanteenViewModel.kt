package com.sahiljadhav.campusconnect.ui.canteen

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sahiljadhav.campusconnect.data.model.Canteen
import com.sahiljadhav.campusconnect.data.model.MenuItem
import com.sahiljadhav.campusconnect.data.model.NetworkResult
import com.sahiljadhav.campusconnect.data.model.TrayItem
import com.sahiljadhav.campusconnect.data.repository.CanteenRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class CanteenUiState(
    val canteens: List<Canteen> = emptyList(),
    val selectedCanteenId: String = "all",
    val selectedCategory: String = "All",
    val searchQuery: String = "",
    val availableCategories: List<String> = listOf("All"),
    val menuState: NetworkResult<List<MenuItem>> = NetworkResult.Loading,
    val selectedItemForDetail: MenuItem? = null
)

class CanteenViewModel(
    private val repository: CanteenRepository = CanteenRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(CanteenUiState())
    val uiState: StateFlow<CanteenUiState> = _uiState.asStateFlow()

    val tray: StateFlow<List<TrayItem>> = repository.tray
    val favouriteItemIds: StateFlow<Set<Long>> = repository.favouriteItemIds

    // Filtered menu items based on canteen, category and search query
    val filteredMenuItems: StateFlow<List<MenuItem>> = combine(
        _uiState,
        _uiState
    ) { state, _ ->
        val rawItems = when (val res = state.menuState) {
            is NetworkResult.Success -> res.data
            else -> emptyList()
        }

        rawItems.filter { item ->
            val matchesCanteen = state.selectedCanteenId == "all" ||
                    item.canteen.equals(state.selectedCanteenId, ignoreCase = true)

            val matchesCategory = state.selectedCategory == "All" ||
                    item.category.equals(state.selectedCategory, ignoreCase = true)

            val matchesSearch = state.searchQuery.isBlank() ||
                    item.itemName.contains(state.searchQuery, ignoreCase = true) ||
                    item.category.contains(state.searchQuery, ignoreCase = true) ||
                    (!item.description.isNullOrBlank() && item.description.contains(state.searchQuery, ignoreCase = true))

            matchesCanteen && matchesCategory && matchesSearch
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        loadData()
    }

    fun loadData(forceRefresh: Boolean = false) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(menuState = NetworkResult.Loading)

            // 1. Fetch Canteens
            val canteensRes = repository.getCanteens()
            val canteens = when (canteensRes) {
                is NetworkResult.Success -> canteensRes.data
                else -> repository.defaultCanteens
            }

            val menuRes = repository.getMenu(forceRefresh = forceRefresh)
            val currentCanteen = _uiState.value.selectedCanteenId
            val categories = categoriesForCanteen(menuRes, currentCanteen)

            _uiState.value = _uiState.value.copy(
                canteens = canteens,
                availableCategories = categories,
                menuState = menuRes
            )
        }
    }

    private fun categoriesForCanteen(menuRes: NetworkResult<List<MenuItem>>, canteenId: String): List<String> {
        if (menuRes !is NetworkResult.Success) return listOf("All")
        val scoped = if (canteenId == "all") menuRes.data else menuRes.data.filter { it.canteen.equals(canteenId, ignoreCase = true) }
        return listOf("All") + scoped.map { it.category }.distinct().sorted()
    }

    fun selectCanteen(canteenId: String) {
        _uiState.value = _uiState.value.copy(
            selectedCanteenId = canteenId,
            selectedCategory = "All",
            availableCategories = categoriesForCanteen(_uiState.value.menuState, canteenId)
        )
    }

    fun selectCategory(category: String) {
        _uiState.value = _uiState.value.copy(selectedCategory = category)
    }

    fun setSearchQuery(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
    }

    fun setSelectedItemForDetail(item: MenuItem?) {
        _uiState.value = _uiState.value.copy(selectedItemForDetail = item)
    }

    fun addToTray(item: MenuItem) {
        repository.addToTray(item)
    }

    fun setItemQuantity(item: MenuItem, quantity: Int) {
        repository.setItemQuantity(item, quantity)
    }

    fun decreaseQuantity(item: MenuItem) {
        repository.decreaseQuantity(item)
    }

    fun decreaseQuantity(itemId: Long) {
        repository.decreaseQuantity(itemId)
    }

    fun removeFromTray(item: MenuItem) {
        repository.removeFromTray(item)
    }

    fun removeFromTray(itemId: Long) {
        repository.removeFromTray(itemId)
    }

    fun clearTray() {
        repository.clearTray()
    }

    fun toggleFavourite(itemId: Long) {
        repository.toggleFavourite(itemId)
    }
}
