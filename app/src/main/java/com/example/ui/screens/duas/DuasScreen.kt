package com.example.ui.screens.duas

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.DuaCategory
import com.example.data.model.DuaItem
import com.example.ui.components.AppTopBar
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

@Composable
fun DuasScreen(
    viewModel: AppViewModel,
    onBackClick: () -> Unit
) {
    val context = LocalContext.current
    val categories = viewModel.duaCategories
    val selectedCategory by viewModel.selectedDuaCategory.collectAsState()
    val currentDuas by viewModel.currentDuas.collectAsState()

    var searchQuery by remember { mutableStateOf("") }

    val displayedDuas = remember(searchQuery, currentDuas) {
        if (searchQuery.isBlank()) currentDuas else viewModel.duaRepository.searchDuas(searchQuery)
    }

    Scaffold(
        topBar = {
            AppTopBar(
                title = "الأدعية المأثورة",
                subtitle = "جوامع الدعاء من القرآن والسنة الصحيحة",
                onBackClick = onBackClick
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
        ) {
            // Search field
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("ابحث في الأدعية...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .testTag("duas_search_bar"),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = SageTeal,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedContainerColor = MaterialTheme.colorScheme.surface
                )
            )

            // Category Chips Row
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
            ) {
                items(categories) { category ->
                    val isSelected = selectedCategory.id == category.id
                    FilterChip(
                        selected = isSelected,
                        onClick = { viewModel.selectDuaCategory(category.id) },
                        label = { Text(category.titleArabic, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = SageTeal,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            // Duas List
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(top = 8.dp, bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(displayedDuas, key = { it.id }) { dua ->
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth().testTag("dua_item_${dua.id}")
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = dua.titleArabic,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                )

                                Row {
                                    IconButton(
                                        onClick = {
                                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                            val clip = ClipData.newPlainText("Dua", "${dua.textArabic}\n\nالمصدر: ${dua.source}")
                                            clipboard.setPrimaryClip(clip)
                                            Toast.makeText(context, "تم نسخ الدعاء", Toast.LENGTH_SHORT).show()
                                        },
                                        modifier = Modifier.size(36.dp)
                                    ) {
                                        Icon(Icons.Outlined.ContentCopy, contentDescription = "نسخ", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }

                                    IconButton(
                                        onClick = {
                                            val shareText = "${dua.titleArabic}\n\n«${dua.textArabic}»\n\nالمصدر: ${dua.source}\n\nعبر تطبيق «أنا مسلم»"
                                            val intent = Intent(Intent.ACTION_SEND).apply {
                                                type = "text/plain"
                                                putExtra(Intent.EXTRA_TEXT, shareText)
                                            }
                                            context.startActivity(Intent.createChooser(intent, "مشاركة الدعاء"))
                                        },
                                        modifier = Modifier.size(36.dp)
                                    ) {
                                        Icon(Icons.Outlined.Share, contentDescription = "مشاركة", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = "«${dua.textArabic}»",
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    fontSize = 17.sp,
                                    lineHeight = 28.sp,
                                    fontWeight = FontWeight.Medium,
                                    textAlign = TextAlign.Right
                                ),
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            if (dua.textEnglish.isNotBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = dua.textEnglish,
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontSize = 12.sp,
                                        lineHeight = 18.sp,
                                        textAlign = TextAlign.Left
                                    ),
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = "المصدر: ${dua.source}",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = SageTeal,
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }
                    }
                }
            }
        }
    }
}
