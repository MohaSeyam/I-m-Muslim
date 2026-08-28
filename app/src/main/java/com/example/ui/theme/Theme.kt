package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = DarkEmerald,
    onPrimary = DarkBg,
    primaryContainer = DarkEmeraldContainer,
    onPrimaryContainer = IslamicGreenContainer,
    secondary = DarkGold,
    onSecondary = DarkBg,
    secondaryContainer = DarkSurfaceVariant,
    onSecondaryContainer = DarkGold,
    tertiary = DarkEmerald,
    background = DarkBg,
    surface = DarkSurface,
    surfaceVariant = DarkSurfaceVariant,
    onBackground = DarkTextPrimary,
    onSurface = DarkTextPrimary,
    onSurfaceVariant = DarkTextSecondary,
    outline = DarkOutline
)

private val LightColorScheme = lightColorScheme(
    primary = IslamicGreenPrimary,
    onPrimary = IslamicGreenOnPrimary,
    primaryContainer = IslamicGreenContainer,
    onPrimaryContainer = IslamicGreenOnContainer,
    secondary = GoldAccent,
    onSecondary = IslamicGreenOnPrimary,
    secondaryContainer = GoldAccentLight,
    onSecondaryContainer = GoldAccentDark,
    tertiary = SageTeal,
    background = CreamBackground,
    surface = WhiteSurface,
    surfaceVariant = CreamSurfaceVariant,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary,
    outline = OutlineSoft
)

@Composable
fun MuslimAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
