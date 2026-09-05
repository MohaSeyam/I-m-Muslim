import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { toArabicNumerals } from '../../data/quranData';
import { islamicAudio } from '../../utils/audioService';
import { getStoredSettings } from '../../utils/settingsStorage';

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
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const s = getStoredSettings();
    return s.soundEffects !== false;
  });

  const playClickSound = () => {
    if (!soundEnabled) return;
    islamicAudio.playClick();
  };

  const playChimeSound = () => {
    if (!soundEnabled) return;
    islamicAudio.playDhikrCompletion();
  };

  const handleTap = () => {
    setCount(prev => {
      const next = prev + 1;
      playClickSound();

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          if (next === target) {
            navigator.vibrate([40, 60, 40]);
          } else {
            navigator.vibrate(15);
          }
        } catch {}
      }

      if (next === target) {
        playChimeSound();
      }

      return next;
    });

    setTotalCount(prev => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(30); } catch {}
    }
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, count / target);
  const strokeDashoffset = circumference * (1 - progressRatio);
  const isTargetReached = count >= target;

  return (
    <div className="h-full max-h-full flex flex-col justify-between overflow-hidden screen-fade-in select-none gap-2">
      {/* 1. Header (flex-shrink-0) */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold font-display text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-coolgreen-700 dark:text-coolgreen-400" />
            المسبحة الإلكترونية
          </h2>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
            مجموع التسبيحات اليوم: <span className="font-extrabold font-display text-burgundy-700 dark:text-burgundy-300">{toArabicNumerals(totalCount)}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs flex items-center transition cursor-pointer ${
              soundEnabled
                ? 'bg-coolgreen-50 dark:bg-coolgreen-950/40 text-coolgreen-800 dark:text-coolgreen-300 border-coolgreen-500/20'
                : 'bg-white/80 dark:bg-[#071611] text-gray-400 border-coolgreen-500/15'
            }`}
            title={soundEnabled ? 'صوت النقر مفعّل' : 'صوت النقر مكتوم'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-coolgreen-700 dark:text-coolgreen-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/80 dark:bg-[#071611] border border-coolgreen-500/20 text-gray-600 dark:text-gray-300 hover:text-burgundy-600 hover:border-burgundy-300 transition cursor-pointer"
            title="تصفير العداد"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Phrase Selector Carousel (flex-shrink-0) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar flex-shrink-0 font-naskh">
        {PRESET_PHRASES.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedPhrase(phrase);
              setCount(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-150 border backdrop-blur-md cursor-pointer ${
              selectedPhrase.text === phrase.text
                ? 'bg-coolgreen-700 text-white border-coolgreen-700 shadow-xs'
                : 'bg-white/90 dark:bg-[#071611] text-gray-700 dark:text-gray-300 border-coolgreen-500/15 hover:border-coolgreen-500/35'
            }`}
          >
            {phrase.text}
          </button>
        ))}
      </div>

      {/* 3. Target Selector (flex-shrink-0) */}
      <div className="flex justify-center gap-1.5 flex-shrink-0 font-sans">
        {[33, 99, 100, 1000].map(t => (
          <button
            key={t}
            onClick={() => {
              setTarget(t);
              setCount(0);
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              target === t
                ? 'bg-burgundy-700 dark:bg-burgundy-600 text-white shadow-xs'
                : 'bg-white/90 dark:bg-[#071611] text-coolgreen-800 dark:text-iceblue-200 border border-coolgreen-500/20'
            }`}
          >
            الهدف: {toArabicNumerals(t)}
          </button>
        ))}
      </div>

      {/* 4. Big Circular Glassmorphic Tap Area */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-2">
        <div
          onClick={handleTap}
          className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center backdrop-blur-2xl bg-gradient-to-br from-coolgreen-800 via-coolgreen-900 to-[#041510] text-white shadow-2xl shadow-coolgreen-950/40 dark:shadow-black/70 cursor-pointer active:scale-95 transition-transform duration-150 select-none border border-coolgreen-400/30 dark:border-burgundy-400/30 group"
        >
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-2" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-white/15 dark:stroke-white/10 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-iceblue-400 fill-none transition-all duration-300 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="z-10 text-center space-y-2 px-5">
            <span className="font-naskh text-lg sm:text-xl font-bold text-iceblue-100 block leading-tight">
              {selectedPhrase.text}
            </span>
            <span className="text-5xl sm:text-6xl font-black tracking-tight block font-display text-white">
              {toArabicNumerals(count)}
            </span>
            <span className="text-xs text-iceblue-200 block font-bold font-sans flex items-center justify-center gap-1">
              {isTargetReached ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-burgundy-300" />
                  <span>اكتمل الهدف ({toArabicNumerals(target)})</span>
                </>
              ) : (
                <span>الهدف: {toArabicNumerals(target)} (متبقي {toArabicNumerals(Math.max(0, target - count))})</span>
              )}
            </span>
          </div>
        </div>

        <p className="text-xs font-sans text-coolgreen-800 dark:text-coolgreen-300 mt-2.5 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-burgundy-500" />
          اضغط داخل الدائرة للتسبيح المبارك
        </p>
      </div>
    </div>
  );
};
