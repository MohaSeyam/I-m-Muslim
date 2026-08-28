import React, { useState, useMemo } from 'react';
import { dhikrCategories, dhikrItems } from '../../data/adhkarData';
import { DhikrCategory, DhikrItem } from '../../types';
import { DuasScreen } from './DuasScreen';
import { TasbihScreen } from './TasbihScreen';
import {
  Check,
  Copy,
  RotateCcw,
  Volume2,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  HeartHandshake,
  CircleDot,
  BookOpen
} from 'lucide-react';

interface AdhkarScreenProps {
  initialCategoryId?: string;
  onBack?: () => void;
}

export const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ initialCategoryId }) => {
  const [mainTab, setMainTab] = useState<'adhkar' | 'duas' | 'tasbih'>('adhkar');
  const [selectedCategory, setSelectedCategory] = useState<DhikrCategory | null>(() => {
    if (initialCategoryId) {
      return dhikrCategories.find(c => c.id === initialCategoryId) || null;
    }
    return null;
  });

  const [activeSection, setActiveSection] = useState<'all' | 'daily' | 'prayer' | 'praise' | 'life'>('all');
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(18);

  const filteredCategories = useMemo(() => {
    if (activeSection === 'all') return dhikrCategories;
    return dhikrCategories.filter(c => c.section === activeSection);
  }, [activeSection]);

  const currentCategoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return dhikrItems.filter(item => item.categoryId === selectedCategory.id);
  }, [selectedCategory]);

  const completedCount = useMemo(() => {
    if (!selectedCategory) return 0;
    return currentCategoryItems.filter(item => {
      const current = itemCounts[item.id] || 0;
      return current >= item.countTarget;
    }).length;
  }, [currentCategoryItems, itemCounts, selectedCategory]);

  const totalProgressPercentage = currentCategoryItems.length > 0
    ? Math.round((completedCount / currentCategoryItems.length) * 100)
    : 0;

  const handleIncrement = (item: DhikrItem) => {
    const current = itemCounts[item.id] || 0;
    if (current < item.countTarget) {
      setItemCounts(prev => ({
        ...prev,
        [item.id]: current + 1
      }));
      // Simple Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(current + 1 === item.countTarget ? [40, 40, 40] : 25);
      }
    }
  };

  const handleResetSession = () => {
    if (!selectedCategory) return;
    const updated = { ...itemCounts };
    currentCategoryItems.forEach(item => {
      delete updated[item.id];
    });
    setItemCounts(updated);
  };

  const handleCopy = (item: DhikrItem) => {
    const text = `${item.textArabic}\n\n${item.rewardArabic}\nالمصدر: ${item.source}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Segmented Sub-Nav: Adhkar vs Duas vs Tasbih */}
      <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-[#15241f] p-1 rounded-2xl border border-emerald-100/60 dark:border-emerald-950/60">
        <button
          onClick={() => {
            setMainTab('adhkar');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mainTab === 'adhkar'
              ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>حصن المسلم</span>
        </button>

        <button
          onClick={() => {
            setMainTab('duas');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mainTab === 'duas'
              ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>الأدعية</span>
        </button>

        <button
          onClick={() => {
            setMainTab('tasbih');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mainTab === 'tasbih'
              ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span>المسبحة</span>
        </button>
      </div>

      {/* RENDER ACTIVE MAIN TAB */}
      {mainTab === 'duas' && <DuasScreen />}
      {mainTab === 'tasbih' && <TasbihScreen />}

      {mainTab === 'adhkar' && (
        <>
          {/* If no category is selected: Show category list */}
          {!selectedCategory ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">حصن المسلم والأذكار</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">أذكار اليوم والليلة المأثورة عن النبي ﷺ</p>
                </div>
              </div>

              {/* Section Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'daily', label: 'اليوم والليلة' },
                  { id: 'prayer', label: 'الصلاة والمسجد' },
                  { id: 'praise', label: 'تسبيح ورقية' },
                  { id: 'life', label: 'الحياة واليوميات' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      activeSection === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#15241f] text-gray-600 dark:text-gray-400 border border-emerald-100 dark:border-emerald-950 hover:border-emerald-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCategories.map(cat => {
                  const itemsCount = dhikrItems.filter(i => i.categoryId === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className="group p-4 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{cat.titleArabic}</h3>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{cat.descriptionArabic}</p>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
                            {itemsCount} أذكار • {cat.timeContext}
                          </span>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-[-2px] transition" />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Selected Category Reader View */
            <div className="space-y-4">
              {/* Category Header & Back */}
              <div className="flex items-center justify-between bg-white dark:bg-[#15241f] p-3 rounded-2xl border border-emerald-100 dark:border-emerald-950 shadow-xs">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:opacity-80 px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  كل الأقسام
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetSession}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    title="إعادة تصفير العداد"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    تصفير
                  </button>
                </div>
              </div>

              {/* Progress Summary Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{selectedCategory.titleArabic}</h2>
                    <p className="text-xs text-emerald-100 mt-0.5">{selectedCategory.timeContext}</p>
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-black">{totalProgressPercentage}%</span>
                    <span className="text-[11px] block text-emerald-200">
                      {completedCount} من {currentCategoryItems.length} مكتمل
                    </span>
                  </div>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${totalProgressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Dhikr Items List */}
              <div className="space-y-3">
                {currentCategoryItems.map((item, idx) => {
                  const current = itemCounts[item.id] || 0;
                  const isDone = current >= item.countTarget;
                  const remaining = Math.max(0, item.countTarget - current);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleIncrement(item)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative overflow-hidden select-none active:scale-[0.99] ${
                        isDone
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                          : 'bg-white dark:bg-[#15241f] border-emerald-100 dark:border-emerald-950 shadow-sm hover:border-emerald-200'
                      }`}
                    >
                      {/* Top Meta & Action */}
                      <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                        <span className="font-bold text-gray-500 dark:text-gray-400">
                          الذكر {idx + 1}
                        </span>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleCopy(item)}
                            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-emerald-600"
                            title="نسخ الذكر"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Main Arabic Text */}
                      <p
                        className="font-arabic text-right text-gray-900 dark:text-gray-100 leading-loose"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {item.textArabic}
                      </p>

                      {/* Reward / Fadl */}
                      {item.rewardArabic && (
                        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-sans">
                          <span className="font-bold">✨ الفضل: </span>
                          {item.rewardArabic}
                          <span className="block text-[10px] text-amber-700 dark:text-amber-400 mt-1 font-semibold">
                            المصدر: {item.source}
                          </span>
                        </div>
                      )}

                      {/* Interactive Counter Tap Button */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400">انقر في أي مكان للتكرار</span>

                        <div
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>اكتمل ({item.countTarget})</span>
                            </>
                          ) : (
                            <>
                              <span>{current}</span>
                              <span className="text-xs opacity-60">/ {item.countTarget}</span>
                              <span className="text-xs text-amber-600 dark:text-amber-400 font-normal">
                                (متبقي {remaining})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
