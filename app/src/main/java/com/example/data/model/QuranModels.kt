package com.example.data.model

data class Surah(
    val number: Int,
    val nameArabic: String,
    val nameEnglish: String,
    val englishTranslation: String,
    val revelationType: String, // "Meccan" or "Medinan" (مكية / مدنية)
    val ayahCount: Int,
    val pageNumber: Int
)

data class Ayah(
    val numberInQuran: Int,
    val surahNumber: Int,
    val numberInSurah: Int,
    val textArabic: String,
    val textEnglish: String,
    val tafsirMuyassar: String,
    val page: Int,
    val audioUrl: String = ""
)

data class Reciter(
    val id: String,
    val nameArabic: String,
    val nameEnglish: String,
    val serverPath: String
)

enum class ReadingMode {
    VERSE_BY_VERSE,
    SURAH_READING
}
