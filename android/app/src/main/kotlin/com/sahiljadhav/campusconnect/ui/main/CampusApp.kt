package com.sahiljadhav.campusconnect.ui.main

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sahiljadhav.campusconnect.data.repository.AuthRepository
import com.sahiljadhav.campusconnect.ui.auth.AuthGateModal
import com.sahiljadhav.campusconnect.ui.auth.AuthUiState
import com.sahiljadhav.campusconnect.ui.auth.AuthViewModel
import com.sahiljadhav.campusconnect.ui.auth.MyOrdersScreen
import com.sahiljadhav.campusconnect.ui.auth.MyReportsScreen
import com.sahiljadhav.campusconnect.ui.auth.ProfileScreen
import com.sahiljadhav.campusconnect.ui.auth.SignInScreen
import com.sahiljadhav.campusconnect.ui.auth.SignUpScreen
import com.sahiljadhav.campusconnect.ui.canteen.CanteenScreen
import com.sahiljadhav.campusconnect.ui.canteen.CanteenViewModel
import com.sahiljadhav.campusconnect.ui.canteen.components.TrayContent
import com.sahiljadhav.campusconnect.ui.common.CampusTab
import com.sahiljadhav.campusconnect.ui.common.CampusTopBar
import com.sahiljadhav.campusconnect.ui.components.CampusDock
import com.sahiljadhav.campusconnect.ui.home.HomeScreen
import com.sahiljadhav.campusconnect.ui.home.HomeViewModel
import com.sahiljadhav.campusconnect.ui.lostfound.LostFoundScreen
import com.sahiljadhav.campusconnect.ui.lostfound.LostFoundViewModel
import com.sahiljadhav.campusconnect.ui.splash.CampusSplashScreen
import com.sahiljadhav.campusconnect.ui.theme.CampusMotion

enum class AuthDestination {
    NONE,
    SIGN_IN,
    SIGN_UP,
    PROFILE,
    MY_REPORTS,
    MY_ORDERS
}

@Composable
fun CampusApp(
    modifier: Modifier = Modifier
) {
    // Polished native launch splash state (runs on cold/warm start without blocking startup)
    var isSplashComplete by rememberSaveable { mutableStateOf(false) }

    if (!isSplashComplete) {
        CampusSplashScreen(
            onSplashFinished = { isSplashComplete = true },
            modifier = modifier
        )
        return
    }

    val context = LocalContext.current
    val authRepository = remember { AuthRepository(context.applicationContext) }
    val authViewModel: AuthViewModel = viewModel(factory = object : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return AuthViewModel(authRepository) as T
        }
    })

    var activeTab by rememberSaveable { mutableStateOf(CampusTab.HOME) }
    var activeAuthDestination by rememberSaveable { mutableStateOf(AuthDestination.NONE) }

    val canteenViewModel: CanteenViewModel = viewModel()
    val lostFoundViewModel: LostFoundViewModel = viewModel()
    val homeViewModel: HomeViewModel = viewModel()

    val tray by canteenViewModel.tray.collectAsState()
    val trayItemCount = tray.sumOf { it.quantity }

    val authState by authViewModel.uiState.collectAsState()
    val isLoggedIn = authState is AuthUiState.Authenticated
    val userDisplayName = (authState as? AuthUiState.Authenticated)?.profile?.fullName
        ?: (authState as? AuthUiState.Authenticated)?.user?.displayName

    val authGateVisible by authViewModel.authGateVisible.collectAsState()
    val authGateReason by authViewModel.authGateReason.collectAsState()

    // Back gesture interception
    BackHandler(enabled = activeAuthDestination != AuthDestination.NONE || activeTab != CampusTab.HOME) {
        if (activeAuthDestination != AuthDestination.NONE) {
            when (activeAuthDestination) {
                AuthDestination.MY_REPORTS, AuthDestination.MY_ORDERS -> {
                    activeAuthDestination = AuthDestination.PROFILE
                }
                AuthDestination.SIGN_UP -> {
                    activeAuthDestination = AuthDestination.SIGN_IN
                }
                else -> {
                    activeAuthDestination = AuthDestination.NONE
                }
            }
        } else {
            activeTab = CampusTab.HOME
        }
    }

    AnimatedContent(
        targetState = activeAuthDestination,
        transitionSpec = {
            if (targetState != AuthDestination.NONE && initialState == AuthDestination.NONE) {
                // Forward navigation into auth/profile
                (slideInHorizontally(
                    initialOffsetX = { it / 3 },
                    animationSpec = spring(dampingRatio = 0.88f, stiffness = Spring.StiffnessMedium)
                ) + fadeIn(tween(CampusMotion.durationMicroMs))).togetherWith(
                    fadeOut(tween(CampusMotion.durationMicroMs))
                )
            } else if (targetState == AuthDestination.NONE) {
                // Return to main app
                fadeIn(tween(CampusMotion.durationMicroMs)).togetherWith(
                    slideOutHorizontally(
                        targetOffsetX = { it / 3 },
                        animationSpec = spring(dampingRatio = 0.88f, stiffness = Spring.StiffnessMedium)
                    ) + fadeOut(tween(CampusMotion.durationMicroMs))
                )
            } else {
                // Horizontal navigation between auth screens (e.g. Sign In <-> Sign Up)
                (slideInHorizontally(
                    initialOffsetX = { it / 4 },
                    animationSpec = spring(dampingRatio = 0.88f, stiffness = Spring.StiffnessMedium)
                ) + fadeIn(tween(CampusMotion.durationMicroMs))).togetherWith(
                    slideOutHorizontally(
                        targetOffsetX = { -it / 4 },
                        animationSpec = spring(dampingRatio = 0.88f, stiffness = Spring.StiffnessMedium)
                    ) + fadeOut(tween(CampusMotion.durationMicroMs))
                )
            }
        },
        label = "authScreenTransitions"
    ) { destination ->
        when (destination) {
            AuthDestination.SIGN_IN -> SignInScreen(
                viewModel = authViewModel,
                onBack = { activeAuthDestination = AuthDestination.NONE },
                onNavigateToSignUp = { activeAuthDestination = AuthDestination.SIGN_UP },
                onSignInSuccess = { activeAuthDestination = AuthDestination.NONE }
            )
            AuthDestination.SIGN_UP -> SignUpScreen(
                viewModel = authViewModel,
                onBack = { activeAuthDestination = AuthDestination.SIGN_IN },
                onNavigateToSignIn = { activeAuthDestination = AuthDestination.SIGN_IN },
                onSignUpSuccess = { activeAuthDestination = AuthDestination.NONE }
            )
            AuthDestination.PROFILE -> ProfileScreen(
                viewModel = authViewModel,
                onBack = { activeAuthDestination = AuthDestination.NONE },
                onNavigateToMyReports = { activeAuthDestination = AuthDestination.MY_REPORTS },
                onNavigateToMyOrders = { activeAuthDestination = AuthDestination.MY_ORDERS },
                onSignOutComplete = { activeAuthDestination = AuthDestination.NONE }
            )
            AuthDestination.MY_REPORTS -> MyReportsScreen(
                viewModel = authViewModel,
                onBack = { activeAuthDestination = AuthDestination.PROFILE }
            )
            AuthDestination.MY_ORDERS -> MyOrdersScreen(
                viewModel = authViewModel,
                onBack = { activeAuthDestination = AuthDestination.PROFILE }
            )
            AuthDestination.NONE -> {
                Scaffold(
                    modifier = modifier.fillMaxSize(),
                    topBar = {
                        CampusTopBar(
                            title = when (activeTab) {
                                CampusTab.HOME -> "CampusConnect"
                                CampusTab.CANTEEN -> "Campus Bites"
                                CampusTab.LOST_FOUND -> "Lost & Found"
                                CampusTab.TRAY -> "Campus Tray"
                            },
                            subtitle = when (activeTab) {
                                CampusTab.HOME -> "Your campus essentials"
                                CampusTab.CANTEEN -> "Digital canteen menu"
                                CampusTab.LOST_FOUND -> "Browse & report items"
                                CampusTab.TRAY -> "Order summary & review"
                            },
                            trayItemCount = trayItemCount,
                            isLoggedIn = isLoggedIn,
                            userDisplayName = userDisplayName,
                            onAccountClick = {
                                activeAuthDestination = if (isLoggedIn) AuthDestination.PROFILE else AuthDestination.SIGN_IN
                            },
                            onTrayClick = { activeTab = CampusTab.TRAY },
                            onRefreshClick = {
                                when (activeTab) {
                                    CampusTab.HOME -> homeViewModel.loadDashboardData(forceRefresh = true)
                                    CampusTab.CANTEEN -> canteenViewModel.loadData(forceRefresh = true)
                                    CampusTab.LOST_FOUND -> lostFoundViewModel.loadData(forceRefresh = true)
                                    CampusTab.TRAY -> Unit
                                }
                            }
                        )
                    },
                    bottomBar = {
                        CampusDock(
                            selectedTab = activeTab,
                            onTabSelected = { activeTab = it },
                            trayCount = trayItemCount
                        )
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        AnimatedContent(
                            targetState = activeTab,
                            transitionSpec = {
                                val direction = if (targetState.ordinal > initialState.ordinal) 1 else -1
                                (slideInHorizontally(
                                    initialOffsetX = { fullWidth -> direction * (fullWidth / 8) },
                                    animationSpec = spring(dampingRatio = 0.88f, stiffness = Spring.StiffnessMedium)
                                ) + fadeIn(animationSpec = tween(CampusMotion.durationMicroMs))).togetherWith(
                                    slideOutHorizontally(
                                        targetOffsetX = { fullWidth -> -direction * (fullWidth / 8) },
                                        animationSpec = spring(dampingRatio = 0.88f, stiffness = Spring.StiffnessMedium)
                                    ) + fadeOut(animationSpec = tween(CampusMotion.durationMicroMs))
                                )
                            },
                            label = "tabContentTransitions"
                        ) { tab ->
                            when (tab) {
                                CampusTab.HOME -> HomeScreen(
                                    viewModel = homeViewModel,
                                    onNavigateTab = { targetTab -> activeTab = targetTab },
                                    onAddToCart = { item -> canteenViewModel.addToTray(item) },
                                    onReportClick = { status ->
                                        if (!isLoggedIn) {
                                            authViewModel.showAuthGate("Sign in with your student account to report items to the campus Lost & Found board.")
                                        } else {
                                            activeTab = CampusTab.LOST_FOUND
                                            lostFoundViewModel.openReportDialog(status)
                                        }
                                    }
                                )
                                CampusTab.CANTEEN -> CanteenScreen(
                                    viewModel = canteenViewModel
                                )
                                CampusTab.LOST_FOUND -> LostFoundScreen(
                                    viewModel = lostFoundViewModel
                                )
                                CampusTab.TRAY -> TrayContent(
                                    trayItems = tray,
                                    onIncreaseQuantity = { id ->
                                        val item = tray.firstOrNull { it.item.id == id }?.item
                                        if (item != null) canteenViewModel.addToTray(item)
                                    },
                                    onDecreaseQuantity = { id -> canteenViewModel.decreaseQuantity(id) },
                                    onRemoveItem = { id -> canteenViewModel.removeFromTray(id) },
                                    onClearTray = { canteenViewModel.clearTray() },
                                    onBrowseMenu = { activeTab = CampusTab.CANTEEN }
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Global Auth Gate Modal
    AuthGateModal(
        visible = authGateVisible,
        reason = authGateReason,
        onSignInClick = {
            authViewModel.hideAuthGate()
            activeAuthDestination = AuthDestination.SIGN_IN
        },
        onSignUpClick = {
            authViewModel.hideAuthGate()
            activeAuthDestination = AuthDestination.SIGN_UP
        },
        onDismiss = { authViewModel.hideAuthGate() }
    )
}
