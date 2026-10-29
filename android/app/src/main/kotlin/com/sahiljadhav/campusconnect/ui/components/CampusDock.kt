package com.sahiljadhav.campusconnect.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sahiljadhav.campusconnect.ui.common.CampusTab
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.CampusElevation
import com.sahiljadhav.campusconnect.ui.theme.CampusShapes

// Fixed Dock Geometry Constants
private val DOCK_WIDTH = 328.dp
private val DOCK_HEIGHT = 56.dp
private val DOCK_PADDING = 4.dp
private val SLOT_WIDTH = (DOCK_WIDTH - (DOCK_PADDING * 2)) / 4 // Exactly 80.dp
private val SLOT_HEIGHT = DOCK_HEIGHT - (DOCK_PADDING * 2) // Exactly 48.dp
private val INDICATOR_SHAPE = RoundedCornerShape(24.dp)

/**
 * Premium iOS/Instagram-inspired Native Floating Dock Navigation.
 * - Fixed overall width & height (never resizes regardless of destination or label length)
 * - 4 strictly equal, fixed-width slots (80dp each)
 * - Single shared sliding active indicator that smoothly travels between slots with spring physics
 * - Restrained dark translucent surface, subtle border, and soft shadow
 * - Discrete haptic feedback on tab change
 * - Correct bottom navigation insets
 */
@Composable
fun CampusDock(
    selectedTab: CampusTab,
    onTabSelected: (CampusTab) -> Unit,
    trayCount: Int = 0,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current
    val tabs = CampusTab.entries
    val selectedIndex = tabs.indexOf(selectedTab).coerceIn(0, tabs.lastIndex)

    // Smooth fluid sliding active indicator offset
    val indicatorOffset by animateDpAsState(
        targetValue = DOCK_PADDING + (SLOT_WIDTH * selectedIndex),
        animationSpec = spring(
            dampingRatio = 0.82f,
            stiffness = Spring.StiffnessMediumLow
        ),
        label = "dockIndicatorOffset"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(bottom = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        // Fixed Outer Dock Container (Constant dimensions)
        Box(
            modifier = Modifier
                .width(DOCK_WIDTH)
                .height(DOCK_HEIGHT)
                .shadow(
                    elevation = CampusElevation.dock,
                    shape = CampusShapes.dock,
                    ambientColor = Color.Black.copy(alpha = 0.28f),
                    spotColor = BrandOrange.copy(alpha = 0.22f)
                )
                .clip(CampusShapes.dock)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.surface.copy(alpha = 0.95f),
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.93f)
                        )
                    )
                )
                .border(
                    width = 1.dp,
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color.White.copy(alpha = 0.22f),
                            MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.15f)
                        )
                    ),
                    shape = CampusShapes.dock
                )
        ) {
            // Fluid Sliding Active Indicator (Moves beneath slots)
            Box(
                modifier = Modifier
                    .offset(x = indicatorOffset, y = DOCK_PADDING)
                    .width(SLOT_WIDTH)
                    .height(SLOT_HEIGHT)
                    .clip(INDICATOR_SHAPE)
                    .background(BrandOrange.copy(alpha = 0.16f))
                    .border(
                        width = 1.dp,
                        color = BrandOrange.copy(alpha = 0.32f),
                        shape = INDICATOR_SHAPE
                    )
            )

            // 4 Equal, Fixed-Width Slots
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(DOCK_PADDING),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                tabs.forEach { tab ->
                    val isSelected = selectedTab == tab
                    DockSlot(
                        tab = tab,
                        isSelected = isSelected,
                        badgeCount = if (tab == CampusTab.TRAY) trayCount else 0,
                        onClick = {
                            if (!isSelected) {
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                onTabSelected(tab)
                            }
                        }
                    )
                }
            }
        }
    }
}

/**
 * An individual fixed-width slot (strictly 80dp wide).
 * Sizing is 100% immune to text or selection state changes.
 */
@Composable
private fun DockSlot(
    tab: CampusTab,
    isSelected: Boolean,
    badgeCount: Int,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue = when {
            isPressed -> 0.92f
            isSelected -> 1.05f
            else -> 1.0f
        },
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "slotScale"
    )

    val contentColor by animateColorAsState(
        targetValue = if (isSelected) BrandOrange else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.72f),
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "slotColor"
    )

    val compactLabel = when (tab) {
        CampusTab.HOME -> "Home"
        CampusTab.CANTEEN -> "Canteen"
        CampusTab.LOST_FOUND -> "Lost"
        CampusTab.TRAY -> "Tray"
    }

    Box(
        modifier = Modifier
            .width(SLOT_WIDTH)
            .height(SLOT_HEIGHT)
            .clip(INDICATOR_SHAPE)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier
                .graphicsLayer {
                    scaleX = scale
                    scaleY = scale
                }
                .padding(horizontal = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            // Tab Icon with BadgedBox for Tray
            BadgedBox(
                badge = {
                    if (badgeCount > 0) {
                        Badge(
                            containerColor = BrandOrange,
                            contentColor = Color.White
                        ) {
                            Text(
                                text = if (badgeCount > 99) "99+" else badgeCount.toString(),
                                fontSize = 9.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            ) {
                Icon(
                    imageVector = tab.icon,
                    contentDescription = tab.title,
                    tint = contentColor,
                    modifier = Modifier.size(if (isSelected) 20.dp else 22.dp)
                )
            }

            // Compact Label inside the fixed slot (visible only when selected)
            AnimatedVisibility(
                visible = isSelected,
                enter = fadeIn(spring(stiffness = Spring.StiffnessMedium)),
                exit = fadeOut(spring(stiffness = Spring.StiffnessMedium))
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = compactLabel,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = contentColor,
                            fontSize = 11.5.sp
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}
