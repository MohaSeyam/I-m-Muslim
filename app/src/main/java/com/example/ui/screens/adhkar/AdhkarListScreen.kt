package com.example.ui.screens.adhkar

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.DhikrCategory
import com.example.data.model.DhikrItem
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.IslamicGreenPrimary
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

enum class AdhkarFilter(val titleArabic: String, val categoryIds: Set<String>?) {
    ALL("جميع الأذكار", null),
    DAY_NIGHT("اليوم والليلة", setOf("morning", "evening", "sleep", "wakeup")),
    PRAYER_MOSQUE("الصلاة والمسجد", setOf("after_prayer", "mosque")),
    PRAISE("تسبيح واستغفار", setOf("salawat", "istighfar")),
    DAILY_LIFE("الحياة واليوميات", setOf("food", "travel"))
}

@Composable
fun AdhkarListScreen(
    viewModel: AppViewModel,
    onCategorySelected: (String) -> Unit,
    onNavigate: (String) -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val categories = viewModel.dhikrCategories
    val sessionCounts by viewModel.dhikrSessionCounts.collectAsState()
    val completedDhikrIds by viewModel.completedDhikrIds.collectAsState()
    val totalSessionTaps by viewModel.totalSessionDhikrCount.collectAsState()

    val salawatCount by viewModel.salawatCount.collectAsState()
    val istighfarCount by viewModel.istighfarCount.collectAsState()

    var selectedFilter by remember { mutableStateOf(AdhkarFilter.ALL) }
    var expandedCategoryId by remember { mutableStateOf<String?>("morning") }
    var showCopySnackbar by remember { mutableStateOf(false) }

    fun triggerHaptic(strong: Boolean = false) {
        try {
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val duration = if (strong) 40L else 20L
                val amplitude = if (strong) VibrationEffect.DEFAULT_AMPLITUDE else 80
                vibrator?.vibrate(VibrationEffect.createOneShot(duration, amplitude))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(if (strong) 40L else 20L)
            }
        } catch (_: Exception) {}
    }

    val filteredCategories = remember(selectedFilter, categories) {
        if (selectedFilter.categoryIds == null) {
            categories
        } else {
            categories.filter { it.id in (selectedFilter.categoryIds ?: emptySet()) }
        }
    }

    val totalPossibleAdhkar = remember(categories) {
        categories.sumOf { cat -> viewModel.dhikrRepository.getItemsForCategory(cat.id).size }
    }

    val overallProgress = if (totalPossibleAdhkar > 0) {
        completedDhikrIds.size.toFloat() / totalPossibleAdhkar.toFloat()
    } else 0f

    Scaffold(
        snackbarHost = {
            if (showCopySnackbar) {
                Snackbar(
                    modifier = Modifier.padding(16.dp),
                    action = {
                        TextButton(onClick = { showCopySnackbar = false }) {
                            Text("تم", color = Color.White)
                        }
                    }
                ) {
                    Text("تم نسخ نص الذكر الشريف")
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 12.dp, bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "الأذكار وحصن المسلم",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 24.sp
                            ),
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "ألا بذكر الله تطمئن القلوب 🌿",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    if (totalSessionTaps > 0 || completedDhikrIds.isNotEmpty()) {
                        FilledTonalButton(
                            onClick = {
                                viewModel.resetAllDhikrSessions()
                                triggerHaptic(true)
                            },
                            colors = ButtonDefaults.filledTonalButtonColors(
                                containerColor = SageTeal.copy(alpha = 0.12f),
                                contentColor = SageTeal
                            ),
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "تصفير الجلسة", modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("تصفير العداد", style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }

            // Session Progress Tracker Card
            item {
                Card(
                    shape = RoundedCornerShape(22.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth().testTag("adhkar_session_tracker")
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.horizontalGradient(
                                    listOf(
                                        SageTeal.copy(alpha = 0.08f),
                                        MaterialTheme.colorScheme.surface
                                    )
                                )
                            )
                            .padding(18.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(
                                        shape = CircleShape,
                                        color = SageTeal.copy(alpha = 0.18f),
                                        modifier = Modifier.size(38.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Icon(
                                                imageVector = Icons.Outlined.CheckCircleOutline,
                                                contentDescription = null,
                                                tint = SageTeal,
                                                modifier = Modifier.size(22.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(
                                            text = "متابعة إنجاز الأذكار اليومية",
                                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                        Text(
                                            text = "إجمالي التكرارات في هذه الجلسة: $totalSessionTaps تكرار",
                                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }

                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = SageTeal.copy(alpha = 0.15f)
                                ) {
                                    Text(
                                        text = "${(overallProgress * 100).toInt()}%",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = SageTeal
                                        ),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            LinearProgressIndicator(
                                progress = { overallProgress.coerceIn(0f, 1f) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(RoundedCornerShape(4.dp)),
                                color = SageTeal,
                                trackColor = SageTeal.copy(alpha = 0.12f),
                                strokeCap = StrokeCap.Round
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "الأذكار المكتملة: ${completedDhikrIds.size} من أصل $totalPossibleAdhkar",
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = if (completedDhikrIds.isEmpty()) "ابدأ بورد الصباح أو المساء" else "واصل ذكر الله 🌿",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = SageTeal
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // Quick Spiritual Hub Chips Row (Tasbih, Duas, Asmaul Husna, Hadith)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .clickable { onNavigate("tasbih") }
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(Icons.Outlined.TouchApp, contentDescription = null, tint = SageTeal, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("المسبحة", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .clickable { onNavigate("duas") }
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(Icons.Outlined.VolunteerActivism, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("الأدعية", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .clickable { onNavigate("asmaul_husna") }
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(Icons.Outlined.Stars, contentDescription = null, tint = Color(0xFF0077B6), modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("الأسماء الحسنى", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                        }
                    }
                }
            }

            // Instant Salawat & Istighfar Tap Counters
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Salawat Card with instant tap
                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(18.dp))
                            .clickable {
                                viewModel.incrementSalawat()
                                triggerHaptic(false)
                            }
                            .testTag("salawat_quick_card")
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = CircleShape,
                                    color = SageTeal.copy(alpha = 0.15f),
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Icon(Icons.Default.Favorite, contentDescription = null, tint = SageTeal, modifier = Modifier.size(16.dp))
                                    }
                                }
                                Text(
                                    text = "+1 اضغط",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 10.sp,
                                        color = SageTeal,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "الصلاة على النبي ﷺ",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "$salawatCount صلاة اليوم",
                                style = MaterialTheme.typography.bodySmall.copy(color = SageTeal, fontWeight = FontWeight.Bold)
                            )
                        }
                    }

                    // Istighfar Card with instant tap
                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(18.dp))
                            .clickable {
                                viewModel.incrementIstighfar()
                                triggerHaptic(false)
                            }
                            .testTag("istighfar_quick_card")
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = CircleShape,
                                    color = GoldAccent.copy(alpha = 0.15f),
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Icon(Icons.Default.WaterDrop, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(16.dp))
                                    }
                                }
                                Text(
                                    text = "+1 اضغط",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 10.sp,
                                        color = GoldAccent,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "الاستغفار والتوبة",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "$istighfarCount استغفار اليوم",
                                style = MaterialTheme.typography.bodySmall.copy(color = GoldAccent, fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }

            // Category Filter Scrollable Chips
            item {
                Column {
                    Text(
                        text = "أقسام وتصنيفات الأذكار",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(AdhkarFilter.values()) { filter ->
                            val isSelected = selectedFilter == filter
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedFilter = filter },
                                label = {
                                    Text(
                                        text = filter.titleArabic,
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                        )
                                    )
                                },
                                shape = RoundedCornerShape(12.dp),
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = SageTeal,
                                    selectedLabelColor = Color.White,
                                    containerColor = MaterialTheme.colorScheme.surface
                                )
                            )
                        }
                    }
                }
            }

            // Category Items with Progress and Expansion
            items(filteredCategories, key = { it.id }) { category ->
                val catItems = remember(category.id) { viewModel.dhikrRepository.getItemsForCategory(category.id) }
                val completedInCat = catItems.count { it.id in completedDhikrIds }
                val catProgress = if (catItems.isNotEmpty()) completedInCat.toFloat() / catItems.size.toFloat() else 0f
                val isExpanded = expandedCategoryId == category.id

                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
                    modifier = Modifier.fillMaxWidth().testTag("dhikr_cat_${category.id}")
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        // Category Header Row
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    expandedCategoryId = if (isExpanded) null else category.id
                                }
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(14.dp),
                                    color = if (catProgress >= 1f) SageTeal.copy(alpha = 0.2f) else MaterialTheme.colorScheme.primaryContainer,
                                    modifier = Modifier.size(46.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Icon(
                                            imageVector = when (category.id) {
                                                "morning" -> Icons.Outlined.WbSunny
                                                "evening" -> Icons.Outlined.Nightlight
                                                "sleep" -> Icons.Outlined.Bedtime
                                                "after_prayer" -> Icons.Outlined.Mosque
                                                "salawat" -> Icons.Outlined.Favorite
                                                "istighfar" -> Icons.Outlined.WaterDrop
                                                "wakeup" -> Icons.Outlined.Alarm
                                                "mosque" -> Icons.Outlined.AccountBalance
                                                "food" -> Icons.Outlined.Restaurant
                                                "travel" -> Icons.Outlined.DirectionsCar
                                                else -> Icons.Outlined.AutoStories
                                            },
                                            contentDescription = category.titleArabic,
                                            tint = if (catProgress >= 1f) SageTeal else MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = category.titleArabic,
                                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                        if (catProgress >= 1f) {
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Icon(
                                                imageVector = Icons.Default.CheckCircle,
                                                contentDescription = "مكتمل",
                                                tint = SageTeal,
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = category.subtitleArabic,
                                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Surface(
                                    color = if (catProgress >= 1f) SageTeal.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(
                                        text = "$completedInCat / ${catItems.size}",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = if (catProgress >= 1f) SageTeal else MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Icon(
                                    imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                    contentDescription = if (isExpanded) "طي" else "توسيع",
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }

                        // Progress line across category bottom
                        LinearProgressIndicator(
                            progress = { catProgress.coerceIn(0f, 1f) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(3.dp),
                            color = SageTeal,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                        )

                        // Expanded Adhkar Items with Inline Counting
                        AnimatedVisibility(
                            visible = isExpanded,
                            enter = expandVertically() + fadeIn(),
                            exit = shrinkVertically() + fadeOut()
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
                                    .padding(12.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                // Fullscreen Recitation button for this category
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "العد السريع التفاعلي:",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    )

                                    FilledTonalButton(
                                        onClick = {
                                            viewModel.selectDhikrCategory(category.id)
                                            onCategorySelected(category.id)
                                        },
                                        shape = RoundedCornerShape(12.dp),
                                        colors = ButtonDefaults.filledTonalButtonColors(
                                            containerColor = SageTeal,
                                            contentColor = Color.White
                                        ),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                                    ) {
                                        Icon(Icons.Outlined.Fullscreen, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("وضع التلاوة المركز", style = MaterialTheme.typography.labelSmall)
                                    }
                                }

                                catItems.forEachIndexed { index, item ->
                                    val currentCount = sessionCounts[item.id] ?: 0
                                    val isItemDone = currentCount >= item.countTarget || item.id in completedDhikrIds

                                    Card(
                                        shape = RoundedCornerShape(16.dp),
                                        colors = CardDefaults.cardColors(
                                            containerColor = if (isItemDone) SageTeal.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface
                                        ),
                                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Column(modifier = Modifier.padding(14.dp)) {
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Surface(
                                                    shape = CircleShape,
                                                    color = if (isItemDone) SageTeal.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant,
                                                    modifier = Modifier.size(24.dp)
                                                ) {
                                                    Box(contentAlignment = Alignment.Center) {
                                                        Text(
                                                            text = "${index + 1}",
                                                            style = MaterialTheme.typography.labelSmall.copy(
                                                                fontWeight = FontWeight.Bold,
                                                                color = if (isItemDone) SageTeal else MaterialTheme.colorScheme.onSurfaceVariant,
                                                                fontSize = 11.sp
                                                            )
                                                        )
                                                    }
                                                }

                                                Row(verticalAlignment = Alignment.CenterVertically) {
                                                    Surface(
                                                        shape = RoundedCornerShape(8.dp),
                                                        color = if (isItemDone) SageTeal.copy(alpha = 0.2f) else GoldAccent.copy(alpha = 0.15f)
                                                    ) {
                                                        Text(
                                                            text = if (isItemDone) "مكتمل ✓" else "الهدف: ${item.countTarget} ${if (item.countTarget == 1) "مرة" else "مرات"}",
                                                            style = MaterialTheme.typography.labelSmall.copy(
                                                                fontWeight = FontWeight.Bold,
                                                                color = if (isItemDone) SageTeal else DarkEmerald,
                                                                fontSize = 10.5.sp
                                                            ),
                                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                        )
                                                    }

                                                    IconButton(
                                                        onClick = {
                                                            val toCopy = "${item.textArabic}\n\nالفضل: ${item.rewardArabic}\nالمصدر: ${item.source}"
                                                            clipboardManager.setText(AnnotatedString(toCopy))
                                                            showCopySnackbar = true
                                                        },
                                                        modifier = Modifier.size(28.dp)
                                                    ) {
                                                        Icon(
                                                            Icons.Outlined.Share,
                                                            contentDescription = "نسخ",
                                                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                                            modifier = Modifier.size(16.dp)
                                                        )
                                                    }
                                                }
                                            }

                                            Spacer(modifier = Modifier.height(8.dp))

                                            // Arabic text
                                            Text(
                                                text = item.textArabic,
                                                style = MaterialTheme.typography.bodyLarge.copy(
                                                    lineHeight = 26.sp,
                                                    fontSize = 15.5.sp,
                                                    fontWeight = FontWeight.Normal
                                                ),
                                                color = MaterialTheme.colorScheme.onSurface
                                            )

                                            if (item.rewardArabic.isNotEmpty()) {
                                                Spacer(modifier = Modifier.height(6.dp))
                                                Text(
                                                    text = "✨ ${item.rewardArabic} (${item.source})",
                                                    style = MaterialTheme.typography.bodySmall.copy(
                                                        fontSize = 11.sp,
                                                        lineHeight = 16.sp,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                )
                                            }

                                            Spacer(modifier = Modifier.height(12.dp))

                                            // Interactive Inline Counter Button
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                if (currentCount > 0) {
                                                    TextButton(
                                                        onClick = {
                                                            viewModel.resetItemDhikrById(item)
                                                            triggerHaptic(true)
                                                        },
                                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                                                    ) {
                                                        Text("إعادة", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.error)
                                                    }
                                                } else {
                                                    Spacer(modifier = Modifier.width(1.dp))
                                                }

                                                // Big Tap To Count Button
                                                Button(
                                                    onClick = {
                                                        if (currentCount < item.countTarget) {
                                                            viewModel.incrementItemDhikrById(item)
                                                            triggerHaptic(currentCount + 1 >= item.countTarget)
                                                        }
                                                    },
                                                    colors = ButtonDefaults.buttonColors(
                                                        containerColor = if (isItemDone) SageTeal else MaterialTheme.colorScheme.primary
                                                    ),
                                                    shape = RoundedCornerShape(12.dp),
                                                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                                                    modifier = Modifier.testTag("count_btn_${item.id}")
                                                ) {
                                                    if (isItemDone) {
                                                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                                        Spacer(modifier = Modifier.width(6.dp))
                                                        Text("أتممت (${item.countTarget})", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                                                    } else {
                                                        Icon(Icons.Outlined.TouchApp, contentDescription = null, modifier = Modifier.size(16.dp))
                                                        Spacer(modifier = Modifier.width(6.dp))
                                                        Text(
                                                            text = "$currentCount / ${item.countTarget} (اضغط للعد)",
                                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
