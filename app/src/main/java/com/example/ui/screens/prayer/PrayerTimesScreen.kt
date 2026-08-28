package com.example.ui.screens.prayer

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.PrayerTimeItem
import com.example.data.model.PrayerType
import com.example.ui.components.AppTopBar
import com.example.ui.components.PrayerCountdownCard
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.IslamicGreenPrimary
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

@Composable
fun PrayerTimesScreen(
    viewModel: AppViewModel,
    onBackClick: () -> Unit
) {
    val prayerSchedule by viewModel.prayerSchedule.collectAsState()
    val hijriDate = viewModel.hijriDate
    val events = viewModel.islamicEvents

    var notificationStates by remember {
        mutableStateOf(mapOf(
            PrayerType.FAJR to true,
            PrayerType.SUNRISE to false,
            PrayerType.DHUHR to true,
            PrayerType.ASR to true,
            PrayerType.MAGHRIB to true,
            PrayerType.ISHA to true
        ))
    }

    Scaffold(
        topBar = {
            AppTopBar(
                title = "مواقيت الصلاة",
                subtitle = "${hijriDate.formattedArabic} • مكة المكرمة",
                onBackClick = onBackClick,
                actions = {
                    IconButton(onClick = {
                        viewModel.sendTestNotification("حان الآن موعد أذان العصر", "حي على الصلاة، حي على الفلاح")
                    }) {
                        Icon(Icons.Outlined.NotificationsActive, contentDescription = "تجربة التنبيه", tint = SageTeal)
                    }
                }
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Countdown Banner
            item {
                PrayerCountdownCard(
                    nextPrayer = prayerSchedule.nextPrayer,
                    timeRemaining = prayerSchedule.timeRemainingString,
                    progress = prayerSchedule.progressToNext,
                    cityName = "مكة المكرمة",
                    onClick = {}
                )
            }

            // Section: اليوم
            item {
                Text(
                    text = "جدول الصلوات المفروضة",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onBackground
                )
            }

            // Prayer items
            items(prayerSchedule.prayers, key = { it.type.name }) { prayer ->
                val isNotifEnabled = notificationStates[prayer.type] ?: true

                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (prayer.isNext) IslamicGreenPrimary.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = if (prayer.isNext) 2.dp else 1.dp),
                    modifier = Modifier.fillMaxWidth().testTag("prayer_item_${prayer.type.name}")
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = if (prayer.isNext) SageTeal else MaterialTheme.colorScheme.primaryContainer,
                                modifier = Modifier.size(40.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = when (prayer.type) {
                                            PrayerType.FAJR -> Icons.Outlined.WbTwighlight
                                            PrayerType.SUNRISE -> Icons.Outlined.WbSunny
                                            PrayerType.DHUHR -> Icons.Outlined.LightMode
                                            PrayerType.ASR -> Icons.Outlined.WbCloudy
                                            PrayerType.MAGHRIB -> Icons.Outlined.NightsStay
                                            PrayerType.ISHA -> Icons.Outlined.Bedtime
                                        },
                                        contentDescription = prayer.type.arName,
                                        tint = if (prayer.isNext) Color.White else MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = prayer.type.arName,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = if (prayer.isNext) FontWeight.Bold else FontWeight.Medium
                                        ),
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    if (prayer.isNext) {
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Surface(
                                            shape = RoundedCornerShape(8.dp),
                                            color = SageTeal
                                        ) {
                                            Text(
                                                text = "القادمة",
                                                style = MaterialTheme.typography.labelSmall.copy(
                                                    color = Color.White,
                                                    fontWeight = FontWeight.Bold
                                                ),
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                }
                                Text(
                                    text = prayer.type.enName,
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = prayer.formattedTime,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = if (prayer.isNext) SageTeal else MaterialTheme.colorScheme.onSurface
                                )
                            )

                            Spacer(modifier = Modifier.width(8.dp))

                            if (prayer.type != PrayerType.SUNRISE) {
                                IconButton(
                                    onClick = {
                                        val current = notificationStates[prayer.type] ?: true
                                        notificationStates = notificationStates.toMutableMap().apply {
                                            put(prayer.type, !current)
                                        }
                                    },
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Icon(
                                        imageVector = if (isNotifEnabled) Icons.Default.NotificationsActive else Icons.Outlined.NotificationsOff,
                                        contentDescription = "التنبيه",
                                        tint = if (isNotifEnabled) GoldAccent else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Section: المناسبات الإسلامية
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "المناسبات الإسلامية والتقويم الهجري",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onBackground
                )
            }

            items(events.take(4)) { event ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = event.titleArabic,
                                style = MaterialTheme.typography.titleSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            )
                            Text(
                                text = event.titleEnglish,
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = event.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }
        }
    }
}
