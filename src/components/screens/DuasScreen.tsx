import React, { useState } from 'react';
import { dailyDuas } from '../../data/duasData';
import { DuaItem } from '../../types';
import { HeartHandshake, Copy, Check, Search } from 'lucide-react';

export const DuasScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', label: 'جميع الأدعية' },
    { id: 'quranic', label: 'أدعية قرآنية' },
    { id: 'anxiety', label: 'تفريج الكرب والهم' },
    { id: 'parents', label: 'الوالدين والذرية' },
    { id: 'istikhara', label: 'الاستخارة والحاجة' }
  ];

  const filtered = dailyDuas.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = d.title.includes(search) || d.arabic.includes(search) || d.translation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.translation}\nالمصدر: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">الأدعية المأثورة والجامعة</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">سؤال الله بخيري الدنيا والآخرة والاعتصام به</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#15241f] text-gray-600 dark:text-gray-400 border border-emerald-100 dark:border-emerald-950'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Duas List */}
      <div className="space-y-3">
        {filtered.map(dua => (
          <div
            key={dua.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 className="font-bold text-xs text-emerald-700 dark:text-emerald-400">{dua.title}</h3>
              <button
                onClick={() => handleCopy(dua)}
                className="p-1 text-gray-400 hover:text-emerald-600 transition"
                title="نسخ الدعاء"
              >
                {copiedId === dua.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="font-quran text-lg text-gray-900 dark:text-gray-100 leading-loose text-right">
              {dua.arabic}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left dir-ltr">
              {dua.translation}
            </p>

            <div className="pt-2 text-[11px] text-gray-400 text-right">
              📖 {dua.reference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
