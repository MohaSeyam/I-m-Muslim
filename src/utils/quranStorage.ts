import { LastReadPosition, QuranBookmark } from '../types';

const STORAGE_KEY_LAST_READ = 'ana_muslim_quran_last_read';
const STORAGE_KEY_BOOKMARKS = 'ana_muslim_quran_bookmarks';

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


