package com.sahiljadhav.campusconnect.ui.theme

import androidx.compose.ui.graphics.Color

// Campus Varsity + Burnt Saffron Palette (WCAG AA Verified, R-29: 3 Core Colors + Neutrals)
val VarsityNavy = Color(0xFF1B2A4A)       // Structural brand anchor (14.22:1 with white)
val VarsityNavyLight = Color(0xFF283D69)
val VarsityNavyInk = Color(0xFFD6DFED)

val BrandOrange = Color(0xFFC2410C)       // Deliberate Burnt Saffron accent (5.18:1 with white)
val BrandOrangeDark = Color(0xFF9A3412)   // Deep Copper (7.10:1 with white)
val BrandOrangeLight = Color(0xFFFB923C)  // Warm Saffron for Dark Mode (7.63:1 on dark surface)
val BrandAmber = Color(0xFFB45309)        // Deep Amber (5.02:1 with white)
val BrandCream = Color(0xFFF7F5F0)        // Warm Stone Paper

// Light Theme Colors (Warm Stone Paper + Crisp White Cards)
val PrimaryLight = BrandOrange
val OnPrimaryLight = Color(0xFFFFFFFF)
val PrimaryContainerLight = Color(0xFFFFEDD5)
val OnPrimaryContainerLight = Color(0xFF431407)

val SecondaryLight = VarsityNavy
val OnSecondaryLight = Color(0xFFFFFFFF)
val SecondaryContainerLight = Color(0xFFE2E8F0)
val OnSecondaryContainerLight = Color(0xFF0F172A)

val TertiaryLight = Color(0xFF0F766E)     // Pine Emerald
val OnTertiaryLight = Color(0xFFFFFFFF)
val TertiaryContainerLight = Color(0xFFCCFBF1)
val OnTertiaryContainerLight = Color(0xFF042F2E)

val BackgroundLight = Color(0xFFF7F5F0)
val OnBackgroundLight = Color(0xFF14171F)
val SurfaceLight = Color(0xFFFFFFFF)
val OnSurfaceLight = Color(0xFF14171F)
val SurfaceVariantLight = Color(0xFFEDEAE2)
val OnSurfaceVariantLight = Color(0xFF4B5363)
val OutlineLight = Color(0xFF6B7280)
val OutlineVariantLight = Color(0xFFDFDAD0)

// Dark Theme Colors (Deep Obsidian Slate)
val PrimaryDark = BrandOrangeLight
val OnPrimaryDark = Color(0xFF14171F)
val PrimaryContainerDark = Color(0xFF7C2D12)
val OnPrimaryContainerDark = Color(0xFFFFEDD5)

val SecondaryDark = Color(0xFFCBD5E1)
val OnSecondaryDark = Color(0xFF0F172A)
val SecondaryContainerDark = Color(0xFF283D69)
val OnSecondaryContainerDark = Color(0xFFE2E8F0)

val TertiaryDark = Color(0xFF34D399)
val OnTertiaryDark = Color(0xFF022C22)
val TertiaryContainerDark = Color(0xFF065F46)
val OnTertiaryContainerDark = Color(0xFFD1FAE5)

val BackgroundDark = Color(0xFF0E1117)
val OnBackgroundDark = Color(0xFFF4F5F7)
val SurfaceDark = Color(0xFF161B24)
val OnSurfaceDark = Color(0xFFF4F5F7)
val SurfaceVariantDark = Color(0xFF1F2633)
val OnSurfaceVariantDark = Color(0xFFB8C0CC)
val OutlineDark = Color(0xFF8B95A5)
val OutlineVariantDark = Color(0xFF2B3444)

// Semantic Status Colors (All WCAG AA verified with white text >= 5.0:1)
val SuccessGreen = Color(0xFF0F766E)
val SuccessGreenLight = Color(0xFFCCFBF1)
val ErrorRed = Color(0xFFB91C1C)
val ErrorRedLight = Color(0xFFFEE2E2)
val WarningYellow = Color(0xFFB45309)
val AvailableGreen = Color(0xFF0F766E)
val UnavailableRed = Color(0xFFB91C1C)
