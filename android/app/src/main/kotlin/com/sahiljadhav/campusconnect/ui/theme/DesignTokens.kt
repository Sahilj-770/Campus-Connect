package com.sahiljadhav.campusconnect.ui.theme

import androidx.compose.animation.core.AnimationSpec
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.SpringSpec
import androidx.compose.animation.core.TweenSpec
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Standardized CampusConnect Design Tokens
 * Provides single source of truth for spacing, shapes, elevations, and motion.
 */
object CampusSpacing {
    val xxs: Dp = 2.dp
    val xs: Dp = 4.dp
    val sm: Dp = 8.dp
    val md: Dp = 12.dp
    val lg: Dp = 16.dp
    val xl: Dp = 20.dp
    val xxl: Dp = 24.dp
    val section: Dp = 28.dp
    val dockBottomPadding: Dp = 88.dp // Space to prevent dock from covering content
}

object CampusShapes {
    val chip = RoundedCornerShape(10.dp)
    val button = RoundedCornerShape(14.dp)
    val card = RoundedCornerShape(18.dp)
    val sheet = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    val dock = RoundedCornerShape(28.dp)
    val dialog = RoundedCornerShape(22.dp)
    val avatar = RoundedCornerShape(50)
}

object CampusElevation {
    val none: Dp = 0.dp
    val low: Dp = 2.dp
    val medium: Dp = 6.dp
    val high: Dp = 12.dp
    val dock: Dp = 16.dp
}

object CampusMotion {
    const val durationInstantMs = 100
    const val durationMicroMs = 180
    const val durationStandardMs = 300
    const val durationEmphasisMs = 450
    const val durationSplashMs = 650

    val instantTween: TweenSpec<Float> = tween(durationInstantMs, easing = FastOutSlowInEasing)
    val microTween: TweenSpec<Float> = tween(durationMicroMs, easing = FastOutSlowInEasing)
    val standardTween: TweenSpec<Float> = tween(durationStandardMs, easing = FastOutSlowInEasing)
    val emphasisTween: TweenSpec<Float> = tween(durationEmphasisMs, easing = FastOutSlowInEasing)

    val snappySpring: SpringSpec<Float> = spring(
        dampingRatio = Spring.DampingRatioNoBouncy,
        stiffness = Spring.StiffnessMedium
    )

    val bouncySpring: SpringSpec<Float> = spring(
        dampingRatio = Spring.DampingRatioMediumBouncy,
        stiffness = Spring.StiffnessMedium
    )

    val gentleSpring: SpringSpec<Float> = spring(
        dampingRatio = 0.85f,
        stiffness = Spring.StiffnessLow
    )
}

object CampusColors {
    val BrandOrangePrimary = BrandOrange
    val BrandOrangeDark = Color(0xFFC95D1E)
    val BrandOrangeLight = Color(0xFFF99859)
    val BrandAmberAccent = Color(0xFFF59E0B)
    val BrandCreamText = Color(0xFFFFF4E8)

    // Dark Surface Layers
    val SurfaceDarkBase = Color(0xFF14100D)
    val SurfaceDarkElevated = Color(0xFF1C1713)
    val SurfaceDarkCard = Color(0xFF241E19)
    val SurfaceDarkBorder = Color(0x28FFFFFF)
    val SurfaceDarkBorderFocused = Color(0x50E8752D)

    // Status Colors
    val StatusAvailable = Color(0xFF16A34A)
    val StatusUnavailable = Color(0xFFDC2626)
    val StatusLost = Color(0xFFE8752D)
    val StatusFound = Color(0xFF10B981)
}
