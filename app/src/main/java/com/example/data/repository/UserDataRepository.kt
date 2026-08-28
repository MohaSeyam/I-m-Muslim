package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.local.entity.BookmarkEntity
import com.example.data.local.entity.DailyHabitEntity
import com.example.data.local.entity.DhikrCounterEntity
import com.example.data.local.entity.ReadingProgressEntity
import com.example.data.local.entity.UserSettingsEntity
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class UserDataRepository(private val database: AppDatabase) {

    private val bookmarkDao = database.bookmarkDao()
    private val readingProgressDao = database.readingProgressDao()
    private val dhikrCounterDao = database.dhikrCounterDao()
    private val dailyHabitDao = database.dailyHabitDao()
    private val userSettingsDao = database.userSettingsDao()

    val allBookmarks: Flow<List<BookmarkEntity>> = bookmarkDao.getAllBookmarks()
    val readingProgress: Flow<ReadingProgressEntity?> = readingProgressDao.getReadingProgress()
    val userSettings: Flow<UserSettingsEntity?> = userSettingsDao.getSettings()

    suspend fun toggleBookmark(
        surahNumber: Int,
        surahNameAr: String,
        surahNameEn: String,
        ayahNumber: Int,
        ayahTextAr: String,
        ayahTextEn: String
    ): Boolean {
        // Check if exists
        val exists = database.bookmarkDao()
        bookmarkDao.deleteBookmark(surahNumber, ayahNumber)
        val newBookmark = BookmarkEntity(
            surahNumber = surahNumber,
            surahNameAr = surahNameAr,
            surahNameEn = surahNameEn,
            ayahNumber = ayahNumber,
            ayahTextAr = ayahTextAr,
            ayahTextEn = ayahTextEn
        )
        bookmarkDao.insertBookmark(newBookmark)
        return true
    }

    suspend fun removeBookmark(id: Int) {
        bookmarkDao.deleteById(id)
    }

    suspend fun saveReadingProgress(surahNumber: Int, ayahNumber: Int, surahNameAr: String, surahNameEn: String) {
        readingProgressDao.saveReadingProgress(
            ReadingProgressEntity(
                id = 1,
                surahNumber = surahNumber,
                surahNameAr = surahNameAr,
                surahNameEn = surahNameEn,
                ayahNumber = ayahNumber,
                lastReadTimestamp = System.currentTimeMillis()
            )
        )
    }

    fun getCounter(key: String): Flow<DhikrCounterEntity?> {
        return dhikrCounterDao.getCounterByKey(key)
    }

    suspend fun incrementCounter(key: String, target: Int = 100) {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val current = dhikrCounterDao.getCounterByKey(key)
        // Insert or update
        val updated = DhikrCounterEntity(
            dhikrKey = key,
            todayCount = 1,
            totalCount = 1,
            targetCount = target,
            lastDate = todayStr
        )
        dhikrCounterDao.saveCounter(updated)
    }

    fun getHabitsForToday(): Flow<List<DailyHabitEntity>> {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        return dailyHabitDao.getHabitsForDate(todayStr)
    }

    suspend fun toggleHabit(habitKey: String, isCompleted: Boolean) {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        dailyHabitDao.saveHabit(
            DailyHabitEntity(
                habitKey = habitKey,
                dateStr = todayStr,
                isCompleted = isCompleted
            )
        )
    }

    suspend fun updateSettings(settings: UserSettingsEntity) {
        userSettingsDao.saveSettings(settings)
    }
}
