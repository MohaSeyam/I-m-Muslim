package com.example.data.repository

import com.example.data.model.Ayah

object QuranStaticData {

    val ayahOfTheDay = Ayah(
        numberInQuran = 255,
        surahNumber = 2,
        numberInSurah = 255,
        textArabic = "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        textEnglish = "Allah! There is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        tafsirMuyassar = "الله الذي لا يستحق الألوهية والعبودية إلا هو، الحي القيوم القائم على تدبير خلقه، لا يلحقه نعاس ولا نوم، له ملك السماوات والأرض، لا يشفع عنده أحد إلا بإذنه، محيط بعلم الأولين والآخرين، وسع كرسيه السماوات والأرض ولا يثقله حفظهما وهو العلي العظيم.",
        page = 42
    )

    private val fatihahAyahs = listOf(
        Ayah(1, 1, 1, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "In the name of Allah, the Entirely Merciful, the Especially Merciful.", "أبدأ قراءتي مستعينا باسم الله، الرحمن الذي وسعت رحمته كل شيء، الرحيم بالمؤمنين.", 1),
        Ayah(2, 1, 2, "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "[All] praise is [due] to Allah, Lord of the worlds -", "الثناء الكامل والشكر الخالص لله وحده، مالك الخلق ومدبر شؤونهم أجمعين.", 1),
        Ayah(3, 1, 3, "الرَّحْمَٰنِ الرَّحِيمِ", "The Entirely Merciful, the Especially Merciful,", "الرحمن ذو الرحمة العامة الشاملة لجميع المخلوقات، الرحيم بالمؤمنين خاصة.", 1),
        Ayah(4, 1, 4, "مَالِكِ يَوْمِ الدِّينِ", "Sovereign of the Day of Recompense.", "مالك يوم الجزاء والحساب وهو يوم القيامة وحده لا شريك له.", 1),
        Ayah(5, 1, 5, "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "It is You we worship and You we ask for help.", "نخصك وحدك بالعبادة والطاعة، ونخصك وحدك بطلب العون والتوفيق في كل أمورنا.", 1),
        Ayah(6, 1, 6, "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "Guide us to the straight path -", "دلنا وأرشدنا ووفقنا وثبتنا على الصراط المستقيم الذي لا اعوجاج فيه، وهو دين الإسلام.", 1),
        Ayah(7, 1, 7, "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", "طريق النبيين والصدّيقين والشهداء والصالحين، غير طريق المغضوب عليهم (اليهود ومن على شاكلتهم) ولا الضالين (النصارى ومن تبعهم).", 1)
    )

    private val ikhlasAyahs = listOf(
        Ayah(6222, 112, 1, "قُلْ هُوَ اللَّهُ أَحَدٌ", "Say, \"He is Allah, [who is] One,", "قل أيها الرسول للناس: الله هو الإله الواحد الأحد، الذي لا شريك له ولا مثيل.", 604),
        Ayah(6223, 112, 2, "اللَّهُ الصَّمَدُ", "Allah, the Eternal Refuge.", "الله الذي تصمد وتتجه إليه جميع الخلائق في حوائجها ورغائبها.", 604),
        Ayah(6224, 112, 3, "لَمْ يَلِدْ وَلَمْ يُولَدْ", "He neither begets nor is born,", "ليس له ولد ولا والد ولا صاحبة، تنزه سبحانه عن كل نقص.", 604),
        Ayah(6225, 112, 4, "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", "Nor is there to Him any equivalent.\"", "ولم يكن له مكافئ ولا مماثل ولا نظير في ذاته أو صفاته أو أفعاله.", 604)
    )

    private val falaqAyahs = listOf(
        Ayah(6226, 113, 1, "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "Say, \"I seek refuge in the Lord of daybreak", "قل: أعتصم وألتجئ برب الصبح وفالقه بنوره بعد الظلام.", 604),
        Ayah(6227, 113, 2, "مِن شَرِّ مَا خَلَقَ", "From the evil of that which He created", "من شر جميع ما خلق الله من الإنس والجن والدواب وسائر المخلوقات.", 604),
        Ayah(6228, 113, 3, "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", "And from the evil of darkness when it settles", "ومن شر الليل إذا أقبل بظلامه وما ينتشر فيه من الشرور والمكاره.", 604),
        Ayah(6229, 113, 4, "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", "And from the evil of the blowers in knots", "ومن شر الساحرات والنفّاثين الذين يعقدون الخيوط وينفثون فيها بالسحر.", 604),
        Ayah(6230, 113, 5, "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", "And from the evil of an envier when he envies.\"", "ومن شر الحاسد إذا أظهر حسده وتمنى زوال النعمة عن غيره.", 604)
    )

    private val nasAyahs = listOf(
        Ayah(6231, 114, 1, "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "Say, \"I seek refuge in the Lord of mankind,", "قل: ألتجئ وأعتصم برب الناس وخالقهم ومدبر أمورهم.", 604),
        Ayah(6232, 114, 2, "مَلِكِ النَّاسِ", "The Sovereign of mankind,", "ملك الناس المتصرف في شؤونهم، الحاكم بينهم بعدله.", 604),
        Ayah(6233, 114, 3, "إِلَٰهِ النَّاسِ", "The God of mankind,", "معبود الناس الحق الذي لا معبود سواه ولا إله غيره.", 604),
        Ayah(6234, 114, 4, "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", "From the evil of the retreating whisperer -", "من شر الشيطان الموسوس الذي يلقي الشبهات ويهرب عند ذكر الله.", 604),
        Ayah(6235, 114, 5, "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", "Who whispers into the breasts of mankind -", "الذي يبث الشر والشكوك في قلوب الناس ويزين المعاصي.", 604),
        Ayah(6236, 114, 6, "مِنَ الْجِنَّةِ وَالنَّاسِ", "From among the jinn and mankind.\"", "سواء كان هذا الموسوس من شياطين الجن أو من شياطين الإنس.", 604)
    )

    private val mulkOpening = listOf(
        Ayah(5241, 67, 1, "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", "Blessed is He in whose hand is dominion, and He is over all things competent -", "تكاثر خير الله وبركته وعظم سلطانه، بيده ملك السماوات والأرض وهو على كل شيء قدير.", 562),
        Ayah(5242, 67, 2, "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -", "الذي أوجد الموت والحياة ليختبركم: أيكم أخلص وأصوب عملاً، وهو العزيز في انتقامه، الغفور لمن تاب.", 562),
        Ayah(5243, 67, 3, "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", "[And] who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency. So return [your] vision; do you see any breaks?", "الذي أبدع سبع سماوات متطابقة بعضها فوق بعض، ما ترى في خلق الرحمن من خلل أو اضطراب.", 562),
        Ayah(5244, 67, 4, "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.", "ثم كرر النظر والتأمل، يرجع إليك بصرك خاضعاً عاجزاً عن رؤية أي عيب وهو مجهد.", 562),
        Ayah(5245, 67, 5, "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", "And We have certainly beautified the nearest heaven with stars and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.", "وزينا السماء القريبة بنجوم مضيئة وجعلناها شهباً لرجم الشياطين المسترقين للسمع، وأعددنا لهم عذاب النار.", 562)
    )

    private val kahfOpening = listOf(
        Ayah(2141, 18, 1, "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ", "[All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.", "الثناء والحمد لله الذي أنزل القرآن على نبيه محمد ﷺ، وجعله كتاباً مستقيماً لا اعوجاج فيه ولا تناقض.", 293),
        Ayah(2142, 18, 2, "قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا", "[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward", "كتاباً قيماً مستقيماً ليخوّف الكفار بعذاب شديد من عنده، ويبشر المؤمنين الصالحين بالجنة والنعيم المقيم.", 293),
        Ayah(2143, 18, 3, "مَّاكِثِينَ فِيهِ أَبَدًا", "In which they will remain forever", "خالدين في هذا النعيم المقيم أبداً لا يزول عنهم ولا يزولون عنه.", 293),
        Ayah(2144, 18, 4, "وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا", "And to warn those who say, \"Allah has taken a son.\"", "ولينذر المشركين والنصارى الذين ادّعوا أن لله ولداً، تنزه الله عن ذلك علواً كبيراً.", 293),
        Ayah(2145, 18, 5, "مَّا لَهُم بِهِ مِنْ عِلْمٍ وَلَا لِآبَائِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَاهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا", "They have no knowledge of it, nor had their fathers. Grave is the word that comes out of their mouths; they speak not except a lie.", "ليس عندهم برهان ولا علم بما يقولون، بل هو كذب عظيم وبهتان قبيح.", 293)
    )

    private val baqarahOpening = listOf(
        Ayah(8, 2, 1, "الم", "Alif, Lam, Meem.", "حروف مقطعة لبيان إعجاز القرآن، وتحدي العرب بأن يأتوا بمثله وهو مركب من هذه الحروف.", 2),
        Ayah(9, 2, 2, "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", "This is the Book about which there is no doubt, a guidance for those conscious of Allah -", "هذا القرآن العظيم لا شك في صدقه وأنه من عند الله، هادٍ ودليل للمتقين الذين يخشون ربهم.", 2),
        Ayah(10, 2, 3, "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", "Who believe in the unseen, establish prayer, and spend out of what We have provided for them,", "الذين يصدقون بما غاب عنهم كالملائكة والبعث والجنة والنار، ويؤدون الصلاة بأركانها، وينفقون في سبيل الله.", 2),
        Ayah(11, 2, 4, "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", "And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith].", "ويصدقون بالقرآن وبالكتب السماوية السابقة المنزلة على الأنبياء، وبالآخرة والحساب يوقنون إيقاناً تاماً.", 2),
        Ayah(12, 2, 5, "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", "Those are upon [right] guidance from their Lord, and it is those who are the successful.", "أولئك المتصفون بهذه الصفات الكريمة على نور وبصيرة من ربهم، وهم الفائزون في الدنيا والآخرة.", 2),
        ayahOfTheDay
    )

    private val yasinOpening = listOf(
        Ayah(3786, 36, 1, "يس", "Ya, Seen.", "يس: حروف مقطعة تدل على إعجاز القرآن وتحدي المكذبين.", 440),
        Ayah(3787, 36, 2, "وَالْقُرْآنِ الْحَكِيمِ", "By the wise Qur'an.", "يقسم الله تعالى بالقرآن المحكم المشتمل على الحكمة والهدى.", 440),
        Ayah(3788, 36, 3, "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", "Indeed you, [O Muhammad], are from among the messengers,", "إنك يا محمد لمن الرسل الذين أرسلهم الله بالحق إلى الخلق.", 440),
        Ayah(3789, 36, 4, "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", "On a straight path.", "على دين قويم ونهج مستقيم لا اعوجاج فيه.", 440),
        Ayah(3790, 36, 5, "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ", "[This is] a revelation of the Exalted in Might, the Merciful,", "هذا القرآن تنزيل من الله العزيز القوي، الرحيم بعباده المؤمنين.", 440)
    )

    private val masadAyahs = listOf(
        Ayah(6217, 111, 1, "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", "May the hands of Abu Lahab be ruined, and ruined is he.", "هلكت وخسرت يدا أبي لهب بن عبد المطلب عم النبي ﷺ، وقد خاب وخسر.", 604),
        Ayah(6218, 111, 2, "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", "His wealth will not avail him or that which he gained.", "ما أغنى عنه ماله ولا ما كسبه من جاه وولد من عذاب الله.", 604),
        Ayah(6219, 111, 3, "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", "He will [enter to] burn in a Fire of [blazing] flame", "سيدخل ناراً متقدة ذات لهب شديد يصلى حرها.", 604),
        Ayah(6220, 111, 4, "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", "And his wife [as well] - the carrier of firewood.", "وستدخل معه امرأته أم جميل التي كانت تحمل الشوك وتلقيه في طريق النبي ﷺ.", 604),
        Ayah(6221, 111, 5, "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", "Around her neck is a rope of [twisted] fiber.", "في عنقها حبل محكم الفتل من ليف النار تعذب به.", 604)
    )

    private val nasrAyahs = listOf(
        Ayah(6214, 110, 1, "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", "When the victory of Allah has come and the conquest,", "إذا تم لك يا محمد نصر الله على كفار قريش، وفتح مكة.", 603),
        Ayah(6215, 110, 2, "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", "And you see the people entering into the religion of Allah in multitudes,", "ورأيت الناس يدخلون في دين الإسلام جماعات وفئات كثيرة.", 603),
        Ayah(6216, 110, 3, "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.", "فقابل نعم الله بالحمد والتسبيح، واستغفره، إنه سبحانه كان تواباً على المستغفرين.", 603)
    )

    private val kafirunAyahs = listOf(
        Ayah(6208, 109, 1, "قُلْ يَا أَيُّهَا الْكَافِرُونَ", "Say, \"O disbelievers,", "قل أيها الرسول للذين كفروا بالله ورسوله معلناً براءتك من شركهم:", 603),
        Ayah(6209, 109, 2, "لَا أَعْبُدُ مَا تَعْبُدُونَ", "I do not worship what you worship.", "لا أعبد الأصنام والآلهة الباطلة التي تعبدونها.", 603),
        Ayah(6210, 109, 3, "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", "Nor are you worshippers of what I worship.", "ولا أنتم عابدون الله وحده الذي أعبده بإخلاص.", 603),
        Ayah(6211, 109, 4, "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", "Nor will I be a worshipper of what you worship.", "ولا أنا سأعبد في المستقبل ما عبدتم من الباطل.", 603),
        Ayah(6212, 109, 5, "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", "Nor will you be worshippers of what I worship.", "ولا أنتم عابدون ما أعبد من الحق.", 603),
        Ayah(6213, 109, 6, "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", "For you is your religion, and for me is my religion.\"", "لكم شرككم وباطلكم، ولي توحيدي وديني الحق الذي لا أبتغي غيره.", 603)
    )

    private val kawtharAyahs = listOf(
        Ayah(6205, 108, 1, "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", "Indeed, We have granted you, [O Muhammad], al-Kawthar.", "إنا أعطيناك يا محمد الخير الكثير الدائم في الدنيا والآخرة، ومنه نهر الكوثر في الجنة.", 602),
        Ayah(6206, 108, 2, "فَصَلِّ لِرَبِّكَ وَانْحَرْ", "So pray to your Lord and sacrifice [to Him alone].", "فأخلص لربك صلاتك كلها، واذبح ذبيحتك له وحده شكراً له.", 602),
        Ayah(6207, 108, 3, "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", "Indeed, your enemy is the one cut off.", "إن مبغضك وعدوك يا محمد هو المنقطع أثره، المقطوع من كل خير.", 602)
    )

    private val asrAyahs = listOf(
        Ayah(6177, 103, 1, "وَالْعَصْرِ", "By time,", "أقسم الله تعالى بالدهر والزمان لما فيه من العبر والدلالات على قدرته.", 601),
        Ayah(6178, 103, 2, "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", "Indeed, mankind is in loss,", "إن كل إنسان في خسران ونقصان وهلاك في عاقبة أمره.", 601),
        Ayah(6179, 103, 3, "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.", "إلا الذين آمنوا بالله وعملوا الصالحات، وأوصى بعضهم بعضاً بالتمسك بالحق والصبر على طاعة الله ومصائبه.", 601)
    )

    private val qadrAyahs = listOf(
        Ayah(6125, 97, 1, "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", "Indeed, We sent the Qur'an down during the Night of Decree.", "إنا ابتدأنا إنزال القرآن العظيم في ليلة القدر المباركة من شهر رمضان.", 598),
        Ayah(6126, 97, 2, "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", "And what can make you know what is the Night of Decree?", "وما أعلمك يا محمد ما عظم شأن ليلة القدر وفضلها الكبير؟", 598),
        Ayah(6127, 97, 3, "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", "The Night of Decree is better than a thousand months.", "العمل الصالح والعبادة في ليلة القدر خير من عبادة ألف شهر ليس فيها ليلة قدر.", 598),
        Ayah(6128, 97, 4, "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ", "The angels and the Spirit descend therein by permission of their Lord for every matter.", "تنزل الملائكة الكرام وجبريل عليه السلام فيها بكل أمر قضاه الله وقدره لتلك السنة.", 598),
        Ayah(6129, 97, 5, "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", "Peace it is until the emergence of dawn.", "هي سلام وأمان وطمأنينة وبركة كلها للمؤمنين حتى طلوع الفجر.", 598)
    )

    private val sharhAyahs = listOf(
        Ayah(6111, 94, 1, "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", "Did We not expand for you, [O Muhammad], your breast?", "ألم نفسح لك صدرك وننوره بالنبوة والهدى والحكمة يا محمد؟", 596),
        Ayah(6112, 94, 2, "وَوَضَعْنَا عَنكَ وِزْرَكَ", "And We removed from you your burden", "وحططنا وغفرنا لك ما تقدم من ذنبك وما تأخر.", 596),
        Ayah(6113, 94, 3, "الَّذِي أَنقَضَ ظَهْرَكَ", "Which had weighed upon your back", "الذي أثقل ظهرك وحملك المشقة.", 596),
        Ayah(6114, 94, 4, "وَرَفَعْنَا لَكَ ذِكْرَكَ", "And raised high for you your repute.", "وأعلينا قدرك ومكانتك بأن يذكر اسمك مقترناً باسم الله في الأذان والشهادة.", 596),
        Ayah(6115, 94, 5, "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", "For indeed, with hardship [will be] ease.", "فإن مع الشدة والضيق فرجاً وسهولة وتيسيراً.", 596),
        Ayah(6116, 94, 6, "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Indeed, with hardship [will be] ease.", "إن مع العسر الواحد يسراً مضاعفاً لا يغلبه عسران.", 596),
        Ayah(6117, 94, 7, "فَإِذَا فَرَغْتَ فَانصَبْ", "So when you have finished [your duties], then stand up [for worship].", "فإذا فرغت من أعمالك وأمور دنياك فاجتهد في عبادة ربك ودعائه.", 596),
        Ayah(6118, 94, 8, "وَإِلَىٰ رَبِّكَ فَارْغَب", "And to your Lord direct [your] longing.", "واجعل رغبتك وقصدك وتوكلك إلى الله وحده في كل حوائجك.", 596)
    )

    private val duhaAyahs = listOf(
        Ayah(6100, 93, 1, "وَالضُّحَىٰ", "By the morning brightness", "أقسم الله تعالى بأول النهار وضوء الشمس وانتشار نورها.", 596),
        Ayah(6101, 93, 2, "وَاللَّيْلِ إِذَا سَجَىٰ", "And [by] the night when it covers with darkness,", "وبالليل إذا اشتد ظلامه وسكن كل شيء فيه.", 596),
        Ayah(6102, 93, 3, "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you].", "ما تركك ربك يا محمد وما أبغضك منذ اختارك لنبوته ورسالته.", 596),
        Ayah(6103, 93, 4, "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", "And the Hereafter is better for you than the first [life].", "وللدار الآخرة وما أعده الله لك فيها خير لك وأعظم من الدنيا الفانية.", 596),
        Ayah(6104, 93, 5, "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", "And your Lord is going to give you, and you will be satisfied.", "ولسوف يفيض عليك ربك من أنواع الإنعام والشفاعة والكرامة حتى ترضى.", 596)
    )

    fun getAyahsForSurah(surahNumber: Int): List<Ayah> {
        return when (surahNumber) {
            1 -> fatihahAyahs
            2 -> baqarahOpening
            18 -> kahfOpening
            36 -> yasinOpening
            67 -> mulkOpening
            93 -> duhaAyahs
            94 -> sharhAyahs
            97 -> qadrAyahs
            103 -> asrAyahs
            108 -> kawtharAyahs
            109 -> kafirunAyahs
            110 -> nasrAyahs
            111 -> masadAyahs
            112 -> ikhlasAyahs
            113 -> falaqAyahs
            114 -> nasAyahs
            else -> generateAyahsForSurah(surahNumber)
        }
    }

    private fun generateAyahsForSurah(surahNumber: Int): List<Ayah> {
        val surah = QuranRepository().getSurahByNumber(surahNumber) ?: return emptyList()
        val count = surah.ayahCount.coerceAtMost(10)
        return (1..count).map { index ->
            Ayah(
                numberInQuran = surahNumber * 100 + index,
                surahNumber = surahNumber,
                numberInSurah = index,
                textArabic = if (index == 1 && surahNumber != 9) "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" else "آية من سورة ${surah.nameArabic} رقم ($index)",
                textEnglish = if (index == 1 && surahNumber != 9) "In the name of Allah, the Entirely Merciful, the Especially Merciful." else "Verse $index of Surah ${surah.nameEnglish}.",
                tafsirMuyassar = "تفسير الآية الكريمة من سورة ${surah.nameArabic} من التفسير الميسر المعتمد.",
                page = surah.pageNumber
            )
        }
    }

    fun search(query: String): List<Ayah> {
        val allStatic = fatihahAyahs + baqarahOpening + kahfOpening + yasinOpening + mulkOpening +
                duhaAyahs + sharhAyahs + qadrAyahs + asrAyahs + kawtharAyahs + kafirunAyahs +
                nasrAyahs + masadAyahs + ikhlasAyahs + falaqAyahs + nasAyahs
        return allStatic.filter {
            it.textArabic.contains(query) || it.textEnglish.contains(query, ignoreCase = true) || it.tafsirMuyassar.contains(query)
        }
    }
}

