package com.example.data.model

enum class PrayerType(val arName: String, val enName: String) {
    FAJR("الفجر", "Fajr"),
    SUNRISE("الشروق", "Sunrise"),
    DHUHR("الظهر", "Dhuhr"),
    ASR("العصر", "Asr"),
    MAGHRIB("المغرب", "Maghrib"),
    ISHA("العشاء", "Isha")
}

data class PrayerTimeItem(
    val type: PrayerType,
    val formattedTime: String,
    val hour24: Int,
    val minute: Int,
    val isNext: Boolean = false,
    val isPassed: Boolean = false
)

data class DailyPrayerSchedule(
    val dateString: String,
    val prayers: List<PrayerTimeItem>,
    val nextPrayer: PrayerTimeItem?,
    val timeRemainingString: String,
    val progressToNext: Float
)

enum class CalculationMethod(val titleAr: String, val titleEn: String) {
    UMM_AL_QURA("أم القرى (مكة المكرمة)", "Umm Al-Qura (Makkah)"),
    MUSLIM_WORLD_LEAGUE("رابطة العالم الإسلامي", "Muslim World League"),
    EGYPTIAN("الهيئة المصرية العامة للمساحة", "Egyptian General Authority"),
    ISNA("الجمعية الإسلامية لأمريكا الشمالية", "Islamic Society of North America"),
    KARACHI("جامعة العلوم الإسلامية بكراتشي", "University of Islamic Sciences, Karachi"),
    DUBAI("دائرة الشؤون الإسلامية بدبي", "Dubai Islamic Affairs")
}

data class QiblaData(
    val qiblaAngle: Float,
    val deviceCompassBearing: Float,
    val relativeAngle: Float,
    val distanceKm: Double,
    val cityName: String
)
