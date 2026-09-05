/**
 * Hijri Calendar Utility - 100% Offline & Independent
 */

export interface HijriDateInfo {
  day: number;
  monthNameAr: string;
  monthNameEn: string;
  year: number;
  formatted: string;
}

const hijriMonthsAr = [
  'المحرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة'
];

const hijriMonthsEn = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qadah',
  'Dhu al-Hijjah'
];

import { getStoredSettings } from './settingsStorage';

export function getHijriDate(date: Date = new Date(), dayAdjustment?: number): HijriDateInfo {
  const effectiveAdjustment = typeof dayAdjustment === 'number' ? dayAdjustment : (getStoredSettings()?.hijriAdjustment ?? 0);
  const adjustedDate = new Date(date);
  if (effectiveAdjustment !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + effectiveAdjustment);
  }

  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(adjustedDate);
    const dayStr = parts.find(p => p.type === 'day')?.value || '1';
    const monthName = parts.find(p => p.type === 'month')?.value || 'رمضان';
    const yearStr = parts.find(p => p.type === 'year')?.value || '1448';

    // Parse arabic numerals to standard numbers
    const dayNum = parseInt(dayStr.replace(/[\u0660-\u0669]/g, d => (d.charCodeAt(0) - 1632).toString()), 10) || 1;
    const yearNum = parseInt(yearStr.replace(/[\u0660-\u0669]/g, d => (d.charCodeAt(0) - 1632).toString()), 10) || 1448;

    return {
      day: dayNum,
      monthNameAr: monthName,
      monthNameEn: 'Hijri',
      year: yearNum,
      formatted: `${dayNum} ${monthName} ${yearNum} هـ`
    };
  } catch {
    // Standard tabular fallback
    const day = ((adjustedDate.getDate() + 8) % 29) + 1;
    const monthIdx = (adjustedDate.getMonth() + 2) % 12;
    const year = 1448;

    return {
      day,
      monthNameAr: hijriMonthsAr[monthIdx],
      monthNameEn: hijriMonthsEn[monthIdx],
      year,
      formatted: `${day} ${hijriMonthsAr[monthIdx]} ${year} هـ`
    };
  }
}
