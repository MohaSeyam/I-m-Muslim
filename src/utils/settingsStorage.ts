export interface AppSettings {
  // Quran Settings
  quranFontSize: number | 'small' | 'medium' | 'large' | 'xlarge' | 'huge';
  quranFontSizeNumeric: number;
  quranLineHeight: number | 'compact' | 'normal' | 'relaxed' | 'spacious';
  quranLineHeightNumeric: number;
  quranFontFamily: 'uthmani' | 'hafs' | 'amiri' | 'scheherazade';
  quranAutoShowTafseer: boolean;

  // Appearance & Theme
  themeMode: 'light' | 'dark' | 'system';

  // Worship Notifications
  notifyMorningAdhkar: boolean;
  morningAdhkarTime: string;
  notifyEveningAdhkar: boolean;
  eveningAdhkarTime: string;
  notifyFridayKahf: boolean;

  // Sound & Haptics & Feedback
  hapticFeedback: boolean;
  soundEffects: boolean;
  dhikrCompletionSound: boolean;
  autoAdvanceAdhkar?: boolean;

  // Hijri Calendar Adjustment (-2, -1, 0, +1, +2 days)
  hijriAdjustment: number;
}

const SETTINGS_STORAGE_KEY = 'ana_muslim_user_settings_v4';

export const DEFAULT_SETTINGS: AppSettings = {
  quranFontSize: 24,
  quranFontSizeNumeric: 24,
  quranLineHeight: 2.4,
  quranLineHeightNumeric: 2.4,
  quranFontFamily: 'uthmani',
  quranAutoShowTafseer: false,

  themeMode: 'dark',

  notifyMorningAdhkar: true,
  morningAdhkarTime: '06:30',
  notifyEveningAdhkar: true,
  eveningAdhkarTime: '17:30',
  notifyFridayKahf: true,

  hapticFeedback: true,
  soundEffects: true,
  dhikrCompletionSound: true,
  autoAdvanceAdhkar: true,

  hijriAdjustment: 0
};

export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateStoredSettings(partial: Partial<AppSettings>): AppSettings {
  const current = getStoredSettings();
  const updated = { ...current, ...partial };
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('app_settings_changed'));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
  return updated;
}
