import React, { useState, useRef } from 'react';
import { dailyDuas } from '../../data/duasData';
import { DuaItem } from '../../types';
import { HeartHandshake, Copy, Check, Search, Sparkles, X } from 'lucide-react';
import { toArabicNumerals } from '../../data/quranData';

export const DuasScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'جميع الأدعية' },
    { id: 'prophets', label: 'أدعية الأنبياء' },
    { id: 'quranic', label: 'أدعية قرآنية' },
    { id: 'prophetic', label: 'جوامع الدعاء النبوي' },
    { id: 'repentance', label: 'التوبة والمغفرة' },
    { id: 'family', label: 'الأسرة والأولاد' },
    { id: 'anxiety', label: 'تفريج الكرب والهم' },
    { id: 'healing', label: 'الشفاء والعافية' },
    { id: 'parents', label: 'الوالدين والذرية' },
    { id: 'rizq', label: 'الرزق وقضاء الدين' },
    { id: 'travel', label: 'السفر وركوب الدابة' },
    { id: 'istikhara', label: 'الاستخارة والحاجة' }
  ];

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    if (search.trim()) {
      setSearch('');
    }
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = dailyDuas.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = search.trim() === '' || 
      d.title.includes(search) || 
      d.arabic.includes(search) || 
      d.translation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.translation}\nالمصدر: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full max-h-full flex flex-col overflow-hidden animate-fadeIn gap-2 select-none">
      {/* Header (flex-shrink-0) */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            الأدعية المأثورة والجامعة
          </h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            سؤال الله بخيري الدنيا والآخرة ({toArabicNumerals(filtered.length)} دعاء)
          </p>
        </div>
      </div>

      {/* Search Bar (flex-shrink-0) */}
      <div className="relative flex-shrink-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث في الأدعية بالكلمة أو الموضوع..."
          className="w-full pl-8 pr-9 py-2 rounded-xl text-xs backdrop-blur-xl bg-white/80 dark:bg-[#0E1A16]/90 border border-emerald-500/20 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
        <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute left-2.5 top-2 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs (flex-shrink-0) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
        {categories.map(cat => {
          const isSelected = activeCategory === cat.id;
          const count = cat.id === 'all' 
            ? dailyDuas.length 
            : dailyDuas.filter(d => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                  : 'backdrop-blur-md bg-white/70 dark:bg-[#0E1A16]/80 text-gray-700 dark:text-gray-300 border border-emerald-500/15 hover:border-emerald-500/40 hover:bg-emerald-500/5'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                }`}
              >
                {toArabicNumerals(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Duas List (flex-1 min-h-0, smoothly scrollable inside its bounded card area) */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5">
        {filtered.map(dua => (
          <div
            key={dua.id}
            className="p-3.5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#0C1613]/90 border border-emerald-500/15 dark:border-emerald-500/20 shadow-xs space-y-2 hover:border-emerald-500/40 transition group"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {dua.title}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(dua)}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 px-2 py-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
                title="نسخ الدعاء"
              >
                {copiedId === dua.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-right font-quran text-base sm:text-lg text-gray-900 dark:text-slate-100 leading-relaxed">
              {dua.arabic}
            </p>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal">
              {dua.translation}
            </p>

            <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
              <span>{dua.reference}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-xs">
            لا توجد أدعية تطابق بحثك حالياً
          </div>
        )}
      </div>
    </div>
  );
};
