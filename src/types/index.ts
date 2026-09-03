export interface DhikrItem {
  id: string;
  categoryId: string;
  textArabic: string;
  countTarget: number;
  rewardArabic: string;
  source: string;
  transliteration?: string;
  translationEn?: string;
  virtue?: string;
  reference?: string;
}

export interface DhikrCategory {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  descriptionArabic: string;
  iconName: string;
  timeContext: string;
  section: 'daily' | 'prayer' | 'praise' | 'life';
}

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  englishTranslation: string;
  numberOfAyahs: number;
  ayahCount?: number;
  revelationType: 'Meccan' | 'Medinan';
  pageNumber?: number; // Start page in 604-page Medina Mushaf
  juzNumber?: number;  // 1 to 30
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  textArabic: string;
  textEnglish: string;
  tafseer: string;
  page?: number;
  juz?: number;
  audioUrl?: string;
}

export interface QuranNote {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  timestamp: number;
}

export interface KhatmahProgress {
  currentPage: number;
  targetDays?: number;
  startDate: number;
  lastReadDate: number;
  completedPages: number[];
}

export interface LastReadPosition {
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish?: string;
  ayahNumberInSurah: number;
  timestamp: number;
}

export interface QuranBookmark {
  id: string; // e.g. "1_1" (surahNumber_ayahNumber)
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish?: string;
  ayahNumberInSurah: number;
  ayahTextArabic: string;
  ayahText?: string;
  pageNumber?: number;
  ayahTextEnglish?: string;
  tafseer?: string;
  timestamp: number;
}

export interface QuranRibbonBookmark {
  id: string; // 'ribbon_yellow', 'ribbon_green', 'ribbon_red', 'ribbon_blue'
  color?: 'yellow' | 'green' | 'red' | 'blue';
  colorNameArabic?: string;
  hex?: string;
  pageNumber: number;
  surahNumber: number;
  surahNameArabic?: string;
  surahName?: string;
  ayahNumber?: number;
  timestamp: number;
  type?: string;
  title?: string;
}

export interface NameOfAllah {
  number: number;
  arabic: string;
  transliteration: string;
  meaningEn: string;
  meaningAr: string;
  quranReference: string;
}

export interface HadithNawawi {
  number: number;
  titleArabic: string;
  titleEnglish: string;
  narrator: string;
  arabicText: string;
  englishText: string;
  explanation: string;
  benefits?: string[];
}

export interface DuaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  translation: string;
  transliteration?: string;
  reference: string;
}

export interface PrayerTimeData {
  name: string;
  nameAr: string;
  time: string;
  isNext: boolean;
  passed: boolean;
}
