import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SurahMeta } from '../types';
import { surahsList, juzData, toArabicNumerals } from '../data/quranData';
import {
  Search,
  X,
  BookOpen,
  Layers,
  Bookmark,
  Sparkles,
  ChevronLeft,
  Flame,
  Star,
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';

interface SurahDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: number;
  onSelectSurah: (surahNumber: number, targetPage?: number) => void;
  onSelectJuz: (juzNumber: number) => void;
}

const POPULAR_SURAHS = [1, 18, 36, 55, 56, 67, 112, 113, 114];

const normalizeArabic = (text: string) => {
  return text
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .toLowerCase()
    .trim();
};

export const SurahDrawerModal: React.FC<SurahDrawerModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectSurah,
  onSelectJuz,
}) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz' | 'pages'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Meccan' | 'Medinan' | 'popular'>('all');
  const [pageJumpInput, setPageJumpInput] = useState(currentPage ? currentPage.toString() : '1');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Determine which surah the user is currently reading
  const currentSurahNumber = useMemo(() => {
    if (!currentPage) return 1;
    const found = [...surahsList].reverse().find(s => (s.pageNumber || 1) <= currentPage);
    return found ? found.number : 1;
  }, [currentPage]);

  // Filtered surahs with normalized instant matching
  const filteredSurahs = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const normalizedQ = normalizeArabic(rawQuery);

    return surahsList.filter(surah => {
      const normName = normalizeArabic(surah.nameArabic);
      const matchesSearch =
        !rawQuery ||
        normName.includes(normalizedQ) ||
        surah.nameArabic.includes(rawQuery) ||
        surah.nameEnglish.toLowerCase().includes(rawQuery) ||
        surah.number.toString() === rawQuery ||
        (surah.pageNumber && surah.pageNumber.toString() === rawQuery);

      let matchesFilter = true;
      if (revelationFilter === 'Meccan') matchesFilter = surah.revelationType === 'Meccan';
      else if (revelationFilter === 'Medinan') matchesFilter = surah.revelationType === 'Medinan';
      else if (revelationFilter === 'popular') matchesFilter = POPULAR_SURAHS.includes(surah.number);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, revelationFilter]);

  if (!isOpen) return null;

  const handleJumpToPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageJumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
      const foundSurah = [...surahsList].reverse().find(s => (s.pageNumber || 1) <= pageNum) || surahsList[0];
      onSelectSurah(foundSurah.number, pageNum);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs backdrop-fade-smooth select-none p-0 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="فهرس القرآن الكريم الشريف"
        className="relative z-10 w-full max-w-3xl max-h-[92vh] h-[88vh] sm:h-[82vh] landscape:h-[95vh] bg-[#FAF8F2] dark:bg-[#0F1420] backdrop-blur-2xl rounded-t-[32px] sm:rounded-3xl border border-coolgreen-600/30 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden text-gray-900 dark:text-slate-100 modal-pop-smooth font-sans"
      >
        {/* Header with Search & Tabs */}
        <div className="p-3.5 sm:p-5 landscape:p-3 pb-2.5 border-b border-coolgreen-600/15 dark:border-white/10 space-y-2.5 shrink-0 bg-white/90 dark:bg-[#131924]/90 backdrop-blur-md">
          {/* Drag Pill for Mobile */}
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden" />

          {/* Top Title Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-coolgreen-700 to-coolgreen-900 dark:from-emerald-600 dark:to-emerald-800 text-white flex items-center justify-center font-bold shadow-md shadow-coolgreen-900/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold font-display text-coolgreen-950 dark:text-slate-100 flex items-center gap-2">
                  <span>فهرس المصحف الشريف</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-sans font-bold">
                    ١١٤ سورة
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
                  تصفح السور، الأجزاء، والصفحات مع البحث الفوري
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-gray-100 dark:bg-[#1A2232] text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 transition cursor-pointer hover:scale-105 active:scale-95"
              aria-label="إغلاق الفهرس"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-coolgreen-700 dark:text-emerald-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم السورة، رقمها، أو رقم الصفحة (مثال: الكهف، 18، 293)..."
              className="w-full bg-gray-50 dark:bg-[#182030] border border-coolgreen-600/20 dark:border-white/10 rounded-2xl pr-10 pl-10 py-2.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Mode Segmented Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-[#1A2232] p-1 rounded-2xl border border-gray-200/80 dark:border-white/5">
            <button
              onClick={() => setActiveTab('surahs')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'surahs'
                  ? 'bg-coolgreen-800 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>السور ({toArabicNumerals(114)})</span>
            </button>

            <button
              onClick={() => setActiveTab('juz')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'juz'
                  ? 'bg-coolgreen-800 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الأجزاء ({toArabicNumerals(30)})</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-coolgreen-800 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>الصفحات ({toArabicNumerals(604)})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5 space-y-3">
          {/* TAB 1: SURAHS LIST */}
          {activeTab === 'surahs' && (
            <div className="space-y-3">
              {/* Revelation & Popular Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                {[
                  { id: 'all', label: 'جميع السور (١١٤)' },
                  { id: 'popular', label: 'السور الفاضلة' },
                  { id: 'Meccan', label: 'مكية (٨٦)' },
                  { id: 'Medinan', label: 'مدنية (٢٨)' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setRevelationFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      revelationFilter === filter.id
                        ? 'bg-coolgreen-800 dark:bg-emerald-600 text-white border-coolgreen-800 dark:border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-[#141A26] text-gray-600 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-emerald-400'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Surah List Grid */}
              {filteredSurahs.length === 0 ? (
                <div className="p-8 text-center space-y-2 text-gray-500 dark:text-slate-400">
                  <p className="font-bold text-sm">لم يتم العثور على سور مطابقة للبحث</p>
                  <p className="text-xs">جرّب كتابة اسم السورة أو رقمها بطريقة أخرى</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-2 gap-2 sm:gap-2.5">
                  {filteredSurahs.map(surah => {
                    const isCurrent = surah.number === currentSurahNumber;

                    return (
                      <div
                        key={surah.number}
                        onClick={() => {
                          onSelectSurah(surah.number, surah.pageNumber);
                          onClose();
                        }}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden shadow-xs hover:scale-[1.01] ${
                          isCurrent
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/50 dark:border-emerald-400/50 ring-1 ring-emerald-500/30'
                            : 'bg-white dark:bg-[#141A26] border-coolgreen-600/15 dark:border-white/10 hover:border-emerald-600/40 dark:hover:border-emerald-400/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Octagon Islamic Star Number Badge */}
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs font-display flex-shrink-0 transition-transform group-hover:scale-105 ${
                            isCurrent
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                              : 'bg-coolgreen-50 dark:bg-[#1E2638] text-coolgreen-900 dark:text-emerald-300 border border-coolgreen-600/15 dark:border-white/10'
                          }`}>
                            {toArabicNumerals(surah.number)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-slate-100 font-display truncate">
                                سورة {surah.nameArabic}
                              </h4>
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-sans">
                                  الصفحة الحالية
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-sans mt-0.5">
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                                {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                              </span>
                              <span>•</span>
                              <span>{toArabicNumerals(surah.numberOfAyahs)} آية</span>
                              <span>•</span>
                              <span className="text-coolgreen-800 dark:text-emerald-400 font-bold">
                                صفحة {toArabicNumerals(surah.pageNumber || 1)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Calligraphic Surah Name */}
                        <div className="flex flex-col items-end flex-shrink-0 pl-1">
                          <span className="font-quran text-xl text-coolgreen-950 dark:text-emerald-200 group-hover:text-emerald-500 transition-colors">
                            {surah.nameArabic}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JUZ LIST */}
          {activeTab === 'juz' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-2 gap-2 sm:gap-2.5">
              {juzData.map(juz => {
                const startSurah = surahsList.find(s => s.number === juz.startSurahNumber);

                return (
                  <div
                    key={juz.number}
                    onClick={() => {
                      onSelectJuz(juz.number);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#141A26] border border-coolgreen-600/15 dark:border-white/10 hover:border-emerald-600/40 dark:hover:border-emerald-400/40 transition cursor-pointer flex items-center justify-between group shadow-xs hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-coolgreen-50 dark:bg-[#1E2638] text-coolgreen-900 dark:text-emerald-300 flex items-center justify-center font-bold text-xs font-display flex-shrink-0 border border-coolgreen-600/15 dark:border-white/10">
                        {toArabicNumerals(juz.number)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-slate-100 font-display truncate">
                          {juz.nameArabic}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans truncate">
                          يبدأ من سورة {startSurah?.nameArabic} (آية {toArabicNumerals(juz.startAyahNumber)})
                        </p>
                      </div>
                    </div>

                    <div className="text-left flex flex-col items-end flex-shrink-0">
                      <span className="text-xs font-bold text-coolgreen-800 dark:text-emerald-400 font-sans">
                        ص {toArabicNumerals(juz.pageNumber)}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: PAGES QUICK JUMP & LANDMARKS */}
          {activeTab === 'pages' && (
            <div className="space-y-4 py-1">
              <form onSubmit={handleJumpToPageSubmit} className="p-4 rounded-3xl bg-white dark:bg-[#141A26] border border-coolgreen-600/20 dark:border-white/10 space-y-3 shadow-xs">
                <h4 className="font-extrabold font-display text-sm text-gray-900 dark:text-slate-100">
                  الانتقال المباشر لرقم صفحة في المصحف (1 - 604)
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="604"
                    value={pageJumpInput}
                    onChange={e => setPageJumpInput(e.target.value)}
                    className="flex-1 text-center py-2.5 px-3 rounded-2xl bg-gray-50 dark:bg-[#1C2538] border border-coolgreen-600/30 dark:border-white/10 text-xl font-bold font-display text-coolgreen-900 dark:text-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-coolgreen-700 hover:bg-coolgreen-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    انتقال
                  </button>
                </div>
              </form>

              {/* Quick Jump Landmarks */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-gray-600 dark:text-slate-400 px-1">
                  صفحات ومعالم مباركة في القرآن:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'سورة الفاتحة', page: 1 },
                    { label: 'سورة البقرة', page: 2 },
                    { label: 'آية الكرسي', page: 42 },
                    { label: 'سورة الكهف', page: 293 },
                    { label: 'سورة يس', page: 440 },
                    { label: 'سورة الرحمن', page: 531 },
                    { label: 'سورة الملك', page: 562 },
                    { label: 'جزء عم', page: 582 },
                    { label: 'المعوذات', page: 604 },
                  ].map(landmark => (
                    <button
                      key={landmark.page}
                      onClick={() => {
                        const foundSurah = [...surahsList].reverse().find(s => (s.pageNumber || 1) <= landmark.page) || surahsList[0];
                        onSelectSurah(foundSurah.number, landmark.page);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white dark:bg-[#141A26] border border-coolgreen-600/15 dark:border-white/10 hover:border-emerald-400 text-right flex items-center justify-between text-xs font-bold transition cursor-pointer shadow-2xs hover:scale-[1.02]"
                    >
                      <span className="text-gray-900 dark:text-slate-100 font-display">{landmark.label}</span>
                      <span className="text-coolgreen-800 dark:text-emerald-400 font-sans">ص {toArabicNumerals(landmark.page)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
