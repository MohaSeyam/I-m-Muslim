import React, { useState } from 'react';
import { namesOfAllah } from '../../data/namesOfAllahData';
import { NameOfAllah } from '../../types';
import { Search, Sparkles, X } from 'lucide-react';

export const NamesOfAllahScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState<NameOfAllah | null>(null);

  const filtered = namesOfAllah.filter(n =>
    n.arabic.includes(search) ||
    n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
    n.meaningEn.toLowerCase().includes(search.toLowerCase()) ||
    n.meaningAr.includes(search)
  );

  return (
    <div className="h-full max-h-full flex flex-col overflow-hidden animate-fadeIn gap-2 select-none">
      {/* Header (flex-shrink-0) */}
      <div className="flex-shrink-0">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          أسماء الله الحسنى
        </h2>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          قال ﷺ: "إن لله تسعة وتسعين اسما مائة إلا واحدا من أحصاها دخل الجنة"
        </p>
      </div>

      {/* Search Bar (flex-shrink-0) */}
      <div className="relative flex-shrink-0">
        <input
          type="text"
          placeholder="ابحث في أسماء الله ومعانيها..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pr-9 pl-4 py-2 rounded-xl backdrop-blur-xl bg-white/80 dark:bg-[#0E1A16] border border-emerald-500/20 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
        <Search className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Names Grid (flex-1 min-h-0) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-1">
          {filtered.map(name => (
            <div
              key={name.number}
              onClick={() => setSelectedName(name)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#0E1A16] border border-emerald-500/15 dark:border-emerald-500/20 hover:border-emerald-500/40 shadow-xs hover:shadow transition cursor-pointer text-center space-y-1 group"
            >
              <span className="inline-block text-[10px] w-5 h-5 leading-5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                {name.number}
              </span>
              <h3 className="font-quran text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-100 group-hover:scale-105 transition-transform">
                {name.arabic}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{name.transliteration}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 leading-relaxed">{name.meaningAr}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedName && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="backdrop-blur-2xl bg-white/95 dark:bg-[#0E1A16] rounded-3xl p-5 max-w-sm w-full border border-emerald-500/25 shadow-2xl space-y-3 text-center animate-scaleUp">
            <div className="flex justify-between items-center">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25">
                الاسم رقم #{selectedName.number}
              </span>
              <button
                onClick={() => setSelectedName(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-quran text-3xl sm:text-4xl font-bold text-emerald-950 dark:text-emerald-100 py-1">
              {selectedName.arabic}
            </h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedName.transliteration}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{selectedName.meaningEn}</p>

            <div className="p-3.5 rounded-2xl backdrop-blur-md bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/15 text-xs text-emerald-950 dark:text-emerald-100 text-right leading-relaxed space-y-1.5">
              <p><strong className="text-emerald-700 dark:text-emerald-300">المعنى والشرح:</strong> {selectedName.meaningAr}</p>
              <p><strong className="text-emerald-700 dark:text-emerald-300">الشاهد القرآني:</strong> {selectedName.quranReference}</p>
            </div>

            <button
              onClick={() => setSelectedName(null)}
              className="w-full py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
