package com.example.data.model

data class DuaCategory(
    val id: String,
    val titleArabic: String,
    val titleEnglish: String,
    val icon: String
)

data class DuaItem(
    val id: String,
    val categoryId: String,
    val titleArabic: String,
    val titleEnglish: String,
    val textArabic: String,
    val textEnglish: String,
    val source: String
)

data class DailyReminder(
    val id: String,
    val categoryAr: String,
    val categoryEn: String,
    val textArabic: String,
    val textEnglish: String,
    val sourceArabic: String,
    val sourceEnglish: String
)

data class HijriDate(
    val day: Int,
    val monthNumber: Int,
    val monthNameArabic: String,
    val monthNameEnglish: String,
    val year: Int,
    val formattedArabic: String,
    val formattedEnglish: String
)

data class IslamicEvent(
    val titleArabic: String,
    val titleEnglish: String,
    val hijriMonth: Int,
    val hijriDay: Int,
    val descriptionArabic: String
)

data class AsmaulHusna(
    val id: Int,
    val nameArabic: String,
    val transliteration: String,
    val meaningArabic: String,
    val meaningEnglish: String,
    val quranicReference: String = ""
)

data class NawawiHadith(
    val number: Int,
    val titleArabic: String,
    val titleEnglish: String,
    val narratorArabic: String,
    val matnArabic: String,
    val matnEnglish: String,
    val explanationArabic: String,
    val reference: String = "الأربعون النووية"
)

data class CityPreset(
    val nameArabic: String,
    val nameEnglish: String,
    val countryArabic: String,
    val latitude: Double,
    val longitude: Double,
    val timezone: Double
)

