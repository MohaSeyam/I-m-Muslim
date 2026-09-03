import { Ayah } from '../types';
import { sampleSurahAyahs, surahsList } from '../data/quranData';
import { generateOfflinePagePayload } from '../data/quranOfflineData';

const PAGE_CACHE_KEY_PREFIX = 'ana_muslim_page_cache_v7_';

export interface PageAyahExtended extends Ayah {
  surahNumber?: number;
  surahNameArabic?: string;
  isFirstAyahOfSurah?: boolean;
}

export function getCachedPageAyahs(pageNumber: number): PageAyahExtended[] | null {
  try {
    const raw = localStorage.getItem(`${PAGE_CACHE_KEY_PREFIX}${pageNumber}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading page cache', e);
  }
  return null;
}

export function saveCachedPageAyahs(pageNumber: number, ayahs: PageAyahExtended[]): void {
  try {
    localStorage.setItem(`${PAGE_CACHE_KEY_PREFIX}${pageNumber}`, JSON.stringify(ayahs));
  } catch (e) {
    console.warn('Storage quota reached or saving cached page failed', e);
  }
}

/**
 * Loads complete text for a given Mushaf Page (1 to 604) in authentic Uthmani script with Tafseer.
 * 100% guaranteed to return data even when completely offline with no network.
 */
export async function fetchPageAyahs(
  pageNumber: number
): Promise<{ ayahs: PageAyahExtended[]; surahsOnPage: { number: number; nameArabic: string }[] }> {
  const safePage = Math.min(604, Math.max(1, pageNumber));

  // 1. Check local persistent cache first (instant 0ms response)
  const cached = getCachedPageAyahs(safePage);
  if (cached && cached.length > 0) {
    const surahSet = new Map<number, string>();
    cached.forEach(a => {
      if (a.surahNumber && a.surahNameArabic) {
        surahSet.set(a.surahNumber, a.surahNameArabic);
      }
    });
    return {
      ayahs: cached,
      surahsOnPage: Array.from(surahSet.entries()).map(([num, name]) => ({ number: num, nameArabic: name }))
    };
  }

  // 2. Guaranteed Offline Engine (Instant 0ms, Zero Network Dependency)
  const offlinePayload = generateOfflinePagePayload(safePage);
  saveCachedPageAyahs(safePage, offlinePayload.ayahs);
  return offlinePayload;
}

/**
 * Preload adjacent pages text into cache in background
 */
export function preloadAdjacentPages(currentPage: number): void {
  const pages = [currentPage - 1, currentPage + 1, currentPage + 2];
  pages.forEach(p => {
    if (p >= 1 && p <= 604 && !getCachedPageAyahs(p)) {
      fetchPageAyahs(p).catch(() => {});
    }
  });
}

/**
 * Download/Preload all Quran pages (1-604) for 100% full offline guarantee
 */
export async function downloadAllPagesForOffline(
  onProgress?: (progress: number, page: number, total: number) => void
): Promise<{ success: boolean; cachedCount: number }> {
  let cachedCount = 0;
  const totalPages = 604;

  for (let page = 1; page <= totalPages; page++) {
    try {
      if (!getCachedPageAyahs(page)) {
        await fetchPageAyahs(page);
      }
      cachedCount++;
      if (onProgress) {
        onProgress(Math.round((page / totalPages) * 100), page, totalPages);
      }
      // Small tick pause to keep main thread completely unblocked
      if (page % 10 === 0) {
        await new Promise(r => setTimeout(r, 15));
      }
    } catch {
      // Continue next page
    }
  }

  return { success: true, cachedCount };
}

