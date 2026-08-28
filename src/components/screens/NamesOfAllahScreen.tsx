import React, { useState } from 'react';
import { namesOfAllah } from '../../data/namesOfAllahData';
import { NameOfAllah } from '../../types';
import { Search, Sparkles, BookOpen, Volume2, Info } from 'lucide-react';

export const NamesOfAllahScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState<NameOfAllah | null>(null);

  const filtered = namesOfAllah.filter(n =>
    n.arabic.includes(search) ||
    n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
    n.meaningEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">أسماء الله الحسنى</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">قال ﷺ: "إن لله تسعة وتسعين اسما مائة إلا واحدا من أحصاها دخل الجنة"</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث في أسماء الله ومعانيها..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map(name => (
          <div
            key={name.number}
            onClick={() => setSelectedName(name)}
            className="p-4 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 hover:border-emerald-500 shadow-sm transition cursor-pointer text-center space-y-2 group"
          >
            <span className="inline-block text-[10px] w-6 h-6 leading-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
              {name.number}
            </span>
            <h3 className="font-quran text-2xl font-bold text-emerald-950 dark:text-emerald-100 group-hover:scale-105 transition-transform">
              {name.arabic}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{name.transliteration}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{name.meaningAr}</p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedName && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#15241f] rounded-3xl p-6 max-w-sm w-full border border-emerald-200 dark:border-emerald-900 shadow-2xl space-y-4 text-center animate-scaleUp">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold">
              الاسم رقم #{selectedName.number}
            </span>
            <h3 className="font-quran text-4xl font-bold text-emerald-950 dark:text-emerald-100 py-2">
              {selectedName.arabic}
            </h3>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedName.transliteration}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{selectedName.meaningEn}</p>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 text-xs text-emerald-950 dark:text-emerald-100 text-right leading-relaxed space-y-2">
              <p><strong className="text-emerald-700 dark:text-emerald-300">المعنى والشرح:</strong> {selectedName.meaningAr}</p>
              <p><strong className="text-emerald-700 dark:text-emerald-300">الشاهد القرآني:</strong> {selectedName.quranReference}</p>
            </div>

            <button
              onClick={() => setSelectedName(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
