package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entity.BookmarkEntity
import com.example.data.local.entity.DailyHabitEntity
import com.example.data.local.entity.DhikrCounterEntity
import com.example.data.local.entity.ReadingProgressEntity
import com.example.data.local.entity.UserSettingsEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM bookmarks ORDER BY dateAdded DESC")
    fun getAllBookmarks(): Flow<List<BookmarkEntity>>

    @Query("SELECT EXISTS(SELECT 1 FROM bookmarks WHERE surahNumber = :surahNumber AND ayahNumber = :ayahNumber)")
    fun isBookmarked(surahNumber: Int, ayahNumber: Int): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBookmark(bookmark: BookmarkEntity)

    @Query("DELETE FROM bookmarks WHERE surahNumber = :surahNumber AND ayahNumber = :ayahNumber")
    suspend fun deleteBookmark(surahNumber: Int, ayahNumber: Int)

    @Query("DELETE FROM bookmarks WHERE id = :id")
    suspend fun deleteById(id: Int)
}

@Dao
interface ReadingProgressDao {
    @Query("SELECT * FROM reading_progress WHERE id = 1")
    fun getReadingProgress(): Flow<ReadingProgressEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveReadingProgress(progress: ReadingProgressEntity)
}

@Dao
interface DhikrCounterDao {
    @Query("SELECT * FROM dhikr_counters")
    fun getAllCounters(): Flow<List<DhikrCounterEntity>>

    @Query("SELECT * FROM dhikr_counters WHERE dhikrKey = :key")
    fun getCounterByKey(key: String): Flow<DhikrCounterEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveCounter(counter: DhikrCounterEntity)
}

@Dao
interface DailyHabitDao {
    @Query("SELECT * FROM daily_habits WHERE dateStr = :dateStr")
    fun getHabitsForDate(dateStr: String): Flow<List<DailyHabitEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveHabit(habit: DailyHabitEntity)
}

@Dao
interface UserSettingsDao {
    @Query("SELECT * FROM user_settings WHERE id = 1")
    fun getSettings(): Flow<UserSettingsEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveSettings(settings: UserSettingsEntity)
}
