package com.example.ui.screens.quran

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Ayah
import com.example.ui.components.AppTopBar
import com.example.ui.components.AyahItemCard
import com.example.ui.components.TafsirBottomSheet
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.IslamicGreenPrimary
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SurahReaderScreen(
    viewModel: AppViewModel,
    onBackClick: () -> Unit
) {
    val surah by viewModel.selectedSurah.collectAsState()
    val ayahs by viewModel.currentAyahs.collectAsState()
    val bookmarks by viewModel.bookmarks.collectAsState()
    val tafsirAyah by viewModel.selectedAyahForTafsir.collectAsState()
    val fontSize by viewModel.quranFontSize.collectAsState()
    val showTranslation by viewModel.showTranslation.collectAsState()
    val audioState by viewModel.audioState.collectAsState()
    val currentReciter by viewModel.selectedReciter.collectAsState()

    var showFontDialog by remember { mutableStateOf(false) }
    var showReciterDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            AppTopBar(
                title = "سورة ${surah?.nameArabic ?: ""}",
                subtitle = "${surah?.revelationType ?: ""} • ${surah?.ayahCount ?: 0} آية • صفحة ${surah?.pageNumber ?: 1}",
                onBackClick = onBackClick,
                actions = {
                    IconButton(onClick = { viewModel.toggleShowTranslation() }) {
                        Icon(
                            imageVector = if (showTranslation) Icons.Default.Translate else Icons.Outlined.Translate,
                            contentDescription = "ترجمة",
                            tint = if (showTranslation) SageTeal else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    IconButton(onClick = { showFontDialog = true }) {
                        Icon(
                            imageVector = Icons.Outlined.FormatSize,
                            contentDescription = "حجم الخط",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    IconButton(onClick = { showReciterDialog = true }) {
                        Icon(
                            imageVector = Icons.Outlined.RecordVoiceOver,
                            contentDescription = "القارئ",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            )
        },
        bottomBar = {
            // Mini Audio Player Bar if audio is playing or preparing
            AnimatedVisibility(visible = audioState.isPlaying || audioState.status.name != "IDLE") {
                Surface(
                    color = IslamicGreenPrimary,
                    tonalElevation = 8.dp,
                    modifier = Modifier.fillMaxWidth().navigationBarsPadding()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Surface(
                                shape = CircleShape,
                                color = GoldAccent.copy(alpha = 0.2f),
                                modifier = Modifier.size(40.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.MusicNote,
                                        contentDescription = null,
                                        tint = GoldAccent
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "تلاوة بصوت: ${audioState.currentReciterName}",
                                    style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.8f))
                                )
                                Text(
                                    text = "سورة ${surah?.nameArabic} (الآية ${audioState.currentAyah})",
                                    style = MaterialTheme.typography.titleSmall.copy(color = Color.White, fontWeight = FontWeight.Bold)
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(onClick = { viewModel.toggleAudio() }) {
                                Icon(
                                    imageVector = if (audioState.isPlaying) Icons.Default.PauseCircle else Icons.Default.PlayCircle,
                                    contentDescription = "تشغيل/إيقاف",
                                    tint = GoldAccent,
                                    modifier = Modifier.size(36.dp)
                                )
                            }
                            IconButton(onClick = { viewModel.stopAudio() }) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "إغلاق",
                                    tint = Color.White.copy(alpha = 0.7f)
                                )
                            }
                        }
                    }
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
            contentPadding = PaddingValues(top = 12.dp, bottom = 40.dp)
        ) {
            // Surah Header Card & Bismillah (unless Surah 9 At-Tawbah)
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        IslamicGreenPrimary.copy(alpha = 0.08f),
                                        Color.Transparent
                                    )
                                )
                            )
                            .padding(20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "سورة ${surah?.nameArabic}",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 28.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${surah?.nameEnglish} • ${surah?.englishTranslation}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            if (surah?.number != 9 && surah?.number != 1) {
                                Spacer(modifier = Modifier.height(16.dp))
                                Text(
                                    text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        fontWeight = FontWeight.Normal,
                                        fontSize = 22.sp,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // Ayahs list
            items(ayahs, key = { it.numberInSurah }) { ayah ->
                val isBookmarked = bookmarks.any { it.surahNumber == surah?.number && it.ayahNumber == ayah.numberInSurah }
                val isPlayingThisAyah = audioState.isPlaying && audioState.currentAyah == ayah.numberInSurah

                AyahItemCard(
                    ayah = ayah,
                    fontSize = fontSize,
                    showTranslation = showTranslation,
                    isPlaying = isPlayingThisAyah,
                    isBookmarked = isBookmarked,
                    onPlayClick = {
                        if (isPlayingThisAyah) viewModel.toggleAudio() else viewModel.playAyahAudio(ayah)
                    },
                    onTafsirClick = { viewModel.openTafsir(ayah) },
                    onBookmarkClick = { viewModel.toggleBookmark(ayah) }
                )
            }
        }

        // Tafsir Bottom Sheet
        if (tafsirAyah != null) {
            TafsirBottomSheet(
                ayah = tafsirAyah,
                onDismiss = { viewModel.closeTafsir() }
            )
        }

        // Font Size Dialog
        if (showFontDialog) {
            AlertDialog(
                onDismissRequest = { showFontDialog = false },
                title = { Text("تعديل حجم خط المصحف") },
                text = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontSize = fontSize.sp,
                                textAlign = TextAlign.Center
                            ),
                            modifier = Modifier.padding(vertical = 12.dp)
                        )
                        Slider(
                            value = fontSize,
                            onValueChange = { viewModel.setQuranFontSize(it) },
                            valueRange = 18f..36f,
                            steps = 9
                        )
                        Text(
                            text = "${fontSize.toInt()} sp",
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showFontDialog = false }) {
                        Text("تم")
                    }
                }
            )
        }

        // Reciter Selection Dialog
        if (showReciterDialog) {
            AlertDialog(
                onDismissRequest = { showReciterDialog = false },
                title = { Text("اختر القارئ المفضل") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        viewModel.reciters.forEach { reciter ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .clickable {
                                        viewModel.setReciter(reciter)
                                        showReciterDialog = false
                                    }
                                    .padding(vertical = 8.dp, horizontal = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(
                                        text = reciter.nameArabic,
                                        style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold)
                                    )
                                    Text(
                                        text = reciter.nameEnglish,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                if (currentReciter.id == reciter.id) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = SageTeal
                                    )
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showReciterDialog = false }) {
                        Text("إلغاء")
                    }
                }
            )
        }
    }
}
