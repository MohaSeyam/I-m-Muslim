package com.example.data.repository

import com.example.data.model.DhikrCategory
import com.example.data.model.DhikrItem

class DhikrRepository {

    val categories: List<DhikrCategory> = listOf(
        DhikrCategory(
            id = "morning",
            titleArabic = "أذكار الصباح",
            titleEnglish = "Morning Adhkar",
            subtitleArabic = "صباحك ذكر وطمأنينة 🌿",
            subtitleEnglish = "Start your day with peace & light",
            icon = "morning",
            countItems = 8
        ),
        DhikrCategory(
            id = "evening",
            titleArabic = "أذكار المساء",
            titleEnglish = "Evening Adhkar",
            subtitleArabic = "حصن نفسك عند الغروب 🌇",
            subtitleEnglish = "Protection and peace at sunset",
            icon = "evening",
            countItems = 8
        ),
        DhikrCategory(
            id = "sleep",
            titleArabic = "أذكار النوم",
            titleEnglish = "Before Sleep",
            subtitleArabic = "قبل أن تنام وسكن فؤادك 🌙",
            subtitleEnglish = "Tranquility before sleeping",
            icon = "sleep",
            countItems = 6
        ),
        DhikrCategory(
            id = "after_prayer",
            titleArabic = "أذكار بعد الصلاة",
            titleEnglish = "After Prayer Adhkar",
            subtitleArabic = "استتمام الفريضة بالأذكار المشروعة 🕌",
            subtitleEnglish = "Supplications following obligatory prayer",
            icon = "prayer",
            countItems = 5
        ),
        DhikrCategory(
            id = "salawat",
            titleArabic = "الصلاة على النبي ﷺ",
            titleEnglish = "Salawat on Prophet ﷺ",
            subtitleArabic = "إن الله وملائكته يصلون على النبي 💚",
            subtitleEnglish = "Blessings upon the Messenger of Allah",
            icon = "salawat",
            countItems = 4
        ),
        DhikrCategory(
            id = "istighfar",
            titleArabic = "الاستغفار والتوبة",
            titleEnglish = "Istighfar & Repentance",
            subtitleArabic = "فقلت استغفروا ربكم إنه كان غفارا 🌧️",
            subtitleEnglish = "Seeking forgiveness from the Most Merciful",
            icon = "istighfar",
            countItems = 4
        ),
        DhikrCategory(
            id = "wakeup",
            titleArabic = "أذكار الاستيقاظ",
            titleEnglish = "Waking Up Adhkar",
            subtitleArabic = "الحمد لله الذي أحيانا بعد ما أماتنا ☀️",
            subtitleEnglish = "Gratitude upon waking up",
            icon = "wakeup",
            countItems = 3
        ),
        DhikrCategory(
            id = "mosque",
            titleArabic = "أذكار المسجد",
            titleEnglish = "Mosque Adhkar",
            subtitleArabic = "الدخول والخروج والاعتكاف 🕌",
            subtitleEnglish = "Entering & leaving the mosque",
            icon = "prayer",
            countItems = 3
        ),
        DhikrCategory(
            id = "food",
            titleArabic = "أذكار الطعام والشراب",
            titleEnglish = "Food & Drink Adhkar",
            subtitleArabic = "البركة والحمد بعد النعمة 🍽️",
            subtitleEnglish = "Blessing before & after meals",
            icon = "food",
            countItems = 3
        ),
        DhikrCategory(
            id = "travel",
            titleArabic = "أذكار السفر والخروج",
            titleEnglish = "Travel & Leaving Home",
            subtitleArabic = "سبحان الذي سخر لنا هذا 🚗",
            subtitleEnglish = "Supplications for travel & journey",
            icon = "travel",
            countItems = 4
        )
    )

    private val morningAdhkar = listOf(
        DhikrItem(
            id = "m1",
            categoryId = "morning",
            textArabic = "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
            textEnglish = "We have entered a new morning and the dominion belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone.",
            countTarget = 1,
            rewardArabic = "من قالها حين يصبح حماه الله ووفقه في يومه.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "m2",
            categoryId = "morning",
            textArabic = "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
            textEnglish = "O Allah, You are my Lord, there is none worthy of worship except You. You created me and I am Your servant...",
            countTarget = 1,
            rewardArabic = "سيد الاستغفار: من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة، وكذلك إذا أصبح.",
            source = "صحيح البخاري"
        ),
        DhikrItem(
            id = "m3",
            categoryId = "morning",
            textArabic = "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
            textEnglish = "In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
            countTarget = 3,
            rewardArabic = "من قالها ثلاثاً لم يضره شيء.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "m4",
            categoryId = "morning",
            textArabic = "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.",
            textEnglish = "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.",
            countTarget = 3,
            rewardArabic = "كان حقاً على الله أن يرضيه يوم القيامة.",
            source = "سنن الترمذي"
        ),
        DhikrItem(
            id = "m5",
            categoryId = "morning",
            textArabic = "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
            textEnglish = "Allah is sufficient for me; there is none worthy of worship except Him. In Him I put my trust, and He is Lord of the Mighty Throne.",
            countTarget = 7,
            rewardArabic = "من قالها سبع مرات كفاه الله ما أهمه من أمر الدنيا والآخرة.",
            source = "سنن أبي داود"
        ),
        DhikrItem(
            id = "m6",
            categoryId = "morning",
            textArabic = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.",
            textEnglish = "Glory is to Allah and praise is to Him, by the number of His creation, by His pleasure, by the weight of His Throne, and by the ink of His words.",
            countTarget = 3,
            rewardArabic = "تعدل في الأجر ساعات طويلة من الذكر والتسبيح.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "m7",
            categoryId = "morning",
            textArabic = "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.",
            textEnglish = "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped except You.",
            countTarget = 3,
            rewardArabic = "سؤال العافية والسلامة في الحواس والبدن.",
            source = "سنن أبي داود"
        ),
        DhikrItem(
            id = "m8",
            categoryId = "morning",
            textArabic = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
            textEnglish = "Glory be to Allah and His is the praise.",
            countTarget = 100,
            rewardArabic = "حُطت خطاياه وإن كانت مثل زبد البحر.",
            source = "صحيح البخاري ومسلم"
        )
    )

    private val eveningAdhkar = listOf(
        DhikrItem(
            id = "e1",
            categoryId = "evening",
            textArabic = "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
            textEnglish = "We have entered upon the evening and the kingdom belongs to Allah, all praise is due to Allah...",
            countTarget = 1,
            rewardArabic = "حفظ العبد في ليلته.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "e2",
            categoryId = "evening",
            textArabic = "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
            textEnglish = "I seek refuge in the Perfect Words of Allah from the evil of what He has created.",
            countTarget = 3,
            rewardArabic = "من قالها لم يضره شيء في تلك الليلة.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "e3",
            categoryId = "evening",
            textArabic = "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
            textEnglish = "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and unto You is the final return.",
            countTarget = 1,
            rewardArabic = "تجديد الإيمان والتوكل على الله.",
            source = "سنن الترمذي"
        ),
        DhikrItem(
            id = "e4",
            categoryId = "evening",
            textArabic = "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
            textEnglish = "In the Name of Allah, with Whose Name nothing can cause harm...",
            countTarget = 3,
            rewardArabic = "حماية وحفظ تام من كل سوء ومكروه.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "e5",
            categoryId = "evening",
            textArabic = "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
            textEnglish = "O Ever-Living, O Sustainer, in Your mercy I seek relief; rectify for me all of my affairs and do not leave me to myself even for the blink of an eye.",
            countTarget = 1,
            rewardArabic = "دعاء شامل لطلب التوفيق والإعانة الإلهية.",
            source = "المستدرك للحاكم"
        ),
        DhikrItem(
            id = "e6",
            categoryId = "evening",
            textArabic = "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي.",
            textEnglish = "O Allah, I ask You for pardon and well-being in this world and the next...",
            countTarget = 1,
            rewardArabic = "سؤال الحفظ والأمان والعافية التامة.",
            source = "سنن أبي داود"
        ),
        DhikrItem(
            id = "e7",
            categoryId = "evening",
            textArabic = "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.",
            textEnglish = "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
            countTarget = 3,
            rewardArabic = "رضا الله عز وجل عن العبد يوم القيامة.",
            source = "سنن الترمذي"
        ),
        DhikrItem(
            id = "e8",
            categoryId = "evening",
            textArabic = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
            textEnglish = "Glory be to Allah and His is the praise.",
            countTarget = 100,
            rewardArabic = "تكفير الخطايا ومغفرة الذنوب.",
            source = "صحيح مسلم"
        )
    )

    private val sleepAdhkar = listOf(
        DhikrItem(
            id = "s1",
            categoryId = "sleep",
            textArabic = "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
            textEnglish = "In Your name, my Lord, I lay down my side and in Your name I raise it...",
            countTarget = 1,
            rewardArabic = "حفظ النفس والروح أثناء النوم.",
            source = "صحيح البخاري ومسلم"
        ),
        DhikrItem(
            id = "s2",
            categoryId = "sleep",
            textArabic = "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
            textEnglish = "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
            countTarget = 3,
            rewardArabic = "كان رسول الله ﷺ يقولها ثلاثاً إذا أراد النوم.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "s3",
            categoryId = "sleep",
            textArabic = "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا.",
            textEnglish = "In Your Name, O Allah, I die and I live.",
            countTarget = 1,
            rewardArabic = "تسليم الأمر لله والاستعانة باسمه.",
            source = "صحيح البخاري"
        ),
        DhikrItem(
            id = "s4",
            categoryId = "sleep",
            textArabic = "سُبْحَانَ اللَّهِ (33) ، الْحَمْدُ لِلَّهِ (33) ، اللَّهُ أَكْبَرُ (34)",
            textEnglish = "Subhan Allah (33), Alhamdulillah (33), Allahu Akbar (34)",
            countTarget = 1,
            rewardArabic = "خير للعبد من خادم وتعطي قوة ونشاطاً في البدن.",
            source = "صحيح البخاري ومسلم"
        ),
        DhikrItem(
            id = "s5",
            categoryId = "sleep",
            textArabic = "آية الكرسي (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)",
            textEnglish = "Ayat Al-Kursi (Allah! There is no deity except Him, the Ever-Living...)",
            countTarget = 1,
            rewardArabic = "لا يزال عليك من الله حافظ ولا يقربك شيطان حتى تصبح.",
            source = "صحيح البخاري"
        ),
        DhikrItem(
            id = "s6",
            categoryId = "sleep",
            textArabic = "سورة الإخلاص والمعوذتين (الفلق والناس) مع النفث في الكفين ومسح الجسد.",
            textEnglish = "Surah Al-Ikhlas, Al-Falaq, and An-Nas with cupping hands and wiping the body.",
            countTarget = 3,
            rewardArabic = "سنة المصطفى ﷺ في التحصين قبل النوم.",
            source = "صحيح البخاري"
        )
    )

    private val salawatAdhkar = listOf(
        DhikrItem(
            id = "sal1",
            categoryId = "salawat",
            textArabic = "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.",
            textEnglish = "O Allah, bestow Your blessings upon Muhammad and the family of Muhammad, as You bestowed blessings upon Ibrahim and the family of Ibrahim...",
            countTarget = 10,
            rewardArabic = "الصلاة الإبراهيمية: من صلى عليّ صلاة صلى الله عليه بها عشراً.",
            source = "صحيح البخاري ومسلم"
        ),
        DhikrItem(
            id = "sal2",
            categoryId = "salawat",
            textArabic = "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
            textEnglish = "O Allah, send prayers, peace, and blessings upon our Prophet Muhammad.",
            countTarget = 100,
            rewardArabic = "من صلى عليّ حين يصبح عشراً وحين يمسي عشراً أدركته شفاعتي يوم القيامة.",
            source = "رواه الطبراني وحسنه الألباني"
        ),
        DhikrItem(
            id = "sal3",
            categoryId = "salawat",
            textArabic = "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ.",
            textEnglish = "May Allah send blessings and peace upon him.",
            countTarget = 300,
            rewardArabic = "كفاية الهموم ومغفرة الذنوب ونيل القرب والشفاعة.",
            source = "سنن الترمذي"
        ),
        DhikrItem(
            id = "sal4",
            categoryId = "salawat",
            textArabic = "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا، وَعَافِيَةِ الأَبْدَانِ وَشِفَائِهَا، وَنُورِ الأَبْصَارِ وَضِيَائِهَا، وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ.",
            textEnglish = "O Allah, send blessings upon our Master Muhammad, the medicine of hearts and their cure...",
            countTarget = 50,
            rewardArabic = "صيغة الصلاة المباركة لتفريج الكروب وانشراح الصدر.",
            source = "من صيغ الصالحين المأثورة"
        )
    )

    private val istighfarAdhkar = listOf(
        DhikrItem(
            id = "ist1",
            categoryId = "istighfar",
            textArabic = "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ.",
            textEnglish = "I ask Allah the Great for forgiveness, and I repent unto Him.",
            countTarget = 100,
            rewardArabic = "طوبى لمن وجد في صحيفته استغفاراً كثيراً.",
            source = "سنن ابن ماجه"
        ),
        DhikrItem(
            id = "ist2",
            categoryId = "istighfar",
            textArabic = "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ.",
            textEnglish = "I seek the forgiveness of Allah, other than Whom there is no God, the Ever-Living, the Eternal, and I repent unto Him.",
            countTarget = 33,
            rewardArabic = "غُفرت ذنوبه وإن كان فر من الزحف.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "ist3",
            categoryId = "istighfar",
            textArabic = "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.",
            textEnglish = "My Lord, forgive me and accept my repentance, surely You are the Accepter of Repentance, the Merciful.",
            countTarget = 100,
            rewardArabic = "كان رسول الله ﷺ يعد له في المجلس الواحد مائة مرة.",
            source = "سنن أبي داود"
        ),
        DhikrItem(
            id = "ist4",
            categoryId = "istighfar",
            textArabic = "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.",
            textEnglish = "None has the right to be worshipped except You; exalted are You. Indeed, I have been of the wrongdoers.",
            countTarget = 100,
            rewardArabic = "دعوة ذي النون: لم يدع بها رجل مسلم في شيء قط إلا استجاب الله له.",
            source = "سنن الترمذي"
        )
    )

    private val afterPrayerAdhkar = listOf(
        DhikrItem(
            id = "ap1",
            categoryId = "after_prayer",
            textArabic = "أَسْتَغْفِرُ اللَّهَ (3 مرات) ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
            textEnglish = "I ask Allah for forgiveness (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.",
            countTarget = 3,
            rewardArabic = "سنة رسول الله ﷺ دبر كل صلاة مكتوبة.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "ap2",
            categoryId = "after_prayer",
            textArabic = "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.",
            textEnglish = "None has the right to be worshipped except Allah alone...",
            countTarget = 1,
            rewardArabic = "توحيد خالص بعد الفراغ من الصلاة.",
            source = "صحيح البخاري ومسلم"
        ),
        DhikrItem(
            id = "ap3",
            categoryId = "after_prayer",
            textArabic = "سُبْحَانَ اللَّهِ (33) ، الْحَمْدُ لِلَّهِ (33) ، اللَّهُ أَكْبَرُ (33) ، وتَمَامُ الْمِائَةِ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
            textEnglish = "Subhan Allah (33), Alhamdulillah (33), Allahu Akbar (33), and to complete 100: La ilaha illallah...",
            countTarget = 1,
            rewardArabic = "غُفرت خطاياه وإن كانت مثل زبد البحر.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "ap4",
            categoryId = "after_prayer",
            textArabic = "آية الكرسي: اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
            textEnglish = "Ayat Al-Kursi after every obligatory prayer.",
            countTarget = 1,
            rewardArabic = "من قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت.",
            source = "رواه النسائي وصححه الألباني"
        ),
        DhikrItem(
            id = "ap5",
            categoryId = "after_prayer",
            textArabic = "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.",
            textEnglish = "O Allah, help me to remember You, give thanks to You, and worship You in the best manner.",
            countTarget = 1,
            rewardArabic = "وصية النبي ﷺ لمعاذ بن جبل رضي الله عنه.",
            source = "سنن أبي داود"
        )
    )

    private val wakeupAdhkar = listOf(
        DhikrItem(
            id = "w1",
            categoryId = "wakeup",
            textArabic = "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
            textEnglish = "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
            countTarget = 1,
            rewardArabic = "شكر الله على نعمة الحياة واليقظة.",
            source = "صحيح البخاري"
        ),
        DhikrItem(
            id = "w2",
            categoryId = "wakeup",
            textArabic = "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ.",
            textEnglish = "Praise is to Allah Who gave strength to my body and returned my soul to me and permitted me to remember Him.",
            countTarget = 1,
            rewardArabic = "استشعار نعمة العافية والذكر.",
            source = "سنن الترمذي"
        ),
        DhikrItem(
            id = "w3",
            categoryId = "wakeup",
            textArabic = "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ.",
            textEnglish = "None has the right to be worshipped except Allah alone...",
            countTarget = 1,
            rewardArabic = "من تعارّ من الليل فقالها ثم دعا استجيب له، وإن توضأ وصلى قُبلت صلاته.",
            source = "صحيح البخاري"
        )
    )

    private val mosqueAdhkar = listOf(
        DhikrItem(
            id = "mq1",
            categoryId = "mosque",
            textArabic = "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ (عند دخول المسجد مع تقديم الرجل اليمنى).",
            textEnglish = "O Allah, open the gates of Your mercy for me (upon entering the mosque).",
            countTarget = 1,
            rewardArabic = "طلب أبواب الرحمة والسكينة.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "mq2",
            categoryId = "mosque",
            textArabic = "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ (عند الخروج من المسجد مع تقديم الرجل اليسرى).",
            textEnglish = "O Allah, I ask You from Your bounty (upon leaving the mosque).",
            countTarget = 1,
            rewardArabic = "طلب فضل الله والرزق الحلال بعد العبادة.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "mq3",
            categoryId = "mosque",
            textArabic = "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ.",
            textEnglish = "I seek refuge in Allah the Almighty, by His noble countenance and His primordial authority, from Satan the outcast.",
            countTarget = 1,
            rewardArabic = "من قالها حُفظ من الشيطان سائر يومه.",
            source = "سنن أبي داود"
        )
    )

    private val foodAdhkar = listOf(
        DhikrItem(
            id = "fd1",
            categoryId = "food",
            textArabic = "بِسْمِ اللَّهِ (وإن نسي في أوله فليقل: بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ).",
            textEnglish = "In the Name of Allah (and if forgotten: In the Name of Allah at its beginning and end).",
            countTarget = 1,
            rewardArabic = "حلول البركة في الطعام وحرمان الشيطان منه.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "fd2",
            categoryId = "food",
            textArabic = "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ.",
            textEnglish = "All praise is for Allah who fed me this and provided it for me without any might or power from myself.",
            countTarget = 1,
            rewardArabic = "من قالها بعد طعامه غُفر له ما تقدم من ذنبه.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "fd3",
            categoryId = "food",
            textArabic = "اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ، وَارْحَمْهُمْ (دعاء للضيف ولمن أطعمك).",
            textEnglish = "O Allah, bless them in what You provided them, forgive them, and have mercy upon them.",
            countTarget = 1,
            rewardArabic = "دعاء مستجاب ومحبة وإكرام لمن أطعمك.",
            source = "صحيح مسلم"
        )
    )

    private val travelAdhkar = listOf(
        DhikrItem(
            id = "tr1",
            categoryId = "travel",
            textArabic = "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ (عند الخروج من المنزل).",
            textEnglish = "In the Name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
            countTarget = 1,
            rewardArabic = "يقال له: هُديت وكُفيت ووُقيت، وتنحى عنه الشيطان.",
            source = "سنن أبي داود والترمذي"
        ),
        DhikrItem(
            id = "tr2",
            categoryId = "travel",
            textArabic = "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ.",
            textEnglish = "Glory to Him who has subjected this to us, and we could never have it by ourselves, and to our Lord we shall return.",
            countTarget = 1,
            rewardArabic = "دعاء ركوب الدابة والسيارة ووسائل السفر.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "tr3",
            categoryId = "travel",
            textArabic = "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ.",
            textEnglish = "O Allah, we ask You on this journey of ours for righteousness and piety...",
            countTarget = 1,
            rewardArabic = "تيسير السفر والحفظ في الأهل والمال.",
            source = "صحيح مسلم"
        ),
        DhikrItem(
            id = "tr4",
            categoryId = "travel",
            textArabic = "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ (عند الرجوع من السفر).",
            textEnglish = "We return, repenting, worshipping, and praising our Lord.",
            countTarget = 3,
            rewardArabic = "شكر الله على نعمة العودة سالماً غانماً.",
            source = "صحيح مسلم"
        )
    )

    fun getItemsForCategory(categoryId: String): List<DhikrItem> {
        return when (categoryId) {
            "morning" -> morningAdhkar
            "evening" -> eveningAdhkar
            "sleep" -> sleepAdhkar
            "salawat" -> salawatAdhkar
            "istighfar" -> istighfarAdhkar
            "after_prayer" -> afterPrayerAdhkar
            "wakeup" -> wakeupAdhkar
            "mosque" -> mosqueAdhkar
            "food" -> foodAdhkar
            "travel" -> travelAdhkar
            else -> morningAdhkar
        }
    }

    fun getDhikrOfTheDay(): DhikrItem {
        return DhikrItem(
            id = "daily_dhikr",
            categoryId = "general",
            textArabic = "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
            textEnglish = "There is no power and no strength except with Allah, the Most High, the Most Great.",
            countTarget = 100,
            rewardArabic = "كنز من كنوز الجنة ودواء لتسعة وتسعين داء أيسرها الهم.",
            source = "صحيح البخاري ومسلم"
        )
    }
}
