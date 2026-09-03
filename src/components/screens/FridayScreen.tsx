import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  Heart,
  RotateCcw,
  Award,
  CheckCircle2,
  ChevronLeft,
  Droplets,
  BookOpen,
  Clock,
  Building2,
  Flower2
} from 'lucide-react';

const STORAGE_KEY_CHECKS = 'al_mushaf_friday_sunan_v3';
const STORAGE_KEY_SALAWAT = 'al_mushaf_friday_salawat_v3';

export const FridayScreen: React.FC = () => {
  const [salawatCount, setSalawatCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SALAWAT);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [checkedSunan, setCheckedSunan] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist Salawat count
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SALAWAT, salawatCount.toString());
    } catch (e) {
      console.warn(e);
    }
  }, [salawatCount]);

  // Persist Sunan checks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKS, JSON.stringify(checkedSunan));
    } catch (e) {
      console.warn(e);
    }
  }, [checkedSunan]);

  const sunan = [
    { id: 'ghusl', title: 'الاغتسال والتطيب ولبس أحسن الثياب', desc: 'سنة مؤكدة قبل الخروج لصلاة الجمعة', icon: Droplets },
    { id: 'siwak', title: 'استعمال السواك ونظافة الفم', desc: 'تطهير للفم ونيل طيب الرائحة', icon: Flower2 },
    { id: 'early', title: 'التبكير إلى المسجد', desc: 'نيل أجر القرب والصف الأول وتدوين الملائكة للأول فالأول', icon: Building2 },
    { id: 'kahf', title: 'قراءة سورة الكهف', desc: 'تضيء للمسلم نوراً ما بين الجمعتين', icon: BookOpen },
    { id: 'salawat', title: 'الإكثار من الصلاة على النبي ﷺ', desc: 'تُعرض صلاتنا على رسول الله ﷺ في هذا اليوم الفضيل', icon: Heart },
    { id: 'dua_hour', title: 'تحري ساعة الإجابة (آخر ساعة بعد العصر)', desc: 'لا يوافقها عبد مسلم يسأل الله شيئاً إلا أعطاه إياه', icon: Clock },
  ];

  const toggleSunnah = (id: string) => {
    setCheckedSunan(prev => ({ ...prev, [id]: !prev[id] }));
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(20); } catch {}
    }
  };

  const handleResetFriday = () => {
    if (window.confirm('هل تريد إعادة تصفير مهام وسنن يوم الجمعة لهذا الأسبوع؟')) {
      setCheckedSunan({});
      setSalawatCount(0);
      try {
        localStorage.removeItem(STORAGE_KEY_CHECKS);
        localStorage.removeItem(STORAGE_KEY_SALAWAT);
      } catch {}
    }
  };

  const completedCount = sunan.filter(s => !!checkedSunan[s.id]).length;
  const progressPct = Math.round((completedCount / sunan.length) * 100);

  const isTodayFriday = new Date().getDay() === 5;
  const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(new Date());

  if (!isTodayFriday) {
    return (
      <div className="h-full max-h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fadeIn select-none font-sans">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md border border-emerald-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-sm">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
            اليوم: {dayName}
          </span>
          <h2 className="text-xl font-bold font-display text-gray-900 dark:text-slate-100">
            سنن وآداب يوم الجمعة
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
            تُفعل قائمة سنن وآداب يوم الجمعة، متابعة سورة الكهف، وعداد الصلاة على النبي ﷺ يوم الجمعة المبارك فقط. نسأل الله أن يتقبل طاعتكم في سائر الأيام.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-full flex flex-col overflow-hidden animate-fadeIn gap-2 select-none">
      {/* Scrollable Container (flex-1 min-h-0) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 space-y-3">
        {/* Friday Hero Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg space-y-2.5 text-center relative overflow-hidden border border-emerald-500/25">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-400/15 rounded-full blur-xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-emerald-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            يوم الجمعة المبارك
          </span>

          <h2 className="text-xl sm:text-2xl font-bold font-quran text-white">
            خيرُ يومٍ طلعت عليه الشمس
          </h2>

          <p className="text-[11px] text-emerald-100/90 max-w-md mx-auto leading-relaxed font-sans">
            قال رسول الله ﷺ: «خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ، فِيهِ خُلِقَ آدَمُ، وَفِيهِ أُدْخِلَ الْجَنَّةَ، وَفِيهِ أُخْرِجَ مِنْهَا»
          </p>

          {/* Progress Bar of Friday Sunan */}
          <div className="pt-1 max-w-sm mx-auto space-y-1">
            <div className="flex items-center justify-between text-[11px] text-emerald-200 font-semibold px-1">
              <span>إنجاز سنن الجمعة</span>
              <span className="text-emerald-300 font-bold">{completedCount} من {sunan.length} ({progressPct}%)</span>
            </div>
            <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500 bg-emerald-400 shadow-sm"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {progressPct === 100 && (
            <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-bold animate-fadeIn">
              <Award className="w-4 h-4" />
              هنيئاً لك! أتممت جميع سنن الجمعة
            </div>
          )}
        </div>

        {/* Salawat Smart Counter Card */}
        <div className="p-4 rounded-3xl bg-white/85 dark:bg-[#0E1A16] backdrop-blur-xl border border-emerald-500/15 dark:border-emerald-500/20 shadow-xs space-y-3 text-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Heart className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-xs">عداد الصلاة على النبي ﷺ</h3>
            </div>

            <button
              onClick={() => {
                if (window.confirm('هل تريد تصفير عداد الصلاة على النبي؟')) {
                  setSalawatCount(0);
                }
              }}
              className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
              title="تصفير عداد الصلاة"
            >
              <RotateCcw className="w-3 h-3" />
              تصفير العداد
            </button>
          </div>

          <p className="font-quran text-base sm:text-lg text-emerald-950 dark:text-slate-100 font-semibold leading-relaxed">
            اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ
          </p>

          {/* Big Tap Area */}
          <div className="flex flex-col items-center justify-center gap-1.5">
            <button
              onClick={() => {
                setSalawatCount(c => c + 1);
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  try { navigator.vibrate(25); } catch {}
                }
              }}
              className="group relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-900/30 active:scale-95 transition duration-200 flex flex-col items-center justify-center p-2 border-4 border-emerald-400/30 select-none cursor-pointer"
            >
              <span className="text-2xl sm:text-3xl font-black tracking-tight">{salawatCount}</span>
              <span className="text-[10px] text-emerald-100 font-bold">انقر للصلاة ﷺ</span>
            </button>
            <span className="text-[10px] text-gray-400">محفوظة تلقائياً في جهازك</span>
          </div>
        </div>

        {/* Friday Sunan Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              سنن وآداب يوم الجمعة المحفوظة
            </h3>

            <button
              onClick={handleResetFriday}
              className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-1 font-medium transition"
              title="إعادة تعيين الأسبوع"
            >
              <RotateCcw className="w-3 h-3" />
              تصفير الأسبوع
            </button>
          </div>

          <div className="space-y-2">
            {sunan.map(item => {
              const isDone = !!checkedSunan[item.id];
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSunnah(item.id)}
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
                    isDone
                      ? 'bg-emerald-500/10 dark:bg-[#0E1A16]/80 border-emerald-500/40 shadow-2xs'
                      : 'bg-white/90 dark:bg-[#0E1A16] backdrop-blur-md border-emerald-500/15 dark:border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-xl flex items-center justify-center border transition duration-200 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm scale-105'
                          : 'border-gray-300 dark:border-emerald-500/30 bg-gray-50 dark:bg-emerald-950/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <h4 className={`text-xs font-bold transition-colors ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                          {item.title}
                        </h4>
                        {isDone && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
