package com.example.ui.screens.hadith

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.NawawiHadith
import com.example.ui.components.AppTopBar
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.IslamicGreenPrimary
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

@Composable
fun NawawiHadithScreen(
    viewModel: AppViewModel,
    onBackClick: () -> Unit
) {
    val hadiths by viewModel.filteredHadiths.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedHadithForDetail by remember { mutableStateOf<NawawiHadith?>(null) }
    val clipboardManager = LocalClipboardManager.current
    var showCopiedSnackbar by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            AppTopBar(
                title = "الأربعون النووية",
                subtitle = "جوامع الكلم من أحاديث النبي المصطفى ﷺ",
                onBackClick = onBackClick
            )
        },
        snackbarHost = {
            if (showCopiedSnackbar) {
                Snackbar(
                    modifier = Modifier.padding(16.dp),
                    action = {
                        TextButton(onClick = { showCopiedSnackbar = false }) {
                            Text("حسناً", color = Color.White)
                        }
                    }
                ) {
                    Text("تم نسخ نص الحديث الشريف بنجاح")
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(10.dp))

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    viewModel.searchHadiths(it)
                },
                placeholder = { Text("ابحث في عنوان أو نص الحديث أو الراوي...", style = MaterialTheme.typography.bodyMedium) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "بحث", tint = SageTeal) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = {
                            searchQuery = ""
                            viewModel.searchHadiths("")
                        }) {
                            Icon(Icons.Default.Clear, contentDescription = "مسح")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = SageTeal,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("hadith_search_input")
            )

            Spacer(modifier = Modifier.height(12.dp))

            LazyColumn(
                contentPadding = PaddingValues(bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(hadiths, key = { it.number }) { hadith ->
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedHadithForDetail = hadith }
                            .testTag("hadith_card_${hadith.number}")
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(32.dp)
                                            .clip(CircleShape)
                                            .background(SageTeal.copy(alpha = 0.12f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "${hadith.number}",
                                            style = MaterialTheme.typography.labelMedium.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = SageTeal
                                            )
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(
                                            text = hadith.titleArabic,
                                            style = MaterialTheme.typography.titleMedium.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.onSurface
                                            )
                                        )
                                        Text(
                                            text = hadith.titleEnglish,
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        )
                                    }
                                }

                                IconButton(onClick = {
                                    val textToCopy = "${hadith.titleArabic}\n\n${hadith.narratorArabic}\n\n${hadith.matnArabic}\n\nالمصدر: ${hadith.reference}"
                                    clipboardManager.setText(AnnotatedString(textToCopy))
                                    showCopiedSnackbar = true
                                }) {
                                    Icon(
                                        imageVector = Icons.Outlined.Share,
                                        contentDescription = "نسخ الحديث",
                                        tint = SageTeal
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = hadith.narratorArabic,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = GoldAccent
                                )
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = hadith.matnArabic,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    lineHeight = 24.sp,
                                    fontSize = 15.sp
                                ),
                                color = MaterialTheme.colorScheme.onSurface,
                                maxLines = 3
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.End
                            ) {
                                Text(
                                    text = "عرض الحديث والشرح الكامل ←",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = SageTeal,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }

        // Full Hadith Detail Dialog
        selectedHadithForDetail?.let { hadith ->
            AlertDialog(
                onDismissRequest = { selectedHadithForDetail = null },
                title = {
                    Column {
                        Text(
                            text = "الحديث ${hadith.number}: ${hadith.titleArabic}",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = DarkEmerald
                            )
                        )
                        Text(
                            text = hadith.narratorArabic,
                            style = MaterialTheme.typography.labelSmall.copy(color = GoldAccent)
                        )
                    }
                },
                text = {
                    LazyColumn(modifier = Modifier.fillMaxWidth()) {
                        item {
                            Text(
                                text = "متن الحديث الشريف:",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = hadith.matnArabic,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    lineHeight = 26.sp,
                                    fontSize = 16.sp
                                ),
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            Spacer(modifier = Modifier.height(14.dp))
                            Text(
                                text = "English Translation:",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = hadith.matnEnglish,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    lineHeight = 20.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )

                            Spacer(modifier = Modifier.height(14.dp))
                            Text(
                                text = "من فوائد الحديث ومعانيه:",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = hadith.explanationArabic,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    lineHeight = 22.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { selectedHadithForDetail = null }) {
                        Text("إغلاق", color = SageTeal)
                    }
                }
            )
        }
    }
}
