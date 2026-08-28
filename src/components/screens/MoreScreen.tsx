import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  HeartHandshake,
  Compass,
  Sparkles,
  Bookmark,
  Type,
  RotateCcw,
  Check,
  Eye
} from 'lucide-react';
import {
  getQuranBookmarks,
  getQuranFontSize,
  saveQuranFontSize,
  getQuranTafseerFontSize,
  saveQuranTafseerFontSize,
  getQuranLineHeight,
  saveQuranLineHeight,
  DEFAULT_QURAN_FONT_SIZE,
  DEFAULT_TAFSEER_FONT_SIZE,
  DEFAULT_QURAN_LINE_HEIGHT
} from '../../utils/quranStorage';

interface MoreScreenProps {
  onNavigate: (tab: string) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ onNavigate }) => {
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [quranFontSize, setQuranFontSizeState] = useState<number>(() => getQuranFontSize());
  const [tafseerFontSize, setTafseerFontSizeState] = useState<number>(() => getQuranTafseerFontSize());
  const [lineHeight, setLineHeightState] = useState<number>(() => getQuranLineHeight());
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    const list = getQuranBookmarks();
    setBookmarksCount(list.length);
  }, []);

  const handleQuranFontSizeChange = (newSize: number) => {
    setQuranFontSizeState(newSize);
    saveQuranFontSize(newSize);
    triggerFeedback();
  };

  const handleTafseerFontSizeChange = (newSize: number) => {
    setTafseerFontSizeState(newSize);
    saveQuranTafseerFontSize(newSize);
    triggerFeedback();
  };

  const handleLineHeightChange = (newHeight: number) => {
    setLineHeightState(newHeight);
    saveQuranLineHeight(newHeight);
    triggerFeedback();
  };

  const handleResetDefaults = () => {
    setQuranFontSizeState(DEFAULT_QURAN_FONT_SIZE);
    saveQuranFontSize(DEFAULT_QURAN_FONT_SIZE);
    setTafseerFontSizeState(DEFAULT_TAFSEER_FONT_SIZE);
    saveQuranTafseerFontSize(DEFAULT_TAFSEER_FONT_SIZE);
    setLineHeightState(DEFAULT_QURAN_LINE_HEIGHT);
    saveQuranLineHeight(DEFAULT_QURAN_LINE_HEIGHT);
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 1800);
  };

  const fontPresets = [
    { label: 'صغير', size: 18 },
    { label: 'قياسي', size: 24 },
    { label: 'كبير', size: 30 },
    { label: 'كبير جداً', size: 38 }
  ];

  const sections = [
    {
      id: 'bookmarks',
      title: 'الإشارات المرجعية للقرآن',
      desc: 'الآيات المحفوظة للرجوع السريع والمتابعة',
      icon: Bookmark,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      badge: bookmarksCount > 0 ? `${bookmarksCount} آيات` : undefined,
      isFeatured: true
    },
    { id: 'names', title: 'أسماء الله الحسنى', desc: '99 اسماً مع المعاني والشواهد القرآنية', icon: Award, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
    { id: 'hadith', title: 'الأربعون النووية', desc: 'جوامع الكلم وشرح الفوائد والدروس', icon: BookOpen, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
    { id: 'duas', title: 'الأدعية المأثورة', desc: 'أدعية تفريج الكرب والوالدين والقرآن', icon: HeartHandshake, color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' },
    { id: 'friday', title: 'سنن ويوم الجمعة', desc: 'سورة الكهف، الصلاة على النبي والسنن', icon: Sparkles, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' },
    { id: 'qibla', title: 'بوصلة القبلة', desc: 'تحديد اتجاه الكعبة المشرفة بدقة', icon: Compass, color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' },
  ];

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">المزيد من الأقسام الإسلامية</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">كنوز إيمانية ومصادر موثوقة في متناول يدك</p>
      </div>

      {/* Interactive Quran Font & Readability Settings Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                تخصيص خط وقراءة القرآن
                {showSavedFeedback && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3 h-3" /> تم الحفظ
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400">تحكم بحجم الخط والمسافات لتحسين راحة العين وسهولة التلاوة</p>
            </div>
          </div>

          <button
            onClick={handleResetDefaults}
            className="text-xs text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
            title="استعادة الإعدادات الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>
        </div>

        {/* Live Arabic Verse Sample Preview Box */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-[#12211c] border border-emerald-200/70 dark:border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              معاينة حية للآية الكريمة:
            </span>
            <span className="bg-white/80 dark:bg-black/30 px-2 py-0.5 rounded-md text-[10px]">
              الحجم: {quranFontSize}px • التباعد: {lineHeight}
            </span>
          </div>

          <p
            className="font-quran text-emerald-950 dark:text-emerald-100 text-center select-none transition-all"
            style={{
              fontSize: `${quranFontSize}px`,
              lineHeight: lineHeight
            }}
          >
            ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ ﴾
          </p>

          <div className="border-t border-emerald-100 dark:border-emerald-900/50 pt-2 text-right">
            <p
              className="text-gray-700 dark:text-gray-300 font-sans leading-relaxed"
              style={{ fontSize: `${tafseerFontSize}px` }}
            >
              📖 <span className="font-bold text-emerald-700 dark:text-emerald-400">التفسير الميسر:</span> هذا القرآن يرشد الناس إلى أكمل الطرق وأعدلها في العقائد والأعمال، ويبشر المؤمنين بالجزاء الأوفى.
            </p>
          </div>
        </div>

        {/* Quran Font Size Slider & Presets */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
            <span className="flex items-center gap-1.5">
              <span>حجم الخط القرآني (Arabic Verse Size)</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {quranFontSize} px
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-bold">A-</span>
            <input
              type="range"
              min="16"
              max="42"
              step="1"
              value={quranFontSize}
              onChange={e => handleQuranFontSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">A+</span>
          </div>

          {/* Quick Size Presets */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {fontPresets.map(preset => (
              <button
                key={preset.size}
                onClick={() => handleQuranFontSizeChange(preset.size)}
                className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                  quranFontSize === preset.size
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tafseer Font Size Slider */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
            <span>حجم خط التفسير والترجمة (Tafseer Size)</span>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-extrabold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
              {tafseerFontSize} px
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400 font-bold">صغير</span>
            <input
              type="range"
              min="12"
              max="22"
              step="1"
              value={tafseerFontSize}
              onChange={e => handleTafseerFontSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[11px] text-gray-600 dark:text-gray-300 font-bold">كبير</span>
          </div>
        </div>

        {/* Line Spacing Selection */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
            <span>تباعد الأسطر والآيات (Line Spacing)</span>
            <span className="text-gray-500 text-xs">
              {lineHeight <= 1.9 ? 'متقارب' : lineHeight <= 2.4 ? 'متوسط مريح' : 'متسع واسع'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'متقارب', val: 1.9 },
              { label: 'متوسط مريح', val: 2.4 },
              { label: 'متسع واسع', val: 2.9 }
            ].map(lh => (
              <button
                key={lh.val}
                onClick={() => handleLineHeightChange(lh.val)}
                className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                  Math.abs(lineHeight - lh.val) < 0.1
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
              >
                {lh.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Islamic Navigation Sections */}
      <div className="space-y-2.5">
        {sections.map(sec => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className={`p-4 rounded-2xl border shadow-sm transition cursor-pointer flex items-center justify-between group ${
                sec.isFeatured
                  ? 'bg-gradient-to-r from-amber-50/70 to-emerald-50/70 dark:from-amber-950/30 dark:to-emerald-950/30 border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                  : 'bg-white dark:bg-[#15241f] border-emerald-100 dark:border-emerald-950 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${sec.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{sec.title}</h3>
                    {sec.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                        {sec.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sec.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-[-3px] transition">
                فتح ←
              </span>
            </div>
          );
        })}
      </div>

      {/* App Info Card */}
      <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center space-y-2">
        <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">تطبيق أنا مسلم (I'm Muslim)</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
          تطبيق إسلامي شامل ومجاني لوجه الله تعالى، مصمم ليرافقك في عباداتك اليومية من أذكار وقرآن ومواقيت صلاة وتدبر.
        </p>
        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
          تقبل الله منا ومنكم صالح الأعمال 🤍
        </p>
      </div>
    </div>
  );
};

