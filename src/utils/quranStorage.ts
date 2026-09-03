import { LastReadPosition, QuranBookmark, QuranRibbonBookmark, QuranNote, KhatmahProgress } from '../types';
export type { QuranBookmark, QuranRibbonBookmark, QuranNote, KhatmahProgress, LastReadPosition };

const STORAGE_KEY_LAST_READ = 'ana_muslim_quran_last_read';
const STORAGE_KEY_BOOKMARKS = 'ana_muslim_quran_bookmarks';
const STORAGE_KEY_STARRED = 'ana_muslim_quran_starred';
const STORAGE_KEY_RIBBONS = 'ana_muslim_quran_ribbons';
const STORAGE_KEY_NOTES = 'ana_muslim_quran_notes';
const STORAGE_KEY_KHATMAH = 'ana_muslim_quran_khatmah';
const STORAGE_KEY_READING_THEME = 'ana_muslim_quran_reading_theme';
const STORAGE_KEY_COMFORT_MODE = 'ana_muslim_quran_comfort_mode';

export function getQuranLastRead(): LastReadPosition | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LAST_READ);
    if (!data) return null;
    return JSON.parse(data) as LastReadPosition;
  } catch (e) {
    console.error('Failed to load last read position from localStorage', e);
    return null;
  }
}

export function saveQuranLastRead(position: LastReadPosition): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_READ, JSON.stringify(position));
  } catch (e) {
    console.error('Failed to save last read position to localStorage', e);
  }
}

export function clearQuranLastRead(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_LAST_READ);
  } catch (e) {
    console.error('Failed to remove last read position from localStorage', e);
  }
}

const STORAGE_KEY_LAST_READ_PAGE = 'ana_muslim_quran_last_read_page';
const STORAGE_KEY_PAGE_BOOKMARK = 'ana_muslim_quran_page_bookmark';

export function getQuranLastReadPage(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_LAST_READ_PAGE);
    if (val) {
      const p = parseInt(val, 10);
      if (p >= 1 && p <= 604) return p;
    }
  } catch (e) {}
  return 1;
}

export function saveQuranLastReadPage(pageNumber: number): void {
  try {
    const safe = Math.min(604, Math.max(1, pageNumber));
    localStorage.setItem(STORAGE_KEY_LAST_READ_PAGE, safe.toString());
  } catch (e) {}
}

export function getQuranPageBookmark(): number | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY_PAGE_BOOKMARK);
    if (val) {
      const p = parseInt(val, 10);
      if (p >= 1 && p <= 604) return p;
    }
  } catch (e) {}
  return null;
}

export function saveQuranPageBookmark(pageNumber: number | null): void {
  try {
    if (pageNumber === null) {
      localStorage.removeItem(STORAGE_KEY_PAGE_BOOKMARK);
    } else {
      localStorage.setItem(STORAGE_KEY_PAGE_BOOKMARK, pageNumber.toString());
    }
  } catch (e) {}
}


// Quran Ayah Bookmarks
export function getQuranBookmarks(): QuranBookmark[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (!data) return [];
    const list = JSON.parse(data) as QuranBookmark[];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('Failed to load Quran bookmarks from localStorage', e);
    return [];
  }
}

export function saveQuranBookmarks(bookmarks: QuranBookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save Quran bookmarks to localStorage', e);
  }
}

export function addQuranBookmark(bookmark: QuranBookmark): void {
  const current = getQuranBookmarks();
  const filtered = current.filter(b => b.id !== bookmark.id);
  const updated = [bookmark, ...filtered];
  saveQuranBookmarks(updated);
}

export function removeQuranBookmark(id: string): void {
  const current = getQuranBookmarks();
  const updated = current.filter(b => b.id !== id);
  saveQuranBookmarks(updated);
}

export function isAyahBookmarked(surahNumber: number, ayahNumberInSurah: number): boolean {
  const id = `${surahNumber}_${ayahNumberInSurah}`;
  const current = getQuranBookmarks();
  return current.some(b => b.id === id);
}

export function toggleQuranBookmark(bookmark: QuranBookmark): boolean {
  const current = getQuranBookmarks();
  const exists = current.some(b => b.id === bookmark.id);
  if (exists) {
    saveQuranBookmarks(current.filter(b => b.id !== bookmark.id));
    return false; // Removed
  } else {
    saveQuranBookmarks([bookmark, ...current]);
    return true; // Added
  }
}

export function clearAllQuranBookmarks(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
  } catch (e) {
    console.error('Failed to clear Quran bookmarks from localStorage', e);
  }
}

// Quran Readability & Font Size Settings
const STORAGE_KEY_QURAN_FONT_SIZE = 'ana_muslim_quran_font_size';
const STORAGE_KEY_TAFSEER_FONT_SIZE = 'ana_muslim_quran_tafseer_font_size';
const STORAGE_KEY_QURAN_LINE_HEIGHT = 'ana_muslim_quran_line_height';

export const DEFAULT_QURAN_FONT_SIZE = 24;
export const DEFAULT_TAFSEER_FONT_SIZE = 15;
export const DEFAULT_QURAN_LINE_HEIGHT = 2.4;

export function getQuranFontSize(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_QURAN_FONT_SIZE);
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 14 && num <= 48) return num;
    }
  } catch (e) {
    console.error('Failed to load Quran font size', e);
  }
  return DEFAULT_QURAN_FONT_SIZE;
}

export function saveQuranFontSize(size: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_QURAN_FONT_SIZE, size.toString());
  } catch (e) {
    console.error('Failed to save Quran font size', e);
  }
}

export function getQuranTafseerFontSize(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_TAFSEER_FONT_SIZE);
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 12 && num <= 28) return num;
    }
  } catch (e) {
    console.error('Failed to load Tafseer font size', e);
  }
  return DEFAULT_TAFSEER_FONT_SIZE;
}

export function saveQuranTafseerFontSize(size: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_TAFSEER_FONT_SIZE, size.toString());
  } catch (e) {
    console.error('Failed to save Tafseer font size', e);
  }
}

export function getQuranLineHeight(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_QURAN_LINE_HEIGHT);
    if (val) {
      const num = parseFloat(val);
      if (!isNaN(num) && num >= 1.6 && num <= 3.5) return num;
    }
  } catch (e) {
    console.error('Failed to load line height', e);
  }
  return DEFAULT_QURAN_LINE_HEIGHT;
}

export function saveQuranLineHeight(height: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_QURAN_LINE_HEIGHT, height.toString());
  } catch (e) {
    console.error('Failed to save line height', e);
  }
}

// Reading Mode: 'continuous' (mushaf flow) vs 'cards' (verse by verse)
const STORAGE_KEY_QURAN_READING_MODE = 'ana_muslim_quran_reading_mode';
export type QuranReadingMode = 'continuous' | 'cards';

export function getQuranReadingMode(): QuranReadingMode {
  try {
    const val = localStorage.getItem(STORAGE_KEY_QURAN_READING_MODE);
    if (val === 'cards' || val === 'continuous') {
      return val;
    }
  } catch (e) {
    console.error('Failed to load Quran reading mode', e);
  }
  return 'continuous'; // Default to continuous Mushaf mode as requested
}

export function saveQuranReadingMode(mode: QuranReadingMode): void {
  try {
    localStorage.setItem(STORAGE_KEY_QURAN_READING_MODE, mode);
  } catch (e) {
    console.error('Failed to save reading mode', e);
  }
}

// Quran Visual Theme: 'parchment' (ورق قديم مريح للعين) | 'dark' (داكن عميق) | 'white' (نهاري ناصع)
export type QuranReadingTheme = 'parchment' | 'dark' | 'white';

export function getQuranReadingTheme(): QuranReadingTheme {
  try {
    const val = localStorage.getItem(STORAGE_KEY_READING_THEME);
    if (val === 'parchment' || val === 'dark' || val === 'white') {
      return val;
    }
  } catch (e) {
    console.error('Failed to load reading theme', e);
  }
  return 'parchment'; // Default to warm antique parchment as requested for comfort
}

export function saveQuranReadingTheme(theme: QuranReadingTheme): void {
  try {
    localStorage.setItem(STORAGE_KEY_READING_THEME, theme);
  } catch (e) {
    console.error('Failed to save reading theme', e);
  }
}

// Comfort Reading Mode: toggles parchment + extra line-height (3.0+) + distraction-free view
export function getIsComfortReadingMode(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEY_COMFORT_MODE);
    if (val !== null) {
      return val === 'true';
    }
  } catch (e) {
    console.error('Failed to load comfort reading mode', e);
  }
  return true; // Enabled by default for comfortable reading
}

export function saveIsComfortReadingMode(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMFORT_MODE, enabled ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save comfort reading mode', e);
  }
}

// Starred Ayahs (مميزة بنجمة)
export function getStarredAyahs(): QuranBookmark[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_STARRED);
    if (!data) return [];
    const list = JSON.parse(data);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('Failed to load starred ayahs', e);
    return [];
  }
}

export function saveStarredAyahs(items: QuranBookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save starred ayahs', e);
  }
}

export function toggleStarredAyah(item: QuranBookmark): boolean {
  const current = getStarredAyahs();
  const exists = current.some(s => s.id === item.id);
  if (exists) {
    saveStarredAyahs(current.filter(s => s.id !== item.id));
    return false;
  } else {
    saveStarredAyahs([item, ...current]);
    return true;
  }
}

export function isAyahStarred(surahNumber: number, ayahNumberInSurah: number): boolean {
  const id = `${surahNumber}_${ayahNumberInSurah}`;
  const current = getStarredAyahs();
  return current.some(s => s.id === id);
}

// Colored Ribbon Bookmarks (الفواصل)
export const DEFAULT_RIBBONS: QuranRibbonBookmark[] = [
  { id: 'ribbon_yellow', color: 'yellow', colorNameArabic: 'الفاصل الأصفر', hex: '#EAB308', pageNumber: 1, surahNumber: 1, surahNameArabic: 'الفاتحة', ayahNumber: 1, timestamp: 0 },
  { id: 'ribbon_green', color: 'green', colorNameArabic: 'الفاصل الأخضر', hex: '#10B981', pageNumber: 50, surahNumber: 3, surahNameArabic: 'آل عمران', ayahNumber: 1, timestamp: 0 },
  { id: 'ribbon_red', color: 'red', colorNameArabic: 'الفاصل الأحمر', hex: '#EF4444', pageNumber: 293, surahNumber: 18, surahNameArabic: 'الكهف', ayahNumber: 1, timestamp: 0 },
  { id: 'ribbon_blue', color: 'blue', colorNameArabic: 'الفاصل الأزرق', hex: '#3B82F6', pageNumber: 562, surahNumber: 67, surahNameArabic: 'الملك', ayahNumber: 1, timestamp: 0 },
];

export function getRibbonBookmarks(): QuranRibbonBookmark[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RIBBONS);
    if (!data) return DEFAULT_RIBBONS;
    const list = JSON.parse(data) as QuranRibbonBookmark[];
    return Array.isArray(list) && list.length > 0 ? list : DEFAULT_RIBBONS;
  } catch (e) {
    console.error('Failed to load ribbon bookmarks', e);
    return DEFAULT_RIBBONS;
  }
}

export function saveRibbonBookmark(ribbon: QuranRibbonBookmark): void {
  const current = getRibbonBookmarks();
  const updated = current.map(r => r.id === ribbon.id ? ribbon : r);
  try {
    localStorage.setItem(STORAGE_KEY_RIBBONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save ribbon bookmarks', e);
  }
}

// Personal Notes & Reflections (الملاحظات والتدبر)
export function getQuranNotes(): QuranNote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!data) return [];
    const list = JSON.parse(data) as QuranNote[];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('Failed to load Quran notes', e);
    return [];
  }
}

export function saveQuranNote(note: QuranNote): void {
  const current = getQuranNotes();
  const filtered = current.filter(n => n.id !== note.id);
  const updated = [note, ...filtered];
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save Quran note', e);
  }
}

export function deleteQuranNote(id: string): void {
  const current = getQuranNotes();
  const updated = current.filter(n => n.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete Quran note', e);
  }
}

// Khatmah Progress (الختمة القرآنية)
export function getKhatmahProgress(): KhatmahProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY_KHATMAH);
    if (data) {
      return JSON.parse(data) as KhatmahProgress;
    }
  } catch (e) {
    console.error('Failed to load Khatmah progress', e);
  }
  return {
    currentPage: 1,
    targetDays: 30,
    startDate: Date.now(),
    lastReadDate: Date.now(),
    completedPages: [1]
  };
}

export function saveKhatmahProgress(progress: KhatmahProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_KHATMAH, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save Khatmah progress', e);
  }
}

// ----------------------------------------------------
// READING STATISTICS & ANALYTICS
// ----------------------------------------------------
const STORAGE_KEY_READING_STATS = 'ana_muslim_quran_reading_stats_v1';

export interface QuranReadingStats {
  uniquePagesRead: number[];
  dailyLogs: Record<string, number>;
  lifetimeFlips: number;
  currentStreakDays: number;
  lastActiveDateStr: string;
}

function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getQuranReadingStats(): QuranReadingStats {
  try {
    const data = localStorage.getItem(STORAGE_KEY_READING_STATS);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        uniquePagesRead: Array.isArray(parsed.uniquePagesRead) ? parsed.uniquePagesRead : [1],
        dailyLogs: parsed.dailyLogs && typeof parsed.dailyLogs === 'object' ? parsed.dailyLogs : {},
        lifetimeFlips: typeof parsed.lifetimeFlips === 'number' ? parsed.lifetimeFlips : 1,
        currentStreakDays: typeof parsed.currentStreakDays === 'number' ? parsed.currentStreakDays : 1,
        lastActiveDateStr: parsed.lastActiveDateStr || getTodayDateStr()
      };
    }
  } catch (e) {}

  const today = getTodayDateStr();
  return {
    uniquePagesRead: [1],
    dailyLogs: { [today]: 1 },
    lifetimeFlips: 1,
    currentStreakDays: 1,
    lastActiveDateStr: today
  };
}

export function recordQuranPageRead(pageNumber: number): void {
  const stats = getQuranReadingStats();
  const safePage = Math.min(604, Math.max(1, pageNumber));
  const today = getTodayDateStr();

  if (!stats.uniquePagesRead.includes(safePage)) {
    stats.uniquePagesRead.push(safePage);
    stats.uniquePagesRead.sort((a, b) => a - b);
  }

  stats.dailyLogs[today] = (stats.dailyLogs[today] || 0) + 1;
  stats.lifetimeFlips = (stats.lifetimeFlips || 0) + 1;

  if (stats.lastActiveDateStr !== today) {
    const lastDate = new Date(stats.lastActiveDateStr);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      stats.currentStreakDays = (stats.currentStreakDays || 0) + 1;
    } else if (diffDays > 1) {
      stats.currentStreakDays = 1;
    }
    stats.lastActiveDateStr = today;
  }

  try {
    localStorage.setItem(STORAGE_KEY_READING_STATS, JSON.stringify(stats));
  } catch (e) {}
}

export interface ReadingSummaryAnalytics {
  totalPagesRead: number;
  totalUniquePages: number;
  todayPagesCount: number;
  currentStreak: number;
  dailyAverage: number;
  khatmahProgressPercentage: number;
  remainingPages: number;
  estimatedDaysToFinish: number;
  recent7Days: { dateStr: string; dayName: string; count: number }[];
}

export function getReadingSummary(): ReadingSummaryAnalytics {
  const stats = getQuranReadingStats();
  const today = getTodayDateStr();
  const todayPages = stats.dailyLogs[today] || 0;
  const uniqueCount = stats.uniquePagesRead.length;
  const remaining = Math.max(0, 604 - uniqueCount);

  const recent7Days: { dateStr: string; dayName: string; count: number }[] = [];
  const dayNamesAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  let activeDaysSum = 0;
  let activeDaysCount = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = dayNamesAr[d.getDay()];
    const count = stats.dailyLogs[dateStr] || 0;

    recent7Days.push({ dateStr, dayName, count });
    if (count > 0) {
      activeDaysSum += count;
      activeDaysCount++;
    }
  }

  const dailyAverage = activeDaysCount > 0 ? Math.round((activeDaysSum / activeDaysCount) * 10) / 10 : Math.max(1, todayPages);
  const estimatedDaysToFinish = dailyAverage > 0 ? Math.ceil(remaining / dailyAverage) : 30;

  return {
    totalPagesRead: stats.lifetimeFlips,
    totalUniquePages: uniqueCount,
    todayPagesCount: todayPages,
    currentStreak: stats.currentStreakDays || 1,
    dailyAverage,
    khatmahProgressPercentage: Math.round((uniqueCount / 604) * 100),
    remainingPages: remaining,
    estimatedDaysToFinish,
    recent7Days
  };
}



