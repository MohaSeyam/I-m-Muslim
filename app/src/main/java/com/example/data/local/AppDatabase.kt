package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.local.dao.BookmarkDao
import com.example.data.local.dao.DailyHabitDao
import com.example.data.local.dao.DhikrCounterDao
import com.example.data.local.dao.ReadingProgressDao
import com.example.data.local.dao.UserSettingsDao
import com.example.data.local.entity.BookmarkEntity
import com.example.data.local.entity.DailyHabitEntity
import com.example.data.local.entity.DhikrCounterEntity
import com.example.data.local.entity.ReadingProgressEntity
import com.example.data.local.entity.UserSettingsEntity

@Database(
    entities = [
        BookmarkEntity::class,
        ReadingProgressEntity::class,
        DhikrCounterEntity::class,
        DailyHabitEntity::class,
        UserSettingsEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun bookmarkDao(): BookmarkDao
    abstract fun readingProgressDao(): ReadingProgressDao
    abstract fun dhikrCounterDao(): DhikrCounterDao
    abstract fun dailyHabitDao(): DailyHabitDao
    abstract fun userSettingsDao(): UserSettingsDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "im_muslim_app.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
