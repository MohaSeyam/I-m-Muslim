import React, { useState } from 'react';
import { hadithsNawawi } from '../../data/hadithData';
import { HadithNawawi } from '../../types';
import { BookOpen, Search, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const HadithScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedHadith, setExpandedHadith] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = hadithsNawawi.filter(h =>
    h.titleArabic.includes(search) ||
    h.arabicText.includes(search) ||
    h.titleEnglish.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (h: HadithNawawi) => {
    const text = `حديث: ${h.titleArabic}\nعن ${h.narrator}\n\n${h.arabicText}\n\nالفوائد: ${h.explanation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(h.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">الأربعون النووية</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">جوامع كلم النبي ﷺ وقواعد الشريعة الإسلامية</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث في الأحاديث والشروح..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Hadith List */}
      <div className="space-y-3">
        {filtered.map(hadith => {
          const isExpanded = expandedHadith === hadith.number;

          return (
            <div
              key={hadith.number}
              className="p-5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    {hadith.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{hadith.titleArabic}</h3>
                    <span className="text-[11px] text-gray-400">{hadith.narrator}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(hadith)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 transition"
                    title="نسخ الحديث"
                  >
                    {copiedId === hadith.number ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setExpandedHadith(isExpanded ? null : hadith.number)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Hadith Content */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="font-quran text-base text-gray-900 dark:text-gray-100 leading-loose text-right">
                  {hadith.arabicText}
                </p>
              </div>

              {/* Expanded Explanation */}
              {isExpanded && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed space-y-2">
                  <p><strong className="text-emerald-700 dark:text-emerald-300">💡 المعنى والفوائد التربوية:</strong> {hadith.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
