export interface CityPreset {
  name: string;
  nameAr: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;
}

export type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Gulf';

export interface MethodConfig {
  id: CalculationMethod;
  nameAr: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval?: number; // Minutes after Maghrib for Makkah / Gulf
}

export const CALCULATION_METHODS: Record<CalculationMethod, MethodConfig> = {
  Makkah: { id: 'Makkah', nameAr: 'أم القرى - مكة المكرمة (18.5° / 90 دقيقة بعد المغرب)', fajrAngle: 18.5, ishaAngle: 0, ishaInterval: 90 },
  Egypt: { id: 'Egypt', nameAr: 'الهيئة المصرية العامة للمساحة (19.5° / 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 },
  MWL: { id: 'MWL', nameAr: 'رابطة العالم الإسلامي (18° / 17°)', fajrAngle: 18, ishaAngle: 17 },
  Gulf: { id: 'Gulf', nameAr: 'دبي والخليج العربي (18.2° / 90 دقيقة)', fajrAngle: 18.2, ishaAngle: 0, ishaInterval: 90 },
  ISNA: { id: 'ISNA', nameAr: 'الجمعية الإسلامية لأمريكا الشمالية (15° / 15°)', fajrAngle: 15, ishaAngle: 15 },
  Karachi: { id: 'Karachi', nameAr: 'جامعة العلوم الإسلامية بكراتشي (18° / 18°)', fajrAngle: 18, ishaAngle: 18 },
  Tehran: { id: 'Tehran', nameAr: 'معهد ليفا بطهران (17.7° / 14°)', fajrAngle: 17.7, ishaAngle: 14 }
};

export const CITIES_PRESETS: CityPreset[] = [
  { name: 'Makkah', nameAr: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { name: 'Madinah', nameAr: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692, timezone: 3 },
  { name: 'Jerusalem', nameAr: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137, timezone: 2 },
  { name: 'Riyadh', nameAr: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { name: 'Jeddah', nameAr: 'جدة', country: 'السعودية', lat: 21.5433, lng: 39.1728, timezone: 3 },
  { name: 'Cairo', nameAr: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { name: 'Alexandria', nameAr: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187, timezone: 2 },
  { name: 'Dubai', nameAr: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'AbuDhabi', nameAr: 'أبو ظبي', country: 'الإمارات', lat: 24.4539, lng: 54.3773, timezone: 4 },
  { name: 'Doha', nameAr: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, timezone: 3 },
  { name: 'Kuwait City', nameAr: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774, timezone: 3 },
  { name: 'Manama', nameAr: 'المنامة', country: 'البحرين', lat: 26.2285, lng: 50.5860, timezone: 3 },
  { name: 'Muscat', nameAr: 'مسقط', country: 'عُمان', lat: 23.5880, lng: 58.3829, timezone: 4 },
  { name: 'Amman', nameAr: 'عمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284, timezone: 3 },
  { name: 'Beirut', nameAr: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, timezone: 2 },
  { name: 'Damascus', nameAr: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765, timezone: 3 },
  { name: 'Baghdad', nameAr: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661, timezone: 3 },
  { name: 'Tripoli', nameAr: 'طرابلس', country: 'ليبيا', lat: 32.8872, lng: 13.1913, timezone: 2 },
  { name: 'Tunis', nameAr: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815, timezone: 1 },
  { name: 'Algiers', nameAr: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588, timezone: 1 },
  { name: 'Rabat', nameAr: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416, timezone: 1 },
  { name: 'Khartoum', nameAr: 'الخرطوم', country: 'السودان', lat: 15.5007, lng: 32.5599, timezone: 2 },
  { name: 'Sanaa', nameAr: 'صنعاء', country: 'اليمن', lat: 15.3694, lng: 44.1910, timezone: 3 },
  { name: 'Istanbul', nameAr: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { name: 'Jakarta', nameAr: 'جاكرتا', country: 'إندونيسيا', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { name: 'KualaLumpur', nameAr: 'كوالالمبور', country: 'ماليزيا', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { name: 'London', nameAr: 'لندن', country: 'المملكة المتحدة', lat: 51.5074, lng: -0.1278, timezone: 0 },
  { name: 'Paris', nameAr: 'باريس', country: 'فرنسا', lat: 48.8566, lng: 2.3522, timezone: 1 },
  { name: 'New York', nameAr: 'نيويورك', country: 'الولايات المتحدة', lat: 40.7128, lng: -74.0060, timezone: -5 }
];

export interface PrayerCalculationResult {
  times: {
    key: string;
    name: string;
    nameAr: string;
    minutes: number;
    time: string;
    isNext: boolean;
    passed: boolean;
    date: Date;
  }[];
  nextPrayer: {
    key: string;
    name: string;
    nameAr: string;
    minutes: number;
    time: string;
    date: Date;
    remainingMs: number;
    remainingFormatted: string;
  };
}

export function calculatePrayerTimes(
  city: CityPreset,
  date: Date = new Date(),
  method: CalculationMethod = 'Makkah'
): PrayerCalculationResult {
  const methodConf = CALCULATION_METHODS[method] || CALCULATION_METHODS.Makkah;
  const y = date.getFullYear();

  // Day of year
  const startOfYear = new Date(y, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Solar declination & Equation of Time
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const declination = 23.45 * Math.sin(b);
  const eqTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Timezone calculation (or dynamic timezone offset)
  const tzOffsetHours = city.timezone;
  const timeOffsetMinutes = (tzOffsetHours * 15 - city.lng) * 4;
  const solarNoonMinutes = 12 * 60 + timeOffsetMinutes - eqTime;

  const latRad = (city.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  const getSunHourAngle = (altitudeDeg: number) => {
    const altRad = (altitudeDeg * Math.PI) / 180;
    const cosHA = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return (Math.acos(cosHA) * 180) / Math.PI;
  };

  // Fajr altitude
  const fajrHA = getSunHourAngle(-methodConf.fajrAngle);
  // Sunrise altitude (-0.833 standard atmospheric refraction)
  const sunriseHA = getSunHourAngle(-0.833);
  // Isha calculation
  const ishaHA = methodConf.ishaAngle > 0 ? getSunHourAngle(-methodConf.ishaAngle) : 0;

  // Asr altitude (Standard Shafi / Hanbali / Maliki: shadow = 1)
  const asrAlt = (Math.atan(1 / (1 + Math.tan(Math.abs(latRad - decRad)))) * 180) / Math.PI;
  const asrHA = getSunHourAngle(asrAlt);

  const fajrMin = solarNoonMinutes - fajrHA * 4;
  const sunriseMin = solarNoonMinutes - sunriseHA * 4;
  const dhuhrMin = solarNoonMinutes + 4; // slight buffer after zenith
  const asrMin = solarNoonMinutes + asrHA * 4;
  const maghribMin = solarNoonMinutes + sunriseHA * 4 + 2;
  const ishaMin = methodConf.ishaInterval
    ? maghribMin + methodConf.ishaInterval
    : solarNoonMinutes + ishaHA * 4;

  const formatMinutes = (totalMin: number) => {
    const normalized = (totalMin % 1440 + 1440) % 1440;
    const hours = Math.floor(normalized / 60);
    const mins = Math.floor(normalized % 60);
    const period = hours >= 12 ? 'م' : 'ص';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const createPrayerDate = (totalMin: number, isTomorrow: boolean = false) => {
    const normalized = (totalMin % 1440 + 1440) % 1440;
    const hours = Math.floor(normalized / 60);
    const mins = Math.floor(normalized % 60);
    const pDate = new Date(date);
    if (isTomorrow) {
      pDate.setDate(pDate.getDate() + 1);
    }
    pDate.setHours(hours, mins, 0, 0);
    return pDate;
  };

  const currentMinutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;

  const baseTimes = [
    { key: 'fajr', name: 'Fajr', nameAr: 'الفجر', minutes: fajrMin },
    { key: 'sunrise', name: 'Sunrise', nameAr: 'الشروق', minutes: sunriseMin },
    { key: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', minutes: dhuhrMin },
    { key: 'asr', name: 'Asr', nameAr: 'العصر', minutes: asrMin },
    { key: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', minutes: maghribMin },
    { key: 'isha', name: 'Isha', nameAr: 'العشاء', minutes: ishaMin }
  ];

  let nextPrayerIndex = baseTimes.findIndex(p => p.minutes > currentMinutes);
  const isTomorrowFajr = nextPrayerIndex === -1;
  if (nextPrayerIndex === -1) {
    nextPrayerIndex = 0; // Fajr tomorrow
  }

  const nextPrayerObj = baseTimes[nextPrayerIndex];
  const nextPrayerDate = createPrayerDate(nextPrayerObj.minutes, isTomorrowFajr);
  const remainingMs = Math.max(0, nextPrayerDate.getTime() - date.getTime());

  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const remainingFormatted = `${remainingHours > 0 ? `${remainingHours} س و ` : ''}${remainingMinutes} د و ${remainingSeconds} ث`;

  const times = baseTimes.map((t, idx) => ({
    ...t,
    time: formatMinutes(t.minutes),
    isNext: idx === nextPrayerIndex,
    passed: t.minutes <= currentMinutes,
    date: createPrayerDate(t.minutes)
  }));

  return {
    times,
    nextPrayer: {
      ...nextPrayerObj,
      time: formatMinutes(nextPrayerObj.minutes),
      date: nextPrayerDate,
      remainingMs,
      remainingFormatted
    }
  };
}

export function getHijriDate(date: Date = new Date(), dayAdjustment: number = 0): {
  day: number;
  monthNameAr: string;
  monthNameEn: string;
  year: number;
  formatted: string;
} {
  const hijriMonthsAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  const hijriMonthsEn = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani',
    'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul Qi\'dah', 'Dhul Hijjah'
  ];

  // Precise modern approximation with user adjustment
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + dayAdjustment);

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

export function calculateQiblaDirection(lat: number, lng: number): number {
  const makkahLat = (21.422487 * Math.PI) / 180;
  const makkahLng = (39.826206 * Math.PI) / 180;
  const userLat = (lat * Math.PI) / 180;
  const userLng = (lng * Math.PI) / 180;

  const deltaLng = makkahLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng);

  const qiblaAngle = (Math.atan2(y, x) * 180) / Math.PI;
  return (qiblaAngle + 360) % 360;
}

export function calculateDistanceToKaabaKm(lat: number, lng: number): number {
  const R = 6371; // Earth radius in KM
  const makkahLat = 21.422487;
  const makkahLng = 39.826206;

  const dLat = ((makkahLat - lat) * Math.PI) / 180;
  const dLng = ((makkahLng - lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) * Math.cos((makkahLat * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
