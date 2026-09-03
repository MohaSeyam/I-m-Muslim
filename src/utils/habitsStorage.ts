export interface HabitItem {
  id: string;
  titleArabic: string;
  title?: string;
  category: 'fard' | 'sunnah' | 'quran' | 'dhikr';
  categoryTitle: string;
  iconName: 'sunrise' | 'sun' | 'cloud-sun' | 'sunset' | 'moon' | 'mosque' | 'book-open' | 'sparkles' | 'heart' | 'hand' | 'shield' | 'repeat';
  targetDesc: string;
}

export const DAILY_HABITS: HabitItem[] = [
  { id: 'fajr', titleArabic: 'صلاة الفجر في وقتها', category: 'fard', categoryTitle: 'الفرائض', iconName: 'sunrise', targetDesc: 'في المسجد أو أول الوقت' },
  { id: 'dhuhr', titleArabic: 'صلاة الظهر', category: 'fard', categoryTitle: 'الفرائض', iconName: 'sun', targetDesc: 'أداء الفريضة بخشوع' },
  { id: 'asr', titleArabic: 'صلاة العصر', category: 'fard', categoryTitle: 'الفرائض', iconName: 'cloud-sun', targetDesc: 'المحافظة على الصلاة الوسطى' },
  { id: 'maghrib', titleArabic: 'صلاة المغرب', category: 'fard', categoryTitle: 'الفرائض', iconName: 'sunset', targetDesc: 'في وقتها مع السنة البعدية' },
  { id: 'isha', titleArabic: 'صلاة العشاء', category: 'fard', categoryTitle: 'الفرائض', iconName: 'moon', targetDesc: 'في جماعة وأول الوقت' },
  { id: 'rawatib', titleArabic: 'السنن الرواتب (12 ركعة)', category: 'sunnah', categoryTitle: 'السنن والنوافل', iconName: 'mosque', targetDesc: 'بناء بيت في الجنة' },
  { id: 'duha', titleArabic: 'صلاة الضحى', category: 'sunnah', categoryTitle: 'السنن والنوافل', iconName: 'sun', targetDesc: 'صدقة عن سائر مفاصل الجسد' },
  { id: 'qiyam_witr', titleArabic: 'صلاة الوتر وقيام الليل', category: 'sunnah', categoryTitle: 'السنن والنوافل', iconName: 'moon', targetDesc: 'شرف المؤمن ودأب الصالحين' },
  { id: 'quran_wird', titleArabic: 'ورد القرآن الكريم اليومي', category: 'quran', categoryTitle: 'القرآن الكريم', iconName: 'book-open', targetDesc: 'تلاوة جزء أو حزب بتدبر' },
  { id: 'adhkar_morning', titleArabic: 'أذكار الصباح', category: 'dhikr', categoryTitle: 'الأذكار والتحصين', iconName: 'sparkles', targetDesc: 'حصن المسلم وحفظ اليوم' },
  { id: 'adhkar_evening', titleArabic: 'أذكار المساء', category: 'dhikr', categoryTitle: 'الأذكار والتحصين', iconName: 'shield', targetDesc: 'سكينة وحماية للمساء' },
  { id: 'istighfar_100', titleArabic: 'الاستغفار والتسبيح (100 مرة)', category: 'dhikr', categoryTitle: 'الأذكار والتحصين', iconName: 'repeat', targetDesc: 'تفريج للهموم وتوسيع للرزق' },
  { id: 'salawat_100', titleArabic: 'الصلاة على النبي ﷺ (100 مرة)', category: 'dhikr', categoryTitle: 'الأذكار والتحصين', iconName: 'heart', targetDesc: 'كفاية للهم وغفران للذنب' },
  { id: 'sadaqah', titleArabic: 'صدقة أو بذل معروف', category: 'sunnah', categoryTitle: 'السنن والنوافل', iconName: 'hand', targetDesc: 'تطفئ غضب الرب وتدفع البلاء' }
];

export interface DailyHabitsLog {
  dateStr: string; // YYYY-MM-DD
  completedIds: string[];
  scorePct: number;
}

const HABITS_STORAGE_KEY = 'ana_muslim_habits_log_v3';

export function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getHabitsLogs(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getTodayCompletedHabits(): string[] {
  const logs = getHabitsLogs();
  const today = getTodayDateStr();
  return logs[today] || [];
}

export function toggleHabit(habitId: string): {
  completed: boolean;
  scorePct: number;
  newCompleted: string[];
  completedIds: string[];
  streak: number;
} {
  const logs = getHabitsLogs();
  const today = getTodayDateStr();
  const current = logs[today] || [];

  let next: string[];
  const isCurrentlyDone = current.includes(habitId);

  if (isCurrentlyDone) {
    next = current.filter(id => id !== habitId);
  } else {
    next = [...current, habitId];
  }

  logs[today] = next;
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.warn(e);
  }

  const scorePct = Math.round((next.length / DAILY_HABITS.length) * 100);
  const streak = getHabitsStreak();
  return {
    completed: !isCurrentlyDone,
    scorePct,
    newCompleted: next,
    completedIds: next,
    streak
  };
}

export function getHabitsStreak(): number {
  const logs = getHabitsLogs();
  let streak = 0;
  const d = new Date();

  // Check from today or yesterday backwards
  for (let i = 0; i < 60; i++) {
    const checkDate = new Date(d);
    checkDate.setDate(d.getDate() - i);
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const completed = logs[dateStr] || [];

    // Count day as active if completed at least 4 habits
    if (completed.length >= 4) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}
