import { Ayah, SurahMeta } from '../types';
import { sampleSurahAyahs, surahsList } from '../data/quranData';

const QURAN_CACHE_KEY_PREFIX = 'ana_muslim_surah_cache_v2_';

// Check if surah ayahs are stored in localStorage
export function getCachedSurahAyahs(surahNumber: number): Ayah[] | null {
  try {
    const raw = localStorage.getItem(`${QURAN_CACHE_KEY_PREFIX}${surahNumber}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading surah cache', e);
  }
  return null;
}

export function saveCachedSurahAyahs(surahNumber: number, ayahs: Ayah[]): void {
  try {
    localStorage.setItem(`${QURAN_CACHE_KEY_PREFIX}${surahNumber}`, JSON.stringify(ayahs));
  } catch (e) {
    console.warn('Storage full or error saving cached surah', e);
  }
}

/**
 * Loads complete ayahs for a given Surah.
 * 1. Checks embedded offline data (`sampleSurahAyahs`)
 * 2. Checks local browser persistent cache
 * 3. Fetches full Arabic Quran text & English & Tafseer from reliable public CDN / API with fallback
 */
export async function fetchFullSurahAyahs(
  surahNumber: number,
  onUpdate?: (ayahs: Ayah[]) => void
): Promise<Ayah[]> {
  // 1. Check embedded offline sample data
  if (sampleSurahAyahs[surahNumber] && sampleSurahAyahs[surahNumber].length >= (surahsList.find(s => s.number === surahNumber)?.numberOfAyahs || 1)) {
    return sampleSurahAyahs[surahNumber];
  }

  // 2. Check cached in localStorage
  const cached = getCachedSurahAyahs(surahNumber);
  if (cached && cached.length > 0) {
    return cached;
  }

  // If we have partial embedded data, emit it first for instant zero-latency UI response
  if (sampleSurahAyahs[surahNumber]) {
    if (onUpdate) onUpdate(sampleSurahAyahs[surahNumber]);
  }

  // 3. Try to fetch complete surah from online Quran API
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,ar.muyassar`);
    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 3) {
        const arabicData = json.data[0].ayahs;
        const englishData = json.data[1].ayahs;
        const tafseerData = json.data[2].ayahs;

        const ayahs: Ayah[] = arabicData.map((a: any, idx: number) => {
          let cleanArabic = a.text;
          // In Surah 1 (Al-Fatihah), keep Bismillah as Ayah 1. In others, remove leading bismillah if embedded
          if (surahNumber !== 1 && surahNumber !== 9 && idx === 0) {
            cleanArabic = cleanArabic.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').trim();
          }

          return {
            number: a.number,
            numberInSurah: a.numberInSurah,
            textArabic: cleanArabic || a.text,
            textEnglish: englishData[idx]?.text || '',
            tafseer: tafseerData[idx]?.text || 'التفسير الميسر: بيان لهداية الآيات وتدبرها.'
          };
        });

        if (ayahs.length > 0) {
          saveCachedSurahAyahs(surahNumber, ayahs);
          return ayahs;
        }
      }
    }
  } catch (err) {
    console.log('Online fetch Quran fallback to offline generator', err);
  }

  // 4. Fallback generator if offline / no internet connection
  const meta = surahsList.find(s => s.number === surahNumber);
  if (!meta) return [];

  // Use existing sample or generate structured offline placeholders
  if (sampleSurahAyahs[surahNumber]) {
    return sampleSurahAyahs[surahNumber];
  }

  const count = meta.numberOfAyahs;
  const fallbackAyahs: Ayah[] = [];
  for (let i = 1; i <= count; i++) {
    fallbackAyahs.push({
      number: i,
      numberInSurah: i,
      textArabic: i === 1 && surahNumber !== 9
        ? `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • افتتاح سورة ${meta.nameArabic}`
        : `﴿ آية ${i} من سورة ${meta.nameArabic} المباركة ﴾`,
      textEnglish: `Verse ${i} of Surah ${meta.nameEnglish} (${meta.englishTranslation}).`,
      tafseer: `التفسير الميسر للآية (${i}) من سورة ${meta.nameArabic}: بيان لهداية القرآن وتدبر آياته الكريمة.`
    });
  }

  return fallbackAyahs;
}
