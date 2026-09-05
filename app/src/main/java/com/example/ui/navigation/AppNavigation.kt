package com.example.ui.navigation

import androidx.compose.animation.*
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.ui.screens.adhkar.AdhkarDetailScreen
import com.example.ui.screens.adhkar.AdhkarListScreen
import com.example.ui.screens.asmaulhusna.AsmaulHusnaScreen
import com.example.ui.screens.duas.DuasScreen
import com.example.ui.screens.friday.FridaySpecialScreen
import com.example.ui.screens.hadith.NawawiHadithScreen
import com.example.ui.screens.home.HomeScreen
import com.example.ui.screens.prayer.PrayerTimesScreen
import com.example.ui.screens.qibla.QiblaCompassScreen
import com.example.ui.screens.quran.QuranListScreen
import com.example.ui.screens.quran.SurahReaderScreen
import com.example.ui.screens.settings.SettingsScreen
import com.example.ui.screens.stats.StatisticsScreen
import com.example.ui.screens.tasbih.DigitalTasbihScreen

import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

sealed class BottomNavItem(
    val route: String,
    val titleArabic: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Home : BottomNavItem("home", "الرئيسية", Icons.Filled.Home, Icons.Outlined.Home)
    object Quran : BottomNavItem("quran", "القرآن", Icons.Filled.MenuBook, Icons.Outlined.MenuBook)
    object Adhkar : BottomNavItem("adhkar", "الأذكار", Icons.Filled.WbSunny, Icons.Outlined.WbSunny)
    object Prayer : BottomNavItem("prayer", "المواقيت", Icons.Filled.Mosque, Icons.Outlined.Mosque)
    object More : BottomNavItem("settings", "الإعدادات", Icons.Filled.Settings, Icons.Outlined.Settings)
}

@Composable
fun AppNavigation(viewModel: AppViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val bottomNavItems = listOf(
        BottomNavItem.Home,
        BottomNavItem.Quran,
        BottomNavItem.Adhkar,
        BottomNavItem.Prayer,
        BottomNavItem.More
    )

    val showBottomBar = currentRoute in listOf("home", "quran", "adhkar", "prayer", "settings")

    Scaffold(
        contentWindowInsets = WindowInsets.safeDrawing,
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    tonalElevation = 6.dp,
                    windowInsets = NavigationBarDefaults.windowInsets,
                    modifier = Modifier.testTag("bottom_nav_bar")
                ) {
                    bottomNavItems.forEach { item ->
                        val selected = currentRoute == item.route
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                if (currentRoute != item.route) {
                                    navController.navigate(item.route) {
                                        popUpTo(navController.graph.findStartDestination().id) {
                                            saveState = true
                                        }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                                    contentDescription = item.titleArabic
                                )
                            },
                            label = {
                                Text(
                                    text = item.titleArabic,
                                    fontSize = 11.sp,
                                    fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = SageTeal,
                                selectedTextColor = SageTeal,
                                indicatorColor = SageTeal.copy(alpha = 0.15f)
                            ),
                            modifier = Modifier.testTag("nav_tab_${item.route}")
                        )
                    }
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            composable("home") {
                HomeScreen(
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable("quran") {
                QuranListScreen(
                    viewModel = viewModel,
                    onSurahSelected = { _ -> navController.navigate("surah_reader") }
                )
            }

            composable("surah_reader") {
                SurahReaderScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("adhkar") {
                AdhkarListScreen(
                    viewModel = viewModel,
                    onCategorySelected = { _ -> navController.navigate("adhkar_detail") },
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable("adhkar_detail") {
                AdhkarDetailScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("prayer") {
                PrayerTimesScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("qibla") {
                QiblaCompassScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("tasbih") {
                DigitalTasbihScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("duas") {
                DuasScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("asmaul_husna") {
                AsmaulHusnaScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("hadith") {
                NawawiHadithScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("friday") {

                FridaySpecialScreen(
                    viewModel = viewModel,
                    onNavigateToSurahReader = { navController.navigate("surah_reader") },
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("stats") {
                StatisticsScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable("settings") {
                SettingsScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }
        }
    }
}
