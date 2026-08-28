import React, { useState } from 'react';
import { Check, Sparkles, Heart, BookOpen, Clock } from 'lucide-react';

export const FridayScreen: React.FC = () => {
  const [salawatCount, setSalawatCount] = useState(0);
  const [checkedSunan, setCheckedSunan] = useState<Record<string, boolean>>({});

  const sunan = [
    { id: 'ghusl', title: 'الاغتسال والتطيب ولبس أحسن الثياب', desc: 'سنة مؤكدة قبل الخروج لصلاة الجمعة' },
    { id: 'siwak', title: 'استعمال السواك', desc: 'لتطهير الفم وطيب الرائحة' },
    { id: 'early', title: 'التبكير إلى المسجد', desc: 'نيل أجر القرب والصف الأول' },
    { id: 'kahf', title: 'قراءة سورة الكهف', desc: 'تضيء للمسلم نورا ما بين الجمعتين' },
    { id: 'salawat', title: 'الإكثار من الصلاة على النبي ﷺ', desc: 'تُعرض صلاتنا على رسول الله ﷺ' },
    { id: 'dua_hour', title: 'تحري ساعة الاستجابة (آخر ساعة بعد العصر)', desc: 'لا يوافقها عبد مسلم يسأل الله خيرا إلا أعطاه' },
  ];

  const toggleSunnah = (id: string) => {
    setCheckedSunan(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Friday Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-emerald-800 text-white shadow-xl space-y-3 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold">✨ يوم الجمعة المبارك ✨</span>
        <h2 className="text-2xl font-bold font-quran">خير يوم طلعت عليه الشمس</h2>
        <p className="text-xs text-amber-100 max-w-md mx-auto leading-relaxed">
          قال ﷺ: "خير يوم طلعت عليه الشمس يوم الجمعة، فيه خُلق آدم، وفيه أُدخل الجنة، وفيه أُخرج منها، ولا تقوم الساعة إلا في يوم الجمعة".
        </p>
      </div>

      {/* Salawat Counter */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
          <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
          <h3 className="font-bold text-sm">عداد الصلاة على النبي ﷺ</h3>
        </div>

        <p className="font-quran text-lg text-gray-900 dark:text-gray-100 py-1">
          اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setSalawatCount(c => c + 1);
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
            }}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-md active:scale-95 transition"
          >
            صلِّ على النبي ({salawatCount})
          </button>
        </div>
      </div>

      {/* Friday Sunan Checklist */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          قائمة سنن وآداب يوم الجمعة
        </h3>

        <div className="space-y-2">
          {sunan.map(item => {
            const isDone = !!checkedSunan[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleSunnah(item.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-[#15241f] border-emerald-100 dark:border-emerald-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDone ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
