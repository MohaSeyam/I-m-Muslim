package com.example.ui.screens.adhkar

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.AppTopBar
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.IslamicGreenPrimary
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

@Composable
fun AdhkarDetailScreen(
    viewModel: AppViewModel,
    onBackClick: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val category by viewModel.selectedDhikrCategory.collectAsState()
    val items by viewModel.categoryDhikrItems.collectAsState()
    val currentIndex by viewModel.currentDhikrIndex.collectAsState()
    val currentProgressCount by viewModel.dhikrItemProgressCount.collectAsState()
    val completedDhikrIds by viewModel.completedDhikrIds.collectAsState()

    var fontSizeDelta by remember { mutableStateOf(0) }
    var vibrationEnabled by remember { mutableStateOf(true) }
    var showCopiedToast by remember { mutableStateOf(false) }

    val currentItem = items.getOrNull(currentIndex)
    val isCompleted = items.isNotEmpty() && currentIndex >= items.size - 1 && currentProgressCount >= (items.lastOrNull()?.countTarget ?: 1)

    fun triggerHaptic(strong: Boolean = false) {
        if (!vibrationEnabled) return
        try {
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val duration = if (strong) 45L else 25L
                val amplitude = if (strong) VibrationEffect.DEFAULT_AMPLITUDE else 80
                vibrator?.vibrate(VibrationEffect.createOneShot(duration, amplitude))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(if (strong) 45L else 25L)
            }
        } catch (_: Exception) {}
    }

    Scaffold(
        topBar = {
            AppTopBar(
                title = category?.titleArabic ?: "الأذكار",
                subtitle = if (items.isNotEmpty()) "الذكر ${currentIndex + 1} من ${items.size}" else null,
                onBackClick = onBackClick,
                actions = {
                    IconButton(onClick = { vibrationEnabled = !vibrationEnabled }) {
                        Icon(
                            if (vibrationEnabled) Icons.Outlined.Vibration else Icons.Outlined.PhoneAndroid,
                            contentDescription = "الاهتزاز",
                            tint = if (vibrationEnabled) SageTeal else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = {
                        fontSizeDelta = if (fontSizeDelta >= 4) -2 else fontSizeDelta + 2
                    }) {
                        Icon(Icons.Outlined.FormatSize, contentDescription = "حجم الخط")
                    }
                    IconButton(onClick = {
                        viewModel.resetCategoryDhikrSession()
                        triggerHaptic(true)
                    }) {
                        Icon(Icons.Default.Refresh, contentDescription = "إعادة البدء")
                    }
                }
            )
        },
        snackbarHost = {
            if (showCopiedToast) {
                Snackbar(
                    modifier = Modifier.padding(16.dp),
                    action = {
                        TextButton(onClick = { showCopiedToast = false }) {
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Overall session progress bar
            if (items.isNotEmpty()) {
                val progressRatio = (currentIndex.toFloat() + (currentProgressCount.toFloat() / (currentItem?.countTarget ?: 1).toFloat())) / items.size.toFloat()
                LinearProgressIndicator(
                    progress = { progressRatio.coerceIn(0f, 1f) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = SageTeal,
                    trackColor = SageTeal.copy(alpha = 0.15f),
                    strokeCap = StrokeCap.Round
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Mini Item indicator row
                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    itemsIndexed(items) { idx, item ->
                        val isDone = item.id in completedDhikrIds || idx < currentIndex
                        val isCurrent = idx == currentIndex

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = when {
                                isCurrent -> SageTeal
                                isDone -> SageTeal.copy(alpha = 0.35f)
                                else -> MaterialTheme.colorScheme.surfaceVariant
                            },
                            modifier = Modifier
                                .size(width = if (isCurrent) 28.dp else 22.dp, height = 8.dp)
                                .clip(RoundedCornerShape(8.dp))
                        ) {}
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))
            }

            if (isCompleted) {
                // Completed State Card
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        shape = RoundedCornerShape(26.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                        modifier = Modifier.fillMaxWidth().padding(16.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(26.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = SageTeal.copy(alpha = 0.15f),
                                modifier = Modifier.size(76.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = SageTeal,
                                        modifier = Modifier.size(46.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(18.dp))

                            Text(
                                text = "أتممت الأذكار بحمد الله 🤍",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 22.sp
                                ),
                                color = MaterialTheme.colorScheme.primary
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "تقبل الله طاعتكم وكتب لكم الأجر والتحصين والبركة والسكينة.",
                                style = MaterialTheme.typography.bodyMedium,
                                textAlign = TextAlign.Center,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            Spacer(modifier = Modifier.height(24.dp))

                            Button(
                                onClick = {
                                    viewModel.resetCategoryDhikrSession()
                                    triggerHaptic(true)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = SageTeal),
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("إعادة القراءة والورد")
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            OutlinedButton(
                                onClick = onBackClick,
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("العودة لقائمة الأذكار")
                            }
                        }
                    }
                }
            } else if (currentItem != null) {
                // Active Dhikr Card View
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    contentPadding = PaddingValues(vertical = 4.dp)
                ) {
                    item {
                        Card(
                            shape = RoundedCornerShape(24.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(20.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                // Header: repetition badge & share
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(10.dp),
                                        color = SageTeal.copy(alpha = 0.15f)
                                    ) {
                                        Text(
                                            text = "التكرار المطلوب: ${currentItem.countTarget} ${if (currentItem.countTarget == 1) "مرة واحدة" else "مرات"}",
                                            style = MaterialTheme.typography.labelMedium.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = SageTeal
                                            ),
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                        )
                                    }

                                    IconButton(
                                        onClick = {
                                            val textToCopy = "${currentItem.textArabic}\n\n${currentItem.rewardArabic}\nالمصدر: ${currentItem.source}"
                                            clipboardManager.setText(AnnotatedString(textToCopy))
                                            showCopiedToast = true
                                        },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            Icons.Outlined.ContentCopy,
                                            contentDescription = "نسخ النص",
                                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                // Main Arabic Dhikr Text
                                Text(
                                    text = currentItem.textArabic,
                                    style = MaterialTheme.typography.headlineSmall.copy(
                                        fontSize = (20 + fontSizeDelta).sp,
                                        lineHeight = (32 + fontSizeDelta * 1.5).sp,
                                        fontWeight = FontWeight.Medium,
                                        textAlign = TextAlign.Right
                                    ),
                                    color = MaterialTheme.colorScheme.onSurface,
                                    modifier = Modifier.fillMaxWidth()
                                )

                                if (currentItem.rewardArabic.isNotBlank() || currentItem.source.isNotBlank()) {
                                    Spacer(modifier = Modifier.height(16.dp))
                                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.15f))
                                    Spacer(modifier = Modifier.height(12.dp))

                                    if (currentItem.rewardArabic.isNotBlank()) {
                                        Text(
                                            text = "✨ ${currentItem.rewardArabic}",
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = SageTeal,
                                                fontWeight = FontWeight.SemiBold,
                                                textAlign = TextAlign.Right,
                                                fontSize = 12.sp
                                            ),
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                    }

                                    if (currentItem.source.isNotBlank()) {
                                        Text(
                                            text = "📖 المصدر: ${currentItem.source}",
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontSize = 11.sp,
                                                textAlign = TextAlign.Right
                                            ),
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // Touch Counter Area
                Surface(
                    shape = RoundedCornerShape(24.dp),
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 3.dp,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Button(
                            onClick = {
                                val reachedTarget = (currentProgressCount + 1) >= currentItem.countTarget
                                triggerHaptic(reachedTarget)
                                viewModel.incrementDhikrCount()
                            },
                            shape = RoundedCornerShape(20.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SageTeal),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(82.dp)
                                .testTag("dhikr_tap_button")
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        Icons.Outlined.TouchApp,
                                        contentDescription = null,
                                        modifier = Modifier.size(28.dp),
                                        tint = Color.White
                                    )
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(
                                            text = "اضغط للتسبيح",
                                            style = MaterialTheme.typography.titleMedium.copy(
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 17.sp,
                                                color = Color.White
                                            )
                                        )
                                        Text(
                                            text = "الذكر ${currentIndex + 1} من ${items.size}",
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = Color.White.copy(alpha = 0.8f),
                                                fontSize = 11.sp
                                            )
                                        )
                                    }
                                }

                                Surface(
                                    shape = CircleShape,
                                    color = Color.White.copy(alpha = 0.2f),
                                    modifier = Modifier.size(52.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            text = "$currentProgressCount / ${currentItem.countTarget}",
                                            style = MaterialTheme.typography.titleSmall.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White,
                                                fontSize = 14.sp
                                            )
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
