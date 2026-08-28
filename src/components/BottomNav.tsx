import React from 'react';
import { Home, Book, Sparkles, Clock, Grid } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'القرآن', icon: Book },
    { id: 'adhkar', label: 'الأذكار', icon: Sparkles },
    { id: 'prayers', label: 'الصلاة والقبلة', icon: Clock },
    { id: 'more', label: 'المزيد', icon: Grid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111f1a]/95 backdrop-blur-lg border-t border-emerald-100 dark:border-emerald-950/60 pb-safe shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Group check: e.g. 'tasbih' or 'duas' falls under 'adhkar', 'qibla' or 'friday' falls under 'prayers', 'bookmarks' falls under 'more'
          const isSelected =
            activeTab === tab.id ||
            (tab.id === 'adhkar' && (activeTab === 'tasbih' || activeTab === 'duas')) ||
            (tab.id === 'prayers' && (activeTab === 'qibla' || activeTab === 'friday')) ||
            (tab.id === 'more' && (activeTab === 'bookmarks' || activeTab === 'names' || activeTab === 'hadith'));

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-200 ${
                isSelected
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-2xs' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
