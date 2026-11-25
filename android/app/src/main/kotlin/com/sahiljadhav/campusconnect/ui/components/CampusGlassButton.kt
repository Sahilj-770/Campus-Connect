package com.sahiljadhav.campusconnect.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sahiljadhav.campusconnect.ui.theme.BrandAmber
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.BrandOrangeDark

enum class GlassButtonVariant {
    BRAND_ORANGE,
    TRANSLUCENT_SURFACE,
    NEUTRAL_GLASS
}

/**
 * Native Jetpack Compose Liquid Glass Button inspired by modern 21st.dev component patterns.
 * Combines translucent gradient layers, a glass reflection highlight border,
 * subtle elevation, and spring-based press scaling.
 */
@Composable
fun CampusGlassButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: GlassButtonVariant = GlassButtonVariant.BRAND_ORANGE,
    shape: Shape = RoundedCornerShape(16.dp),
    minHeight: Dp = 50.dp,
    enabled: Boolean = true
) {
    CampusGlassButton(
        onClick = onClick,
        modifier = modifier,
        variant = variant,
        shape = shape,
        minHeight = minHeight,
        enabled = enabled
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge.copy(
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                color = Color.White
            )
        )
    }
}

@Composable
fun CampusGlassButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: GlassButtonVariant = GlassButtonVariant.BRAND_ORANGE,
    shape: Shape = RoundedCornerShape(16.dp),
    minHeight: Dp = 50.dp,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    // Spring press scale animation
    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled) 0.96f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "glassButtonScale"
    )

    // Glass gradients & highlight borders based on variant
    val backgroundBrush = when (variant) {
        GlassButtonVariant.BRAND_ORANGE -> Brush.linearGradient(
            colors = listOf(
                BrandOrange.copy(alpha = if (isPressed) 1.0f else 0.96f),
                BrandOrangeDark.copy(alpha = 0.98f)
            )
        )
        GlassButtonVariant.TRANSLUCENT_SURFACE -> Brush.linearGradient(
            colors = listOf(
                Color.White.copy(alpha = if (isPressed) 0.35f else 0.22f),
                Color.White.copy(alpha = if (isPressed) 0.20f else 0.12f)
            )
        )
        GlassButtonVariant.NEUTRAL_GLASS -> Brush.linearGradient(
            colors = listOf(
                MaterialTheme.colorScheme.surface.copy(alpha = if (isPressed) 0.95f else 0.85f),
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = if (isPressed) 0.90f else 0.75f)
            )
        )
    }

    val borderBrush = when (variant) {
        GlassButtonVariant.BRAND_ORANGE -> Brush.verticalGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.45f),
                BrandOrangeDark.copy(alpha = 0.30f)
            )
        )
        GlassButtonVariant.TRANSLUCENT_SURFACE -> Brush.verticalGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.60f),
                Color.White.copy(alpha = 0.15f)
            )
        )
        GlassButtonVariant.NEUTRAL_GLASS -> Brush.verticalGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.35f),
                MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.30f)
            )
        )
    }

    Box(
        modifier = modifier
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
                alpha = if (enabled) 1f else 0.5f
            }
            .shadow(
                elevation = if (isPressed) 2.dp else 6.dp,
                shape = shape,
                ambientColor = if (variant == GlassButtonVariant.BRAND_ORANGE) BrandOrange.copy(alpha = 0.3f) else Color.Black.copy(alpha = 0.1f),
                spotColor = if (variant == GlassButtonVariant.BRAND_ORANGE) BrandOrange.copy(alpha = 0.4f) else Color.Black.copy(alpha = 0.15f)
            )
            .clip(shape)
            .background(backgroundBrush)
            .border(width = 1.2.dp, brush = borderBrush, shape = shape)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick
            )
            .heightIn(min = minHeight)
            .padding(horizontal = 20.dp, vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            content = content
        )
    }
}
