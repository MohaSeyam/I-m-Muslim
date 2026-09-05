import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Sparkles,
  Bookmark,
  Type,
  Bell,
  SlidersHorizontal,
  Flame,
  Check,
  Sun,
  Moon,
  Wifi,
  Smartphone,
  ShieldCheck,
  Info,
  ChevronLeft,
  ChevronRight,
  Settings,
  Palette,
  Heart,
  BookMarked,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Share2,
  Download,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { getStoredSettings, updateStoredSettings, AppSettings } from '../../utils/settingsStorage';
import { DAILY_HABITS, getTodayCompletedHabits, toggleHabit, getHabitsStreak, HabitItem } from '../../utils/habitsStorage';
import { toArabicNumerals } from '../../data/quranData';
import { getHijriDate } from '../../utils/hijriCalendar';
import { AppLogo } from '../AppLogo';

interface MoreScreenProps {
  onNavigate: (tab: string, subParam?: any) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'features' | 'settings'>('features');
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [completedHabits, setCompletedHabits] = useState<string[]>(() => getTodayCompletedHabits());
  const [streakCount, setStreakCount] = useState<number>(() => getHabitsStreak());
  const [showHabitsSection, setShowHabitsSection] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [habitCategoryFilter, setHabitCategoryFilter] = useState<'all' | 'fard' | 'sunnah' | 'quran' | 'dhikr'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getStoredSettings());
    };
    window.addEventListener('app_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('app_settings_changed', handleSettingsChange);
  }, []);

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = updateStoredSettings(partial);
    setSettings(updated);
    showToast('تم حفظ التغييرات بنجاح');
  };

  const handleHabitToggle = (habitId: string) => {
    if (settings.hapticFeedback && navigator.vibrate) {
      try { navigator.vibrate(20); } catch {}
    }
    const res = toggleHabit(habitId);
    const safeCompleted = res.newCompleted || res.completedIds || [];
    setCompletedHabits(safeCompleted);
    setStreakCount(res.streak ?? getHabitsStreak());
  };

  const isTodayFriday = new Date().getDay() === 5;
  const hijriPreview = getHijriDate(new Date(), settings.hijriAdjustment ?? 0);

  const featuresList = [
    {
      id: 'habits',
      title: 'المواظبة اليومية والأوراد',
      desc: `سجل الطاعات اليومية (${toArabicNumerals(completedHabits.length)}/${toArabicNumerals(DAILY_HABITS.length)}) ومتابعة الأيام المتتالية`,
      icon: Flame,
      action: () => setShowHabitsSection(true)
    },
    {
      id: 'names',
      title: 'أسماء الله الحسنى',
      desc: '٩٩ اسماً مع المعاني والتأملات الإيمانية',
      icon: Award,
      action: () => onNavigate('names')
    },
    {
      id: 'hadith',
      title: 'الأحاديث النبوية',
      desc: 'الأربعون النووية مع الشرح الموسع والفوائد',
      icon: BookMarked,
      action: () => onNavigate('hadith')
    },
    ...(isTodayFriday ? [{
      id: 'friday',
      title: 'سنن يوم الجمعة',
      desc: 'سورة الكهف، الصلاة على النبي، وآداب الجمعة',
      icon: Sparkles,
      action: () => onNavigate('friday')
    }] : []),
    {
      id: 'duas',
      title: 'الأدعية المأثورة',
      desc: 'أدعية الأنبياء، القرآن الكريم، وجوامع الكلم',
      icon: Heart,
      action: () => onNavigate('duas')
    },
    {
      id: 'tasbih',
      title: 'المسبحة الإلكترونية',
      desc: 'عداد الاستغفار والتسبيح مع اهتزاز لمسي',
      icon: Sparkles,
      action: () => onNavigate('tasbih')
    },
    {
      id: 'bookmarks',
      title: 'الفواصل والإشارات المرجعية',
      desc: 'مواضع القراءة المحفوظة في المصحف الشريف',
      icon: Bookmark,
      action: () => onNavigate('bookmarks')
    },
    {
      id: 'export_branding',
      title: 'شعار التطبيق وشاشة البداية (Splash & Logo)',
      desc: 'عرض وتحميل اللوجو الرسمي وصورة Splash Screen للتصدير',
      icon: ImageIcon,
      action: () => setShowExportModal(true)
    }
  ];

  const filteredHabits = DAILY_HABITS.filter(h => {
    if (habitCategoryFilter === 'all') return true;
    return h.category === habitCategoryFilter;
  });

  const completionPercent = Math.round(((completedHabits.length) / DAILY_HABITS.length) * 100);

  // If user opened the dedicated "المواظبة اليومية والأوراد" section
  if (showHabitsSection) {
    return (
      <div className="flex-1 min-h-0 flex flex-col font-sans relative overflow-hidden select-none">
        {/* Header with Back button */}
        <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md border border-coolgreen-600/20 dark:border-white/10 flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowHabitsSection(false)}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer text-gray-700 dark:text-slate-200"
              title="رجوع للأقسام"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-extrabold font-display text-base text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>المواظبة اليومية والأوراد</span>
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
                سجل متابعة الأعمال الصالحة والصلوات والأوراد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{toArabicNumerals(streakCount)} أيام متتالية</span>
          </div>
        </div>

        {/* Scrollable Habits List */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3 pb-6">
          {/* Progress Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white border border-emerald-700/40 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-100">
                إنجاز اليوم: {toArabicNumerals(completedHabits.length)} من {toArabicNumerals(DAILY_HABITS.length)}
              </span>
              <span className="text-xs font-extrabold text-white font-sans">
                {toArabicNumerals(completionPercent)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            {completionPercent === 100 && (
              <div className="mt-3 text-center text-xs font-bold text-emerald-200 bg-white/10 py-1.5 rounded-xl">
                ✨ ماشاء الله! أتممت جميع أوراد وطاعات اليوم كاملة، تقبل الله منا ومنكم!
              </div>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'fard', label: 'الفرائض' },
              { id: 'sunnah', label: 'السنن والنوافل' },
              { id: 'quran', label: 'القرآن الكريم' },
              { id: 'dhikr', label: 'الأذكار والتحصين' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setHabitCategoryFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  habitCategoryFilter === f.id
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white dark:bg-[#121824] text-gray-800 dark:text-slate-200 border-gray-200 dark:border-white/10 hover:border-emerald-500/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Habits Grid */}
          <div className="space-y-2">
            {filteredHabits.map(habit => {
              const isDone = completedHabits.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  onClick={() => handleHabitToggle(habit.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-xs'
                      : 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10 text-gray-900 dark:text-slate-100 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition flex-shrink-0 ${
                        isDone ? 'bg-emerald-600 text-white' : 'border-2 border-gray-300 dark:border-slate-500'
                      }`}
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold font-sans ${isDone ? 'line-through opacity-70 text-emerald-950 dark:text-emerald-200' : 'text-gray-900 dark:text-white'}`}>
                        {habit.titleArabic || habit.title}
                      </h4>
                      <p className="text-[11px] font-sans mt-0.5 text-gray-600 dark:text-slate-300">
                        {habit.targetDesc || habit.categoryTitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-gray-700 dark:text-slate-200 flex-shrink-0">
                    {habit.categoryTitle || (habit.category === 'fard' ? 'فريضة' : habit.category === 'sunnah' ? 'سنة' : habit.category === 'quran' ? 'قرآن' : 'أذكار')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col font-sans relative overflow-hidden select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-950 dark:bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-white/10 animate-scaleUp">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Segment Switcher: Features vs Settings */}
      <div className="p-1 rounded-2xl bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md border border-coolgreen-600/20 dark:border-white/10 flex items-center gap-1 mb-2 flex-shrink-0">
        <button
          onClick={() => setActiveTab('features')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'features'
              ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الأبواب والخدمات</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات التطبيق</span>
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3 pb-6">
        {activeTab === 'features' ? (
          <div className="space-y-3">
            {/* Grid of Islamic Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {featuresList.map(feat => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.id}
                    onClick={feat.action}
                    className="p-3.5 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-sm hover:border-emerald-500/50 active:scale-[0.99] transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs border border-emerald-500/20 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold font-display text-sm text-gray-900 dark:text-slate-100">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
                          {feat.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 1. Hijri Date Adjustment Setting */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-slate-100 font-display">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>تعديل التاريخ الهجري</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {toArabicNumerals(hijriPreview.day)} {hijriPreview.monthNameAr} {toArabicNumerals(hijriPreview.year)} هـ
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-slate-400 font-sans">
                اضبط التاريخ بتقديم أو تأخير يوم أو يومين ليتوافق بدقة مع الرؤية الشرعية لبلدك:
              </p>

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { value: -2, label: '-٢ يوم' },
                  { value: -1, label: '-١ يوم' },
                  { value: 0, label: 'تلقائي (٠)' },
                  { value: 1, label: '+١ يوم' },
                  { value: 2, label: '+٢ يوم' },
                ].map(opt => {
                  const isSel = (settings.hijriAdjustment ?? 0) === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdateSettings({ hijriAdjustment: opt.value })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer text-center border ${
                        isSel
                          ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-gray-50 dark:bg-[#182030] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-emerald-500/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Theme Setting (Light, Dark, System) */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-slate-100 font-display">
                <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>مظهر التطبيق</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'داكن', icon: Moon },
                  { id: 'light', label: 'فاتح', icon: Sun },
                  { id: 'system', label: 'تلقائي', icon: Smartphone }
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSel = (settings.themeMode || 'dark') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleUpdateSettings({ themeMode: opt.id as any })}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer border ${
                        isSel
                          ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-gray-50 dark:bg-[#182030] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-emerald-500/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Quran Typography Settings */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-slate-100 font-display">
                <Type className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>خط المصحف الشريف</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'uthmani', label: 'عثماني أصيل', sample: 'بِسْمِ ٱللَّهِ' },
                  { id: 'amiri', label: 'أميري قرآني', sample: 'بِسْمِ ٱللَّهِ' },
                  { id: 'scheherazade', label: 'النسخ الواضح', sample: 'بِسْمِ ٱللَّهِ' }
                ].map(font => {
                  const isSel = (settings.quranFontFamily || 'uthmani') === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => handleUpdateSettings({ quranFontFamily: font.id as any })}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 border cursor-pointer ${
                        isSel
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-gray-50 dark:bg-[#182030] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span className="font-quran text-base">{font.sample}</span>
                      <span className="font-sans text-[11px]">{font.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-slate-300">
                  <span>حجم خط الآيات:</span>
                  <span>{toArabicNumerals(settings.quranFontSizeNumeric || 24)} نقطة</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="36"
                  value={settings.quranFontSizeNumeric || 24}
                  onChange={e => handleUpdateSettings({ quranFontSizeNumeric: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* 4. Sounds, Haptics & Feedback */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-slate-100 font-display">
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>الأصوات والتفاعل والاهتزاز</span>
              </div>

              <div className="space-y-2">
                {/* Dhikr Completion Sound (Mute/Unmute toggle requested by user) */}
                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#182030] hover:bg-gray-100/70 dark:hover:bg-[#1f293d] transition cursor-pointer border border-transparent hover:border-emerald-500/20">
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className={`mt-0.5 p-1.5 rounded-xl ${settings.dhikrCompletionSound !== false ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                      {settings.dhikrCompletionSound !== false ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>صوت إتمام وإنجاز الذكر</span>
                        {settings.dhikrCompletionSound === false && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-md font-semibold">مكتوم</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-snug mt-0.5 font-sans">
                        تشغيل أو كتم نغمة التكبير الهادئة عند اكتمال عدد تكرارات الذكر أو التسبيح
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dhikrCompletionSound !== false}
                    onChange={e => handleUpdateSettings({ dhikrCompletionSound: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* Bead Tap Clicks Sound */}
                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#182030] hover:bg-gray-100/70 dark:hover:bg-[#1f293d] transition cursor-pointer border border-transparent hover:border-emerald-500/20">
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className={`mt-0.5 p-1.5 rounded-xl ${settings.soundEffects !== false ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-slate-100">
                        صوت نقر المسبحة والعداد
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-snug mt-0.5 font-sans">
                        صوت تكتكة خافتة مع كل لمسة أثناء العد
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects !== false}
                    onChange={e => handleUpdateSettings({ soundEffects: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* Haptic Vibration */}
                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#182030] hover:bg-gray-100/70 dark:hover:bg-[#1f293d] transition cursor-pointer border border-transparent hover:border-emerald-500/20">
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200">
                    الاهتزاز اللمسي عند الضغط (Haptic Feedback)
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.hapticFeedback !== false}
                    onChange={e => handleUpdateSettings({ hapticFeedback: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* Auto Advance */}
                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#182030] hover:bg-gray-100/70 dark:hover:bg-[#1f293d] transition cursor-pointer border border-transparent hover:border-emerald-500/20">
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200">
                    الانتقال التلقائي للذكر التالي عند اكتمال العدد
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.autoAdvanceAdhkar ?? true}
                    onChange={e => handleUpdateSettings({ autoAdvanceAdhkar: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 5. Local Privacy & Offline Guarantee */}
            <div className="p-4 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900 dark:text-emerald-300 font-display">
                <Wifi className="w-4 h-4" />
                <span>حفظ البيانات والخصوصية الكاملة</span>
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/90 font-sans leading-relaxed">
                تطبيق أنا مسلم يعمل بشكل كامل ومستقل. كافة نصوص المصحف الشريف بالرسم العثماني (٦٠٤ صفحة)، الأذكار، التفسير الميسر، والأحاديث مخزنة محلياً لضمان سرعة فائقة وحفظ تام لبياناتك وخصوصيتك دون انقطاع.
              </p>
            </div>

            {/* 6. App Info & Logo */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AppLogo className="w-10 h-10 shadow-xs" />
                <div>
                  <h4 className="font-extrabold font-display text-sm text-gray-900 dark:text-slate-100">
                    تطبيق أنا مسلم
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
                    الإصدار المطور • صدقة جارية
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  صدقة جارية
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Assets & Splash Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm select-none">
          <div 
            className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-[#121824] rounded-3xl border border-coolgreen-600/30 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-sm sm:text-base text-gray-900 dark:text-slate-100">
                    هوية وتصدير التطبيق
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
                    لوقو التطبيق الرسمي وشاشة البداية Splash للتصدير
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 font-sans">
              {/* 1. App Logo Section */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200/80 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>لوقو التطبيق الرسمي (App Logo)</span>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      مصحف المدينة المنورة على حامل خشبي ونجمة إسلامية ثمانية (1:1 Square)
                    </p>
                  </div>
                  <a
                    href="/app-logo.jpg"
                    download="ana-muslim-app-logo.jpg"
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل اللوقو</span>
                  </a>
                </div>

                <div className="flex items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-black/20">
                  <img
                    src="/app-logo.jpg"
                    alt="شعار تطبيق أنا مسلم"
                    className="w-36 h-36 rounded-3xl object-cover shadow-lg border-2 border-emerald-500/30"
                  />
                </div>
              </div>

              {/* 2. Splash Screen Section */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200/80 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>شاشة البداية (Splash Screen)</span>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      صورة البداية الرأسية بقياس شاشات الهواتف (9:16 Portrait)
                    </p>
                  </div>
                  <a
                    href="/splash-screen.jpg"
                    download="ana-muslim-splash-screen.jpg"
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل صورة Splash</span>
                  </a>
                </div>

                <div className="flex items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-black/20">
                  <img
                    src="/splash-screen.jpg"
                    alt="شاشة البداية Splash Screen"
                    className="h-56 rounded-2xl object-cover shadow-lg border-2 border-emerald-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-[#1C2538] hover:bg-gray-200 dark:hover:bg-[#253248] text-gray-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
