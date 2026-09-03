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
  Settings,
  Palette,
  Heart,
  BookMarked,
  RotateCcw,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { getStoredSettings, updateStoredSettings, AppSettings } from '../../utils/settingsStorage';
import { DAILY_HABITS, getTodayCompletedHabits, toggleHabit, getHabitsStreak, HabitItem } from '../../utils/habitsStorage';
import { toArabicNumerals } from '../../data/quranData';
import { AppLogo } from '../AppLogo';

interface MoreScreenProps {
  onNavigate: (tab: string, subParam?: any) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'features' | 'settings'>('features');
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [completedHabits, setCompletedHabits] = useState<string[]>(() => getTodayCompletedHabits());
  const [streakCount, setStreakCount] = useState<number>(() => getHabitsStreak());
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
    if (settings.hapticFeedback && navigator.vibrate) navigator.vibrate(20);
    const res = toggleHabit(habitId);
    const safeCompleted = res.newCompleted || res.completedIds || [];
    setCompletedHabits(safeCompleted);
    setStreakCount(res.streak ?? getHabitsStreak());
  };

  const isTodayFriday = new Date().getDay() === 5;

  const featuresList = [
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
    }
  ];

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
            {/* Daily Worship Streak & Habits Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white border border-emerald-700/40 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-xs border border-white/20">
                    <Flame className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-extrabold font-display text-base text-white">
                      المواظبة اليومية والأوراد
                    </h3>
                    <p className="text-xs text-emerald-100/90 font-sans">
                      أتممت {toArabicNumerals((completedHabits || []).length)} من {toArabicNumerals(DAILY_HABITS.length)} أعمال اليوم
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold">
                  <Flame className="w-4 h-4 text-emerald-300" />
                  <span>{toArabicNumerals(streakCount)} أيام متتالية</span>
                </div>
              </div>

              {/* Quick Checklist */}
              <div className="grid grid-cols-2 gap-2 mt-3.5 relative z-10">
                {DAILY_HABITS.slice(0, 4).map(habit => {
                  const isDone = (completedHabits || []).includes(habit.id);
                  return (
                    <button
                      key={habit.id}
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between gap-1.5 transition cursor-pointer border ${
                        isDone
                          ? 'bg-emerald-500/30 text-white border-emerald-400/40'
                          : 'bg-white/10 text-emerald-100 hover:bg-white/20 border-white/15'
                      }`}
                    >
                      <span className="truncate">{habit.title}</span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isDone ? 'bg-emerald-400 text-slate-900' : 'border border-white/40'}`}>
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Other Islamic Sections */}
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
            {/* 1. Theme Setting (Light, Dark, System) */}
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

            {/* 2. Quran Typography Settings */}
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

            {/* 3. Feedback & Haptics */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-slate-100 font-display">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>الاهتزاز اللمسي والتفاعل</span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 dark:bg-[#182030] cursor-pointer">
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200">
                    الاهتزاز اللمسي عند الضغط (Haptic Feedback)
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.hapticFeedback}
                    onChange={e => handleUpdateSettings({ hapticFeedback: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 dark:bg-[#182030] cursor-pointer">
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

            {/* 4. Local Privacy & Offline Guarantee */}
            <div className="p-4 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900 dark:text-emerald-300 font-display">
                <Wifi className="w-4 h-4" />
                <span>حفظ البيانات والخصوصية الكاملة</span>
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/90 font-sans leading-relaxed">
                تطبيق أنا مسلم يعمل بشكل كامل ومستقل. كافة نصوص المصحف الشريف بالرسم العثماني (٦٠٤ صفحة)، الأذكار، التفسير، والأحاديث مخزنة محلياً في جهازك لضمان سرعة فائقة وحفظ تام لبياناتك وخصوصيتك.
              </p>
            </div>

            {/* 5. App Info & Logo */}
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
    </div>
  );
};
