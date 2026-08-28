import React from 'react';
import { Moon, Sun, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { getHijriDate } from '../utils/prayerTimes';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeTab
}) => {
  const hijri = getHijriDate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111f1a]/90 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-950/60 px-4 py-3 shadow-sm transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Hijri Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <span className="text-xl font-bold">🕌</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">أنا مسلم</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                {hijri.day} {hijri.monthNameAr} {hijri.year} هـ
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">تطبيقك الإسلامي اليومي الشامل</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition"
            title="تبديل المظهر"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-800" />}
          </button>
        </div>
      </div>
    </header>
  );
};
