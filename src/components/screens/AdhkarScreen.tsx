import React, { useState, useMemo, useEffect, useRef } from 'react';
import { dhikrCategories, dhikrItems } from '../../data/adhkarData';
import { DhikrCategory, DhikrItem } from '../../types';
import { toArabicNumerals } from '../../data/quranData';
import { islamicAudio } from '../../utils/audioService';
import { DhikrShareModal } from '../DhikrShareModal';
import {
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Volume2,
  VolumeX,
  Search,
  Sun,
  Moon,
  Droplet,
  Shield,
  Heart,
  Utensils,
  Compass,
  Building,
  X,
  SlidersHorizontal,
  Share2,
  Award,
  CloudRain,
  Users,
  LayoutGrid,
  List,
  Shirt,
  DoorOpen,
  Home,
  UserCheck
} from 'lucide-react';

interface AdhkarScreenProps {
  initialCategoryId?: string;
  onBack?: () => void;
}

const getCategoryIcon = (iconName: string, className: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'Sun': return <Sun className={className} />;
    case 'Moon': return <Moon className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'DoorOpen': return <DoorOpen className={className} />;
    case 'Droplet': return <Droplet className={className} />;
    case 'Home': return <Home className={className} />;
    case 'Building': return <Building className={className} />;
    case 'Volume2': return <Volume2 className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Award': return <Award className={className} />;
    default: return <Sparkles className={className} />;
  }
};

interface CategoryStyle {
  cardBg: string;
  iconBg: string;
  iconColor: string;
  accentText: string;
  badgeBg: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  morning: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  evening: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/30 dark:border-coolgreen-500/25',
    iconBg: 'bg-coolgreen-800 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  waking: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  sleep: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/30 dark:border-coolgreen-500/25',
    iconBg: 'bg-coolgreen-800 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  clothes: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-coolgreen-600 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  toilet: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  wudu: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-coolgreen-500/20',
    iconBg: 'bg-coolgreen-600 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  home: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  mosque: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/30 dark:border-coolgreen-500/25',
    iconBg: 'bg-coolgreen-800 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  adhan: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  prayer_adhkar: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/30 dark:border-coolgreen-500/25',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  distress_anxiety: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  food_hospitality: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-coolgreen-600 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  travel_riding: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  illness: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  funerals: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-gray-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-gray-800 dark:text-slate-300',
    badgeBg: 'bg-gray-500/10',
  },
  weather: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-coolgreen-500/20',
    iconBg: 'bg-coolgreen-600 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  social_transactions: {
    cardBg: 'bg-white dark:bg-[#121824] border-gray-200 dark:border-white/10',
    iconBg: 'bg-coolgreen-700 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-coolgreen-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
  comprehensive_duas: {
    cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/30 dark:border-emerald-500/25',
    iconBg: 'bg-coolgreen-800 text-white shadow-xs',
    iconColor: 'text-white',
    accentText: 'text-coolgreen-800 dark:text-emerald-300',
    badgeBg: 'bg-coolgreen-600/10',
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  cardBg: 'bg-white dark:bg-[#121824] border-coolgreen-600/20 dark:border-white/10',
  iconBg: 'bg-coolgreen-700 text-white shadow-xs',
  iconColor: 'text-white',
  accentText: 'text-coolgreen-800 dark:text-emerald-300',
  badgeBg: 'bg-coolgreen-600/10',
};

export const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ initialCategoryId, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<DhikrCategory | null>(() => {
    if (initialCategoryId) {
      return dhikrCategories.find(c => c.id === initialCategoryId) || null;
    }
    return null;
  });

  const [viewMode, setViewMode] = useState<'counter' | 'list'>('counter');
  const [activeDhikrIndex, setActiveDhikrIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ana_muslim_adhkar_font_size');
      return saved ? parseInt(saved, 10) : 22;
    } catch {
      return 22;
    }
  });
  const [showFontSlider, setShowFontSlider] = useState<boolean>(false);
  const [isCounterTapped, setIsCounterTapped] = useState<boolean>(false);

  // Track progress counts
  const [itemCounts, setItemCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('ana_muslim_adhkar_counts_v5');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDhikrForShare, setSelectedDhikrForShare] = useState<DhikrItem | null>(null);

  // Sync external initial category if changed
  useEffect(() => {
    if (initialCategoryId) {
      const found = dhikrCategories.find(c => c.id === initialCategoryId);
      if (found) {
        setSelectedCategory(found);
        setActiveDhikrIndex(0);
      }
    }
  }, [initialCategoryId]);

  // Persist font size
  useEffect(() => {
    try {
      localStorage.setItem('ana_muslim_adhkar_font_size', fontSize.toString());
    } catch {}
  }, [fontSize]);

  // Persist counts
  useEffect(() => {
    try {
      localStorage.setItem('ana_muslim_adhkar_counts_v5', JSON.stringify(itemCounts));
    } catch {}
  }, [itemCounts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return dhikrCategories.filter(cat => {
      let matchesSection = true;
      if (activeSection === 'morning') matchesSection = cat.id === 'morning';
      else if (activeSection === 'evening') matchesSection = cat.id === 'evening';
      else if (activeSection === 'sleep') matchesSection = cat.id === 'sleep';
      else if (activeSection === 'waking') matchesSection = cat.id === 'waking';
      else if (activeSection === 'prayer') matchesSection = cat.section === 'prayer' || cat.id === 'prayer_adhkar' || cat.id === 'mosque' || cat.id === 'adhan' || cat.id === 'wudu';
      else if (activeSection === 'life') matchesSection = cat.section === 'life';
      else if (activeSection === 'praise') matchesSection = cat.section === 'praise';
      else if (activeSection !== 'all') matchesSection = cat.section === activeSection;

      const matchesSearch =
        !searchQuery.trim() ||
        cat.titleArabic.includes(searchQuery) ||
        cat.descriptionArabic.includes(searchQuery);
      return matchesSection && matchesSearch;
    });
  }, [activeSection, searchQuery]);

  // Current category items
  const currentCategoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return dhikrItems.filter(item => item.categoryId === selectedCategory.id);
  }, [selectedCategory]);

  const activeItem: DhikrItem | undefined = currentCategoryItems[activeDhikrIndex];
  const currentItemCount = activeItem ? (itemCounts[activeItem.id] || 0) : 0;
  const isCurrentItemCompleted = activeItem ? currentItemCount >= activeItem.countTarget : false;

  // Handle count increment with vibration & sound feedback
  const handleIncrement = (item: DhikrItem) => {
    const current = itemCounts[item.id] || 0;
    if (current >= item.countTarget) {
      // Completed, provide soft feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([20, 50, 20]); } catch {}
      }
      return;
    }

    const next = current + 1;
    setItemCounts(prev => ({ ...prev, [item.id]: next }));

    // Trigger visual tap pulse
    setIsCounterTapped(true);
    setTimeout(() => setIsCounterTapped(false), 180);

    // Audio click
    islamicAudio.playClick();

    // Haptic feedback & auto-advance on completion
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        if (next === item.countTarget) {
          navigator.vibrate([40, 80, 40]);
          islamicAudio.playTaqbeel();
        } else {
          navigator.vibrate(20);
        }
      } catch {}
    }

    // Auto-advance to next dhikr when target is reached
    if (next === item.countTarget) {
      if (activeDhikrIndex < currentCategoryItems.length - 1) {
        setTimeout(() => {
          setActiveDhikrIndex(prev => Math.min(currentCategoryItems.length - 1, prev + 1));
        }, 450);
      } else {
        showToast('أتممت أذكار هذا الباب، تقبل الله منا ومنكم صالح الأعمال');
      }
    }
  };

  const handleResetCurrentItem = (itemId: string) => {
    setItemCounts(prev => ({ ...prev, [itemId]: 0 }));
    showToast('تم تصفير عداد الذكر');
  };

  const handleResetCategory = () => {
    if (!selectedCategory) return;
    const items = dhikrItems.filter(i => i.categoryId === selectedCategory.id);
    const updated = { ...itemCounts };
    items.forEach(i => {
      updated[i.id] = 0;
    });
    setItemCounts(updated);
    showToast('تم تصفير عدادات هذا الباب');
  };

  // Copy Dhikr
  const handleCopyText = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      showToast('تم نسخ الذكر إلى الحافظة');
    } catch {
      showToast('تعذر النسخ');
    }
  };

  // Share Dhikr
  const handleShareText = async (text: string, categoryTitle: string) => {
    const shareContent = `${text}\n\n[من ${categoryTitle} - تطبيق أنا مسلم]`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: categoryTitle,
          text: shareContent,
        });
      } catch {
        handleCopyText(shareContent);
      }
    } else {
      handleCopyText(shareContent);
    }
  };

  // Speech synthesis
  const toggleSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('القراءة الصوتية غير مدعومة في هذا المتصفح');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Calculate statistics for selected category
  const categoryStats = useMemo(() => {
    if (!selectedCategory) return { completed: 0, total: 0, percentage: 0 };
    const items = dhikrItems.filter(i => i.categoryId === selectedCategory.id);
    const completed = items.filter(i => (itemCounts[i.id] || 0) >= i.countTarget).length;
    const percentage = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
    return { completed, total: items.length, percentage };
  }, [selectedCategory, itemCounts]);

  // Swipe handlers for next/previous dhikr in focus mode
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeDhikrIndex < currentCategoryItems.length - 1) {
        // swipe left -> next
        setActiveDhikrIndex(prev => prev + 1);
      } else if (diff < 0 && activeDhikrIndex > 0) {
        // swipe right -> prev
        setActiveDhikrIndex(prev => prev - 1);
      }
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col relative font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-coolgreen-950 dark:bg-emerald-500 text-white dark:text-white font-bold text-xs shadow-xl animate-scaleUp flex items-center gap-1.5 border border-white/15">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW 1: CATEGORY SELECTION LIST */}
      {!selectedCategory ? (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Top Fixed Header & Classification Bar (Prominent & Always Visible) */}
          <div className="flex-shrink-0 space-y-2 pb-2.5 pt-0.5 border-b border-coolgreen-600/15 dark:border-white/10 mb-2">
            {/* Header & Fast Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث في أبواب الأذكار (الصباح، المساء، الوضوء، النوم...)"
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#121824] border border-coolgreen-600/20 dark:border-white/10 text-xs sm:text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition shadow-2xs font-sans"
              />
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Top Category Classification Bar (شريط تصنيف الأذكار) */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 px-0.5 select-none">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'morning', label: 'أذكار الصباح', icon: Sun },
                { id: 'evening', label: 'أذكار المساء', icon: Moon },
                { id: 'sleep', label: 'أذكار النوم', icon: Moon },
                { id: 'waking', label: 'أذكار الاستيقاظ', icon: Sun },
                { id: 'prayer', label: 'الصلاة والمسجد', icon: Building },
                { id: 'life', label: 'الحياة اليومية', icon: Heart },
                { id: 'praise', label: 'الأدعية والاستغفار', icon: Sparkles },
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-[#121824] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified All-Hero Category Cards Grid - 2 columns in landscape mode */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-6">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-2 gap-2.5 sm:gap-3">
              {filteredCategories.map(category => {
                const items = dhikrItems.filter(i => i.categoryId === category.id);
                const completed = items.filter(i => (itemCounts[i.id] || 0) >= i.countTarget).length;
                const isAllDone = items.length > 0 && completed === items.length;
                const style = CATEGORY_STYLES[category.id] || DEFAULT_STYLE;

                return (
                  <div
                    key={category.id}
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        try { navigator.vibrate(15); } catch {}
                      }
                      setSelectedCategory(category);
                      setActiveDhikrIndex(0);
                    }}
                    className={`relative p-3.5 sm:p-4 rounded-3xl border shadow-sm cursor-pointer hover:border-coolgreen-600/40 active:scale-[0.99] transition-all duration-200 group overflow-hidden ${style.cardBg}`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform ${style.iconBg} ${style.iconColor}`}
                        >
                          {getCategoryIcon(category.iconName, 'w-5 h-5 sm:w-6 sm:h-6')}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold font-display text-sm sm:text-base text-gray-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                            <span>{category.titleArabic}</span>
                            {isAllDone && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 inline flex-shrink-0" />
                            )}
                          </h3>
                          <p
                            className={`text-[11px] font-sans font-medium line-clamp-1 ${style.accentText}`}
                          >
                            {category.descriptionArabic}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0 pl-1">
                        <span
                          className={`text-[11px] font-bold font-sans ${style.accentText}`}
                        >
                          {completed > 0 ? `${toArabicNumerals(completed)}/${toArabicNumerals(items.length)}` : `${toArabicNumerals(items.length)} ذكراً`}
                        </span>
                        {category.timeContext && (
                          <span className="text-[10px] text-gray-500 dark:text-slate-400 font-sans truncate max-w-[95px] sm:max-w-none text-left">
                            {category.timeContext}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <Search className="w-8 h-8 text-gray-300 dark:text-slate-600" />
              <p className="text-sm font-bold text-gray-600 dark:text-slate-400 font-sans">
                لا توجد نتائج تطابق "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-coolgreen-700 dark:text-emerald-400 font-bold underline cursor-pointer"
              >
                مسح البحث وعرض كل الأبواب
              </button>
            </div>
          )}
          </div>
        </div>
      ) : (
        /* VIEW 2: ACTIVE CATEGORY DHIKR VIEWER (Smooth focus counter & list mode) */
        <div className="flex-1 min-h-0 flex flex-col space-y-1.5 sm:space-y-2">
          
          {/* Top Bar for Category Navigation */}
          <div className="flex items-center justify-between px-3 py-2 bg-white/90 dark:bg-[#121824]/95 backdrop-blur-md rounded-2xl border border-coolgreen-600/15 dark:border-white/10 shadow-xs flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-2.5 py-1.5 rounded-xl bg-coolgreen-50 dark:bg-[#1C2538] hover:bg-coolgreen-100 dark:hover:bg-[#25324C] text-coolgreen-900 dark:text-emerald-300 transition cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs flex-shrink-0 border border-coolgreen-600/20 dark:border-white/10"
                title="الرجوع لقائمة أقسام الأذكار"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="font-sans text-[11px]">الأقسام</span>
              </button>
              <div className="min-w-0">
                <h3 className="font-extrabold font-display text-xs sm:text-sm text-gray-900 dark:text-slate-100 truncate">
                  {selectedCategory.titleArabic}
                </h3>
                <span className="text-[10px] text-coolgreen-800 dark:text-emerald-400 font-sans font-medium block">
                  {toArabicNumerals(categoryStats.completed)} من {toArabicNumerals(categoryStats.total)} مكتمل ({toArabicNumerals(categoryStats.percentage)}٪)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* View Switcher: Counter vs List */}
              <div className="flex items-center p-0.5 rounded-xl bg-gray-100 dark:bg-[#1C2538] border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setViewMode('counter')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'counter'
                      ? 'bg-white dark:bg-[#2A3752] text-coolgreen-900 dark:text-emerald-300 shadow-2xs'
                      : 'text-gray-600 dark:text-slate-400'
                  }`}
                  title="وضع بطاقة التسبيح والتركيز"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-[#2A3752] text-coolgreen-900 dark:text-emerald-300 shadow-2xs'
                      : 'text-gray-600 dark:text-slate-400'
                  }`}
                  title="وضع القائمة الكاملة"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Font Size Button */}
              <button
                onClick={() => setShowFontSlider(!showFontSlider)}
                className="p-1.5 rounded-xl bg-gray-100 dark:bg-[#1C2538] hover:bg-gray-200 dark:hover:bg-[#25324C] text-gray-700 dark:text-slate-200 transition cursor-pointer"
                title="التحكم بحجم الخط"
              >
                <SlidersHorizontal className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
              </button>

              {/* Reset Category Progress */}
              <button
                onClick={handleResetCategory}
                className="p-1.5 rounded-xl bg-gray-100 dark:bg-[#1C2538] hover:bg-gray-200 dark:hover:bg-[#25324C] text-gray-700 dark:text-slate-200 transition cursor-pointer"
                title="تصفير عدادات هذا الباب"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Font Size Slider Overlay */}
          {showFontSlider && (
            <div className="p-3 bg-white dark:bg-[#141A26] rounded-2xl border border-coolgreen-600/20 dark:border-white/10 shadow-lg flex items-center justify-between gap-4 animate-scaleUp flex-shrink-0">
              <span className="text-xs font-bold text-gray-700 dark:text-slate-300 font-sans">
                حجم خط الذكر ({toArabicNumerals(fontSize)}):
              </span>
              <input
                type="range"
                min="18"
                max="36"
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coolgreen-600 dark:accent-emerald-400"
              />
              <button
                onClick={() => setShowFontSlider(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* MODE A: FOCUS COUNTER CARD MODE (Landscape responsive split layout) */}
          {viewMode === 'counter' && activeItem && (
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex-1 min-h-0 flex flex-col landscape:flex-row justify-between p-3.5 sm:p-5 landscape:p-3.5 rounded-3xl bg-white dark:bg-[#0F1420] border-2 border-coolgreen-600/20 dark:border-white/10 shadow-xl overflow-hidden relative landscape:gap-4"
            >
              {/* Dhikr Arabic Text Box - in landscape takes full vertical height on right */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col justify-start my-1 sm:my-2 landscape:my-0 py-1 pl-1">
                {/* Top Meta info for portrait mode */}
                <div className="flex landscape:hidden items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2 mb-2">
                  <span className="px-2.5 py-1 rounded-xl bg-coolgreen-50 dark:bg-[#182030] text-coolgreen-900 dark:text-emerald-400 text-xs font-bold font-sans">
                    الذكر {toArabicNumerals(activeDhikrIndex + 1)} من {toArabicNumerals(currentCategoryItems.length)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleSpeech(activeItem.textArabic)}
                      className={`p-1.5 rounded-xl transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-[#182030] text-gray-700 dark:text-slate-300 hover:bg-gray-200'
                      }`}
                      title="الاستماع الصوتي"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleCopyText(activeItem.textArabic)}
                      className="p-1.5 rounded-xl bg-gray-100 dark:bg-[#182030] hover:bg-gray-200 dark:hover:bg-[#202B40] text-gray-700 dark:text-slate-300 transition cursor-pointer"
                      title="نسخ الذكر"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedDhikrForShare(activeItem)}
                      className="p-1.5 rounded-xl bg-gray-100 dark:bg-[#182030] hover:bg-gray-200 dark:hover:bg-[#202B40] text-gray-700 dark:text-slate-300 transition cursor-pointer"
                      title="مشاركة الذكر كصورة أو نص"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p
                  className="font-quran text-justify text-gray-950 dark:text-[#FFFDF7] font-semibold leading-relaxed tracking-normal"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
                >
                  {activeItem.textArabic}
                </p>

                {/* Reward & Hadith Virtue Note */}
                {activeItem.rewardArabic && (
                  <div className="mt-3 sm:mt-4 p-3 rounded-2xl bg-coolgreen-50/80 dark:bg-[#182030]/80 border border-coolgreen-500/20 dark:border-white/10 text-xs text-coolgreen-950 dark:text-slate-200 font-sans space-y-1">
                    <div className="flex items-center gap-1 font-bold text-coolgreen-800 dark:text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>فضل الذكر وثوابه:</span>
                    </div>
                    <p className="leading-normal">{activeItem.rewardArabic}</p>
                    {activeItem.source && (
                      <span className="text-[10px] text-gray-500 dark:text-slate-400 block pt-0.5">
                        المصدر: {activeItem.source}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom (Portrait) / Left Side (Landscape) Controls Panel */}
              <div className="pt-2 landscape:pt-0 flex flex-col items-center justify-between landscape:justify-between w-full landscape:w-64 flex-shrink-0 landscape:border-r landscape:border-gray-100 landscape:dark:border-white/10 landscape:pr-3 space-y-2 landscape:space-y-0">
                {/* Meta & actions inside Landscape Side Panel */}
                <div className="hidden landscape:flex w-full items-center justify-between border-b border-gray-100 dark:border-white/10 pb-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-coolgreen-50 dark:bg-[#182030] text-coolgreen-900 dark:text-emerald-400 text-[11px] font-bold font-sans">
                    #{toArabicNumerals(activeDhikrIndex + 1)} من {toArabicNumerals(currentCategoryItems.length)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSpeech(activeItem.textArabic)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-[#182030] text-gray-700 dark:text-slate-300 hover:bg-gray-200'
                      }`}
                      title="الاستماع الصوتي"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleCopyText(activeItem.textArabic)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#182030] hover:bg-gray-200 dark:hover:bg-[#202B40] text-gray-700 dark:text-slate-300 transition cursor-pointer"
                      title="نسخ الذكر"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedDhikrForShare(activeItem)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#182030] hover:bg-gray-200 dark:hover:bg-[#202B40] text-gray-700 dark:text-slate-300 transition cursor-pointer"
                      title="مشاركة الذكر كصورة أو نص"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Counter Tap Circle */}
                <div className="my-auto py-1">
                  <button
                    onClick={() => handleIncrement(activeItem)}
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 landscape:w-22 landscape:h-22 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
                      isCurrentItemCompleted
                        ? 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-emerald-700/30 ring-4 ring-emerald-500/30'
                        : 'bg-coolgreen-900 dark:bg-coolgreen-900 text-white shadow-coolgreen-950/30 ring-4 ring-emerald-500/30'
                    } ${isCounterTapped ? 'scale-95' : ''}`}
                  >
                    {isCurrentItemCompleted ? (
                      <div className="flex flex-col items-center animate-scaleUp">
                        <Check className="w-7 h-7 stroke-[3]" />
                        <span className="text-[10px] font-bold mt-0.5">اكتمل بحمد الله</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl sm:text-3xl landscape:text-2xl font-extrabold font-display">
                          {toArabicNumerals(currentItemCount)}
                        </span>
                        <span className="text-[10px] text-emerald-300 font-sans font-medium">
                          الهدف: {toArabicNumerals(activeItem.countTarget)}
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Navigation Arrows & Controls for Next / Prev Dhikr Card - Always visible */}
                <div className="w-full flex items-center justify-between pt-1 px-1 bg-gray-50/80 dark:bg-white/5 rounded-2xl p-1.5 border border-gray-100 dark:border-white/10">
                  <button
                    onClick={() => setActiveDhikrIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeDhikrIndex <= 0}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#182030] text-gray-800 dark:text-slate-200 text-xs font-bold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xs border border-gray-200 dark:border-white/10 hover:bg-coolgreen-50"
                  >
                    <ChevronRight className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
                    <span>السابق</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold font-sans text-gray-500 dark:text-slate-400">
                      {toArabicNumerals(activeDhikrIndex + 1)} / {toArabicNumerals(currentCategoryItems.length)}
                    </span>
                    <button
                      onClick={() => handleResetCurrentItem(activeItem.id)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 transition cursor-pointer"
                      title="تصفير عداد هذا الذكر"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveDhikrIndex(prev => Math.min(currentCategoryItems.length - 1, prev + 1))}
                    disabled={activeDhikrIndex >= currentCategoryItems.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#182030] text-gray-800 dark:text-slate-200 text-xs font-bold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xs border border-gray-200 dark:border-white/10 hover:bg-coolgreen-50"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE B: FULL LIST MODE */}
          {viewMode === 'list' && (
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3 p-1">
              {currentCategoryItems.map((item, idx) => {
                const count = itemCounts[item.id] || 0;
                const isDone = count >= item.countTarget;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border transition-all duration-200 ${
                      isDone
                        ? 'bg-emerald-50/50 dark:bg-[#101F18]/40 border-emerald-500/30'
                        : 'bg-white dark:bg-[#121824] border-coolgreen-600/15 dark:border-white/10 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2 mb-2">
                      <span className="text-xs font-bold text-coolgreen-900 dark:text-emerald-400 font-sans">
                        #{toArabicNumerals(idx + 1)} • الهدف: {toArabicNumerals(item.countTarget)} مرة
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyText(item.textArabic)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1C2538] transition cursor-pointer"
                          title="نسخ الذكر"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedDhikrForShare(item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1C2538] transition cursor-pointer"
                          title="مشاركة الذكر كصورة أو نص"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p
                      className="font-quran text-justify text-gray-950 dark:text-[#FFFDF7] font-semibold leading-relaxed"
                      style={{ fontSize: `${Math.max(18, fontSize - 2)}px` }}
                    >
                      {item.textArabic}
                    </p>

                    {item.rewardArabic && (
                      <p className="mt-2 text-[11px] text-coolgreen-800 dark:text-emerald-300 font-sans leading-normal">
                        {item.rewardArabic}
                      </p>
                    )}

                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 dark:text-slate-300 font-sans">
                        المكتمل: {toArabicNumerals(count)} / {toArabicNumerals(item.countTarget)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetCurrentItem(item.id)}
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-[#1C2538] text-gray-600 dark:text-slate-400 hover:text-gray-800 text-xs font-sans cursor-pointer"
                          title="تصفير"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleIncrement(item)}
                          className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-coolgreen-700 hover:bg-coolgreen-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {isDone ? 'مكتمل' : 'تسبيح (+1)'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dhikr Share Image & Text Modal */}
      <DhikrShareModal
        isOpen={!!selectedDhikrForShare}
        onClose={() => setSelectedDhikrForShare(null)}
        dhikr={selectedDhikrForShare}
        categoryTitle={selectedCategory?.titleArabic || 'الأذكار الإسلامية'}
      />
    </div>
  );
};
