package com.sahiljadhav.campusconnect.ui.lostfound

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sahiljadhav.campusconnect.data.model.LostFoundItem
import com.sahiljadhav.campusconnect.data.model.NetworkResult
import com.sahiljadhav.campusconnect.data.repository.LostFoundRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.io.File

data class LostFoundUiState(
    val activeTab: String = "lost", // "lost" or "found"
    val searchQuery: String = "",
    val selectedCategoryFilter: String = "All",
    val lostItemsState: NetworkResult<List<LostFoundItem>> = NetworkResult.Loading,
    val foundItemsState: NetworkResult<List<LostFoundItem>> = NetworkResult.Loading,
    val selectedItemForDetail: LostFoundItem? = null,
    val isReportDialogOpen: Boolean = false,
    val reportDialogInitialStatus: String = "lost",
    val isSubmittingReport: Boolean = false,
    val reportErrorMessage: String? = null,
    val reportSuccessMessage: String? = null
)

class LostFoundViewModel(
    private val repository: LostFoundRepository = LostFoundRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(LostFoundUiState())
    val uiState: StateFlow<LostFoundUiState> = _uiState.asStateFlow()

    val categories = listOf(
        "All",
        "Electronics",
        "IDs & Cards",
        "Bags & Wallets",
        "Books & Study",
        "Keys & Accessories"
    )

    val currentFilteredItems: StateFlow<List<LostFoundItem>> = combine(
        _uiState,
        _uiState
    ) { state, _ ->
        val rawItems = if (state.activeTab == "lost") {
            when (val res = state.lostItemsState) {
                is NetworkResult.Success -> res.data
                else -> emptyList()
            }
        } else {
            when (val res = state.foundItemsState) {
                is NetworkResult.Success -> res.data
                else -> emptyList()
            }
        }

        rawItems.filter { item ->
            val safeName = item.itemName
            val safeLocation = item.location
            val safeDescription = item.description
            val safeIcon = item.fallbackIcon

            val matchesCategory = when (state.selectedCategoryFilter) {
                "All" -> true
                "Electronics" -> safeIcon in listOf("📱", "🧮", "🔌", "🎧")
                "IDs & Cards" -> safeIcon == "🪪" || safeName.contains("id", ignoreCase = true) || safeName.contains("card", ignoreCase = true)
                "Bags & Wallets" -> safeIcon in listOf("👛", "🎒")
                "Books & Study" -> safeIcon in listOf("📚", "✏️")
                "Keys & Accessories" -> safeIcon in listOf("🔑", "🍶", "👓", "☂️")
                else -> true
            }

            val query = state.searchQuery.trim().lowercase()
            val matchesSearch = query.isEmpty() ||
                    safeName.lowercase().contains(query) ||
                    safeLocation.lowercase().contains(query) ||
                    safeDescription.lowercase().contains(query) ||
                    (!item.personName.isNullOrBlank() && item.personName.lowercase().contains(query))

            matchesCategory && matchesSearch
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        loadData()
    }

    fun loadData(forceRefresh: Boolean = false) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                lostItemsState = NetworkResult.Loading,
                foundItemsState = NetworkResult.Loading
            )

            val lostRes = repository.getLostItems(forceRefresh)
            val foundRes = repository.getFoundItems(forceRefresh)

            _uiState.value = _uiState.value.copy(
                lostItemsState = lostRes,
                foundItemsState = foundRes
            )
        }
    }

    fun selectTab(tab: String) {
        _uiState.value = _uiState.value.copy(activeTab = tab.lowercase())
    }

    fun setSearchQuery(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
    }

    fun selectCategoryFilter(category: String) {
        _uiState.value = _uiState.value.copy(selectedCategoryFilter = category)
    }

    fun setSelectedItemForDetail(item: LostFoundItem?) {
        _uiState.value = _uiState.value.copy(selectedItemForDetail = item)
    }

    fun openReportDialog(initialStatus: String = "lost") {
        _uiState.value = _uiState.value.copy(
            isReportDialogOpen = true,
            reportDialogInitialStatus = initialStatus,
            reportErrorMessage = null,
            reportSuccessMessage = null
        )
    }

    fun closeReportDialog() {
        _uiState.value = _uiState.value.copy(
            isReportDialogOpen = false,
            reportErrorMessage = null,
            reportSuccessMessage = null
        )
    }

    fun submitReport(
        itemName: String,
        status: String,
        location: String,
        description: String,
        personName: String,
        rollNumber: String,
        contactNumber: String,
        imageFile: File?
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isSubmittingReport = true,
                reportErrorMessage = null
            )

            val result = repository.reportItem(
                itemName = itemName,
                status = status,
                location = location,
                description = description,
                personName = personName,
                rollNumber = rollNumber,
                contactNumber = contactNumber,
                imageFile = imageFile
            )

            when (result) {
                is NetworkResult.Success -> {
                    _uiState.value = _uiState.value.copy(
                        isSubmittingReport = false,
                        isReportDialogOpen = false,
                        reportSuccessMessage = "Report submitted successfully!",
                        activeTab = status.lowercase()
                    )
                    loadData(forceRefresh = true)
                }
                is NetworkResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isSubmittingReport = false,
                        reportErrorMessage = result.message
                    )
                }
                is NetworkResult.Loading -> Unit
            }
        }
    }

    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(reportSuccessMessage = null)
    }
}
