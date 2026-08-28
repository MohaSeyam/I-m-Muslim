package com.example.data.repository

import com.example.data.model.Ayah
import com.example.data.model.Reciter
import com.example.data.model.Surah
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class QuranRepository {

    val reciters = listOf(
        Reciter(
            id = "alafasy",
            nameArabic = "مشاري راشد العفاسي",
            nameEnglish = "Mishary Rashid Alafasy",
            serverPath = "https://everyayah.com/data/Alafasy_128kbps/"
        ),
        Reciter(
            id = "abdulbasit",
            nameArabic = "عبد الباسط عبد الصمد (مرتل)",
            nameEnglish = "Abdulbasit Abdussamad",
            serverPath = "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/"
        ),
        Reciter(
            id = "ghamadi",
            nameArabic = "سعد الغامدي",
            nameEnglish = "Saad Al-Ghamdi",
            serverPath = "https://everyayah.com/data/Ghamadi_40kbps/"
        ),
        Reciter(
            id = "muaiqly",
            nameArabic = "ماهر المعيقلي",
            nameEnglish = "Maher Al-Muaiqly",
            serverPath = "https://everyayah.com/data/MaherAlMuaiqly128kbps/"
        ),
        Reciter(
            id = "husary",
            nameArabic = "محمود خليل الحصري",
            nameEnglish = "Mahmoud Khalil Al-Husary",
            serverPath = "https://everyayah.com/data/Husary_128kbps/"
        )
    )

    val surahs: List<Surah> = listOf(
        Surah(1, "الفاتحة", "Al-Fatihah", "The Opening", "مكية", 7, 1),
        Surah(2, "البقرة", "Al-Baqarah", "The Cow", "مدنية", 286, 2),
        Surah(3, "آل عمران", "Ali 'Imran", "Family of Imran", "مدنية", 200, 50),
        Surah(4, "النساء", "An-Nisa", "The Women", "مدنية", 176, 77),
        Surah(5, "المائدة", "Al-Ma'idah", "The Table Spread", "مدنية", 120, 106),
        Surah(6, "الأنعام", "Al-An'am", "The Cattle", "مكية", 165, 128),
        Surah(7, "الأعراف", "Al-A'raf", "The Heights", "مكية", 206, 151),
        Surah(8, "الأنفال", "Al-Anfal", "The Spoils of War", "مدنية", 75, 177),
        Surah(9, "التوبة", "At-Tawbah", "The Repentance", "مدنية", 129, 187),
        Surah(10, "يونس", "Yunus", "Jonah", "مكية", 109, 208),
        Surah(11, "هود", "Hud", "Hud", "مكية", 123, 221),
        Surah(12, "يوسف", "Yusuf", "Joseph", "مكية", 111, 235),
        Surah(13, "الرعد", "Ar-Ra'd", "The Thunder", "مدنية", 43, 249),
        Surah(14, "إبراهيم", "Ibrahim", "Abraham", "مكية", 52, 255),
        Surah(15, "الحجر", "Al-Hijr", "The Rocky Tract", "مكية", 99, 262),
        Surah(16, "النحل", "An-Nahl", "The Bee", "مكية", 128, 267),
        Surah(17, "الإسراء", "Al-Isra", "The Night Journey", "مكية", 111, 282),
        Surah(18, "الكهف", "Al-Kahf", "The Cave", "مكية", 110, 293),
        Surah(19, "مريم", "Maryam", "Mary", "مكية", 98, 305),
        Surah(20, "طه", "Taha", "Ta-Ha", "مكية", 135, 312),
        Surah(21, "الأنبياء", "Al-Anbiya", "The Prophets", "مكية", 112, 322),
        Surah(22, "الحج", "Al-Hajj", "The Pilgrimage", "مدنية", 78, 332),
        Surah(23, "المؤمنون", "Al-Mu'minun", "The Believers", "مكية", 118, 342),
        Surah(24, "النور", "An-Nur", "The Light", "مدنية", 64, 350),
        Surah(25, "الفرقان", "Al-Furqan", "The Criterion", "مكية", 77, 359),
        Surah(26, "الشعراء", "Ash-Shu'ara", "The Poets", "مكية", 227, 367),
        Surah(27, "النمل", "An-Naml", "The Ant", "مكية", 93, 377),
        Surah(28, "القصص", "Al-Qasas", "The Stories", "مكية", 88, 385),
        Surah(29, "العنكبوت", "Al-'Ankabut", "The Spider", "مكية", 69, 396),
        Surah(30, "الروم", "Ar-Rum", "The Romans", "مكية", 60, 404),
        Surah(31, "لقمان", "Luqman", "Luqman", "مكية", 34, 411),
        Surah(32, "السجدة", "As-Sajdah", "The Prostration", "مكية", 30, 415),
        Surah(33, "الأحزاب", "Al-Ahzab", "The Combined Forces", "مدنية", 73, 418),
        Surah(34, "سبأ", "Saba", "Sheba", "مكية", 54, 428),
        Surah(35, "فاطر", "Fatir", "Originator", "مكية", 45, 434),
        Surah(36, "يس", "Ya-Sin", "Ya-Sin", "مكية", 83, 440),
        Surah(37, "الصافات", "As-Saffat", "Those who set the Ranks", "مكية", 182, 446),
        Surah(38, "ص", "Sad", "The Letter Sad", "مكية", 88, 453),
        Surah(39, "الزمر", "Az-Zumar", "The Troops", "مكية", 75, 458),
        Surah(40, "غافر", "Ghafir", "The Forgiver", "مكية", 85, 467),
        Surah(41, "فصلت", "Fussilat", "Explained in Detail", "مكية", 54, 477),
        Surah(42, "الشورى", "Ash-Shuraa", "The Consultation", "مكية", 53, 483),
        Surah(43, "الزخرف", "Az-Zukhruf", "The Ornaments of Gold", "مكية", 89, 489),
        Surah(44, "الدخان", "Ad-Dukhan", "The Smoke", "مكية", 59, 496),
        Surah(45, "الجاثية", "Al-Jathiyah", "The Crouching", "مكية", 37, 499),
        Surah(46, "الأحقاف", "Al-Ahqaf", "The Wind-Curved Sandhills", "مكية", 35, 502),
        Surah(47, "محمد", "Muhammad", "Muhammad", "مدنية", 38, 507),
        Surah(48, "الفتح", "Al-Fath", "The Victory", "مدنية", 29, 511),
        Surah(49, "الحجرات", "Al-Hujurat", "The Rooms", "مدنية", 18, 515),
        Surah(50, "ق", "Qaf", "The Letter Qaf", "مكية", 45, 518),
        Surah(51, "الذاريات", "Adh-Dhariyat", "The Winnowing Winds", "مكية", 60, 520),
        Surah(52, "الطور", "At-Tur", "The Mount", "مكية", 49, 523),
        Surah(53, "النجم", "An-Najm", "The Star", "مكية", 62, 526),
        Surah(54, "القمر", "Al-Qamar", "The Moon", "مكية", 55, 528),
        Surah(55, "الرحمن", "Ar-Rahman", "The Beneficent", "مدنية", 78, 531),
        Surah(56, "الواقعة", "Al-Waqi'ah", "The Inevitable", "مكية", 96, 534),
        Surah(57, "الحديد", "Al-Hadid", "The Iron", "مدنية", 29, 537),
        Surah(58, "المجادلة", "Al-Mujadila", "The Pleading Woman", "مدنية", 22, 542),
        Surah(59, "الحشر", "Al-Hashr", "The Exile", "مدنية", 24, 545),
        Surah(60, "الممتحنة", "Al-Mumtahanah", "She that is to be examined", "مدنية", 13, 549),
        Surah(61, "الصف", "As-Saf", "The Ranks", "مدنية", 14, 551),
        Surah(62, "الجمعة", "Al-Jumu'ah", "The Congregation, Friday", "مدنية", 11, 553),
        Surah(63, "المنافقون", "Al-Munafiqun", "The Hypocrites", "مدنية", 11, 554),
        Surah(64, "التغابن", "At-Taghabun", "The Mutual Disillusion", "مدنية", 18, 556),
        Surah(65, "الطلاق", "At-Talaq", "The Divorce", "مدنية", 12, 558),
        Surah(66, "التحريم", "At-Tahrim", "The Prohibition", "مدنية", 12, 560),
        Surah(67, "الملك", "Al-Mulk", "The Sovereignty", "مكية", 30, 562),
        Surah(68, "القلم", "Al-Qalam", "The Pen", "مكية", 52, 564),
        Surah(69, "الحاقة", "Al-Haqqah", "The Reality", "مكية", 52, 566),
        Surah(70, "المعارج", "Al-Ma'arij", "The Ascending Stairways", "مكية", 44, 568),
        Surah(71, "نوح", "Nuh", "Noah", "مكية", 28, 570),
        Surah(72, "الجن", "Al-Jinn", "The Jinn", "مكية", 28, 572),
        Surah(73, "المزمل", "Al-Muzzammil", "The Enshrouded One", "مكية", 20, 574),
        Surah(74, "المدثر", "Al-Muddaththir", "The Cloaked One", "مكية", 56, 575),
        Surah(75, "القيامة", "Al-Qiyamah", "The Resurrection", "مكية", 40, 577),
        Surah(76, "الإنسان", "Al-Insan", "Man", "مدنية", 31, 578),
        Surah(77, "المرسلات", "Al-Mursalat", "The Emissaries", "مكية", 50, 580),
        Surah(78, "النبأ", "An-Naba", "The Tidings", "مكية", 40, 582),
        Surah(79, "النازعات", "An-Nazi'at", "Those who drag forth", "مكية", 46, 583),
        Surah(80, "عبس", "'Abasa", "He Frowned", "مكية", 42, 585),
        Surah(81, "التكوير", "At-Takwir", "The Overthrowing", "مكية", 29, 586),
        Surah(82, "الانفطار", "Al-Infitar", "The Cleaving", "مكية", 19, 587),
        Surah(83, "المطففين", "Al-Mutaffifin", "The Defrauding", "مكية", 36, 587),
        Surah(84, "الانشقاق", "Al-Inshiqaq", "The Splitting Open", "مكية", 25, 589),
        Surah(85, "البروج", "Al-Buruj", "The Mansions of the Stars", "مكية", 22, 590),
        Surah(86, "الطارق", "At-Tariq", "The Morning Star", "مكية", 17, 591),
        Surah(87, "الأعلى", "Al-A'la", "The Most High", "مكية", 19, 591),
        Surah(88, "الغاشية", "Al-Ghashiyah", "The Overwhelming", "مكية", 26, 592),
        Surah(89, "الفجر", "Al-Fajr", "The Dawn", "مكية", 30, 593),
        Surah(90, "البلد", "Al-Balad", "The City", "مكية", 20, 594),
        Surah(91, "الشمس", "Ash-Shams", "The Sun", "مكية", 15, 595),
        Surah(92, "الليل", "Al-Layl", "The Night", "مكية", 21, 595),
        Surah(93, "الضحى", "Ad-Duhaa", "The Morning Hours", "مكية", 11, 596),
        Surah(94, "الشرح", "Ash-Sharh", "The Relief", "مكية", 8, 596),
        Surah(95, "التين", "At-Tin", "The Fig", "مكية", 8, 597),
        Surah(96, "العلق", "Al-'Alaq", "The Clot", "مكية", 19, 597),
        Surah(97, "القدر", "Al-Qadr", "The Power", "مكية", 5, 598),
        Surah(98, "البينة", "Al-Bayyinah", "The Clear Proof", "مدنية", 8, 598),
        Surah(99, "الزلزلة", "Az-Zalzalah", "The Earthquake", "مدنية", 8, 599),
        Surah(100, "العاديات", "Al-'Adiyat", "The Courser", "مكية", 11, 599),
        Surah(101, "القارعة", "Al-Qari'ah", "The Calamity", "مكية", 11, 600),
        Surah(102, "التكاثر", "At-Takathur", "The Rivalry in World Increase", "مكية", 8, 600),
        Surah(103, "العصر", "Al-'Asr", "The Declining Day", "مكية", 3, 601),
        Surah(104, "الهمزة", "Al-Humazah", "The Traducer", "مكية", 9, 601),
        Surah(105, "الفيل", "Al-Fil", "The Elephant", "مكية", 5, 601),
        Surah(106, "قريش", "Quraysh", "Quraysh", "مكية", 4, 602),
        Surah(107, "الماعون", "Al-Ma'un", "The Small Kindness", "مكية", 7, 602),
        Surah(108, "الكوثر", "Al-Kawthar", "The Abundance", "مكية", 3, 602),
        Surah(109, "الكافرون", "Al-Kafirun", "The Disbelievers", "مكية", 6, 603),
        Surah(110, "النصر", "An-Nasr", "The Divine Support", "مدنية", 3, 603),
        Surah(111, "المسد", "Al-Masad", "The Palm Fiber", "مكية", 5, 603),
        Surah(112, "الإخلاص", "Al-Ikhlas", "The Sincerity", "مكية", 4, 604),
        Surah(113, "الفلق", "Al-Falaq", "The Daybreak", "مكية", 5, 604),
        Surah(114, "الناس", "An-Nas", "Mankind", "مكية", 6, 604)
    )

    fun getSurahByNumber(number: Int): Surah? {
        return surahs.find { it.number == number }
    }

    suspend fun getAyahsForSurah(surahNumber: Int, reciterId: String = "alafasy"): List<Ayah> = withContext(Dispatchers.Default) {
        val reciter = reciters.find { it.id == reciterId } ?: reciters.first()
        val surah = getSurahByNumber(surahNumber) ?: return@withContext emptyList()
        val rawAyahs = QuranStaticData.getAyahsForSurah(surahNumber)
        
        rawAyahs.map { item ->
            val formattedSurah = String.format("%03d", surahNumber)
            val formattedAyah = String.format("%03d", item.numberInSurah)
            val audioUrl = "${reciter.serverPath}${formattedSurah}${formattedAyah}.mp3"
            item.copy(audioUrl = audioUrl)
        }
    }

    fun getAyahOfTheDay(): Ayah {
        return QuranStaticData.ayahOfTheDay
    }

    fun searchQuran(query: String): List<Ayah> {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) return emptyList()
        return QuranStaticData.search(trimmed)
    }
}
