package com.example.ui.screens.qibla

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
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
import kotlin.math.abs

@Composable
fun QiblaCompassScreen(
    viewModel: AppViewModel,
    onBackClick: () -> Unit
) {
    val qiblaData by viewModel.qiblaData.collectAsState()
    
    // Smooth angle animation
    val animatedCompassRotation by animateFloatAsState(
        targetValue = -qiblaData.deviceCompassBearing,
        animationSpec = spring(stiffness = 300f),
        label = "compass_rotation"
    )

    val isFacingQibla = abs(qiblaData.relativeAngle) < 5f || abs(qiblaData.relativeAngle - 360f) < 5f

    Scaffold(
        topBar = {
            AppTopBar(
                title = "بوصلة القبلة",
                subtitle = "اتجاه المسجد الحرام بمكة المكرمة",
                onBackClick = onBackClick
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Status Header
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 12.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = if (isFacingQibla) SageTeal else MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (isFacingQibla) Icons.Default.CheckCircle else Icons.Outlined.Explore,
                            contentDescription = null,
                            tint = if (isFacingQibla) Color.White else MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isFacingQibla) "أنت متجه نحو القبلة مباشرة 🕋" else "أدر هاتفك حتى تتطابق الإبرة مع الكعبة",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = if (isFacingQibla) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                    }
                }

                Text(
                    text = "${qiblaData.qiblaAngle.toInt()}° درجة من الشمال",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onBackground
                )
            }

            // Compass Visual Area
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(280.dp)
                    .testTag("qibla_compass_dial")
            ) {
                // Outer Dial (Rotates with device heading)
                Canvas(
                    modifier = Modifier
                        .size(280.dp)
                        .rotate(animatedCompassRotation)
                ) {
                    val radius = size.width / 2
                    val center = Offset(size.width / 2, size.height / 2)

                    // Outer circle
                    drawCircle(
                        color = Color(0xFF2D6A4F).copy(alpha = 0.2f),
                        radius = radius,
                        center = center,
                        style = Stroke(width = 3.dp.toPx())
                    )

                    // Draw Cardinal points (N, E, S, W)
                    val tickLength = 12.dp.toPx()
                    for (i in 0 until 360 step 30) {
                        val angleRad = Math.toRadians((i - 90).toDouble())
                        val startX = (center.x + (radius - tickLength) * kotlin.math.cos(angleRad)).toFloat()
                        val startY = (center.y + (radius - tickLength) * kotlin.math.sin(angleRad)).toFloat()
                        val endX = (center.x + radius * kotlin.math.cos(angleRad)).toFloat()
                        val endY = (center.y + radius * kotlin.math.sin(angleRad)).toFloat()

                        drawLine(
                            color = if (i % 90 == 0) SageTeal else Color.Gray.copy(alpha = 0.5f),
                            start = Offset(startX, startY),
                            end = Offset(endX, endY),
                            strokeWidth = if (i % 90 == 0) 3.dp.toPx() else 1.5.dp.toPx()
                        )
                    }
                }

                // Inner Kaaba Pointer (Points toward Qibla angle)
                Box(
                    contentAlignment = Alignment.TopCenter,
                    modifier = Modifier
                        .size(240.dp)
                        .rotate(animatedCompassRotation + qiblaData.qiblaAngle)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = GoldAccent,
                            shadowElevation = 6.dp,
                            modifier = Modifier.size(44.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("🕋", fontSize = 22.sp)
                            }
                        }
                        // Arrow pointing up
                        Icon(
                            imageVector = Icons.Default.ArrowDropUp,
                            contentDescription = "Qibla pointer",
                            tint = GoldAccent,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }

                // Center Hub
                Surface(
                    shape = CircleShape,
                    color = SageTeal,
                    shadowElevation = 4.dp,
                    modifier = Modifier.size(28.dp)
                ) {}
            }

            // Bottom Info & Calibration
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "المسافة إلى الكعبة",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "${qiblaData.distanceKm.toInt()} كم",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = SageTeal
                            )
                        )
                    }

                    VerticalDivider(modifier = Modifier.height(36.dp))

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "الموقع المرجعي",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = qiblaData.cityName,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        )
                    }
                }
            }
        }
    }
}
