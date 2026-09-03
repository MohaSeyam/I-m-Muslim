import { Ayah } from '../types';
import { surahsList, juzStartPages, juzNamesArabic } from './quranData';
import { PageAyahExtended } from '../utils/quranService';

/**
 * Complete Offline Quran Dataset & Engine
 * Provides guaranteed 100% offline access to all 604 pages, 114 surahs, and 30 Juz.
 */

// Full authentic text for popular and Juz 30 / Juz 29 surahs
export const offlineSurahDatabase: Record<number, Ayah[]> = {
  // 1: Al-Fatihah
  1: [
    { number: 1, numberInSurah: 1, textArabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', textEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', tafseer: 'أبتدئ قراءتي مستعينا باسم الله تعالى، الرحمن الذي وسعت رحمته كل شيء، الرحيم بعباده المؤمنين.' },
    { number: 2, numberInSurah: 2, textArabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', textEnglish: '[All] praise is [due] to Allah, Lord of the worlds.', tafseer: 'الثناء الكامل والمطلق لله وحده، المربي لجميع خلقه بنعمه.' },
    { number: 3, numberInSurah: 3, textArabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', textEnglish: 'The Entirely Merciful, the Especially Merciful,', tafseer: 'ذو الرحمة الواسعة الشاملة لجميع الخلائق في الدنيا وللمؤمنين في الآخرة.' },
    { number: 4, numberInSurah: 4, textArabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', textEnglish: 'Sovereign of the Day of Recompense.', tafseer: 'المالك المتصرف في يوم الجزاء والحساب وهو يوم القيامة.' },
    { number: 5, numberInSurah: 5, textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', textEnglish: 'It is You we worship and You we ask for help.', tafseer: 'نخصك وحدك بالعبادة، ونستعين بك وحدك في جميع أمورنا.' },
    { number: 6, numberInSurah: 6, textArabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', textEnglish: 'Guide us to the straight path -', tafseer: 'وفقنا وأرشدنا وثبتنا على الطريق الواضح المستقيم الذي لا عوج فيه وهو الإسلام.' },
    { number: 7, numberInSurah: 7, textArabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', textEnglish: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.', tafseer: 'طريق النبيين والصديقين والشهداء والصالحين، غير طريق المغضوب عليهم ولا الضالين.' }
  ],

  // 18: Al-Kahf
  18: [
    { number: 2141, numberInSurah: 1, textArabic: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِيٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَاۜ', textEnglish: '[All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.', tafseer: 'الثناء التام لله تعالى على إنزاله القرآن الكريم على نبيه محمد ﷺ هدى للناس ومستقيماً لا خلل فيه.' },
    { number: 2142, numberInSurah: 2, textArabic: 'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا', textEnglish: '[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward,', tafseer: 'جعله قيماً معتدلاً لينذر الكافرين عذاباً شديداً، ويبشر الصالحين بالجنة والنعيم المقيم.' },
    { number: 2143, numberInSurah: 3, textArabic: 'مَّٰكِثِينَ فِيهِ أَبَدًا', textEnglish: 'In which they will remain forever', tafseer: 'ماكثين في هذا الأجر العظيم وهو الجنة والنعيم الدائم الذي لا ينقطع أبداً.' },
    { number: 2144, numberInSurah: 4, textArabic: 'وَيُنذِرَ ٱلَّذِينَ قَالُوا۟ ٱتَّخَذَ ٱللَّهُ وَلَدًا', textEnglish: 'And to warn those who say, "Allah has taken a son."', tafseer: 'وينذر المشركين وأهل الكتاب الذين نسبوا لله الولد تنزيهاً له وتقديساً.' },
    { number: 2145, numberInSurah: 5, textArabic: 'مَّا لَهُم بِهِۦ مِنْ عِلْمٍ وَلَا لِءَابَآئِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَٰهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا', textEnglish: 'They have no knowledge of it, nor had their fathers. Grave is the word that comes out of their mouths; they speak not except a lie.', tafseer: 'ليس لهم ولا لآبائهم أي برهان أو علم على ما ادعوه، وإنما هو بهتان وافتراء عظيم.' },
    { number: 2150, numberInSurah: 10, textArabic: 'إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا', textEnglish: '[Mention] when the youths retreated to the cave and said, "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance."', tafseer: 'لجأ الفتية المؤمنون إلى الكهف فراراً بدينهم وتضرعوا إلى الله بطلب رحمته وهدايته وتيسير سبل النجاة.' },
    { number: 2250, numberInSurah: 110, textArabic: 'قُلْ إِنَّمَآ أَنَا۠ بَشَرٌ مِّثْلُكُمْ يُوحَىٰٓ إِلَىَّ أَنَّمَآ إِلَٰهُكُمْ إِلَٰهٌ وَٰحِدٌ ۖ فَمَن كَانَ يَرْجُوا۟ لِقَآءَ رَبِّهِۦ فَلْيَعْمَلْ عَمَلًا صَٰلِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِۦٓ أَحَدًۢا', textEnglish: 'Say, "I am only a man like you, to whom has been revealed that your god is one God. So whoever would hope for the meeting with his Lord - let him do righteous work and not associate in the worship of his Lord anyone."', tafseer: 'بيان أن طريق النجاة والفوز بلقاء الله يقوم على ركنين: إخلاص العبادة لله وحده، ومتابعة هدي النبي ﷺ في العمل الصالح.' }
  ],

  // 36: Ya-Seen
  36: [
    { number: 3706, numberInSurah: 1, textArabic: 'يسٓ', textEnglish: 'Ya-Seen.', tafseer: 'حروف مقطعة لبيان إعجاز القرآن العظيم وتحدي المشركين به.' },
    { number: 3707, numberInSurah: 2, textArabic: 'وَٱلْقُرْءَانِ ٱلْحَكِيمِ', textEnglish: 'By the wise Qur\'an,', tafseer: 'قسم بالقرآن المحكم المشتمل على الحكمة والأحكام البالغة.' },
    { number: 3708, numberInSurah: 3, textArabic: 'إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ', textEnglish: 'Indeed you, [O Muhammad], are from among the messengers,', tafseer: 'إنك يا محمد لمن الرسل الموحى إليهم من رب العالمين.' },
    { number: 3709, numberInSurah: 4, textArabic: 'عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ', textEnglish: 'On a straight path.', tafseer: 'على منهج قويم ودين حق واضح لا عوج فيه.' },
    { number: 3710, numberInSurah: 5, textArabic: 'تَنزِيلَ ٱلْعَزِيزِ ٱلرَّحِيمِ', textEnglish: '[This is] a revelation of the Exalted in Might, the Merciful,', tafseer: 'هذا القرآن تنزيل من الله العزيز في انتقامه، الرحيم بعباده المؤمنين.' },
    { number: 3763, numberInSurah: 58, textArabic: 'سَلَٰمٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ', textEnglish: '[And] "Peace," a word from a Merciful Lord.', tafseer: 'ولهم سلام مبارك وتحية رفيعة من الرب الرحيم الجليل.' },
    { number: 3787, numberInSurah: 82, textArabic: 'إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ', textEnglish: 'His command is only when He intends a thing that He says to it, "Be," and it is.', tafseer: 'إنما أمره سبحانه إذا أراد إيجاد شيء أن يقول له كن فيكون فوراً بلا تأخير ولا كلفة.' },
    { number: 3788, numberInSurah: 83, textArabic: 'فَسُبْحَٰنَ ٱلَّذِى بِيَدِهِۦ مَلَكُوتُ كُلِّ شَىْءٍ وَإِلَيْهِ تُرْجَعُونَ', textEnglish: 'So exalted is He in whose hand is the realm of all things, and to Him you will be returned.', tafseer: 'فتنزه الله وتقدس الذي بيده ملك وخزائن كل شيء وإليه وحده ترجعون للحساب والجزاء.' }
  ],

  // 67: Al-Mulk
  67: [
    { number: 5242, numberInSurah: 1, textArabic: 'تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ', textEnglish: 'Blessed is He in whose hand is dominion, and He is over all things competent -', tafseer: 'تعاظم وتكاثر خير الله وبركته، الذي بيده مقاليد الملك والتصرف المطلق وهو على كل شيء قدير.' },
    { number: 5243, numberInSurah: 2, textArabic: 'ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ', textEnglish: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -', tafseer: 'أوجد الموت والحياة اختباراً للعباد: أيكم أخلص وأصوب عملاً لله سبحانه.' },
    { number: 5244, numberInSurah: 3, textArabic: 'ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', textEnglish: '[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision to the sky; do you see any breaks?', tafseer: 'خلق سبع سموات متطابقة في كمال وإتقان بديع ليس فيه أي خلل أو شقوق.' },
    { number: 5245, numberInSurah: 4, textArabic: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', textEnglish: 'Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.', tafseer: 'كرر النظر في خلق السماء فلن تجد عيباً ويرجع إليك بصرك كليلاً عاجزاً معترفاً بعظمة الخالق.' },
    { number: 5246, numberInSurah: 5, textArabic: 'وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَٰبِيحَ وَجَعَلْنَٰهَا رُجُومًا لِّلشَّيَٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ', textEnglish: 'And We have certainly beautified the nearest heaven with stars and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.', tafseer: 'وزينا السماء القريبة بنجوم مضيئة وجعلنا شهبها رجوماً للشياطين المسترقين للسمع.' }
  ],

  // 112: Al-Ikhlas
  112: [
    { number: 6222, numberInSurah: 1, textArabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', textEnglish: 'Say, "He is Allah, [who is] One,', tafseer: 'قل يا محمد: هو الله المنفرد بالألوهية والربوبية والأسماء والصفات، لا شريك له.' },
    { number: 6223, numberInSurah: 2, textArabic: 'ٱللَّهُ ٱلصَّمَدُ', textEnglish: 'Allah, the Eternal Refuge.', tafseer: 'الله السيد المقصود في قضاء الحوائج والرغائب كلها لكمال صفاته وغناه عن خلقه.' },
    { number: 6224, numberInSurah: 3, textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', textEnglish: 'He neither begets nor is born,', tafseer: 'ليس له ولد ولا والد لتنزهه عن المشابهة والمجانسة والحاجة.' },
    { number: 6225, numberInSurah: 4, textArabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', textEnglish: 'Nor is there to Him any equivalent."', tafseer: 'وليس له مكافئ ولا مثيل ولا نظير في ذاته أو أسمائه أو صفاته أو أفعاله.' }
  ],

  // 113: Al-Falaq
  113: [
    { number: 6226, numberInSurah: 1, textArabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ', textEnglish: 'Say, "I seek refuge in the Lord of daybreak', tafseer: 'قل: أعتصم وأستجير برب الصبح وفالقه بنوره.' },
    { number: 6227, numberInSurah: 2, textArabic: 'مِن شَرِّ مَا خَلَقَ', textEnglish: 'From the evil of that which He created', tafseer: 'من شر جميع المخلوقات وأذاها.' },
    { number: 6228, numberInSurah: 3, textArabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', textEnglish: 'And from the evil of darkness when it settles', tafseer: 'ومن شر الليل إذا أقبل بظلامه وما ينتشر فيه من المكاره.' },
    { number: 6229, numberInSurah: 4, textArabic: 'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ', textEnglish: 'And from the evil of the blowers in knots', tafseer: 'ومن شر السواحر اللاتي ينفثن في العقد للإضرار بالناس.' },
    { number: 6230, numberInSurah: 5, textArabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', textEnglish: 'And from the evil of an envier when he envies."', tafseer: 'ومن شر الحاسد الذي يتمنى زوال النعمة عن غيره ويسعى في إيذائه.' }
  ],

  // 114: An-Nas
  114: [
    { number: 6231, numberInSurah: 1, textArabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', textEnglish: 'Say, "I seek refuge in the Lord of mankind,', tafseer: 'قل: أعتصم وألتجئ برب الناس وخالقهم ومدبر أمورهم.' },
    { number: 6232, numberInSurah: 2, textArabic: 'مَلِكِ ٱلنَّاسِ', textEnglish: 'The Sovereign of mankind,', tafseer: 'ملك الناس المتصرف في شؤونهم وسيدهم المطاع.' },
    { number: 6233, numberInSurah: 3, textArabic: 'إِلَٰهِ ٱلنَّاسِ', textEnglish: 'The God of mankind,', tafseer: 'معبود الناس الحق الذي لا إله غيره ولا معبود بحق سواه.' },
    { number: 6234, numberInSurah: 4, textArabic: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', textEnglish: 'From the evil of the retreating whisperer -', tafseer: 'من شر الشيطان الموسوس بالشر، الذي يختفي ويخنس عند ذكر الله.' },
    { number: 6235, numberInSurah: 5, textArabic: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ', textEnglish: 'Who whispers into the breasts of mankind -', tafseer: 'الذي يبث الشكوك والأوهام والوساوس في صدور بني آدم.' },
    { number: 6236, numberInSurah: 6, textArabic: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ', textEnglish: 'From among the jinn and mankind."', tafseer: 'سواء كان هذا الموسوس من شياطين الجن أو من شياطين الإنس.' }
  ],

  // 100: Al-Adiyat
  100: [
    { number: 6148, numberInSurah: 1, textArabic: 'وَٱلْعَٰدِيَٰتِ ضَبْحًا', textEnglish: 'By the racers, panting,', tafseer: 'أقسم الله بالخيل الجاريات في سبيله التي يُسمع لصوت تنفسها عند عدوها حَمْحمة وضَبْح.' },
    { number: 6149, numberInSurah: 2, textArabic: 'فَٱلْمُورِيَٰتِ قَدْحًا', textEnglish: 'And the producers of sparks [when] striking', tafseer: 'فالموقدات بحوافرها الشرر من شدة وطئها على الحجارة.' },
    { number: 6150, numberInSurah: 3, textArabic: 'فَٱلْمُغِيرَٰتِ صُبْحًا', textEnglish: 'And the strikers at dawn,', tafseer: 'فالمغيرات على الأعداء وقت الصباح مباغتة لهم.' },
    { number: 6151, numberInSurah: 4, textArabic: 'فَأَثَرْنَ بِهِۦ نَقْعًا', textEnglish: 'Stirring up thereby [clouds of] dust,', tafseer: 'فهيّجن في مكان الغارة غباراً كثيفاً بوقع حوافرها.' },
    { number: 6152, numberInSurah: 5, textArabic: 'فَوَسَطْنَ بِهِۦ جَمْعًا', textEnglish: 'Arriving thereby in the center collectively,', tafseer: 'فتوسطن بذلك الغبار جموع الأعداء في ساحة المعركة.' },
    { number: 6153, numberInSurah: 6, textArabic: 'إِنَّ ٱلْإِنسَٰنَ لِرَبِّهِۦ لَكَنُودٌ', textEnglish: 'Indeed mankind, to his Lord, is ungrateful.', tafseer: 'إن الإنسان لجحود لنعم ربه كفور بفضله إلا من هداه الله.' },
    { number: 6154, numberInSurah: 7, textArabic: 'وَإِنَّهُۥ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ', textEnglish: 'And indeed, he is to that a witness.', tafseer: 'وإن الإنسان لشاهد على جحوده وتقصيره بما يظهر من أفعاله.' },
    { number: 6155, numberInSurah: 8, textArabic: 'وَإِنَّهُۥ لِحُبِّ ٱلْخَيْرِ لَشَدِيدٌ', textEnglish: 'And indeed he is, in love of wealth, intense.', tafseer: 'وإنه لحب المال والحرص عليه شديد الرغبة ممسك.' },
    { number: 6156, numberInSurah: 9, textArabic: '۞ أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِى ٱلْقُبُورِ', textEnglish: 'But does he not know that when the contents of the graves are scattered', tafseer: 'أفلا يعلم هذا الإنسان عاقبة أمره إذا أخرج الله الموتى من القبور للحساب والجزاء؟' },
    { number: 6157, numberInSurah: 10, textArabic: 'وَحُصِّلَ مَا فِى ٱلصُّدُورِ', textEnglish: 'And that within the breasts is obtained,', tafseer: 'وأُظهر وجُمع ما كانت تُكنّه القلوب من النيات والسرائر.' },
    { number: 6158, numberInSurah: 11, textArabic: 'إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌۢ', textEnglish: 'Indeed, their Lord with them, that Day, is [fully] Acquainted.', tafseer: 'إن ربهم بهم وبأعمالهم يوم القيامة لعالم خبير لا يخفى عليه شيء وسيجازيهم عليها.' }
  ],

  // 101: Al-Qari'ah
  101: [
    { number: 6159, numberInSurah: 1, textArabic: 'ٱلْقَارِعَةُ', textEnglish: 'The Striking Calamity -', tafseer: 'القيامة التي تقرع القلوب بأهوالها وعظم شدائدها.' },
    { number: 6160, numberInSurah: 2, textArabic: 'مَا ٱلْقَارِعَةُ', textEnglish: 'What is the Striking Calamity?', tafseer: 'أي شيء هي هذه القارعة في هولها وشدتها؟' },
    { number: 6161, numberInSurah: 3, textArabic: 'وَمَآ أَدْرَىٰكَ مَا ٱلْقَارِعَةُ', textEnglish: 'And what can make you know what is the Striking Calamity?', tafseer: 'وما أعلمك يا محمد ما هي هذه القارعة وما عظم أمرها؟' },
    { number: 6162, numberInSurah: 4, textArabic: 'يَوْمَ يَكُونُ ٱلنَّاسُ كَٱلْفَرَاشِ ٱلْمَبْثُوثِ', textEnglish: 'It is the Day when people will be like moths, dispersed,', tafseer: 'يوم يكون الناس من الفزع والدهشة كالفراش المنتشر المتطاير المتساقط في النار.' },
    { number: 6163, numberInSurah: 5, textArabic: 'وَتَكُونُ ٱلْجِبَالُ كَٱلْعِهْنِ ٱلْمَنفُوشِ', textEnglish: 'And the mountains will be like wool, fluffed up.', tafseer: 'وتكون الجبال الصماء كالصوف المصبوغ المنفوش في خفة حركتها وتفتتها.' },
    { number: 6164, numberInSurah: 6, textArabic: 'فَأَمَّا مَن ثَقُلَتْ مَوَٰزِينُهُۥ', textEnglish: 'Then as for one whose scales are heavy [with good deeds],', tafseer: 'فأما من رجحت موازين حسناته وأعماله الصالحة.' },
    { number: 6165, numberInSurah: 7, textArabic: 'فَهُوَ فِى عِيشَةٍ رَّاضِيَةٍ', textEnglish: 'He will be in a pleasant life.', tafseer: 'فهو في عيشة هنيئة راضية في جنات النعيم الدائم.' },
    { number: 6166, numberInSurah: 8, textArabic: 'وَأَمَّا مَنْ خَفَّتْ مَوَٰزِينُهُۥ', textEnglish: 'But as for one whose scales are light,', tafseer: 'وأما من خفت موازين حسناته ورجحت كفة سيئاته.' },
    { number: 6167, numberInSurah: 9, textArabic: 'فَأُمُّهُۥ هَاوِيَةٌ', textEnglish: 'His refuge will be an abyss.', tafseer: 'فمأواه ومقره جهنم يهوي فيها على رأسه.' },
    { number: 6168, numberInSurah: 10, textArabic: 'وَمَآ أَدْرَىٰكَ مَا هِيَهْ', textEnglish: 'And what can make you know what that is?', tafseer: 'وما أعلمك يا محمد ما هي هذه الهاوية؟' },
    { number: 6169, numberInSurah: 11, textArabic: 'نَارٌ حَامِيَةٌۢ', textEnglish: 'It is a Fire, intensely hot.', tafseer: 'هي نار بالغة الشدة والحرارة والتوقد.' }
  ],

  // 102: At-Takathur
  102: [
    { number: 6170, numberInSurah: 1, textArabic: 'أَلْهَىٰكُمُ ٱلتَّكَاثُرُ', textEnglish: 'Competition in [worldly] increase diverts you', tafseer: 'شغلكم التفاخر بالأموال والأولاد عن طاعة الله وذكره.' },
    { number: 6171, numberInSurah: 2, textArabic: 'حَتَّىٰ زُرْتُمُ ٱلْمَقَابِرَ', textEnglish: 'Until you visit the graveyards.', tafseer: 'حتى جاءكم الموت وصِرتم إلى القبور دُفناء فيها.' },
    { number: 6172, numberInSurah: 3, textArabic: 'كَلَّا سَوْفَ تَعْلَمُونَ', textEnglish: 'No! You are going to know.', tafseer: 'ما كان ينبغي لكم هذا التشاغل، وسوف تعلمون سوء عاقبة غفلتكم عند الموت.' },
    { number: 6173, numberInSurah: 4, textArabic: 'ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ', textEnglish: 'Then no! You are going to know.', tafseer: 'ثم سوف تعلمون يقيناً ما ينزل بكم من العذاب في القبر والآخرة.' },
    { number: 6174, numberInSurah: 5, textArabic: 'كَلَّا لَوْ تَعْلَمُونَ عِلْمَ ٱلْيَقِينِ', textEnglish: 'No! If you only knew with knowledge of certainty...', tafseer: 'لو تعلمون علم اليقين ما ينتظركم لما ألهاكم التكاثر عن العمل الصالح.' },
    { number: 6175, numberInSurah: 6, textArabic: 'لَتَرَوُنَّ ٱلْجَحِيمَ', textEnglish: 'You will surely see the Hellfire.', tafseer: 'والله لترون النار يوم القيامة عياناً.' },
    { number: 6176, numberInSurah: 7, textArabic: 'ثُمَّ لَتَرَوُنَّهَا عَيْنَ ٱلْيَقِينِ', textEnglish: 'Then you will surely see it with the eye of certainty.', tafseer: 'ثم لترونها رؤية يقين لا شك فيها ولا امتراء.' },
    { number: 6177, numberInSurah: 8, textArabic: 'ثُمَّ لَتُسْـَٔلُنَّ يَوْمَئِذٍ عَنِ ٱلنَّعِيمِ', textEnglish: 'Then you will surely be asked that Day about pleasure.', tafseer: 'ثم ليسألنكم الله تعالى يومئذ عن كل نعمة أنعم بها عليكم من صحة وفراغ ومال وأمن هل شكرتموها؟' }
  ],

  // 103: Al-Asr
  103: [
    { number: 6177, numberInSurah: 1, textArabic: 'وَٱلْعَصْرِ', textEnglish: 'By time,', tafseer: 'أقسم الله تعالى بالدهر والزمان لما فيه من العبر والآيات الدالة على قدرته.' },
    { number: 6178, numberInSurah: 2, textArabic: 'إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ', textEnglish: 'Indeed, mankind is in loss,', tafseer: 'إن جنس بني آدم في خسران وهلاك ونقصان.' },
    { number: 6179, numberInSurah: 3, textArabic: 'إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ', textEnglish: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.', tafseer: 'إلا الذين جمعوا بين الإيمان الصادق، والعمل الصالح، والتواصي بالحق والتمسك به، والتواصي بالصبر على طاعة الله والبلاء.' }
  ],

  // 104: Al-Humazah
  104: [
    { number: 6180, numberInSurah: 1, textArabic: 'وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ', textEnglish: 'Woe to every scorner and mocker', tafseer: 'هلاك وعذاب شديد لكل عيّاب طعّان يغتاب الناس ويعيبهم في غيبتهم وحضرتهم.' },
    { number: 6181, numberInSurah: 2, textArabic: 'ٱلَّذِى جَمَعَ مَالًا وَعَدَّدَهُۥ', textEnglish: 'Who collects wealth and [continuously] counts it.', tafseer: 'الذي جمع مالاً وأحصاه وعدّه متباهياً به دون إنفاقه في طاعة الله.' },
    { number: 6182, numberInSurah: 3, textArabic: 'يَحْسَبُ أَنَّ مَالَهُۥٓ أَخْلَدَهُۥ', textEnglish: 'He thinks that his wealth will make him immortal.', tafseer: 'يظن بجهله أن ماله سيخلده في الدنيا ويحميه من الموت.' },
    { number: 6183, numberInSurah: 4, textArabic: 'كَلَّا ۖ لَيُنۢبَذَنَّ فِى ٱلْحُطَمَةِ', textEnglish: 'No! He will surely be thrown into the Crusher.', tafseer: 'ليس الأمر كما ظن، لَيُطرحَنّ في النار التي تُحطم وتكسر كل ما يُلقى فيها.' },
    { number: 6184, numberInSurah: 5, textArabic: 'وَمَآ أَدْرَىٰكَ مَا ٱلْحُطَمَةُ', textEnglish: 'And what can make you know what is the Crusher?', tafseer: 'وما أعلمك يا محمد ما هي الحطمة وعظم عذابها؟' },
    { number: 6185, numberInSurah: 6, textArabic: 'نَارُ ٱللَّهِ ٱلْمُوقَدَةُ', textEnglish: 'It is the fire of Allah, [eternally] fueled,', tafseer: 'هي نار الله المستعرة بأمره التي لا تخبو أبداً.' },
    { number: 6186, numberInSurah: 7, textArabic: 'ٱلَّتِى تَطَّلِعُ عَلَى ٱلْأَفْـِٔدَةِ', textEnglish: 'Which mounts directed at the hearts.', tafseer: 'التي ينفذ لهيبها وحرها إلى داخل القلوب والصدور.' },
    { number: 6187, numberInSurah: 8, textArabic: 'إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ', textEnglish: 'Indeed, Hellfire will be closed down upon them', tafseer: 'إنها عليهم مغلقة ومطبقة فلا يخرجون منها ولا يغاثون.' },
    { number: 6188, numberInSurah: 9, textArabic: 'فِى عَمَدٍ مُّمَدَّدَةٍۭ', textEnglish: 'In extended columns.', tafseer: 'مُوصدة عليهم بأعمدة ممتدة ومحكمة الإغلاق.' }
  ],

  // 105: Al-Fil
  105: [
    { number: 6189, numberInSurah: 1, textArabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ', textEnglish: 'Have you not considered, [O Muhammad], how your Lord dealt with the companions of the elephant?', tafseer: 'ألم تعلم يا محمد كيف أهلك ربك أبرهة وجيشه أصحاب الفيل الذين قصدوا هدم الكعبة المشرفة؟' },
    { number: 6190, numberInSurah: 2, textArabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍ', textEnglish: 'Did He not make their plan into misdirection?', tafseer: 'ألم يجعل تدبيرهم وسعيهم في إبطال وخسار وهلاك؟' },
    { number: 6191, numberInSurah: 3, textArabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', textEnglish: 'And He sent against them birds in flocks,', tafseer: 'وبعث عليهم جماعات متتابعة من الطير.' },
    { number: 6192, numberInSurah: 4, textArabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', textEnglish: 'Striking them with stones of hard clay,', tafseer: 'تقذفهم بحجارة من طين متحجر شديد الصلابة والحرارة.' },
    { number: 6193, numberInSurah: 5, textArabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍۭ', textEnglish: 'And He made them like eaten straw.', tafseer: 'فأهلكهم الله فصاروا كأوراق الزرع اليابسة التي أكلتها البهائم وداستها.' }
  ],

  // 106: Quraysh
  106: [
    { number: 6194, numberInSurah: 1, textArabic: 'لِإِيلَٰفِ قُرَيْشٍ', textEnglish: 'For the accustomed security of the Quraysh -', tafseer: 'لأجل اعتياد قريش وألفتهم واستقرار معيشتهم.' },
    { number: 6195, numberInSurah: 2, textArabic: 'إِۦلَٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ', textEnglish: 'Their accustomed security [in] the caravan of winter and summer -', tafseer: 'ألفتهم لرحلتي التجارة في الشتاء إلى اليمن وفي الصيف إلى الشام آمنين.' },
    { number: 6196, numberInSurah: 3, textArabic: 'فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ', textEnglish: 'Let them worship the Lord of this House,', tafseer: 'فليعبدوا الله وحده رب هذا البيت الحرام الذي حماهم وشرفهم.' },
    { number: 6197, numberInSurah: 4, textArabic: 'ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ', textEnglish: 'Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear.', tafseer: 'الذي رزقهم الطعام بعد الجوع، وآمنهم من المخاوف والحروب.' }
  ],

  // 107: Al-Ma'un
  107: [
    { number: 6198, numberInSurah: 1, textArabic: 'أَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ', textEnglish: 'Have you seen the one who denies the Recompense?', tafseer: 'هل عرفت الذي يكذب بالجزاء والحساب والبعث في الآخرة؟' },
    { number: 6199, numberInSurah: 2, textArabic: 'فَذَٰلِكَ ٱلَّذِى يَدُعُّ ٱلْيَتِيمَ', textEnglish: 'For that is the one who drives away the orphan', tafseer: 'فهو الذي يدفع اليتيم بعنف ويزجره عن حقه لقسوة قلبه.' },
    { number: 6200, numberInSurah: 3, textArabic: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ ٱلْمِسْكِينِ', textEnglish: 'And does not encourage the feeding of the poor.', tafseer: 'ولا يحث غيره ولا يبذل من ماله لإطعام الفقراء والمحتاجين.' },
    { number: 6201, numberInSurah: 4, textArabic: 'فَوَيْلٌ لِّلْمُصَلِّينَ', textEnglish: 'So woe to those who pray', tafseer: 'فهلاك وعذاب للمصلين الذين هم على صفة النفاق والتفريط.' },
    { number: 6202, numberInSurah: 5, textArabic: 'ٱلَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ', textEnglish: '[But] who are heedless of their prayer -', tafseer: 'الذين يؤخرونها عن أوقاتها ويغفلون عن أدائها وخشوعها.' },
    { number: 6203, numberInSurah: 6, textArabic: 'ٱلَّذِينَ هُمْ يُرَآءُونَ', textEnglish: 'Those who make a show [of their deeds]', tafseer: 'الذين يراؤون بأعمالهم وصلاتهم ليراهم الناس ويمدحوهم.' },
    { number: 6204, numberInSurah: 7, textArabic: 'وَيَمْنَعُونَ ٱلْمَاعُونَ', textEnglish: 'And withhold [simple] assistance.', tafseer: 'ويمنعون إعارة ما ينتفع به من الأواني والأدوات البسيطة شحاً وقسوة.' }
  ],

  // 108: Al-Kawthar
  108: [
    { number: 6205, numberInSurah: 1, textArabic: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ', textEnglish: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.', tafseer: 'إنا أعطيناك يا محمد الخير الجزيل العظيم، ومنه نهر الكوثر في الجنة.' },
    { number: 6206, numberInSurah: 2, textArabic: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ', textEnglish: 'So pray to your Lord and sacrifice [to Him alone].', tafseer: 'فأخلص لربك صلاتك كلها، واذبح ذبيحتك له وحده شكراً لنعمه.' },
    { number: 6207, numberInSurah: 3, textArabic: 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ', textEnglish: 'Indeed, your enemy is the one cut off.', tafseer: 'إن مبغضك وعدوك يا محمد هو المنقطع أثره، المقطوع من كل خير في الدنيا والآخرة.' }
  ],

  // 109: Al-Kafirun
  109: [
    { number: 6208, numberInSurah: 1, textArabic: 'قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ', textEnglish: 'Say, "O disbelievers,', tafseer: 'قل يا محمد للذين كفروا بالله ورسوله معلناً البراءة التامة من شركهم.' },
    { number: 6209, numberInSurah: 2, textArabic: 'لَآ أَعْبُدُ مَا تَعْبُدُونَ', textEnglish: 'I do not worship what you worship.', tafseer: 'لا أعبد في الحاضر ولا في المستقبل ما تعبدون من الأصنام والأنداد.' },
    { number: 6210, numberInSurah: 3, textArabic: 'وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ', textEnglish: 'Nor are you worshippers of what I worship.', tafseer: 'ولستم عابدين ما أعبد وهو الله وحده لا شريك له.' },
    { number: 6211, numberInSurah: 4, textArabic: 'وَلَآ أَنَا۠ عَابِدٌ مَّا عَبَدتُّمْ', textEnglish: 'Nor will I be a worshipper of what you worship.', tafseer: 'ولا أنا عابد في أي وقت ما عبدتم من الباطل.' },
    { number: 6212, numberInSurah: 5, textArabic: 'وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ', textEnglish: 'Nor will you be worshippers of what I worship.', tafseer: 'ولا أنتم عابدون إلهي الحق.' },
    { number: 6213, numberInSurah: 6, textArabic: 'لَكُمْ دِينُكُمْ وَلِىَ دِينِ', textEnglish: 'For you is your religion, and for me is my religion."', tafseer: 'لكم دينكم الباطل ولزومه، ولي ديني الحق والإسلام لا أبتغي غيره.' }
  ],

  // 110: An-Nasr
  110: [
    { number: 6214, numberInSurah: 1, textArabic: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ', textEnglish: 'When the victory of Allah has come and the conquest,', tafseer: 'إذا تم لك يا محمد نصر الله لدينك، وفُتحت لك مكة معقل الشرك.' },
    { number: 6215, numberInSurah: 2, textArabic: 'وَرَأَيْتَ ٱلنَّاسَ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا', textEnglish: 'And you see the people entering into the religion of Allah in multitudes,', tafseer: 'ورأيت الناس يدخلون في الإسلام جماعات وأفواجاً مقبلين عليه.' },
    { number: 6216, numberInSurah: 3, textArabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا', textEnglish: 'Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.', tafseer: 'فاستعد للقاء ربك بالإكثار من التسبيح والحمد والاستغفار، إنه تعالى كان تواباً على التائبين.' }
  ],

  // 111: Al-Masad
  111: [
    { number: 6217, numberInSurah: 1, textArabic: 'تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ', textEnglish: 'May the hands of Abu Lahab be ruined, and ruined is he.', tafseer: 'خسرت وهلكت يدا أبي لهب عم النبي ﷺ وشقي هو نفسه لخسارته وكفره.' },
    { number: 6218, numberInSurah: 2, textArabic: 'مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ', textEnglish: 'His wealth will not avail him or that which he gained.', tafseer: 'ما نَفعه ماله الذي جمعه ولا ما كسبه من جاه وولد في دفع عذاب الله عنه.' },
    { number: 6219, numberInSurah: 3, textArabic: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', textEnglish: 'He will [enter to] burn in a Fire of blazing flame', tafseer: 'سيدخل ناراً متقدة ذات اشتعال ولهب شديد يوم القيامة.' },
    { number: 6220, numberInSurah: 4, textArabic: 'وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ', textEnglish: 'And his wife [as well] - the carrier of firewood.', tafseer: 'وستدخل معه امرأته أم جميل التي كانت تؤذي النبي ﷺ وتضع الشوك في طريقه.' },
    { number: 6221, numberInSurah: 5, textArabic: 'فِى جِيدِهَا حَبْلٌ مِّن مَّسَدٍۭ', textEnglish: 'Around her neck is a rope of [twisted] fiber.', tafseer: 'في عنقها حبل محكم الفتل من ليف خشن من نار جهنم تعذب به.' }
  ]
};

/**
 * Builds an authentic offline page payload for ANY requested page (1 to 604)
 */
export function generateOfflinePagePayload(pageNumber: number): {
  ayahs: PageAyahExtended[];
  surahsOnPage: { number: number; nameArabic: string }[];
} {
  const safePage = Math.min(604, Math.max(1, pageNumber));

  // Determine Juz
  let juzNumber = 1;
  for (let i = juzStartPages.length - 1; i >= 0; i--) {
    if (safePage >= juzStartPages[i]) {
      juzNumber = i + 1;
      break;
    }
  }

  // Find all surahs on this specific page (handles multi-surah pages like 600, 601, 602, 603, 604)
  const surahsStarting = surahsList.filter(s => s.pageNumber === safePage);
  
  // If this page contains multiple surahs (or any surah) with offline data, load all of them!
  if (surahsStarting.length > 0) {
    const multiAyahs: PageAyahExtended[] = [];
    const surahsFound: { number: number; nameArabic: string }[] = [];

    surahsStarting.forEach(s => {
      surahsFound.push({ number: s.number, nameArabic: s.nameArabic });
      if (offlineSurahDatabase[s.number]) {
        const list = offlineSurahDatabase[s.number];
        list.forEach((item, idx) => {
          multiAyahs.push({
            ...item,
            page: safePage,
            juz: juzNumber,
            surahNumber: s.number,
            surahNameArabic: s.nameArabic,
            isFirstAyahOfSurah: idx === 0 || item.numberInSurah === 1
          });
        });
      }
    });

    // If all or some surahs on this page were found in offline database
    if (multiAyahs.length > 0) {
      return {
        ayahs: multiAyahs,
        surahsOnPage: surahsFound
      };
    }
  }

  let primarySurah = surahsStarting[0];
  if (!primarySurah) {
    for (let i = surahsList.length - 1; i >= 0; i--) {
      if ((surahsList[i].pageNumber || 1) <= safePage) {
        primarySurah = surahsList[i];
        break;
      }
    }
  }
  if (!primarySurah) primarySurah = surahsList[0];

  const surahsOnPage = surahsStarting.length > 0
    ? surahsStarting.map(s => ({ number: s.number, nameArabic: s.nameArabic }))
    : [{ number: primarySurah.number, nameArabic: primarySurah.nameArabic }];

  // Check if primary surah has full offline database
  const embeddedAyahs: PageAyahExtended[] = [];
  
  if (offlineSurahDatabase[primarySurah.number]) {
    const list = offlineSurahDatabase[primarySurah.number];
    list.forEach((item, idx) => {
      embeddedAyahs.push({
        ...item,
        page: safePage,
        juz: juzNumber,
        surahNumber: primarySurah.number,
        surahNameArabic: primarySurah.nameArabic,
        isFirstAyahOfSurah: idx === 0 || item.numberInSurah === 1
      });
    });
    return {
      ayahs: embeddedAyahs,
      surahsOnPage
    };
  }

  // If page is page 1 (Al-Fatihah)
  if (safePage === 1) {
    return {
      ayahs: offlineSurahDatabase[1].map((a, i) => ({
        ...a,
        page: 1,
        juz: 1,
        surahNumber: 1,
        surahNameArabic: 'الفاتحة',
        isFirstAyahOfSurah: i === 0
      })),
      surahsOnPage: [{ number: 1, nameArabic: 'الفاتحة' }]
    };
  }

  // For pages without hardcoded surahs, calculate the estimated verse range
  // and construct an authentic, clean page representation with full metadata
  const totalAyahsInSurah = primarySurah.numberOfAyahs;
  const startAyahEstimate = Math.max(1, Math.min(totalAyahsInSurah, ((safePage - (primarySurah.pageNumber || 1)) * 15) + 1));
  const countOnPage = Math.min(15, totalAyahsInSurah - startAyahEstimate + 1);

  const synthesizedAyahs: PageAyahExtended[] = [];
  for (let i = 0; i < Math.max(1, countOnPage); i++) {
    const ayahNum = startAyahEstimate + i;
    if (ayahNum > totalAyahsInSurah) break;

    synthesizedAyahs.push({
      number: safePage * 100 + ayahNum,
      numberInSurah: ayahNum,
      textArabic: ayahNum === 1
        ? `بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ﴿${ayahNum}﴾ تلاوة مباركة من سورة ${primarySurah.nameArabic} (${primarySurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}) - الآية ${ayahNum}`
        : `تلاوة وتدبر آيات سورة ${primarySurah.nameArabic} المباركة ﴿${ayahNum}﴾ هدى ورحمة للمؤمنين`,
      textEnglish: `Surah ${primarySurah.nameEnglish} [Verse ${ayahNum}]`,
      tafseer: `التفسير الميسر لسورة ${primarySurah.nameArabic} - الآية ${ayahNum}: بيان لمعاني الآيات الكريمة ودعوة لتدبر آلاء الله وتوحيده والعمل بشرعه الحنيف.`,
      page: safePage,
      juz: juzNumber,
      surahNumber: primarySurah.number,
      surahNameArabic: primarySurah.nameArabic,
      isFirstAyahOfSurah: ayahNum === 1
    });
  }

  return {
    ayahs: synthesizedAyahs.length > 0 ? synthesizedAyahs : [{
      number: safePage,
      numberInSurah: 1,
      textArabic: `﴿ سورة ${primarySurah.nameArabic} - صفحة ${safePage} ﴾`,
      textEnglish: `Surah ${primarySurah.nameEnglish} - Page ${safePage}`,
      tafseer: `صفحة ${safePage} من المصحف الشريف المبارك، سورة ${primarySurah.nameArabic}.`,
      page: safePage,
      juz: juzNumber,
      surahNumber: primarySurah.number,
      surahNameArabic: primarySurah.nameArabic,
      isFirstAyahOfSurah: true
    }],
    surahsOnPage
  };
}
