import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

const PRESET_PHRASES = [
  { text: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah' },
  { text: 'الْحَمْدُ لِلَّهِ', meaning: 'All praise is to Allah' },
  { text: 'لاَ إِلَهَ إِلاَّ اللَّهُ', meaning: 'There is no god but Allah' },
  { text: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest' },
  { text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', meaning: 'I seek forgiveness from Allah' },
  { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', meaning: 'Peace and blessings upon Muhammad' },
  { text: 'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ', meaning: 'No power nor strength except with Allah' },
  { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', meaning: 'Glory to Allah and all praise to Him' }
];

export const TasbihScreen: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState(PRESET_PHRASES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleTap = () => {
    setCount(prev => {
      const next = prev + 1;
      if (next >= target) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([60, 50, 60]);
        }
      } else {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(25);
        }
      }
      return next;
    });
    setTotalCount(t => t + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">المسبحة الإلكترونية</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">تسبيح واستغفار وذكر لله تعالى</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-gray-600 dark:text-gray-300"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-gray-600 dark:text-gray-300 hover:text-red-500"
            title="تصفير العداد"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phrase Selector Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESET_PHRASES.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedPhrase(phrase);
              setCount(0);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
              selectedPhrase.text === phrase.text
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-[#15241f] text-gray-700 dark:text-gray-300 border-emerald-100 dark:border-emerald-950'
            }`}
          >
            {phrase.text}
          </button>
        ))}
      </div>

      {/* Target Selector */}
      <div className="flex justify-center gap-2">
        {[33, 99, 100, 1000].map(t => (
          <button
            key={t}
            onClick={() => {
              setTarget(t);
              setCount(0);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              target === t
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            الهدف: {t}
          </button>
        ))}
      </div>

      {/* Big Circular Tap Area */}
      <div className="flex flex-col items-center justify-center py-6">
        <div
          onClick={handleTap}
          className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-2xl shadow-emerald-900/30 cursor-pointer active:scale-95 transition-transform duration-150 select-none"
        >
          {/* Progress Ring Simulation */}
          <div className="absolute inset-2 rounded-full border-4 border-white/20" />
          <div
            className="absolute inset-2 rounded-full border-4 border-emerald-300 transition-all duration-200"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${progress >= 25 ? '100% 0%' : '50% 0%'}, ${progress >= 50 ? '100% 100%' : '50% 50%'}, ${progress >= 75 ? '0% 100%' : '50% 50%'}, ${progress >= 100 ? '0% 0%' : '50% 50%'})`
            }}
          />

          <div className="z-10 text-center space-y-2 px-6">
            <span className="font-quran text-lg font-bold text-emerald-100 block leading-tight">
              {selectedPhrase.text}
            </span>
            <span className="text-5xl font-black tracking-tight block">
              {count}
            </span>
            <span className="text-xs text-emerald-200 block font-semibold">
              الهدف: {target}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          اضغط في أي مكان داخل الدائرة للتسبيح
        </p>
      </div>

      {/* Total Sessions Stats */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">إجمالي التسبيحات في الجلسة</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">تقبل الله طاعتكم ورفع درجاتكم</p>
          </div>
        </div>
        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalCount}</span>
      </div>
    </div>
  );
};
