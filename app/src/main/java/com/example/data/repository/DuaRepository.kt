package com.example.data.repository

import com.example.data.model.DailyReminder
import com.example.data.model.DuaCategory
import com.example.data.model.DuaItem

class DuaRepository {

    val categories = listOf(
        DuaCategory("rizq", "أدعية الرزق والبركة", "Provision & Sustenance", "rizq"),
        DuaCategory("parents", "بر الوالدين", "Parents & Family", "parents"),
        DuaCategory("relief", "تفريج الهم والكرب", "Relief & Anxiety", "relief"),
        DuaCategory("healing", "الشفاء والعافية", "Healing & Health", "healing"),
        DuaCategory("forgiveness", "طلب المغفرة والرحمة", "Forgiveness & Mercy", "forgiveness"),
        DuaCategory("success", "التوفيق والدراسة والعمل", "Success & Work", "success"),
        DuaCategory("friday", "أدعية يوم الجمعة", "Friday Supplications", "friday"),
        DuaCategory("ramadan", "أدعية رمضان والصيام", "Ramadan & Fasting", "ramadan")
    )

    private val allDuas = listOf(
        DuaItem(
            id = "d1",
            categoryId = "rizq",
            titleArabic = "سؤال الرزق الحلال والبركة",
            titleEnglish = "Seeking Halal Provision",
            textArabic = "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
            textEnglish = "O Allah, I ask You for beneficial knowledge, good (halal) provision, and deeds that are accepted.",
            source = "سنن ابن ماجه"
        ),
        DuaItem(
            id = "d2",
            categoryId = "rizq",
            titleArabic = "دعاء سداد الدين والغنى عن الناس",
            titleEnglish = "Relief from Debt & Need",
            textArabic = "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.",
            textEnglish = "O Allah! Suffice me with what You have allowed instead of what You have forbidden, and enrich me with Your bounty instead of anyone else.",
            source = "سنن الترمذي"
        ),
        DuaItem(
            id = "d3",
            categoryId = "parents",
            titleArabic = "دعاء قرآني للوالدين",
            titleEnglish = "Quranic Prayer for Parents",
            textArabic = "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا.",
            textEnglish = "My Lord, forgive me and my parents and have mercy upon them as they brought me up [when I was] small.",
            source = "سورة الإسراء: 24"
        ),
        DuaItem(
            id = "d4",
            categoryId = "relief",
            titleArabic = "دعاء تفريج الكرب الشديد",
            titleEnglish = "Relief from Severe Distress",
            textArabic = "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.",
            textEnglish = "None has the right to be worshipped except Allah, the Great, the Forebearing...",
            source = "صحيح البخاري ومسلم"
        ),
        DuaItem(
            id = "d5",
            categoryId = "relief",
            titleArabic = "دعاء الاستعاذة من الهم والحزن",
            titleEnglish = "Protection from Grief & Worry",
            textArabic = "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.",
            textEnglish = "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness...",
            source = "صحيح البخاري"
        ),
        DuaItem(
            id = "d6",
            categoryId = "healing",
            titleArabic = "دعاء عيادة المريض وسؤال الشفاء",
            titleEnglish = "Prayer for Healing & Recovery",
            textArabic = "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا.",
            textEnglish = "O Allah, Lord of mankind, remove the hardship, heal, You are the Healer...",
            source = "صحيح البخاري"
        ),
        DuaItem(
            id = "d7",
            categoryId = "success",
            titleArabic = "دعاء تيسير الأمور الصعبة",
            titleEnglish = "Prayer for Making Matters Easy",
            textArabic = "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا.",
            textEnglish = "O Allah, there is no ease except that which You make easy, and indeed You make difficulties easy if You will.",
            source = "صحيح ابن حبان"
        ),
        DuaItem(
            id = "d8",
            categoryId = "friday",
            titleArabic = "دعاء ساعة الإجابة يوم الجمعة",
            titleEnglish = "Friday Hour of Response",
            textArabic = "اللَّهُمَّ يَا حَيُّ يَا قَيُّومُ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، أَسْأَلُكَ فِي هَذِهِ السَّاعَةِ الْمُبَارَكَةِ أَنْ تَفْتَحَ لَنَا أَبْوَابَ رَحْمَتِكَ، وَتَغْفِرَ لَنَا ذُنُوبَنَا، وَتُعْطِيَنَا سُؤْلَنَا فِي دِينِنَا وَدُنْيَانَا.",
            textEnglish = "O Ever-Living, O Sustainer, O Possessor of Majesty and Honor, I ask You at this blessed hour to open for us the gates of Your mercy...",
            source = "مأثور الجمعة"
        )
    )

    fun getDuasForCategory(categoryId: String): List<DuaItem> {
        return allDuas.filter { it.categoryId == categoryId }
    }

    fun searchDuas(query: String): List<DuaItem> {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) return allDuas
        return allDuas.filter {
            it.titleArabic.contains(trimmed) || it.textArabic.contains(trimmed) || it.titleEnglish.contains(trimmed, ignoreCase = true)
        }
    }

    fun getDailyReminders(): List<DailyReminder> {
        return listOf(
            DailyReminder(
                id = "rem_1",
                categoryAr = "حديث نبوي شريف",
                categoryEn = "Prophetic Hadith",
                textArabic = "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ، أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ: «كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ».",
                textEnglish = "Two words are light on the tongue, heavy in the balance, beloved to the Most Merciful: Subhan Allahi wa bihamdihi, Subhan Allahil Azeem.",
                sourceArabic = "صحيح البخاري ومسلم",
                sourceEnglish = "Sahih al-Bukhari & Muslim"
            ),
            DailyReminder(
                id = "rem_2",
                categoryAr = "حكمة وإشراقة إيمانية",
                categoryEn = "Spiritual Wisdom",
                textArabic = "«احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ».",
                textEnglish = "Be mindful of Allah, and He will protect you. Be mindful of Allah, and you will find Him in front of you. If you ask, ask Allah...",
                sourceArabic = "سنن الترمذي - حديث صحيح",
                sourceEnglish = "Jami' at-Tirmidhi"
            ),
            DailyReminder(
                id = "rem_3",
                categoryAr = "آية كريمة",
                categoryEn = "Quranic Ayah",
                textArabic = "﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾",
                textEnglish = "Unquestionably, by the remembrance of Allah hearts are assured.",
                sourceArabic = "سورة الرعد: 28",
                sourceEnglish = "Surah Ar-Ra'd: 28"
            )
        )
    }
}
