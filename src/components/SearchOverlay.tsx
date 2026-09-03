import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, BookOpen, Sparkles, Heart, ChevronLeft, ArrowRight } from 'lucide-react';
import { surahsList, toArabicNumerals } from '../data/quranData';
import { dhikrCategories } from '../data/adhkarData';
import { dailyDuas } from '../data/duasData';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, subParam?: any) => void;
}

type SearchCategory = 'all' | 'quran' | 'adhkar' | 'duas';

interface SearchResultItem {
  id: string;
  type: 'quran' | 'adhkar' | 'duas';
  title: string;
  subtitle: string;
  badge: string;
  targetTab: string;
  targetParam?: any;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean and normalize arabic text for reliable search
  const normalizeArabic = (text: string) => {
    return text
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLowerCase()
      .trim();
  };

  const results = useMemo<SearchResultItem[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Default quick suggestions
      const defaultSurahs: SearchResultItem[] = [
        {
          id: 's_1',
          type: 'quran',
          title: 'سورة الفاتحة',
          subtitle: 'صفحة ١ • ٧ آيات • مكية',
          badge: 'المصحف',
          targetTab: 'quran',
          targetParam: { pageNumber: 1, surahNumber: 1 }
        },
        {
          id: 's_36',
          type: 'quran',
          title: 'سورة يس',
          subtitle: 'صفحة ٤٤٠ • ٨٣ آية • مكية',
          badge: 'المصحف',
          targetTab: 'quran',
          targetParam: { pageNumber: 440, surahNumber: 36 }
        },
        {
          id: 's_18',
          type: 'quran',
          title: 'سورة الكهف',
          subtitle: 'صفحة ٢٩٣ • ١١٠ آيات • مكية',
          badge: 'المصحف',
          targetTab: 'quran',
          targetParam: { pageNumber: 293, surahNumber: 18 }
        },
        {
          id: 's_67',
          type: 'quran',
          title: 'سورة الملك',
          subtitle: 'صفحة ٥٦٢ • ٣٠ آية • مكية',
          badge: 'المصحف',
          targetTab: 'quran',
          targetParam: { pageNumber: 562, surahNumber: 67 }
        },
      ];

      const defaultAdhkar: SearchResultItem[] = [
        {
          id: 'adh_morning',
          type: 'adhkar',
          title: 'أذكار الصباح',
          subtitle: 'التحصين النبوي والبركة مع إشراقة الصباح',
          badge: 'الأذكار',
          targetTab: 'adhkar',
          targetParam: 'morning'
        },
        {
          id: 'adh_evening',
          type: 'adhkar',
          title: 'أذكار المساء',
          subtitle: 'الحفظ والسكينة مع إقبال الليل',
          badge: 'الأذكار',
          targetTab: 'adhkar',
          targetParam: 'evening'
        },
        {
          id: 'adh_sleep',
          type: 'adhkar',
          title: 'أذكار النوم والأحلام',
          subtitle: 'التحصين قبل المنام وعند الفزع والتقلب',
          badge: 'الأذكار',
          targetTab: 'adhkar',
          targetParam: 'sleep'
        }
      ];

      const defaultDuas: SearchResultItem[] = [
        {
          id: 'dua_1',
          type: 'duas',
          title: 'طلب خيري الدنيا والآخرة والوقاية من النار',
          subtitle: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً',
          badge: 'الأدعية',
          targetTab: 'duas',
          targetParam: { category: 'quranic' }
        },
        {
          id: 'dua_istikhara',
          type: 'duas',
          title: 'دعاء صلاة الاستخارة النبوية',
          subtitle: 'اللهم إني أستخيرك بعلمك وأستقدرك بقدرتك',
          badge: 'الأدعية',
          targetTab: 'duas',
          targetParam: { category: 'prophetic' }
        }
      ];

      const all = [...defaultSurahs, ...defaultAdhkar, ...defaultDuas];
      if (activeCategory === 'all') return all;
      return all.filter(item => item.type === activeCategory);
    }

    const normQuery = normalizeArabic(trimmed);
    const matchedItems: SearchResultItem[] = [];

    // 1. Search Quran Surahs
    if (activeCategory === 'all' || activeCategory === 'quran') {
      const isNum = /^\d+$/.test(trimmed);
      const pageNum = isNum ? parseInt(trimmed, 10) : NaN;

      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
        matchedItems.push({
          id: `page_${pageNum}`,
          type: 'quran',
          title: `الانتقال إلى الصفحة ${toArabicNumerals(pageNum)}`,
          subtitle: `الانتقال مباشرة لمصحف المدينة صفحة ${pageNum}`,
          badge: 'صفحة بالمصحف',
          targetTab: 'quran',
          targetParam: { pageNumber: pageNum }
        });
      }

      for (const surah of surahsList) {
        const normName = normalizeArabic(surah.nameArabic);
        const normEng = surah.nameEnglish.toLowerCase();
        if (normName.includes(normQuery) || normEng.includes(normQuery) || (isNum && surah.number === pageNum)) {
          matchedItems.push({
            id: `surah_${surah.number}`,
            type: 'quran',
            title: `سورة ${surah.nameArabic}`,
            subtitle: `صفحة ${toArabicNumerals(surah.pageNumber)} • ${toArabicNumerals(surah.numberOfAyahs)} آية • ${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}`,
            badge: 'المصحف',
            targetTab: 'quran',
            targetParam: { pageNumber: surah.pageNumber, surahNumber: surah.number }
          });
        }
      }
    }

    // 2. Search Adhkar Categories
    if (activeCategory === 'all' || activeCategory === 'adhkar') {
      for (const cat of dhikrCategories) {
        const normTitle = normalizeArabic(cat.titleArabic);
        const normDesc = normalizeArabic(cat.descriptionArabic);
        if (normTitle.includes(normQuery) || normDesc.includes(normQuery)) {
          matchedItems.push({
            id: `adhkar_${cat.id}`,
            type: 'adhkar',
            title: cat.titleArabic,
            subtitle: cat.descriptionArabic,
            badge: 'الأذكار',
            targetTab: 'adhkar',
            targetParam: cat.id
          });
        }
      }
    }

    // 3. Search Duas
    if (activeCategory === 'all' || activeCategory === 'duas') {
      for (const dua of dailyDuas) {
        const normTitle = normalizeArabic(dua.title);
        const normArabic = normalizeArabic(dua.arabic);
        if (normTitle.includes(normQuery) || normArabic.includes(normQuery)) {
          matchedItems.push({
            id: `dua_${dua.id}`,
            type: 'duas',
            title: dua.title,
            subtitle: dua.arabic.length > 70 ? `${dua.arabic.slice(0, 70)}...` : dua.arabic,
            badge: 'الأدعية',
            targetTab: 'duas',
            targetParam: { category: dua.category }
          });
          if (matchedItems.length > 40) break;
        }
      }
    }

    return matchedItems;
  }, [query, activeCategory]);

  const handleSelect = (item: SearchResultItem) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(10); } catch {}
    }
    onNavigate(item.targetTab, item.targetParam);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div 
        className="w-full max-w-lg bg-white/95 dark:bg-[#101726]/95 border border-emerald-500/20 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden modal-pop-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header with Search Input */}
        <div className="p-3 sm:p-4 border-b border-gray-200/80 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute right-3 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن سورة، رقم صفحة، ذكر، أو دعاء..."
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-gray-100 dark:bg-[#162032] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-slate-100 text-sm placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 absolute left-2.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-gray-100 dark:bg-[#162032] text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1e2a40] transition cursor-pointer flex-shrink-0"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Category Filter Pills */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#162032] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1e2a40]'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveCategory('quran')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'quran'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#162032] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1e2a40]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>السور والمصحف</span>
            </button>
            <button
              onClick={() => setActiveCategory('adhkar')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'adhkar'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#162032] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1e2a40]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>الأذكار والأوراد</span>
            </button>
            <button
              onClick={() => setActiveCategory('duas')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'duas'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#162032] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-[#1e2a40]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>الأدعية المأثورة</span>
            </button>
          </div>
        </div>

        {/* 3. Search Results List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-1.5 custom-scrollbar">
          {results.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-500" />
              <p className="text-xs font-bold">لم يتم العثور على نتائج تطابق بحثك</p>
              <p className="text-[11px] mt-1">جرّب كتابة اسم سورة مثل «البقرة» أو ذكر مثل «الصباح»</p>
            </div>
          ) : (
            results.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#141C2B] hover:bg-emerald-50/70 dark:hover:bg-[#1A2436] border border-gray-200/70 dark:border-white/5 hover:border-emerald-500/30 transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {item.type === 'quran' && <BookOpen className="w-4 h-4" />}
                      {item.type === 'adhkar' && <Sparkles className="w-4 h-4" />}
                      {item.type === 'duas' && <Heart className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100 truncate font-display">
                          {item.title}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold flex-shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate mt-0.5 font-sans">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-x-1 transition-all flex-shrink-0 mr-1" />
                </div>
              );
            })
          )}
        </div>

        {/* 4. Footer Hint */}
        <div className="p-2 sm:p-2.5 border-t border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-[#0E1522] text-[11px] text-gray-500 dark:text-slate-400 flex items-center justify-between px-4 flex-shrink-0">
          <span>نتائج فورية بنقرة واحدة</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">أنا مسلم</span>
        </div>
      </div>
    </div>
  );
};
