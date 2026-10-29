package com.sahiljadhav.campusconnect.ui.lostfound

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sahiljadhav.campusconnect.data.model.NetworkResult
import com.sahiljadhav.campusconnect.ui.common.EmptyView
import com.sahiljadhav.campusconnect.ui.common.ErrorView
import com.sahiljadhav.campusconnect.ui.common.LostFoundCardSkeleton
import com.sahiljadhav.campusconnect.ui.components.CampusFilterChip
import com.sahiljadhav.campusconnect.ui.components.CampusSearchBar
import com.sahiljadhav.campusconnect.ui.lostfound.components.ItemDetailSheet
import com.sahiljadhav.campusconnect.ui.lostfound.components.LostFoundItemCard
import com.sahiljadhav.campusconnect.ui.lostfound.components.ReportItemDialog
import com.sahiljadhav.campusconnect.ui.theme.AvailableGreen
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.CampusShapes
import com.sahiljadhav.campusconnect.ui.theme.CampusSpacing

/**
 * Redesigned Lost & Found Screen
 * - Utility-focused, trustworthy, recovery-oriented
 * - Segmented tabs for Lost vs Found with real live item counts
 * - Prominent Search & Category Filter chips
 * - Direct "Report an Item" CTA
 * - Standardized LostFoundItemCard list
 * - Bottom dock clearance
 */
@Composable
fun LostFoundScreen(
    viewModel: LostFoundViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val filteredItems by viewModel.currentFilteredItems.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val haptic = LocalHapticFeedback.current

    val activeState = if (uiState.activeTab == "lost") uiState.lostItemsState else uiState.foundItemsState

    LaunchedEffect(uiState.reportSuccessMessage) {
        uiState.reportSuccessMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearSuccessMessage()
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Segment Tabs: Lost vs Found
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .clip(CampusShapes.button)
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                    .padding(4.dp)
            ) {
                val isLostActive = uiState.activeTab == "lost"
                val lostCount = when (val res = uiState.lostItemsState) {
                    is NetworkResult.Success -> " (${res.data.size})"
                    else -> ""
                }
                val foundCount = when (val res = uiState.foundItemsState) {
                    is NetworkResult.Success -> " (${res.data.size})"
                    else -> ""
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isLostActive) BrandOrange else Color.Transparent)
                        .clickable {
                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            viewModel.selectTab("lost")
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Lost Items$lostCount",
                        style = MaterialTheme.typography.titleSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = if (isLostActive) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (!isLostActive) AvailableGreen else Color.Transparent)
                        .clickable {
                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            viewModel.selectTab("found")
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Found Items$foundCount",
                        style = MaterialTheme.typography.titleSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = if (!isLostActive) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }
            }

            // Search Bar & Report Button Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.weight(1f)) {
                    CampusSearchBar(
                        query = uiState.searchQuery,
                        onQueryChange = { viewModel.setSearchQuery(it) },
                        placeholder = "Search ${uiState.activeTab} items..."
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                Surface(
                    onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        viewModel.openReportDialog(uiState.activeTab)
                    },
                    shape = CampusShapes.button,
                    color = BrandOrange,
                    modifier = Modifier.height(52.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Add,
                            contentDescription = "Report",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Report",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        )
                    }
                }
            }

            // Category Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                viewModel.categories.forEach { category ->
                    CampusFilterChip(
                        selected = uiState.selectedCategoryFilter == category,
                        onClick = { viewModel.selectCategoryFilter(category) },
                        label = category
                    )
                }
            }

            // Content Area: Loading / Error / Empty / Item List
            when (val state = activeState) {
                is NetworkResult.Loading -> {
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
                        items(5) {
                            LostFoundCardSkeleton()
                        }
                    }
                }

                is NetworkResult.Error -> {
                    ErrorView(
                        message = state.message,
                        onRetry = { viewModel.loadData(forceRefresh = true) },
                        isColdStart = state.isColdStart
                    )
                }

                is NetworkResult.Success -> {
                    if (filteredItems.isEmpty()) {
                        EmptyView(
                            title = if (uiState.searchQuery.isNotBlank() || uiState.selectedCategoryFilter != "All")
                                "No matching items found"
                            else
                                "No ${uiState.activeTab} items reported yet",
                            subtitle = if (uiState.searchQuery.isNotBlank())
                                "No items matching \"${uiState.searchQuery}\". Try adjusting your search term."
                            else
                                "Be the first student to report a ${uiState.activeTab} item to help the campus community.",
                            emoji = if (uiState.activeTab == "lost") "🔍" else "📦"
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
                            items(filteredItems, key = { it.serialNumber }) { item ->
                                LostFoundItemCard(
                                    item = item,
                                    onClick = { viewModel.setSelectedItemForDetail(item) }
                                )
                            }
                        }
                    }
                }
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = CampusSpacing.dockBottomPadding + 8.dp)
        )
    }

    // Modal Bottom Sheet for Item Details
    if (uiState.selectedItemForDetail != null) {
        ItemDetailSheet(
            item = uiState.selectedItemForDetail,
            onDismiss = { viewModel.setSelectedItemForDetail(null) }
        )
    }

    // Report Item Dialog
    if (uiState.isReportDialogOpen) {
        ReportItemDialog(
            initialStatus = uiState.reportDialogInitialStatus,
            onDismiss = { viewModel.closeReportDialog() },
            onSubmit = { name, st, loc, desc, person, roll, contact, file ->
                viewModel.submitReport(
                    itemName = name,
                    status = st,
                    location = loc,
                    description = desc,
                    personName = person,
                    rollNumber = roll,
                    contactNumber = contact,
                    imageFile = file
                )
            },
            isSubmitting = uiState.isSubmittingReport,
            errorMessage = uiState.reportErrorMessage
        )
    }
}
