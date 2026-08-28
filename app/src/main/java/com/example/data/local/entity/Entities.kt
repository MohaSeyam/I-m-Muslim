package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "bookmarks")
data class BookmarkEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val surahNumber: Int,
    val surahNameAr: String,
    val surahNameEn: String,
    val ayahNumber: Int,
    val ayahTextAr: String,
    val ayahTextEn: String,
    val dateAdded: Long = System.currentTimeMillis(),
    val note: String = ""
)

@Entity(tableName = "reading_progress")
data class ReadingProgressEntity(
    @PrimaryKey val id: Int = 1,
    val surahNumber: Int,
    val surahNameAr: String,
    val surahNameEn: String,
    val ayahNumber: Int,
    val lastReadTimestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "dhikr_counters")
data class DhikrCounterEntity(
    @PrimaryKey val dhikrKey: String,
    val todayCount: Int = 0,
    val totalCount: Int = 0,
    val targetCount: Int = 100,
    val lastDate: String = ""
)

@Entity(tableName = "daily_habits", primaryKeys = ["habitKey", "dateStr"])
data class DailyHabitEntity(
    val habitKey: String,
    val dateStr: String,
    val isCompleted: Boolean = false
)

@Entity(tableName = "user_settings")
data class UserSettingsEntity(
    @PrimaryKey val id: Int = 1,
    val language: String = "ar", // "ar" or "en"
    val themeMode: String = "system", // "system", "light", "dark"
    val quranFontSize: Float = 24f,
    val showTranslation: Boolean = true,
    val reciterId: String = "alafasy",
    val calculationMethod: String = "UMM_AL_QURA",
    val prayerNotificationsEnabled: Boolean = true,
    val morningReminderTime: String = "06:30",
    val eveningReminderTime: String = "17:30",
    val sleepReminderTime: String = "22:30",
    val salawatReminderEnabled: Boolean = true,
    val userCity: String = "مكة المكرمة",
    val userLatitude: Double = 21.4225,
    val userLongitude: Double = 39.8262
)
