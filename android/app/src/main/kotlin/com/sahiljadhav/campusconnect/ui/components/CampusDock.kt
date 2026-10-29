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
import androidx.compose.foundation.gestures.detectDragGesturesAfterLongPress
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
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
 * Premium iOS-inspired Native Floating Dock Navigation.
 * - Fixed overall width & height (328dp x 56dp, 100% constant)
 * - 4 strictly equal, fixed-width slots (80dp each)
 * - Single shared sliding active indicator with spring physics
 * - Dual Interaction Modes:
 *   1. Immediate Tap: direct navigation with subtle tactile feedback
 *   2. Long-Press + Slide (Scrub Mode): touch & hold anywhere on the dock to enter scrub mode,
 *      slide finger across slots with fluid tracking & discrete slot-boundary haptics,
 *      release to commit navigation.
 * - Complete accessibility and semantic labels.
 */
@Composable
fun CampusDock(
    selectedTab: CampusTab,
    onTabSelected: (CampusTab) -> Unit,
    trayCount: Int = 0,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current
    val density = LocalDensity.current
    val tabs = CampusTab.entries
    val selectedIndex = tabs.indexOf(selectedTab).coerceIn(0, tabs.lastIndex)

    // Scrub gesture states
    var isScrubbing by remember { mutableStateOf(false) }
    var scrubIndex by remember { mutableIntStateOf(selectedIndex) }
    var isOutsideBounds by remember { mutableStateOf(false) }

    // Synchronize scrubIndex with selectedIndex when not scrubbing
    if (!isScrubbing && scrubIndex != selectedIndex) {
        scrubIndex = selectedIndex
    }

    val activeIndex = if (isScrubbing && !isOutsideBounds) scrubIndex else selectedIndex

    // Fluid spring sliding indicator offset
    val indicatorOffset by animateDpAsState(
        targetValue = DOCK_PADDING + (SLOT_WIDTH * activeIndex),
        animationSpec = spring(
            dampingRatio = if (isScrubbing) 0.86f else 0.82f,
            stiffness = if (isScrubbing) Spring.StiffnessMedium else Spring.StiffnessMediumLow
        ),
        label = "dockIndicatorOffset"
    )

    // Scrub emphasis animations
    val indicatorScale by animateFloatAsState(
        targetValue = if (isScrubbing && !isOutsideBounds) 1.04f else 1.0f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "indicatorScale"
    )

    val indicatorBgAlpha by animateFloatAsState(
        targetValue = if (isScrubbing && !isOutsideBounds) 0.26f else 0.16f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "indicatorBgAlpha"
    )

    val indicatorBorderAlpha by animateFloatAsState(
        targetValue = if (isScrubbing && !isOutsideBounds) 0.55f else 0.32f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "indicatorBorderAlpha"
    )

    // Pixel measurements for pointer gesture tracking
    val dockHeightPx = with(density) { DOCK_HEIGHT.toPx() }
    val dockPaddingPx = with(density) { DOCK_PADDING.toPx() }
    val slotWidthPx = with(density) { SLOT_WIDTH.toPx() }
    val maxAvailableWidthPx = slotWidthPx * tabs.size
    val verticalTolerancePx = with(density) { 64.dp.toPx() }

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
                    elevation = if (isScrubbing) CampusElevation.dock + 4.dp else CampusElevation.dock,
                    shape = CampusShapes.dock,
                    ambientColor = Color.Black.copy(alpha = 0.28f),
                    spotColor = BrandOrange.copy(alpha = if (isScrubbing) 0.35f else 0.22f)
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
                            Color.White.copy(alpha = if (isScrubbing) 0.32f else 0.22f),
                            MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.15f)
                        )
                    ),
                    shape = CampusShapes.dock
                )
                // Long-press + Slide (Scrub Mode) Gesture
                .pointerInput(selectedTab) {
                    detectDragGesturesAfterLongPress(
                        onDragStart = { offset ->
                            isScrubbing = true
                            isOutsideBounds = false
                            val relX = (offset.x - dockPaddingPx).coerceIn(0f, maxAvailableWidthPx - 1f)
                            val slot = (relX / slotWidthPx).toInt().coerceIn(0, tabs.lastIndex)
                            scrubIndex = slot
                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        },
                        onDrag = { change, _ ->
                            change.consume()
                            val posY = change.position.y
                            val posX = change.position.x

                            // Guard against dragging far outside vertically
                            if (posY < -verticalTolerancePx || posY > (dockHeightPx + verticalTolerancePx)) {
                                isOutsideBounds = true
                            } else {
                                isOutsideBounds = false
                                val relX = (posX - dockPaddingPx).coerceIn(0f, maxAvailableWidthPx - 1f)
                                val slot = (relX / slotWidthPx).toInt().coerceIn(0, tabs.lastIndex)
                                if (slot != scrubIndex) {
                                    scrubIndex = slot
                                    haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                }
                            }
                        },
                        onDragEnd = {
                            if (isScrubbing) {
                                if (!isOutsideBounds) {
                                    val targetTab = tabs[scrubIndex]
                                    if (targetTab != selectedTab) {
                                        haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                        onTabSelected(targetTab)
                                    }
                                }
                                isScrubbing = false
                                isOutsideBounds = false
                            }
                        },
                        onDragCancel = {
                            isScrubbing = false
                            isOutsideBounds = false
                        }
                    )
                }
        ) {
            // Fluid Sliding Active Indicator (Moves beneath slots)
            Box(
                modifier = Modifier
                    .offset(x = indicatorOffset, y = DOCK_PADDING)
                    .width(SLOT_WIDTH)
                    .height(SLOT_HEIGHT)
                    .graphicsLayer {
                        scaleX = indicatorScale
                        scaleY = indicatorScale
                    }
                    .clip(INDICATOR_SHAPE)
                    .background(BrandOrange.copy(alpha = indicatorBgAlpha))
                    .border(
                        width = if (isScrubbing && !isOutsideBounds) 1.5.dp else 1.dp,
                        color = BrandOrange.copy(alpha = indicatorBorderAlpha),
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
                tabs.forEachIndexed { index, tab ->
                    val isHighlighted = if (isScrubbing && !isOutsideBounds) {
                        index == scrubIndex
                    } else {
                        selectedTab == tab
                    }

                    DockSlot(
                        tab = tab,
                        isSelected = isHighlighted,
                        badgeCount = if (tab == CampusTab.TRAY) trayCount else 0,
                        onClick = {
                            if (!isScrubbing && selectedTab != tab) {
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
        CampusTab.CANTEEN -> "Bites"
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
            )
            .semantics {
                role = Role.Tab
                contentDescription = "${tab.title} Tab"
            },
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
                    contentDescription = null,
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
