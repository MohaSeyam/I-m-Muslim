import React from 'react';
import { Home, BookOpen, Sparkles, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isHidden?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isHidden = false
}) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home, hint: 'الصفحة الرئيسية ووِرد اليوم' },
    { id: 'quran', label: 'المصحف', icon: BookOpen, hint: 'المصحف الشريف بالرسم العثماني' },
    { id: 'adhkar', label: 'الأذكار', icon: Sparkles, hint: 'أذكار حصن المسلم والتسبيح' },
    { id: 'more', label: 'المزيد', icon: LayoutGrid, hint: 'الأدعية، أسماء الله، الأحاديث، الإعدادات' },
  ];

  if (isHidden) return null;

  return (
    <footer aria-label="شريط التنقل الرئيسي" className="w-full flex-shrink-0 z-40 px-3 sm:px-4 pb-2 landscape:pb-1 pt-1 landscape:pt-0.5">
      <nav 
        role="navigation"
        aria-label="القائمة الرئيسية"
        className="max-w-md landscape:max-w-xl mx-auto rounded-2xl backdrop-blur-2xl bg-white/95 dark:bg-[#0F1420]/95 border border-coolgreen-600/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/70 px-2 py-1.5 landscape:py-1 transition-all duration-300"
      >
        <div className="grid grid-cols-4 items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected =
              activeTab === tab.id ||
              (tab.id === 'adhkar' && (activeTab === 'tasbih' || activeTab === 'duas')) ||
              (tab.id === 'more' && (activeTab === 'names' || activeTab === 'hadith' || activeTab === 'friday' || activeTab === 'bookmarks'));

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    try { navigator.vibrate(15); } catch {}
                  }
                  setActiveTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 group select-none font-sans cursor-pointer ${
                  isSelected
                    ? 'text-emerald-800 dark:text-emerald-400 font-bold'
                    : 'text-gray-400 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}
                title={tab.hint}
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    isSelected
                      ? 'scale-105 bg-emerald-500/15 dark:bg-emerald-500/20 ring-1 ring-emerald-500/30 dark:ring-emerald-400/40 text-emerald-800 dark:text-emerald-400 shadow-xs'
                      : 'group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform duration-200" />
                </div>
                <span className="text-[11px] mt-1 tracking-tight font-semibold transition-colors">
                  {tab.label}
                </span>

                {/* Active Indicator Accent */}
                {isSelected && (
                  <span className="absolute -bottom-0.5 w-2.5 h-1 rounded-full bg-emerald-700 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </footer>
  );
};
