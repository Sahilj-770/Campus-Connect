package com.sahiljadhav.campusconnect.ui.canteen

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.ShoppingBag
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
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
import com.sahiljadhav.campusconnect.ui.theme.CampusElevation
import com.sahiljadhav.campusconnect.ui.theme.CampusShapes
import com.sahiljadhav.campusconnect.ui.theme.CampusSpacing
import com.sahiljadhav.campusconnect.ui.theme.VarsityNavy

@Composable
fun CanteenScreen(
    viewModel: CanteenViewModel,
    onOpenTray: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val filteredItems by viewModel.filteredMenuItems.collectAsState()
    val tray by viewModel.tray.collectAsState()
    val favouriteIds by viewModel.favouriteItemIds.collectAsState()

    val trayCount = tray.sumOf { it.quantity }
    val trayTotal = tray.sumOf { it.totalCost }
    val trayTotalFormatted = if (trayTotal % 1.0 == 0.0) "₹${trayTotal.toInt()}" else "₹${String.format("%.2f", trayTotal)}"

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
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

        // Item Count Summary Header + Available Only Quick Toggle
        if (uiState.menuState is NetworkResult.Success) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${filteredItems.size} dishes found",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                CampusFilterChip(
                    selected = uiState.availableOnly,
                    onClick = { viewModel.toggleAvailableOnly() },
                    label = "Available only"
                )
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
                            bottom = if (trayCount > 0) CampusSpacing.dockBottomPadding + 68.dp else CampusSpacing.dockBottomPadding
                        ),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filteredItems, key = { it.uniqueKey }) { item ->
                            val trayItem = tray.firstOrNull { it.item.uniqueKey == item.uniqueKey }
                            val quantity = trayItem?.quantity ?: 0
                            val isFav = favouriteIds.contains(item.id)

                            FoodItemCard(
                                item = item,
                                quantityInTray = quantity,
                                isFavourite = isFav,
                                onItemClick = { viewModel.setSelectedItemForDetail(item) },
                                onAddToCart = { viewModel.addToTray(item) },
                                onDecreaseQuantity = { viewModel.decreaseQuantity(item) },
                                onToggleFavourite = { viewModel.toggleFavourite(item.id) }
                            )
                        }
                    }
                }
            }
        }
        }

        // Thumb-Zone Floating Live Tray Summary Bar
        AnimatedVisibility(
            visible = trayCount > 0,
            enter = slideInVertically { it } + fadeIn(),
            exit = slideOutVertically { it } + fadeOut(),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(horizontal = 16.dp)
                .padding(bottom = CampusSpacing.dockBottomPadding + 6.dp)
        ) {
            Surface(
                onClick = onOpenTray,
                shape = RoundedCornerShape(16.dp),
                color = VarsityNavy,
                shadowElevation = CampusElevation.medium,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = BrandOrange,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Rounded.ShoppingBag,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "$trayCount ${if (trayCount == 1) "item" else "items"} in tray",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                color = Color.White
                            )
                            Text(
                                text = "Total $trayTotalFormatted",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFFD6DFED)
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "View Tray",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFFFDBA74)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                            contentDescription = null,
                            tint = Color(0xFFFDBA74),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }

    // Modal Bottom Sheet for Food Item Details
    if (uiState.selectedItemForDetail != null) {
        val selectedItem = uiState.selectedItemForDetail!!
        val currentQuantity = tray.firstOrNull { it.item.uniqueKey == selectedItem.uniqueKey }?.quantity ?: 0
        val isFav = favouriteIds.contains(selectedItem.id)

        FoodDetailSheet(
            item = selectedItem,
            currentQuantityInTray = currentQuantity,
            isFavourite = isFav,
            onDismiss = { viewModel.setSelectedItemForDetail(null) },
            onAddToCart = { qty ->
                viewModel.setItemQuantity(selectedItem, qty)
            },
            onToggleFavourite = { viewModel.toggleFavourite(selectedItem.id) }
        )
    }
}
