import React, { useState, useEffect, useRef } from 'react';
import { surahsList, getSurahAyahs } from '../../data/quranData';
import { SurahMeta, Ayah, LastReadPosition, QuranBookmark } from '../../types';
import { fetchFullSurahAyahs } from '../../utils/quranService';
import {
  getQuranLastRead,
  saveQuranLastRead,
  getQuranBookmarks,
  toggleQuranBookmark,
  getQuranFontSize,
  saveQuranFontSize,
  getQuranTafseerFontSize,
  saveQuranTafseerFontSize,
  getQuranLineHeight,
  saveQuranLineHeight,
  getQuranReadingMode,
  saveQuranReadingMode,
  QuranReadingMode,
  DEFAULT_QURAN_FONT_SIZE,
  DEFAULT_TAFSEER_FONT_SIZE,
  DEFAULT_QURAN_LINE_HEIGHT
} from '../../utils/quranStorage';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Info,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Copy,
  Share2,
  BookMarked,
  Eye,
  EyeOff,
  Maximize2,
  Type,
  RotateCcw,
  LayoutList,
  ScrollText,
  Pin
} from 'lucide-react';

interface QuranScreenProps {
  initialSurahNumber?: number;
  initialAyahNumber?: number;
  onNavigate?: (tab: string, subParam?: any) => void;
}

// Arabic diacritics and character normalization helper
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove Tashkeel & Quranic marks
    .replace(/[إأآٱ]/g, 'ا') // Normalize Alef variations
    .replace(/ة/g, 'ه') // Normalize Taa Marboota
    .replace(/ى/g, 'ي') // Normalize Alef Maksura
    .replace(/[\u0660-\u0669]/g, d => (d.charCodeAt(0) - 0x0660).toString()) // Arabic-Indic numerals to 0-9
    .trim()
    .toLowerCase();
}

export const QuranScreen: React.FC<QuranScreenProps> = ({
  initialSurahNumber,
  initialAyahNumber,
  onNavigate
}) => {
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(() => {
    if (initialSurahNumber) {
      return surahsList.find(s => s.number === initialSurahNumber) || null;
    }
    return null;
  });

  const [currentAyahs, setCurrentAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);
  const [readingMode, setReadingMode] = useState<QuranReadingMode>(() => getQuranReadingMode());
  const [selectedAyahInMushaf, setSelectedAyahInMushaf] = useState<Ayah | null>(null);

  const [lastRead, setLastRead] = useState<LastReadPosition | null>(() => getQuranLastRead());
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>(() => getQuranBookmarks());
  const [targetAyahToScroll, setTargetAyahToScroll] = useState<number | null>(initialAyahNumber || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  // Tafsir & Display Controls
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAllTafseer, setShowAllTafseer] = useState(false);
  const [expandedTafseerAyahs, setExpandedTafseerAyahs] = useState<Record<number, boolean>>({});
  const [modalTafseerAyah, setModalTafseerAyah] = useState<Ayah | null>(null);

  // Font Size & Readability Controls
  const [fontSize, setFontSize] = useState<number>(() => getQuranFontSize());
  const [tafseerFontSize, setTafseerFontSize] = useState<number>(() => getQuranTafseerFontSize());
  const [lineHeight, setLineHeight] = useState<number>(() => getQuranLineHeight());
  const [isFontControlOpen, setIsFontControlOpen] = useState<boolean>(false);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [copiedTafseerAyahNumber, setCopiedTafseerAyahNumber] = useState<number | null>(null);

  const ayahRefs = useRef<Record<number, HTMLElement | null>>({});

  // Fetch full ayahs whenever selected surah changes
  useEffect(() => {
    if (!selectedSurah) {
      setCurrentAyahs([]);
      return;
    }

    setIsLoadingAyahs(true);
    // Instant initial load from static data if available
    const initial = getSurahAyahs(selectedSurah.number);
    if (initial.length > 0) {
      setCurrentAyahs(initial);
    }

    fetchFullSurahAyahs(selectedSurah.number, updated => {
      setCurrentAyahs(updated);
    }).then(full => {
      if (full && full.length > 0) {
        setCurrentAyahs(full);
      }
      setIsLoadingAyahs(false);
    });

    setLastRead(getQuranLastRead());
    setBookmarks(getQuranBookmarks());
    setFontSize(getQuranFontSize());
    setTafseerFontSize(getQuranTafseerFontSize());
    setLineHeight(getQuranLineHeight());
  }, [selectedSurah]);

  const handleToggleReadingMode = () => {
    const nextMode: QuranReadingMode = readingMode === 'continuous' ? 'cards' : 'continuous';
    setReadingMode(nextMode);
    saveQuranReadingMode(nextMode);
    setSelectedAyahInMushaf(null);
    showToast(nextMode === 'continuous' ? 'تم التبديل إلى نمط المصحف المتواصل 📜' : 'تم التبديل إلى نمط البطاقات (آية آية) 📑');
  };

  const handleUpdateFontSize = (newSize: number) => {
    setFontSize(newSize);
    saveQuranFontSize(newSize);
  };

  const handleUpdateTafseerFontSize = (newSize: number) => {
    setTafseerFontSize(newSize);
    saveQuranTafseerFontSize(newSize);
  };

  const handleUpdateLineHeight = (newHeight: number) => {
    setLineHeight(newHeight);
    saveQuranLineHeight(newHeight);
  };

  const handleResetFontDefaults = () => {
    setFontSize(DEFAULT_QURAN_FONT_SIZE);
    saveQuranFontSize(DEFAULT_QURAN_FONT_SIZE);
    setTafseerFontSize(DEFAULT_TAFSEER_FONT_SIZE);
    saveQuranTafseerFontSize(DEFAULT_TAFSEER_FONT_SIZE);
    setLineHeight(DEFAULT_QURAN_LINE_HEIGHT);
    saveQuranLineHeight(DEFAULT_QURAN_LINE_HEIGHT);
    showToast('تمت استعادة إعدادات الخط الافتراضية');
  };

  // Scroll to target ayah when entering a surah
  useEffect(() => {
    if (selectedSurah && targetAyahToScroll && currentAyahs.length > 0) {
      const timer = setTimeout(() => {
        const element = ayahRefs.current[targetAyahToScroll];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTargetAyahToScroll(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedSurah, targetAyahToScroll, currentAyahs]);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 2500);
  };

  const handleOpenSurah = (surah: SurahMeta, targetAyah?: number) => {
    setSelectedSurah(surah);
    setExpandedTafseerAyahs({});
    setSelectedAyahInMushaf(null);
    if (targetAyah) {
      setTargetAyahToScroll(targetAyah);
    }
    // Automatically record this surah & ayah as current reading position
    const currentSaved = getQuranLastRead();
    const ayahNum = targetAyah || (currentSaved?.surahNumber === surah.number ? currentSaved.ayahNumberInSurah : 1);

    const newPos: LastReadPosition = {
      surahNumber: surah.number,
      surahNameArabic: surah.nameArabic,
      surahNameEnglish: surah.nameEnglish,
      ayahNumberInSurah: ayahNum,
      timestamp: Date.now()
    };
    saveQuranLastRead(newPos);
    setLastRead(newPos);
  };

  const handleSetLastReadMarker = (ayah: Ayah, surah: SurahMeta) => {
    const newPos: LastReadPosition = {
      surahNumber: surah.number,
      surahNameArabic: surah.nameArabic,
      surahNameEnglish: surah.nameEnglish,
      ayahNumberInSurah: ayah.numberInSurah,
      timestamp: Date.now()
    };
    saveQuranLastRead(newPos);
    setLastRead(newPos);
    showToast(`تم تحديد الآية (${ayah.numberInSurah}) كآخر موضع قراءة 📍`);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleToggleAyahBookmark = (ayah: Ayah, surah: SurahMeta) => {
    const bookmarkItem: QuranBookmark = {
      id: `${surah.number}_${ayah.numberInSurah}`,
      surahNumber: surah.number,
      surahNameArabic: surah.nameArabic,
      surahNameEnglish: surah.nameEnglish,
      ayahNumberInSurah: ayah.numberInSurah,
      ayahTextArabic: ayah.textArabic,
      ayahTextEnglish: ayah.textEnglish,
      tafseer: ayah.tafseer,
      timestamp: Date.now()
    };

    const isAdded = toggleQuranBookmark(bookmarkItem);
    setBookmarks(getQuranBookmarks());

    if (isAdded) {
      showToast(`تمت إضافة الآية (${ayah.numberInSurah}) إلى الإشارات المرجعية 🔖`);
    } else {
      showToast(`تمت إزالة الآية (${ayah.numberInSurah}) من الإشارات المرجعية`);
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }
  };

  const handleToggleSingleTafseer = (ayahNumberInSurah: number) => {
    setExpandedTafseerAyahs(prev => ({
      ...prev,
      [ayahNumberInSurah]: !prev[ayahNumberInSurah]
    }));
  };

  const handleCopyAyah = (ayah: Ayah, surah: SurahMeta) => {
    const text = `﴿${ayah.textArabic}﴾ [سورة ${surah.nameArabic}: ${ayah.numberInSurah}]${
      ayah.textEnglish ? `\n\n"${ayah.textEnglish}"` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedAyahNumber(ayah.numberInSurah);
    showToast(`تم نسخ الآية (${ayah.numberInSurah})`);
    setTimeout(() => setCopiedAyahNumber(null), 2000);
  };

  const handleCopyTafseer = (ayah: Ayah, surah: SurahMeta) => {
    const text = `﴿${ayah.textArabic}﴾\n[سورة ${surah.nameArabic} - الآية ${ayah.numberInSurah}]\n\n📖 التفسير الميسر:\n${ayah.tafseer}`;
    navigator.clipboard.writeText(text);
    setCopiedTafseerAyahNumber(ayah.numberInSurah);
    showToast(`تم نسخ تفسير الآية (${ayah.numberInSurah})`);
    setTimeout(() => setCopiedTafseerAyahNumber(null), 2000);
  };

  const handleResumeReading = () => {
    if (!lastRead) return;
    const surah = surahsList.find(s => s.number === lastRead.surahNumber);
    if (surah) {
      handleOpenSurah(surah, lastRead.ayahNumberInSurah);
    }
  };

  const handleNavigateModalAyah = (direction: 'prev' | 'next') => {
    if (!modalTafseerAyah || !selectedSurah) return;
    const currentIndex = currentAyahs.findIndex(a => a.numberInSurah === modalTafseerAyah.numberInSurah);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setModalTafseerAyah(currentAyahs[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < currentAyahs.length - 1) {
      setModalTafseerAyah(currentAyahs[currentIndex + 1]);
    }
  };

  const filteredSurahs = surahsList.filter(surah => {
    if (revelationFilter !== 'all' && surah.revelationType !== revelationFilter) {
      return false;
    }

    const rawQuery = searchQuery.trim();
    if (!rawQuery) return true;

    const normalizedQuery = normalizeArabic(rawQuery);
    const normalizedNameArabic = normalizeArabic(surah.nameArabic);
    const normalizedNameWithoutAl = normalizeArabic(surah.nameArabic.replace(/^ال/, ''));
    const queryWithoutAl = normalizedQuery.replace(/^ال/, '');

    const numericPart = rawQuery.replace(/[^\d]/g, '');
    const isSurahNumberMatch = numericPart && surah.number === parseInt(numericPart, 10);

    const matchesArabic =
      normalizedNameArabic.includes(normalizedQuery) ||
      normalizedNameWithoutAl.includes(queryWithoutAl) ||
      normalizedNameArabic.includes(queryWithoutAl);

    const matchesEnglish =
      surah.nameEnglish.toLowerCase().includes(rawQuery.toLowerCase()) ||
      surah.englishTranslation.toLowerCase().includes(rawQuery.toLowerCase());

    return isSurahNumberMatch || matchesArabic || matchesEnglish;
  });

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/95 text-emerald-50 px-4 py-2 rounded-2xl shadow-xl border border-emerald-700/50 text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Floating Readability & Font Controls Drawer */}
      {isFontControlOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">تخصيص خط وقراءة القرآن</h3>
                  <p className="text-[11px] text-gray-400">تحكم بحجم الخط وارتفاع الأسطر لراحة القراءة</p>
                </div>
              </div>
              <button
                onClick={() => setIsFontControlOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Sample Preview Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-[#12211c] border border-emerald-200/60 dark:border-emerald-900/60 space-y-1 text-center">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block mb-1">
                معاينة حية للآيات والتفسير:
              </span>
              <p
                className="font-quran text-gray-900 dark:text-gray-100 leading-relaxed select-none"
                style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
              </p>
              <p
                className="text-gray-600 dark:text-gray-300 font-sans pt-2 border-t border-emerald-100 dark:border-gray-800 text-xs"
                style={{ fontSize: `${tafseerFontSize}px` }}
              >
                📖 التفسير: أبتدئ قراءتي مستعيناً باسم الله الرَّحمن الرَّحيم.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                  <span>حجم خط الآيات القرآنية:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="44"
                  step="1"
                  value={fontSize}
                  onChange={e => handleUpdateFontSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                  <span>المسافة بين أسطر المصحف:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{lineHeight}</span>
                </div>
                <input
                  type="range"
                  min="1.8"
                  max="3.4"
                  step="0.1"
                  value={lineHeight}
                  onChange={e => handleUpdateLineHeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                  <span>حجم خط التفسير الميسر:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{tafseerFontSize} px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={tafseerFontSize}
                  onChange={e => handleUpdateTafseerFontSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleResetFontDefaults}
                className="text-xs text-gray-500 hover:text-emerald-600 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                استعادة الافتراضي
              </button>
              <button
                onClick={() => setIsFontControlOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md"
              >
                تم ومتابعة القراءة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detailed Tafseer View */}
      {modalTafseerAyah && selectedSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    تفسير سورة {selectedSurah.nameArabic}
                  </h3>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    الآية رقم ({modalTafseerAyah.numberInSurah})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalTafseerAyah(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-center">
                <p
                  className="font-quran text-gray-900 dark:text-gray-100 leading-loose"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {modalTafseerAyah.textArabic} ﴿{modalTafseerAyah.numberInSurah}﴾
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  بيان المعنى والتفسير الميسر:
                </h4>
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#1a2c24] border border-amber-200/60 dark:border-emerald-800/60 text-gray-800 dark:text-gray-200 leading-relaxed font-sans text-sm">
                  {modalTafseerAyah.tafseer}
                </div>
              </div>

              {modalTafseerAyah.textEnglish && (
                <div className="space-y-1 text-left dir-ltr">
                  <h4 className="text-xs font-bold text-gray-400 font-sans">English Meaning:</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-sans p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    {modalTafseerAyah.textEnglish}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavigateModalAyah('prev')}
                  disabled={modalTafseerAyah.numberInSurah <= 1}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1 font-semibold"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  الآية السابقة
                </button>
                <button
                  onClick={() => handleNavigateModalAyah('next')}
                  disabled={modalTafseerAyah.numberInSurah >= currentAyahs.length}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1 font-semibold"
                >
                  الآية التالية
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleCopyTafseer(modalTafseerAyah, selectedSurah)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                نسخ التفسير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toolbar when an Ayah is selected in Continuous Mushaf Mode */}
      {selectedAyahInMushaf && selectedSurah && readingMode === 'continuous' && (
        <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto bg-white/95 dark:bg-[#15241f]/95 border border-emerald-200 dark:border-emerald-800 shadow-2xl rounded-3xl p-3 backdrop-blur-md animate-scaleUp">
          <div className="flex items-center justify-between text-xs font-bold border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              الآية المحددة: ({selectedAyahInMushaf.numberInSurah})
            </span>
            <button
              onClick={() => setSelectedAyahInMushaf(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => setModalTafseerAyah(selectedAyahInMushaf)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition text-[11px] font-bold gap-1"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>التفسير</span>
            </button>

            <button
              onClick={() => handleToggleAyahBookmark(selectedAyahInMushaf, selectedSurah)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition text-[11px] font-bold gap-1"
            >
              <Bookmark className={`w-4 h-4 ${bookmarks.some(b => b.surahNumber === selectedSurah.number && b.ayahNumberInSurah === selectedAyahInMushaf.numberInSurah) ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>إشارة</span>
            </button>

            <button
              onClick={() => handleSetLastReadMarker(selectedAyahInMushaf, selectedSurah)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition text-[11px] font-bold gap-1"
            >
              <Pin className="w-4 h-4 text-emerald-600" />
              <span>حفظ موضع</span>
            </button>

            <button
              onClick={() => handleCopyAyah(selectedAyahInMushaf, selectedSurah)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition text-[11px] font-bold gap-1"
            >
              <Copy className="w-4 h-4 text-gray-600" />
              <span>نسخ</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Index vs Reader */}
      {!selectedSurah ? (
        <div className="space-y-4">
          {/* Header & Quick Resume Card */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">فهرس القرآن الكريم</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">114 سورة مرتلة ومفسرة بالكامل</p>
            </div>

            {bookmarks.length > 0 && onNavigate && (
              <button
                onClick={() => onNavigate('bookmarks')}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3 py-1.5 rounded-2xl hover:bg-amber-100 transition shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>الإشارات ({bookmarks.length})</span>
              </button>
            )}
          </div>

          {/* Last Read Quick Resume Banner */}
          {lastRead && (
            <div
              onClick={handleResumeReading}
              className="p-4 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-lg flex items-center justify-between cursor-pointer hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
                  <Bookmark className="w-5 h-5 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200 block font-semibold">متابعة القراءة من آخر موضع:</span>
                  <h3 className="font-bold text-sm text-white">
                    سورة {lastRead.surahNameArabic} • الآية {lastRead.ayahNumberInSurah}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl group-hover:bg-white/30 transition">
                متابعة ←
              </span>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم السورة أو رقمها (مثال: الكهف، البقرة، 18)..."
              className="w-full bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Revelation Type Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'جميع السور (114)' },
              { id: 'Meccan', label: 'مكية' },
              { id: 'Medinan', label: 'مدنية' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRevelationFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  revelationFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#15241f] text-gray-600 dark:text-gray-400 border border-emerald-100 dark:border-emerald-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredSurahs.map(surah => {
              const isLastRead = lastRead?.surahNumber === surah.number;
              const hasBookmarkInSurah = bookmarks.some(b => b.surahNumber === surah.number);

              return (
                <div
                  key={surah.number}
                  onClick={() => handleOpenSurah(surah)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isLastRead
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-xs'
                      : 'bg-white dark:bg-[#15241f] border-emerald-100 dark:border-emerald-950 hover:border-emerald-200 dark:hover:border-emerald-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                      {surah.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                          سورة {surah.nameArabic}
                        </h3>
                        {hasBookmarkInSurah && (
                          <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500" />
                        )}
                        {isLastRead && (
                          <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                            موضعك
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {surah.nameEnglish} • {surah.numberOfAyahs} آية • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                      </span>
                    </div>
                  </div>

                  <span className="font-quran text-base text-gray-400 group-hover:text-emerald-600 transition">
                    {surah.nameArabic}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Surah Reader View */
        <div className="space-y-4">
          {/* Reader Top Controls Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2 bg-white dark:bg-[#15241f] p-3 rounded-2xl border border-emerald-100 dark:border-emerald-950 shadow-xs">
            <button
              onClick={() => {
                setSelectedSurah(null);
                setSelectedAyahInMushaf(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:opacity-80 px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
            >
              <ArrowRight className="w-4 h-4" />
              قائمة السور
            </button>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Reading Mode Switcher: Continuous Mushaf vs Cards */}
              <button
                onClick={handleToggleReadingMode}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition ${
                  readingMode === 'continuous'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900'
                }`}
                title="التبديل بين قراءة المصحف المتواصل وبطاقات الآيات"
              >
                {readingMode === 'continuous' ? (
                  <>
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>المصحف المتواصل</span>
                  </>
                ) : (
                  <>
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>بطاقات الآيات</span>
                  </>
                )}
              </button>

              {/* Global Tafseer Toggle Button */}
              <button
                onClick={() => {
                  const nextState = !showAllTafseer;
                  setShowAllTafseer(nextState);
                  showToast(nextState ? 'تم تفعيل عرض التفسير 📖' : 'تم إخفاء التفسير');
                }}
                className={`px-2.5 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition ${
                  showAllTafseer
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100'
                }`}
                title="تبديل عرض التفسير الميسر"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showAllTafseer ? 'إخفاء التفسير' : 'التفسير'}</span>
              </button>

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-2 py-1.5 text-xs rounded-xl font-semibold transition ${
                  showTranslation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
                title="الترجمة الإنجليزية"
              >
                EN
              </button>

              {/* Font Customizer */}
              <button
                onClick={() => setIsFontControlOpen(true)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1 transition shadow-2xs"
                title="تخصيص الخط والمسافات"
              >
                <Type className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>({fontSize}px)</span>
              </button>
            </div>
          </div>

          {/* Surah Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-800 text-white text-center shadow-lg space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {lastRead?.surahNumber === selectedSurah.number && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-bold mb-1">
                <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                الموضع المحفوظ: الآية {lastRead.ayahNumberInSurah}
              </div>
            )}

            <h2 className="text-2xl font-bold font-quran">سورة {selectedSurah.nameArabic}</h2>
            <p className="text-xs text-emerald-200">
              {selectedSurah.nameEnglish} • {selectedSurah.numberOfAyahs} آيات • {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
            </p>
            {selectedSurah.number !== 9 && (
              <p className="font-quran text-xl pt-2 text-emerald-100 tracking-wide select-none">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}
          </div>

          {/* Reading Mode Hint */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>
              {readingMode === 'continuous'
                ? '📜 وضع المصحف المتواصل (انقر على أي آية لعرض تفسيرها أو حفظها)'
                : '📑 وضع البطاقات (آية آية)'}
            </span>
            <button
              onClick={handleToggleReadingMode}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              تبديل النمط
            </button>
          </div>

          {/* ================= MODE 1: CONTINUOUS MUSHAF READING MODE ================= */}
          {readingMode === 'continuous' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-md space-y-4">
              <div
                className="text-justify font-quran text-gray-900 dark:text-gray-100 leading-loose select-text"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight
                }}
              >
                {currentAyahs.map(ayah => {
                  const isSelected = selectedAyahInMushaf?.numberInSurah === ayah.numberInSurah;
                  const isLastRead =
                    lastRead?.surahNumber === selectedSurah.number &&
                    lastRead?.ayahNumberInSurah === ayah.numberInSurah;
                  const isBookmarked = bookmarks.some(
                    b => b.surahNumber === selectedSurah.number && b.ayahNumberInSurah === ayah.numberInSurah
                  );

                  return (
                    <span
                      key={ayah.numberInSurah}
                      ref={el => {
                        ayahRefs.current[ayah.numberInSurah] = el;
                      }}
                      onClick={() => {
                        setSelectedAyahInMushaf(isSelected ? null : ayah);
                      }}
                      className={`inline cursor-pointer px-1 py-0.5 rounded-lg transition-all duration-150 ${
                        isSelected
                          ? 'bg-amber-300/40 dark:bg-amber-600/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400'
                          : isBookmarked
                          ? 'bg-amber-100/40 dark:bg-amber-950/40'
                          : isLastRead
                          ? 'bg-emerald-100/40 dark:bg-emerald-950/40'
                          : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                      }`}
                    >
                      {ayah.textArabic}{' '}
                      <span
                        className={`inline-flex items-center justify-center font-sans font-bold text-xs mx-1 px-1.5 py-0.5 rounded-full select-none ${
                          isSelected
                            ? 'bg-amber-500 text-white scale-110 shadow-xs'
                            : isBookmarked
                            ? 'bg-amber-400/30 text-amber-700 dark:text-amber-300 border border-amber-400/50'
                            : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}
                        title={`آية ${ayah.numberInSurah}`}
                      >
                        ﴿{ayah.numberInSurah}﴾
                      </span>{' '}
                    </span>
                  );
                })}
              </div>

              {/* Show Tafseer list below Mushaf if Global Tafseer is turned on */}
              {showAllTafseer && (
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    التفسير الميسر لسورة {selectedSurah.nameArabic} كاملاً:
                  </h4>
                  <div className="space-y-2">
                    {currentAyahs.map(ayah => (
                      <div
                        key={`taf-${ayah.numberInSurah}`}
                        className="p-3 rounded-2xl bg-amber-50/50 dark:bg-[#1a2c24] border border-amber-200/50 dark:border-emerald-900/50 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300 text-[11px]">
                          <span>الآية ({ayah.numberInSurah}):</span>
                          <button
                            onClick={() => handleCopyTafseer(ayah, selectedSurah)}
                            className="hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> نسخ
                          </button>
                        </div>
                        <p
                          className="text-gray-800 dark:text-gray-200 leading-relaxed font-sans"
                          style={{ fontSize: `${tafseerFontSize}px` }}
                        >
                          {ayah.tafseer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MODE 2: CARD-BY-CARD VIEW ================= */}
          {readingMode === 'cards' && (
            <div className="space-y-3">
              {currentAyahs.map(ayah => {
                const isLastReadAyah =
                  lastRead?.surahNumber === selectedSurah.number &&
                  lastRead?.ayahNumberInSurah === ayah.numberInSurah;

                const isBookmarkedAyah = bookmarks.some(
                  b => b.surahNumber === selectedSurah.number && b.ayahNumberInSurah === ayah.numberInSurah
                );

                const isTafseerVisible = showAllTafseer || !!expandedTafseerAyahs[ayah.numberInSurah];

                return (
                  <div
                    key={ayah.numberInSurah}
                    ref={el => {
                      ayahRefs.current[ayah.numberInSurah] = el;
                    }}
                    className={`p-5 rounded-3xl border transition-all space-y-3 ${
                      isBookmarkedAyah
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-md ring-1 ring-amber-400/40'
                        : isLastReadAyah
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/60 shadow-sm'
                        : 'bg-white dark:bg-[#15241f] border-emerald-100 dark:border-emerald-950 shadow-sm'
                    }`}
                  >
                    {/* Ayah Header info & Action buttons */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5 text-xs text-gray-400 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                          {ayah.numberInSurah}
                        </span>
                        {isBookmarkedAyah && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-300/40">
                            <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> إشارة مرجعية
                          </span>
                        )}
                        {isLastReadAyah && !isBookmarkedAyah && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                            📍 موضع القراءة
                          </span>
                        )}
                      </div>

                      {/* Ayah Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Tafseer Toggle / View Button */}
                        <button
                          onClick={() => handleToggleSingleTafseer(ayah.numberInSurah)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                            isTafseerVisible
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                          }`}
                          title="إظهار / إخفاء التفسير الميسر للآية"
                        >
                          <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>{isTafseerVisible ? 'إخفاء التفسير' : 'التفسير'}</span>
                        </button>

                        {/* Modal Tafseer Full View Button */}
                        <button
                          onClick={() => setModalTafseerAyah(ayah)}
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          title="عرض التفسير المفصل والوقفات"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Bookmark Toggle */}
                        <button
                          onClick={() => handleToggleAyahBookmark(ayah, selectedSurah)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                            isBookmarkedAyah
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 hover:text-amber-600'
                          }`}
                          title="حفظ الآية في الإشارات المرجعية"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarkedAyah ? 'fill-white' : ''}`} />
                          <span>{isBookmarkedAyah ? 'محفوظة' : 'إشارة'}</span>
                        </button>

                        {/* Set Last Read Marker */}
                        <button
                          onClick={() => handleSetLastReadMarker(ayah, selectedSurah)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold transition ${
                            isLastReadAyah
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                          title="تحديد هذه الآية كآخر موضع قراءة"
                        >
                          <span>{isLastReadAyah ? '📍 الموضع' : 'تحديد'}</span>
                        </button>

                        {/* Copy Ayah */}
                        <button
                          onClick={() => handleCopyAyah(ayah, selectedSurah)}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          title="نسخ الآية"
                        >
                          {copiedAyahNumber === ayah.numberInSurah ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Ayah Arabic Verse Text */}
                    <div className="py-1">
                      <p
                        className="font-quran text-right text-gray-900 dark:text-gray-100 select-text transition-all"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: lineHeight
                        }}
                      >
                        {ayah.textArabic} ﴿{ayah.numberInSurah}﴾
                      </p>
                    </div>

                    {/* English Translation if enabled */}
                    {showTranslation && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans border-t border-gray-100 dark:border-gray-800 pt-2 text-left dir-ltr">
                        {ayah.textEnglish}
                      </p>
                    )}

                    {/* Inline Tafseer Card */}
                    {isTafseerVisible && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-[#1a2c24] border border-amber-200/80 dark:border-emerald-800/70 text-xs leading-relaxed animate-fadeIn space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-300">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            📖 التفسير الميسر (آية {ayah.numberInSurah}):
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyTafseer(ayah, selectedSurah)}
                              className="text-[10px] text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-md hover:bg-amber-100/50"
                              title="نسخ التفسير"
                            >
                              <Copy className="w-3 h-3" />
                              نسخ التفسير
                            </button>

                            <button
                              onClick={() => setModalTafseerAyah(ayah)}
                              className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold hover:underline flex items-center gap-0.5 bg-white/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800"
                              title="فتح نافذة التفسير الكاملة"
                            >
                              عرض موسع
                            </button>
                          </div>
                        </div>

                        <p
                          className="text-gray-800 dark:text-gray-200 leading-relaxed pt-0.5 font-sans"
                          style={{ fontSize: `${tafseerFontSize}px` }}
                        >
                          {ayah.tafseer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
