import React, { useState, useEffect } from 'react';
import { WifiOff, ArrowRight, Settings, Search } from 'lucide-react';
import { getHijriDate } from '../utils/hijriCalendar';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  activeTab: string;
  isHidden?: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
  onNavigateHome?: () => void;
  onNavigateToSettings?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode: _darkMode,
  setDarkMode: _setDarkMode,
  activeTab: _activeTab,
  isHidden = false,
  canGoBack = false,
  onBack,
  onNavigateHome,
  onNavigateToSettings,
  onOpenSearch
}) => {
  const hijri = getHijriDate(new Date());

  if (isHidden) return null;

  return (
    <header className="h-14 landscape:h-11 flex-shrink-0 z-40 liquid-glass border-b border-gray-200/80 dark:border-white/10 px-3 sm:px-4 landscape:px-4 flex items-center transition-all duration-300">
      <div className="w-full max-w-xl landscape:max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand & Hijri Date / Back Button */}
        <div className="flex items-center gap-2">
          {canGoBack && onBack && (
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  try { navigator.vibrate(15); } catch {}
                }
                onBack();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl liquid-pill text-coolgreen-900 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs font-sans hover:bg-white/80 dark:hover:bg-white/15"
              title="الرجوع إلى الصفحة السابقة"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">رجوع</span>
            </button>
          )}

          <div
            onClick={() => onNavigateHome && onNavigateHome()}
            className="flex items-center gap-2 cursor-pointer group"
            title="الرئيسية"
          >
            <div className="relative transition-transform group-hover:scale-105 active:scale-95">
              <AppLogo size={34} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-coolgreen-950 via-coolgreen-800 to-emerald-700 dark:from-slate-100 dark:via-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight font-display">
                  أنا مسلم
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full liquid-pill text-coolgreen-900 dark:text-emerald-400 font-bold flex items-center gap-1 font-sans">
                  <span>{hijri.day}</span>
                  <span>{hijri.monthNameAr}</span>
                  <span>{hijri.year} هـ</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Minimal Search Icon + Settings */}
        <div className="flex items-center gap-1.5">
          {onOpenSearch && (
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  try { navigator.vibrate(10); } catch {}
                }
                onOpenSearch();
              }}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl liquid-pill text-gray-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-xs transition duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer font-sans"
              title="بحث سريع (سور، آيات، أذكار، أدعية)"
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold hidden sm:inline">بحث</span>
            </button>
          )}

          {onNavigateToSettings && (
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  try { navigator.vibrate(15); } catch {}
                }
                onNavigateToSettings();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl liquid-pill text-gray-700 dark:text-slate-300 hover:text-coolgreen-800 dark:hover:text-emerald-400 shadow-xs transition duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer font-sans"
              title="الإعدادات والتفضيلات"
            >
              <Settings className="w-4 h-4 text-coolgreen-800 dark:text-emerald-400" />
              <span className="text-xs font-bold hidden xs:inline">الإعدادات</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
