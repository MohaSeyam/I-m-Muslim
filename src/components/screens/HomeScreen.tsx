import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Heart,
  BookMarked,
  ChevronLeft,
  Calendar,
  Award,
  MoreHorizontal
} from 'lucide-react';
import { getHijriDate } from '../../utils/hijriCalendar';
import { getQuranLastReadPage } from '../../utils/quranStorage';
import { toArabicNumerals, getPageMeta } from '../../data/quranData';

interface HomeScreenProps {
  onNavigate: (tab: string, subParam?: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const hijri = getHijriDate();
  const [lastReadPage, setLastReadPage] = useState<number>(1);
  const [lastReadSurahName, setLastReadSurahName] = useState<string>('الفاتحة');
  const [lastReadJuzName, setLastReadJuzName] = useState<string>('الجزء الأول');

  useEffect(() => {
    const p = getQuranLastReadPage();
    setLastReadPage(p);

    try {
      const meta = getPageMeta(p);
      if (meta) {
        setLastReadSurahName(meta.primarySurah?.nameArabic || 'الفاتحة');
        setLastReadJuzName(meta.juzName || meta.juz?.juzNameArabic || `الجزء ${meta.juzNumber || 1}`);
      }
    } catch {
      setLastReadSurahName('الفاتحة');
      setLastReadJuzName('الجزء الأول');
    }
  }, []);

  const isTodayFriday = new Date().getDay() === 5;
  const dayNameFormatted = new Intl.DateTimeFormat('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto custom-scrollbar gap-3 screen-fade-in select-none font-sans p-1 pb-2">
      {/* 1. TOP STATUS ROW (Calm Date Header) */}
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-2xl liquid-pill text-xs font-bold text-emerald-950 dark:text-emerald-300 shadow-2xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{dayNameFormatted}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400 font-sans hidden sm:inline">
            • {toArabicNumerals(hijri.day)} {hijri.monthNameAr} {toArabicNumerals(hijri.year)} هـ
          </span>
        </div>

        {isTodayFriday && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-200 font-bold px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-500" /> جمعة مباركة
          </span>
        )}
      </div>

      {/* 2. THE MUSHAF WIDGET (ويدجت المصحف الشريف - Single, Clean Gateway) */}
      <div
        onClick={() => onNavigate('quran', { pageNumber: lastReadPage })}
        className="p-4 sm:p-5 rounded-[28px] liquid-hero text-white cursor-pointer hover:scale-[1.008] active:scale-[0.99] transition-all shadow-lg relative overflow-hidden group flex-shrink-0"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-gradient-to-br from-emerald-400/25 to-teal-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 left-4 opacity-10 text-5xl font-uthmani select-none pointer-events-none">قرآن</div>

        <div className="relative z-10 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold shadow-md border border-white/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white tracking-tight">
                  المصحف الشريف
                </h2>
                <p className="text-xs text-emerald-100/90 font-sans">
                  مصحف المدينة المنورة بالرسم العثماني
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-white bg-white/15 group-hover:bg-white/25 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/20 transition-all shadow-xs">
              <span>فتح المصحف</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Last read position */}
          <div className="p-2.5 rounded-2xl bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                سورة {lastReadSurahName}
              </span>
              <span className="text-emerald-100/80 font-sans">
                • {lastReadJuzName}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-xl bg-white/20 text-white font-bold font-sans">
              صفحة {toArabicNumerals(lastReadPage)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. ADHKAR WIDGET (الأذكار والأوراد - Direct Morning & Evening Access) */}
      <div
        onClick={() => onNavigate('adhkar')}
        className="p-4 rounded-[26px] liquid-card liquid-glass text-gray-900 dark:text-slate-100 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md group relative overflow-hidden font-sans space-y-3 flex-shrink-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 font-display">
                الأذكار والأوراد
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                حصن المسلم وأذكار اليوم والليلة
              </p>
            </div>
          </div>

          <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('adhkar', 'morning');
            }}
            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
          >
            <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>أذكار الصباح</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('adhkar', 'evening');
            }}
            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
          >
            <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>أذكار المساء</span>
          </button>
        </div>
      </div>

      {/* 4. ESSENTIAL SERVICES (Clean, Uncluttered, Spaced Grid) */}
      <div className="flex-shrink-0 pt-1">
        <div className={`grid ${isTodayFriday ? 'grid-cols-5' : 'grid-cols-4'} gap-2`}>
          <button
            onClick={() => onNavigate('tasbih')}
            className="p-2.5 sm:p-3 rounded-2xl liquid-glass flex flex-col items-center gap-1.5 hover:border-emerald-500/40 active:scale-95 transition cursor-pointer text-center group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-emerald-500/15">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 font-sans">المسبحة</span>
          </button>

          <button
            onClick={() => onNavigate('hadith')}
            className="p-2.5 sm:p-3 rounded-2xl liquid-glass flex flex-col items-center gap-1.5 hover:border-emerald-500/40 active:scale-95 transition cursor-pointer text-center group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-emerald-500/15">
              <BookMarked className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 font-sans">الأحاديث</span>
          </button>

          <button
            onClick={() => onNavigate('duas')}
            className="p-2.5 sm:p-3 rounded-2xl liquid-glass flex flex-col items-center gap-1.5 hover:border-emerald-500/40 active:scale-95 transition cursor-pointer text-center group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-emerald-500/15">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 font-sans">الأدعية</span>
          </button>

          <button
            onClick={() => onNavigate('names')}
            className="p-2.5 sm:p-3 rounded-2xl liquid-glass flex flex-col items-center gap-1.5 hover:border-emerald-500/40 active:scale-95 transition cursor-pointer text-center group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-emerald-500/15">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 font-sans">أسماء الله</span>
          </button>

          {isTodayFriday && (
            <button
              onClick={() => onNavigate('friday')}
              className="p-2.5 sm:p-3 rounded-2xl liquid-glass flex flex-col items-center gap-1.5 hover:border-emerald-500/40 active:scale-95 transition cursor-pointer text-center group shadow-2xs bg-emerald-500/10 border-emerald-500/30"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-emerald-500/25">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 font-sans">سنن الجمعة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
