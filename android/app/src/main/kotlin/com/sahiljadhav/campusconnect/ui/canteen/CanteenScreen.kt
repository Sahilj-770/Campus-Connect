package com.sahiljadhav.campusconnect.ui.canteen

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sahiljadhav.campusconnect.data.model.NetworkResult
import com.sahiljadhav.campusconnect.ui.canteen.components.FoodDetailSheet
import com.sahiljadhav.campusconnect.ui.canteen.components.FoodItemCard
import com.sahiljadhav.campusconnect.ui.common.EmptyView
import com.sahiljadhav.campusconnect.ui.common.ErrorView
import com.sahiljadhav.campusconnect.ui.common.FoodCardSkeleton
import com.sahiljadhav.campusconnect.ui.components.CampusFilterChip
import com.sahiljadhav.campusconnect.ui.components.CampusSearchBar
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.CampusSpacing

/**
 * Redesigned Canteen Screen (Campus Bites)
 * - Refined outlet selector taking minimal vertical space
 * - Unified rounded CampusSearchBar
 * - Compact horizontal category chips
 * - Clear food count summary
 * - Premium FoodItemCards with smooth add-to-tray feedback
 * - Floating dock padding protection
 */
@Composable
fun CanteenScreen(
    viewModel: CanteenViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val filteredItems by viewModel.filteredMenuItems.collectAsState()
    val tray by viewModel.tray.collectAsState()
    val favouriteIds by viewModel.favouriteItemIds.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Search Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            CampusSearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.setSearchQuery(it) },
                placeholder = "Search foods, snacks, beverages..."
            )
        }

        // Compact Canteen Outlets Selector
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 2.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val canteens = listOf(
                Pair("all", "All Canteens"),
                Pair("cafeteria", "Cafeteria"),
                Pair("timeless", "Timeless"),
                Pair("nescafe", "Nescafe")
            )
            canteens.forEach { (id, title) ->
                CampusFilterChip(
                    selected = uiState.selectedCanteenId == id,
                    onClick = { viewModel.selectCanteen(id) },
                    label = title
                )
            }
        }

        // Horizontal Category Filter Chips
        if (uiState.availableCategories.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                uiState.availableCategories.forEach { category ->
                    CampusFilterChip(
                        selected = uiState.selectedCategory == category,
                        onClick = { viewModel.selectCategory(category) },
                        label = category
                    )
                }
            }
        }

        // Item Count Summary Header
        if (uiState.menuState is NetworkResult.Success) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 18.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${filteredItems.size} dishes found",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                if (uiState.selectedCanteenId != "all" || uiState.selectedCategory != "All" || uiState.searchQuery.isNotBlank()) {
                    Text(
                        text = "Filtered",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        color = BrandOrange
                    )
                }
            }
        }

        // Content Area: Loading / Error / Empty / Food List
        when (val res = uiState.menuState) {
            is NetworkResult.Loading -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(
                        start = 16.dp,
                        end = 16.dp,
                        top = 8.dp,
                        bottom = CampusSpacing.dockBottomPadding
                    ),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(6) {
                        FoodCardSkeleton()
                    }
                }
            }

            is NetworkResult.Error -> {
                ErrorView(
                    message = res.message,
                    onRetry = { viewModel.loadData(forceRefresh = true) },
                    isColdStart = res.isColdStart
                )
            }

            is NetworkResult.Success -> {
                if (filteredItems.isEmpty()) {
                    EmptyView(
                        title = "No dishes found",
                        subtitle = if (uiState.searchQuery.isNotBlank())
                            "No foods matching \"${uiState.searchQuery}\". Try another keyword or reset filters."
                        else
                            "No dishes found in this category for the selected canteen.",
                        emoji = "🍲"
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(
                            start = 16.dp,
                            end = 16.dp,
                            top = 6.dp,
                            bottom = CampusSpacing.dockBottomPadding
                        ),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filteredItems, key = { it.id }) { item ->
                            val trayItem = tray.firstOrNull { it.item.id == item.id }
                            val quantity = trayItem?.quantity ?: 0
                            val isFav = favouriteIds.contains(item.id)

                            FoodItemCard(
                                item = item,
                                quantityInTray = quantity,
                                isFavourite = isFav,
                                onItemClick = { viewModel.setSelectedItemForDetail(item) },
                                onAddToCart = { viewModel.addToTray(item) },
                                onDecreaseQuantity = { viewModel.decreaseQuantity(item.id) },
                                onToggleFavourite = { viewModel.toggleFavourite(item.id) }
                            )
                        }
                    }
                }
            }
        }
    }

    // Modal Bottom Sheet for Food Item Details
    if (uiState.selectedItemForDetail != null) {
        val selectedItem = uiState.selectedItemForDetail!!
        val currentQuantity = tray.firstOrNull { it.item.id == selectedItem.id }?.quantity ?: 0
        val isFav = favouriteIds.contains(selectedItem.id)

        FoodDetailSheet(
            item = selectedItem,
            currentQuantityInTray = currentQuantity,
            isFavourite = isFav,
            onDismiss = { viewModel.setSelectedItemForDetail(null) },
            onAddToCart = { qty ->
                repeat(qty - currentQuantity) {
                    viewModel.addToTray(selectedItem)
                }
            },
            onToggleFavourite = { viewModel.toggleFavourite(selectedItem.id) }
        )
    }
}
