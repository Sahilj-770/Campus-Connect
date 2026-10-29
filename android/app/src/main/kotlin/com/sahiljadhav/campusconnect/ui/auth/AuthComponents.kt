package com.sahiljadhav.campusconnect.ui.auth

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.Visibility
import androidx.compose.material.icons.rounded.VisibilityOff
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sahiljadhav.campusconnect.R
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.CampusShapes

/**
 * Reusable Header for Authentication Screens
 */
@Composable
fun AuthHeader(
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // App Logo Badge
        Box(
            modifier = Modifier
                .size(62.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(BrandOrange.copy(alpha = 0.12f))
                .border(
                    width = 1.dp,
                    color = BrandOrange.copy(alpha = 0.30f),
                    shape = RoundedCornerShape(18.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.app_logo),
                contentDescription = "CampusConnect Logo",
                modifier = Modifier.size(42.dp)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.ExtraBold,
                fontSize = 24.sp,
                letterSpacing = (-0.3).sp
            ),
            color = MaterialTheme.colorScheme.onBackground,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium.copy(fontSize = 13.5.sp),
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
    }
}

/**
 * Reusable Text Input for Auth Screens
 */
@Composable
fun AuthTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String,
    leadingIcon: ImageVector,
    modifier: Modifier = Modifier,
    keyboardType: KeyboardType = KeyboardType.Text,
    singleLine: Boolean = true,
    keyboardActions: KeyboardActions = KeyboardActions.Default
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, style = MaterialTheme.typography.bodyMedium) },
        placeholder = {
            Text(
                text = placeholder,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
            )
        },
        leadingIcon = {
            Icon(
                imageVector = leadingIcon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                modifier = Modifier.size(20.dp)
            )
        },
        shape = CampusShapes.button,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = BrandOrange,
            unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f),
            focusedContainerColor = MaterialTheme.colorScheme.surface,
            unfocusedContainerColor = MaterialTheme.colorScheme.surface
        ),
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        keyboardActions = keyboardActions,
        singleLine = singleLine,
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
    )
}

/**
 * Reusable Password Field with Eye Toggle
 */
@Composable
fun AuthPasswordField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String = "Password",
    placeholder: String = "Enter password",
    modifier: Modifier = Modifier,
    passwordVisible: Boolean,
    onTogglePasswordVisibility: () -> Unit,
    keyboardActions: KeyboardActions = KeyboardActions.Default
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, style = MaterialTheme.typography.bodyMedium) },
        placeholder = {
            Text(
                text = placeholder,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
            )
        },
        leadingIcon = {
            Icon(
                imageVector = Icons.Rounded.Lock,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                modifier = Modifier.size(20.dp)
            )
        },
        trailingIcon = {
            IconButton(
                onClick = onTogglePasswordVisibility,
                modifier = Modifier.size(48.dp)
            ) {
                Icon(
                    imageVector = if (passwordVisible) Icons.Rounded.VisibilityOff else Icons.Rounded.Visibility,
                    contentDescription = if (passwordVisible) "Hide password" else "Show password",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                    modifier = Modifier.size(20.dp)
                )
            }
        },
        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
        shape = CampusShapes.button,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = BrandOrange,
            unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f),
            focusedContainerColor = MaterialTheme.colorScheme.surface,
            unfocusedContainerColor = MaterialTheme.colorScheme.surface
        ),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        keyboardActions = keyboardActions,
        singleLine = true,
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
    )
}

/**
 * Primary CTA Button for Auth Screens with Loading State
 */
@Composable
fun AuthPrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    loadingText: String = "Please wait...",
    enabled: Boolean = true
) {
    val haptic = LocalHapticFeedback.current
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled && !isLoading) 0.97f else 1.0f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "authBtnScale"
    )

    Surface(
        onClick = {
            if (enabled && !isLoading) {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                onClick()
            }
        },
        enabled = enabled && !isLoading,
        shape = CampusShapes.button,
        color = if (enabled) BrandOrange else MaterialTheme.colorScheme.surfaceVariant,
        contentColor = if (enabled) Color.White else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
        modifier = modifier
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .fillMaxWidth()
            .height(50.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = Color.White,
                    strokeWidth = 2.5.dp
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = loadingText,
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                )
            } else {
                Text(
                    text = text,
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                )
            }
        }
    }
}

/**
 * Compact Error Banner for Friendly Auth Feedback
 */
@Composable
fun AuthErrorBanner(
    errorMessage: String?,
    modifier: Modifier = Modifier
) {
    AnimatedVisibility(
        visible = !errorMessage.isNullOrBlank(),
        enter = fadeIn(spring(stiffness = Spring.StiffnessMedium)),
        exit = fadeOut(spring(stiffness = Spring.StiffnessMedium))
    ) {
        if (!errorMessage.isNullOrBlank()) {
            val friendlyText = when {
                errorMessage.contains("invalid-credential", ignoreCase = true) ||
                        errorMessage.contains("wrong-password", ignoreCase = true) ||
                        errorMessage.contains("user-not-found", ignoreCase = true) ->
                    "Incorrect college email or password."
                errorMessage.contains("network", ignoreCase = true) ->
                    "Couldn't connect to server. Check your connection and try again."
                errorMessage.contains("email-already-in-use", ignoreCase = true) ->
                    "An account with this college email already exists. Try signing in."
                else -> errorMessage
            }

            Box(
                modifier = modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.error.copy(alpha = 0.12f))
                    .border(
                        1.dp,
                        MaterialTheme.colorScheme.error.copy(alpha = 0.35f),
                        RoundedCornerShape(10.dp)
                    )
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Text(
                    text = friendlyText,
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

/**
 * Secondary Bottom Prompt (e.g. Don't have an account? Create one)
 */
@Composable
fun AuthSwitchPrompt(
    promptText: String,
    actionText: String,
    onActionClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = promptText,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        TextButton(onClick = onActionClick) {
            Text(
                text = actionText,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = BrandOrange
                )
            )
        }
    }
}
