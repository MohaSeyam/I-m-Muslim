import React, { useState } from 'react';
import { hadithsNawawi } from '../../data/hadithData';
import { HadithNawawi } from '../../types';
import { BookOpen, Search, Copy, Check, ChevronDown, ChevronUp, Sparkles, BookMarked, CheckCircle2 } from 'lucide-react';
import { toArabicNumerals } from '../../data/quranData';

export const HadithScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedHadith, setExpandedHadith] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = hadithsNawawi.filter(h =>
    h.titleArabic.includes(search) ||
    h.arabicText.includes(search) ||
    h.explanation.includes(search) ||
    (h.benefits && h.benefits.some(b => b.includes(search))) ||
    h.titleEnglish.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (h: HadithNawawi) => {
    const benefitsText = h.benefits && h.benefits.length > 0
      ? `\n\nالفوائد المستفادة:\n` + h.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')
      : '';
    const text = `حديث: ${h.titleArabic}\nعن: ${h.narrator}\n\n${h.arabicText}\n\nالشرح والمعنى:\n${h.explanation}${benefitsText}\n\nتطبيق أنا مسلم`;
    navigator.clipboard.writeText(text);
    setCopiedId(h.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full max-h-full flex flex-col overflow-hidden animate-fadeIn gap-2.5 select-none font-sans">
      {/* Header (flex-shrink-0) */}
      <div className="flex-shrink-0 flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2 font-display">
            <BookMarked className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            الأربعون النووية
          </h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-sans">
            أصول الدين وقواعد الشريعة مع الشرح الموسع والفوائد المستفادة ({toArabicNumerals(filtered.length)} حديث)
          </p>
        </div>
      </div>

      {/* Search Bar (flex-shrink-0) */}
      <div className="relative flex-shrink-0 px-0.5">
        <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث في الأحاديث، الشروح، والفوائد..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2 rounded-2xl bg-white/90 dark:bg-[#0E1A16] border border-emerald-500/20 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-sans placeholder:text-gray-400"
        />
      </div>

      {/* Hadith List (flex-1 min-h-0) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 space-y-3 pb-4">
        {filtered.map(hadith => {
          const isExpanded = expandedHadith === hadith.number;

          return (
            <div
              key={hadith.number}
              className="p-4 rounded-3xl bg-white/90 dark:bg-[#0E1A16] border border-emerald-500/15 dark:border-white/10 shadow-xs space-y-3 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                    {toArabicNumerals(hadith.number)}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm font-display">
                      {hadith.titleArabic}
                    </h3>
                    <span className="text-[11px] text-gray-400 dark:text-slate-400 font-sans">
                      عن {hadith.narrator}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(hadith)}
                    className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition cursor-pointer"
                    title="نسخ الحديث مع الشرح والفوائد"
                  >
                    {copiedId === hadith.number ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setExpandedHadith(isExpanded ? null : hadith.number)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
                    title={isExpanded ? 'إغلاق الشرح' : 'عرض الشرح والفوائد'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Hadith Content */}
              <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                <p className="font-quran text-base sm:text-lg text-gray-900 dark:text-slate-100 leading-loose text-right selection:bg-emerald-200 dark:selection:bg-emerald-900">
                  {hadith.arabicText}
                </p>
              </div>

              {/* Expanded Explanation & Benefits */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-emerald-500/15 space-y-3 animate-fadeIn">
                  {/* Detailed Explanation */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 text-xs leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 font-display text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>الشرح والمعنى الإجمالي:</span>
                    </div>
                    <p className="text-gray-800 dark:text-slate-200 font-sans leading-relaxed">
                      {hadith.explanation}
                    </p>
                  </div>

                  {/* Lessons & Benefits */}
                  {hadith.benefits && hadith.benefits.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300 font-display text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>الفوائد والدروس المستفادة:</span>
                      </div>
                      <ul className="space-y-1.5 pr-1">
                        {hadith.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-800 dark:text-slate-200 font-sans leading-relaxed">
                            <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                              {toArabicNumerals(idx + 1)}
                            </span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
