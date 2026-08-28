package com.example.data.model

data class DhikrCategory(
    val id: String,
    val titleArabic: String,
    val titleEnglish: String,
    val subtitleArabic: String,
    val subtitleEnglish: String,
    val icon: String,
    val countItems: Int
)

data class DhikrItem(
    val id: String,
    val categoryId: String,
    val textArabic: String,
    val textEnglish: String,
    val countTarget: Int,
    val rewardArabic: String = "",
    val rewardEnglish: String = "",
    val source: String = ""
)

data class DailyHabit(
    val id: String,
    val titleArabic: String,
    val titleEnglish: String,
    val category: String,
    val isCompleted: Boolean = false
)
