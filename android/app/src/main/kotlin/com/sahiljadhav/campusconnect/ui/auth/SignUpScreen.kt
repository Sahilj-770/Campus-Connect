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
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Email
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

/**
 * Polished Native CampusConnect Create Account (Sign Up) Screen
 * - Visually aligned with SignInScreen via shared AuthComponents
 * - Clean input styling, password match verification, and friendly error banners
 * - Balanced vertical layout with full IME keyboard clearance
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignUpScreen(
    viewModel: AuthViewModel,
    onBack: () -> Unit,
    onNavigateToSignIn: () -> Unit,
    onSignUpSuccess: () -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

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
                    title = "Join CampusConnect 🚀",
                    subtitle = "Create your student account to order food, report lost items, and access campus services."
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Error Banner
                AuthErrorBanner(
                    errorMessage = errorMessage,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                // Full Name
                AuthTextField(
                    value = fullName,
                    onValueChange = {
                        fullName = it
                        errorMessage = null
                    },
                    label = "Full Name",
                    placeholder = "Sahil Jadhav",
                    leadingIcon = Icons.Rounded.Person
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Email
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

                Spacer(modifier = Modifier.height(12.dp))

                // Password
                AuthPasswordField(
                    value = password,
                    onValueChange = {
                        password = it
                        errorMessage = null
                    },
                    label = "Password (min. 6 characters)",
                    placeholder = "Create password",
                    passwordVisible = passwordVisible,
                    onTogglePasswordVisibility = { passwordVisible = !passwordVisible }
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Confirm Password
                AuthPasswordField(
                    value = confirmPassword,
                    onValueChange = {
                        confirmPassword = it
                        errorMessage = null
                    },
                    label = "Confirm Password",
                    placeholder = "Re-enter password",
                    passwordVisible = confirmPasswordVisible,
                    onTogglePasswordVisibility = { confirmPasswordVisible = !confirmPasswordVisible }
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Primary Create Account CTA
                AuthPrimaryButton(
                    text = "Create Account",
                    loadingText = "Creating Account...",
                    isLoading = isLoading,
                    enabled = !isLoading,
                    onClick = {
                        if (fullName.isBlank() || email.isBlank() || password.isBlank() || confirmPassword.isBlank()) {
                            errorMessage = "Please fill in all fields."
                            return@AuthPrimaryButton
                        }
                        if (password.length < 6) {
                            errorMessage = "Password must be at least 6 characters."
                            return@AuthPrimaryButton
                        }
                        if (password != confirmPassword) {
                            errorMessage = "Passwords do not match."
                            return@AuthPrimaryButton
                        }

                        viewModel.signUp(
                            email = email.trim(),
                            pass = password,
                            fullName = fullName.trim(),
                            onSuccess = onSignUpSuccess,
                            onError = { err -> errorMessage = err }
                        )
                    }
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Switch to Sign In
                AuthSwitchPrompt(
                    promptText = "Already have an account? ",
                    actionText = "Sign In",
                    onActionClick = onNavigateToSignIn
                )
            }
        }
    }
}
