import { surahsList, juzData, toArabicNumerals } from '../data/quranData';
import { offlineSurahDatabase } from '../data/quranOfflineData';

export interface QuranAyahSearchResult {
  surahNumber: number;
  surahNameArabic: string;
  ayahNumberInSurah: number;
  ayahNumberOverall: number;
  textArabic: string;
  pageNumber: number;
  juzNumber?: number;
}

export const normalizeArabic = (text: string): string => {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[إأآاٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/[\s\t\r\n]+/g, ' ')
    .toLowerCase()
    .trim();
};

/**
 * Calculates page number for any ayah in the Holy Quran using Surah and Juz landmarks
 */
export function estimatePageForAyah(surahNumber: number, ayahNumberInSurah: number): number {
  const surah = surahsList.find(s => s.number === surahNumber);
  if (!surah) return 1;

  const startPage = surah.pageNumber || 1;
  const nextSurah = surahsList.find(s => s.number === surahNumber + 1);
  const endPage = nextSurah ? (nextSurah.pageNumber || startPage) : 604;
  const pageSpan = Math.max(1, endPage - startPage);

  if (pageSpan === 1 || surah.numberOfAyahs <= 1) {
    return startPage;
  }

  // Refine using Juz boundary if this surah spans multiple Ajza'
  const relevantJuzMarks = juzData.filter(j => j.startSurahNumber === surahNumber);
  if (relevantJuzMarks.length > 0) {
    // Check if ayah falls into a specific juz landmark inside this surah
    for (let i = relevantJuzMarks.length - 1; i >= 0; i--) {
      const mark = relevantJuzMarks[i];
      if (ayahNumberInSurah >= mark.startAyahNumber) {
        const nextMark = relevantJuzMarks[i + 1] || { startAyahNumber: surah.numberOfAyahs, pageNumber: endPage };
        const localAyahs = Math.max(1, nextMark.startAyahNumber - mark.startAyahNumber);
        const localRatio = Math.min(1, Math.max(0, (ayahNumberInSurah - mark.startAyahNumber) / localAyahs));
        const localSpan = Math.max(1, nextMark.pageNumber - mark.pageNumber);
        return Math.min(604, Math.max(1, Math.round(mark.pageNumber + localRatio * (localSpan - 0.5))));
      }
    }
  }

  const ratio = Math.min(1, Math.max(0, (ayahNumberInSurah - 1) / Math.max(1, surah.numberOfAyahs - 1)));
  const calculated = Math.round(startPage + ratio * (pageSpan - 0.3));
  return Math.min(604, Math.max(1, calculated));
}

// In-memory cache for fast repeat searches
const searchCache = new Map<string, QuranAyahSearchResult[]>();

/**
 * Searches for words/phrases inside Quranic verses both offline and online
 */
export async function searchAyahsInQuran(
  query: string,
  signal?: AbortSignal
): Promise<QuranAyahSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = normalizeArabic(trimmed);
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const results: QuranAyahSearchResult[] = [];
  const seenKeys = new Set<string>();

  // 1. Instant client-side search in offline database
  const normalizedQ = normalizeArabic(trimmed);
  try {
    for (const [surahNumStr, ayahs] of Object.entries(offlineSurahDatabase)) {
      const surahNum = Number(surahNumStr);
      const surahMeta = surahsList.find(s => s.number === surahNum);
      if (!surahMeta || !Array.isArray(ayahs)) continue;

      for (const ayah of ayahs) {
        const normText = normalizeArabic(ayah.textArabic || '');
        if (normText.includes(normalizedQ)) {
          const key = `${surahNum}:${ayah.numberInSurah}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            const page = ayah.pageNumber || estimatePageForAyah(surahNum, ayah.numberInSurah);
            results.push({
              surahNumber: surahNum,
              surahNameArabic: surahMeta.nameArabic,
              ayahNumberInSurah: ayah.numberInSurah,
              ayahNumberOverall: ayah.number || 0,
              textArabic: ayah.textArabic,
              pageNumber: page,
              juzNumber: ayah.juzNumber
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Offline ayah search check:', err);
  }

  // 2. Fetch full Quran search from alquran.cloud if online
  try {
    const encoded = encodeURIComponent(trimmed);
    const res = await fetch(`https://api.alquran.cloud/v1/search/${encoded}/all/quran-simple-clean`, {
      signal
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.matches && Array.isArray(data.data.matches)) {
        for (const match of data.data.matches) {
          const surahNum = match.surah?.number;
          const ayahNum = match.numberInSurah;
          if (!surahNum || !ayahNum) continue;

          const key = `${surahNum}:${ayahNum}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            const surahMeta = surahsList.find(s => s.number === surahNum);
            const page = estimatePageForAyah(surahNum, ayahNum);
            results.push({
              surahNumber: surahNum,
              surahNameArabic: surahMeta?.nameArabic || match.surah?.name || `سورة ${surahNum}`,
              ayahNumberInSurah: ayahNum,
              ayahNumberOverall: match.number || 0,
              textArabic: match.text || '',
              pageNumber: page
            });
          }
        }
      }
    }
  } catch (err: any) {
    // If aborted or offline, fallback to local matches
    if (err.name !== 'AbortError') {
      console.warn('Al-Quran search API offline or error:', err);
    }
  }

  // Sort by Surah and Ayah order
  results.sort((a, b) => {
    if (a.surahNumber !== b.surahNumber) return a.surahNumber - b.surahNumber;
    return a.ayahNumberInSurah - b.ayahNumberInSurah;
  });

  const finalResults = results.slice(0, 50);
  searchCache.set(cacheKey, finalResults);
  return finalResults;
}
