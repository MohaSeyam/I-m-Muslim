package com.example.ui.screens.friday

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.example.ui.components.AppTopBar
import com.example.ui.theme.DarkEmerald
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.IslamicGreenPrimary
import com.example.ui.theme.SageTeal
import com.example.ui.viewmodel.AppViewModel

@Composable
fun FridaySpecialScreen(
    viewModel: AppViewModel,
    onNavigateToSurahReader: () -> Unit,
    onBackClick: () -> Unit
) {
    val salawatCount by viewModel.salawatCount.collectAsState()
    
    var sunanChecklist by remember {
        mutableStateOf(
            listOf(
                "الغسل يوم الجمعة" to true,
                "التطيب ولبس أحسن الثياب" to true,
                "استعمال السواك" to true,
                "التبكير إلى صلاة الجمعة" to false,
                "الإنصات للخطبة وتجنب اللغو" to false,
                "قراءة سورة الكهف كاملة" to true,
                "الإكثار من الصلاة والسلام على رسول الله ﷺ" to true,
                "تحري ساعة الإجابة آخر عصر الجمعة" to false
            )
        )
    }

    Scaffold(
        topBar = {
            AppTopBar(
                title = "بركات يوم الجمعة",
                subtitle = "سيد الأيام وخير يوم طلعت عليه الشمس",
                onBackClick = onBackClick
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
            // Surah Al-Kahf Hero Banner
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = IslamicGreenPrimary),
                    elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .clickable {
                            viewModel.loadSurah(18)
                            onNavigateToSurahReader()
                        }
                        .testTag("read_kahf_button")
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        IslamicGreenPrimary,
                                        Color(0xFF0F3223)
                                    )
                                )
                            )
                            .padding(20.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.AutoAwesome,
                                        contentDescription = null,
                                        tint = GoldAccent,
                                        modifier = Modifier.size(24.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "نور ما بين الجمعتين",
                                        style = MaterialTheme.typography.labelLarge.copy(
                                            color = GoldAccent,
                                            fontWeight = FontWeight.Bold
                                        )
                                    )
                                }

                                Surface(
                                    color = Color.White.copy(alpha = 0.15f),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = "سورة الكهف (110 آيات)",
                                        style = MaterialTheme.typography.bodySmall.copy(color = Color.White),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Text(
                                text = "سورة الكهف",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 28.sp,
                                    color = Color.White
                                )
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "قال ﷺ: «من قرأ سورةَ الكهفِ في يومِ الجمعةِ أضاء له من النورِ ما بين الجُمعتَينِ»",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    color = Color.White.copy(alpha = 0.9f),
                                    lineHeight = 22.sp
                                )
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            Button(
                                onClick = {
                                    viewModel.loadSurah(18)
                                    onNavigateToSurahReader()
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color.Black)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("قراءة سورة الكهف الآن", color = Color.Black, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Salawat on the Prophet ﷺ Counter Card
            item {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "الصلاة والسلام على النبي ﷺ",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "«إن من أفضل أيامكم يوم الجمعة فأكثروا علي من الصلاة فيه»",
                            style = MaterialTheme.typography.bodySmall,
                            textAlign = TextAlign.Center,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "$salawatCount",
                            style = MaterialTheme.typography.displayMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = SageTeal
                            )
                        )

                        Text(
                            text = "صلاة على النبي ﷺ اليوم",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Button(
                            onClick = { viewModel.incrementSalawat() },
                            colors = ButtonDefaults.buttonColors(containerColor = SageTeal),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Text("اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // Section: سنن وآداب يوم الجمعة
            item {
                Text(
                    text = "سنن وآداب يوم الجمعة المباركة",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onBackground
                )
            }

            items(sunanChecklist.size) { index ->
                val (title, checked) = sunanChecklist[index]
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val updated = sunanChecklist.toMutableList()
                            updated[index] = title to !checked
                            sunanChecklist = updated
                        }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = title,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = if (checked) FontWeight.Bold else FontWeight.Normal
                            ),
                            color = MaterialTheme.colorScheme.onSurface
                        )

                        Checkbox(
                            checked = checked,
                            onCheckedChange = { isChecked ->
                                val updated = sunanChecklist.toMutableList()
                                updated[index] = title to isChecked
                                sunanChecklist = updated
                            },
                            colors = CheckboxDefaults.colors(checkedColor = SageTeal)
                        )
                    }
                }
            }
        }
    }
}
