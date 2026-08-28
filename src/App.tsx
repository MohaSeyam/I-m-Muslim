import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { AdhkarScreen } from './components/screens/AdhkarScreen';
import { QuranScreen } from './components/screens/QuranScreen';
import { PrayerTimesScreen } from './components/screens/PrayerTimesScreen';
import { TasbihScreen } from './components/screens/TasbihScreen';
import { NamesOfAllahScreen } from './components/screens/NamesOfAllahScreen';
import { HadithScreen } from './components/screens/HadithScreen';
import { DuasScreen } from './components/screens/DuasScreen';
import { FridayScreen } from './components/screens/FridayScreen';
import { QiblaScreen } from './components/screens/QiblaScreen';
import { MoreScreen } from './components/screens/MoreScreen';
import { BookmarksScreen } from './components/screens/BookmarksScreen';
import { CITIES_PRESETS, CityPreset } from './utils/prayerTimes';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [adhkarCategoryParam, setAdhkarCategoryParam] = useState<string | undefined>(undefined);
  const [quranNavParam, setQuranNavParam] = useState<{ surahNumber?: number; ayahNumber?: number } | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES_PRESETS[0]); // Makkah by default

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (tab: string, subParam?: any) => {
    if (tab === 'adhkar' && typeof subParam === 'string') {
      setAdhkarCategoryParam(subParam);
    } else {
      setAdhkarCategoryParam(undefined);
    }

    if (tab === 'quran' && subParam && typeof subParam === 'object') {
      setQuranNavParam(subParam);
    } else {
      setQuranNavParam(undefined);
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0d1713] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
      />

      <main className="flex-1 max-w-xl w-full mx-auto p-4">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            selectedCity={selectedCity}
          />
        )}
        {activeTab === 'adhkar' && (
          <AdhkarScreen
            initialCategoryId={adhkarCategoryParam}
          />
        )}
        {activeTab === 'quran' && (
          <QuranScreen
            key={quranNavParam ? `${quranNavParam.surahNumber}-${quranNavParam.ayahNumber}` : 'quran-default'}
            initialSurahNumber={quranNavParam?.surahNumber}
            initialAyahNumber={quranNavParam?.ayahNumber}
            onNavigate={handleNavigate}
          />
        )}
        {activeTab === 'prayers' && (
          <PrayerTimesScreen
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onNavigateToQibla={() => setActiveTab('qibla')}
          />
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
        {activeTab === 'qibla' && (
          <QiblaScreen selectedCity={selectedCity} />
        )}
        {activeTab === 'bookmarks' && (
          <BookmarksScreen onNavigate={handleNavigate} />
        )}
        {activeTab === 'more' && (
          <MoreScreen onNavigate={handleNavigate} />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleNavigate}
      />
    </div>
  );
};
