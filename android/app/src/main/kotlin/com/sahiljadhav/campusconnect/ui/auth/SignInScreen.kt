package com.sahiljadhav.campusconnect.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Email
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sahiljadhav.campusconnect.ui.theme.BrandOrange
import com.sahiljadhav.campusconnect.ui.theme.CampusShapes

/**
 * Polished Native CampusConnect Sign In Screen
 * - Vertically balanced layout without excessive whitespace
 * - CampusConnect branding with app icon badge
 * - Reusable AuthTextField and AuthPasswordField with large eye toggle
 * - Restrained BrandOrange CTA with loading state
 * - Clean error presentation and full keyboard/IME handling
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignInScreen(
    viewModel: AuthViewModel,
    onBack: () -> Unit,
    onNavigateToSignUp: () -> Unit,
    onSignInSuccess: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var forgotPasswordDialogVisible by remember { mutableStateOf(false) }
    var resetEmail by remember { mutableStateOf("") }
    var resetSuccessMessage by remember { mutableStateOf<String?>(null) }

    val isLoading by viewModel.isOperationLoading.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.onSurface
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .imePadding(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 24.dp, vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Branding Header
                AuthHeader(
                    title = "Welcome back 👋",
                    subtitle = "Sign in to access your orders, lost & found reports, and student services."
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Error Banner
                AuthErrorBanner(
                    errorMessage = errorMessage,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                // Email Input
                AuthTextField(
                    value = email,
                    onValueChange = {
                        email = it
                        errorMessage = null
                    },
                    label = "College Email",
                    placeholder = "student@dypcoe.edu.in",
                    leadingIcon = Icons.Rounded.Email,
                    keyboardType = KeyboardType.Email
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Password Input
                AuthPasswordField(
                    value = password,
                    onValueChange = {
                        password = it
                        errorMessage = null
                    },
                    passwordVisible = passwordVisible,
                    onTogglePasswordVisibility = { passwordVisible = !passwordVisible }
                )

                // Forgot Password Secondary Link
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 2.dp),
                    contentAlignment = Alignment.CenterEnd
                ) {
                    TextButton(
                        onClick = {
                            resetEmail = email
                            forgotPasswordDialogVisible = true
                        }
                    ) {
                        Text(
                            text = "Forgot password?",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = BrandOrange
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Sign In Primary CTA
                AuthPrimaryButton(
                    text = "Sign In",
                    loadingText = "Signing in...",
                    isLoading = isLoading,
                    enabled = !isLoading,
                    onClick = {
                        if (email.isBlank() || password.isBlank()) {
                            errorMessage = "Please enter both college email and password."
                            return@AuthPrimaryButton
                        }
                        viewModel.signIn(
                            email = email.trim(),
                            pass = password,
                            onSuccess = onSignInSuccess,
                            onError = { err -> errorMessage = err }
                        )
                    }
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Switch to Sign Up
                AuthSwitchPrompt(
                    promptText = "Don't have an account? ",
                    actionText = "Create one",
                    onActionClick = onNavigateToSignUp
                )
            }
        }
    }

    // Forgot Password Dialog
    if (forgotPasswordDialogVisible) {
        AlertDialog(
            onDismissRequest = { forgotPasswordDialogVisible = false },
            shape = CampusShapes.dialog,
            containerColor = MaterialTheme.colorScheme.surface,
            title = {
                Text(
                    text = "Reset Password",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    ),
                    color = MaterialTheme.colorScheme.onSurface
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Enter your registered college email to receive a password reset link.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    OutlinedTextField(
                        value = resetEmail,
                        onValueChange = { resetEmail = it },
                        label = { Text("College Email") },
                        singleLine = true,
                        shape = CampusShapes.button,
                        modifier = Modifier.fillMaxWidth()
                    )

                    if (resetSuccessMessage != null) {
                        Text(
                            text = resetSuccessMessage ?: "",
                            color = BrandOrange,
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                        )
                    }
                }
            },
            confirmButton = {
                AuthPrimaryButton(
                    text = "Send Reset Link",
                    onClick = {
                        if (resetEmail.isNotBlank()) {
                            viewModel.sendPasswordReset(
                                email = resetEmail.trim(),
                                onSuccess = {
                                    resetSuccessMessage = "Reset email sent! Check your inbox."
                                },
                                onError = { err ->
                                    resetSuccessMessage = err
                                }
                            )
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            dismissButton = {
                TextButton(onClick = { forgotPasswordDialogVisible = false }) {
                    Text(
                        text = "Close",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        )
    }
}
