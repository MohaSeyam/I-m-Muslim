import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchOverlay } from './components/SearchOverlay';
import { HomeScreen } from './components/screens/HomeScreen';
import { AdhkarScreen } from './components/screens/AdhkarScreen';
import { QuranScreen } from './components/screens/QuranScreen';
import { TasbihScreen } from './components/screens/TasbihScreen';
import { NamesOfAllahScreen } from './components/screens/NamesOfAllahScreen';
import { HadithScreen } from './components/screens/HadithScreen';
import { DuasScreen } from './components/screens/DuasScreen';
import { FridayScreen } from './components/screens/FridayScreen';
import { MoreScreen } from './components/screens/MoreScreen';
import { BookmarksScreen } from './components/screens/BookmarksScreen';
import { getStoredSettings } from './utils/settingsStorage';

export const App: React.FC = () => {
  const computeIsDarkMode = useCallback((): boolean => {
    try {
      const currentTheme = getStoredSettings()?.themeMode || 'dark';
      if (currentTheme === 'dark') return true;
      if (currentTheme === 'light') return false;
      return typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return true;
    }
  }, []);

  const [darkMode, setDarkMode] = useState<boolean>(computeIsDarkMode);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [navHistory, setNavHistory] = useState<Array<{ tab: string; subParam?: any }>>([{ tab: 'home' }]);
  const [adhkarCategoryParam, setAdhkarCategoryParam] = useState<string | undefined>(undefined);
  const [quranNavParam, setQuranNavParam] = useState<{ surahNumber?: number; ayahNumber?: number; pageNumber?: number } | undefined>(undefined);
  const [isReadingFullscreen, setIsReadingFullscreen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync settings and system dark mode listener
  useEffect(() => {
    const handleSettingsChange = () => {
      setDarkMode(computeIsDarkMode());
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      const current = getStoredSettings();
      if (current.themeMode === 'system') {
        setDarkMode(mediaQuery.matches);
      }
    };

    window.addEventListener('app_settings_changed', handleSettingsChange);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    return () => {
      window.removeEventListener('app_settings_changed', handleSettingsChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, [computeIsDarkMode]);

  // When changing tabs, exit fullscreen mode & update history
  const handleNavigate = (tab: string, subParam?: any) => {
    setIsReadingFullscreen(false);

    if (tab === 'adhkar' && typeof subParam === 'string') {
      setAdhkarCategoryParam(subParam);
    } else {
      setAdhkarCategoryParam(undefined);
    }

    if (tab === 'quran' && subParam && typeof subParam === 'object') {
      setQuranNavParam(subParam);
    } else if (tab === 'quran' && typeof subParam === 'number') {
      setQuranNavParam({ pageNumber: subParam });
    } else {
      setQuranNavParam(undefined);
    }

    setNavHistory(prev => {
      const current = prev[prev.length - 1];
      if (current && current.tab === tab && JSON.stringify(current.subParam) === JSON.stringify(subParam)) {
        return prev;
      }
      return [...prev, { tab, subParam }];
    });

    setActiveTab(tab);
  };

  const handleBack = () => {
    setIsReadingFullscreen(false);
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      const previous = newHistory[newHistory.length - 1];
      setNavHistory(newHistory);

      if (previous.tab === 'adhkar' && typeof previous.subParam === 'string') {
        setAdhkarCategoryParam(previous.subParam);
      } else {
        setAdhkarCategoryParam(undefined);
      }

      if (previous.tab === 'quran' && previous.subParam && typeof previous.subParam === 'object') {
        setQuranNavParam(previous.subParam);
      } else if (previous.tab === 'quran' && typeof previous.subParam === 'number') {
        setQuranNavParam({ pageNumber: previous.subParam });
      } else {
        setQuranNavParam(undefined);
      }

      setActiveTab(previous.tab);
    } else if (activeTab !== 'home') {
      setActiveTab('home');
      setNavHistory([{ tab: 'home' }]);
    }
  };

  const canGoBack = navHistory.length > 1 || activeTab !== 'home';
  const isFullscreenQuran = isReadingFullscreen && activeTab === 'quran';

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-[#F8FAF9] dark:bg-[#090E17] text-gray-900 dark:text-slate-100 relative selection:bg-emerald-500 selection:text-white font-cairo">
      {/* Subtle Islamic Geometric Arabesque Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025] dark:opacity-[0.02] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310B981' fill-rule='evenodd'%3E%3Cpath d='M40 0l40 40-40 40L0 40zM40 10L10 40l30 30 30-30z' fill-opacity='0.4'/%3E%3Cpath d='M40 20l20 20-20 20-20-20z' fill-opacity='0.6'/%3E%3Ccircle cx='40' cy='40' r='5' fill='%2310B981'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Header - completely hidden in fullscreen Quran reading mode */}
      <Header
        activeTab={activeTab}
        canGoBack={canGoBack}
        onBack={handleBack}
        onNavigateHome={() => handleNavigate('home')}
        onNavigateToSettings={() => handleNavigate('more')}
        onOpenSearch={() => setIsSearchOpen(true)}
        isHidden={isFullscreenQuran}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <main 
        className={`flex-1 min-h-0 w-full relative z-10 flex flex-col overflow-hidden ${
          isFullscreenQuran
            ? 'p-0 m-0 max-w-none h-full'
            : 'max-w-xl landscape:max-w-5xl mx-auto px-2 sm:px-3 landscape:px-3 py-1 landscape:py-0.5'
        }`}
      >
        {activeTab === 'home' && (
          <HomeScreen onNavigate={handleNavigate} />
        )}
        {activeTab === 'quran' && (
          <QuranScreen
            initialPageNumber={quranNavParam?.pageNumber}
            initialSurahNumber={quranNavParam?.surahNumber}
            initialAyahNumber={quranNavParam?.ayahNumber}
            onNavigate={handleNavigate}
            isFullscreen={isReadingFullscreen}
            onToggleFullscreen={() => setIsReadingFullscreen(!isReadingFullscreen)}
          />
        )}
        {activeTab === 'adhkar' && (
          <AdhkarScreen
            initialCategoryId={adhkarCategoryParam}
            onBack={handleBack}
          />
        )}
        {activeTab === 'more' && (
          <MoreScreen onNavigate={handleNavigate} />
        )}
        {activeTab === 'tasbih' && (
          <TasbihScreen />
        )}
        {activeTab === 'names' && (
          <NamesOfAllahScreen />
        )}
        {activeTab === 'hadith' && (
          <HadithScreen />
        )}
        {activeTab === 'duas' && (
          <DuasScreen />
        )}
        {activeTab === 'friday' && (
          <FridayScreen />
        )}
        {activeTab === 'bookmarks' && (
          <BookmarksScreen onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
};
