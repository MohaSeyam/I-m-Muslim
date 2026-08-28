import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, BookOpen, Clock, Compass, Heart, Award, ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';
import { calculatePrayerTimes, CITIES_PRESETS, CityPreset, getHijriDate } from '../../utils/prayerTimes';
import { getQuranLastRead } from '../../utils/quranStorage';
import { LastReadPosition } from '../../types';

interface HomeScreenProps {
  onNavigate: (tab: string, subParam?: any) => void;
  selectedCity: CityPreset;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, selectedCity }) => {
  const prayerData = calculatePrayerTimes(selectedCity);
  const hijri = getHijriDate();
  const [quranLastRead, setQuranLastRead] = useState<LastReadPosition | null>(null);

  useEffect(() => {
    setQuranLastRead(getQuranLastRead());
  }, []);

  const isFriday = new Date().getDay() === 5;

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Hero Banner: Next Prayer & Islamic Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 shadow-xl shadow-emerald-900/15">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 left-2 opacity-10 text-7xl font-quran select-none">ﷲ</div>

        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-emerald-100 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5" />
                الصلاة القادمة: {prayerData.nextPrayer.nameAr}
              </span>
              <h2 className="text-3xl font-extrabold mt-2 tracking-tight">
                {prayerData.nextPrayer.time}
              </h2>
            </div>
            <div className="text-left">
              <span className="text-xs text-emerald-200 block">{selectedCity.nameAr}</span>
              <button 
                onClick={() => onNavigate('prayers')}
                className="text-xs underline text-white/80 hover:text-white mt-1 inline-flex items-center gap-1"
              >
                المواقيت كاملة
                <ArrowLeft className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex justify-between items-center text-xs text-emerald-100">
            <span>اليوم: {new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(new Date())}</span>
            <span>{hijri.day} {hijri.monthNameAr} {hijri.year} هـ</span>
          </div>
        </div>
      </div>

      {/* Friday Banner if today is Friday */}
      {isFriday && (
        <div 
          onClick={() => onNavigate('friday')}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-400/30 flex items-center justify-between cursor-pointer hover:border-amber-400/60 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xl">
              🕌
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 dark:text-emerald-50 text-sm">يوم الجمعة المبارك ✨</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">قراءة سورة الكهف، الإكثار من الصلاة على النبي ﷺ، والدعاء</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">فتح الورد ←</span>
        </div>
      )}

      {/* Quick Action Cards: Morning / Evening Adhkar */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onNavigate('adhkar', 'morning')}
          className="group relative p-4 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">أذكار الصباح</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">ابدأ يومك بالتحصين والبركة</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:translate-x-[-2px] transition">
            قراءة الآن ←
          </div>
        </div>

        <div
          onClick={() => onNavigate('adhkar', 'evening')}
          className="group relative p-4 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Moon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">أذكار المساء</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">سكينة وحفظ لختام اليوم</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1 group-hover:translate-x-[-2px] transition">
            قراءة الآن ←
          </div>
        </div>
      </div>

      {/* Featured Quranic Verse */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <BookOpen className="w-4 h-4" />
            آية اليوم وتدبرها
          </span>
          <span className="text-[11px] text-gray-400">سورة الرعد: 28</span>
        </div>
        <p className="text-center font-quran text-lg text-emerald-950 dark:text-emerald-100 leading-loose py-2">
          ﴿ الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          حقيقة طمأنينة القلب وسكونه وذهاب قلقه إنما تكون بمعرفة الله وتوحيده ودوام ذكره وشكره.
        </p>
      </div>

      {/* Quran Last Read Bookmark if present */}
      {quranLastRead && (
        <div
          onClick={() => onNavigate('quran', { surahNumber: quranLastRead.surahNumber, ayahNumber: quranLastRead.ayahNumberInSurah })}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 border border-emerald-700/50 shadow-md text-white flex items-center justify-between cursor-pointer hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <Bookmark className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] text-amber-300 font-bold block">متابعة تلاوة القرآن الكريم</span>
              <h4 className="font-extrabold text-sm text-white">
                سورة {quranLastRead.surahNameArabic} • الآية {quranLastRead.ayahNumberInSurah}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-200 group-hover:text-white font-semibold">
            <span>استئناف</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition" />
          </div>
        </div>
      )}

      {/* Quick Explore Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-between">
          <span>خدمات إسلامية سريعة</span>
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigate('quran')}
            className="p-3 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 flex flex-col items-center gap-2 hover:border-emerald-500 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">المصحف</span>
          </button>

          <button
            onClick={() => onNavigate('tasbih')}
            className="p-3 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 flex flex-col items-center gap-2 hover:border-emerald-500 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">المسبحة</span>
          </button>

          <button
            onClick={() => onNavigate('names')}
            className="p-3 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 flex flex-col items-center gap-2 hover:border-emerald-500 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">أسماء الله</span>
          </button>

          <button
            onClick={() => onNavigate('qibla')}
            className="p-3 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 flex flex-col items-center gap-2 hover:border-emerald-500 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">القبلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
