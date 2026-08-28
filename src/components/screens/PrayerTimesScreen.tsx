import React, { useState, useEffect } from 'react';
import {
  calculatePrayerTimes,
  CITIES_PRESETS,
  CityPreset,
  getHijriDate,
  CalculationMethod,
  CALCULATION_METHODS
} from '../../utils/prayerTimes';
import { QiblaScreen } from './QiblaScreen';
import { FridayScreen } from './FridayScreen';
import {
  Clock,
  MapPin,
  Compass,
  Sun,
  Moon,
  Bell,
  BellRing,
  Sparkles,
  SlidersHorizontal,
  Navigation2,
  Calendar,
  Volume2
} from 'lucide-react';

interface PrayerTimesScreenProps {
  selectedCity: CityPreset;
  setSelectedCity: (city: CityPreset) => void;
  onNavigateToQibla?: () => void;
}

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({
  selectedCity,
  setSelectedCity,
  onNavigateToQibla
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSubTab, setActiveSubTab] = useState<'times' | 'qibla' | 'friday'>('times');
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('Makkah');
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(0);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerData = calculatePrayerTimes(selectedCity, currentTime, calculationMethod);
  const hijri = getHijriDate(currentTime, hijriAdjustment);

  // Play gentle Islamic chime / reminder sound via Web Audio API
  const playAdhanChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.25);
        gain.gain.setValueAtTime(0.15, now + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.7);
      });

      setAudioPlayed(true);
      setTimeout(() => setAudioPlayed(false), 2000);
    } catch (e) {
      console.warn('Audio play chime', e);
    }
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      setGpsMessage('خاصية الموقع غير مدعومة في هذا المتصفح');
      return;
    }

    setIsLocatingGps(true);
    setGpsMessage('جاري تحديد موقعك الجغرافي...');

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const tz = -new Date().getTimezoneOffset() / 60;

        const gpsCity: CityPreset = {
          name: 'CustomLocation',
          nameAr: `موقعي الجغرافي (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          country: 'الموقع الحالي',
          lat,
          lng,
          timezone: tz
        };

        setSelectedCity(gpsCity);
        setIsLocatingGps(false);
        setGpsMessage('تم ضبط المواقيت حسب إحداثياتك بدقة 📍');
        setTimeout(() => setGpsMessage(null), 3000);
      },
      err => {
        setIsLocatingGps(false);
        setGpsMessage('تعذر الوصول إلى الموقع، يرجى تفعيل إذن الموقع الجغرافي');
        setTimeout(() => setGpsMessage(null), 3000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Segmented Sub-Nav: Times vs Qibla vs Friday */}
      <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-[#15241f] p-1 rounded-2xl border border-emerald-100/60 dark:border-emerald-950/60">
        <button
          onClick={() => setActiveSubTab('times')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'times'
              ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>المواقيت</span>
        </button>

        <button
          onClick={() => setActiveSubTab('qibla')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'qibla'
              ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>القبلة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('friday')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'friday'
              ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>يوم الجمعة</span>
        </button>
      </div>

      {/* RENDER ACTIVE SUB-TAB */}
      {activeSubTab === 'qibla' && (
        <QiblaScreen selectedCity={selectedCity} />
      )}

      {activeSubTab === 'friday' && (
        <FridayScreen />
      )}

      {activeSubTab === 'times' && (
        <div className="space-y-4">
          {/* Header & City Selector */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">مواقيت الصلاة</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">حساب فلكي دقيق حسب الأفق المحلي</p>
            </div>

            {/* City Dropdown & GPS */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleGpsDetect}
                disabled={isLocatingGps}
                className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900 transition shadow-2xs"
                title="تحديد الموقع الجغرافي الحالي تلقائياً"
              >
                <Navigation2 className={`w-4 h-4 ${isLocatingGps ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex items-center gap-1.5 bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 rounded-2xl px-3 py-1.5 shadow-xs">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <select
                  value={selectedCity.name}
                  onChange={e => {
                    const found = CITIES_PRESETS.find(c => c.name === e.target.value);
                    if (found) setSelectedCity(found);
                  }}
                  className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer max-w-[140px] truncate"
                >
                  {CITIES_PRESETS.map(c => (
                    <option key={c.name} value={c.name} className="dark:bg-[#15241f]">
                      {c.nameAr} ({c.country})
                    </option>
                  ))}
                  {selectedCity.name === 'CustomLocation' && (
                    <option value="CustomLocation" className="dark:bg-[#15241f]">
                      📍 {selectedCity.nameAr}
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {gpsMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center animate-fadeIn">
              {gpsMessage}
            </div>
          )}

          {/* Main Focus Card: Active / Next Prayer with Countdown */}
          <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl space-y-4">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-center text-xs text-emerald-200">
                <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full font-bold">
                  <Clock className="w-3 h-3" />
                  الصلاة القادمة
                </span>
                <span>{selectedCity.nameAr}</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <h3 className="text-3xl font-extrabold">{prayerData.nextPrayer.nameAr}</h3>
                <p className="text-4xl font-black text-emerald-100 tracking-wide">{prayerData.nextPrayer.time}</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    ⏳ متبقي: {prayerData.nextPrayer.remainingFormatted}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex justify-between items-center text-xs flex-wrap gap-2">
                <span className="flex items-center gap-1 text-emerald-100">
                  <Calendar className="w-3.5 h-3.5" />
                  {hijri.formatted}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={playAdhanChime}
                    className={`flex items-center gap-1 font-bold text-xs bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full transition ${
                      audioPlayed ? 'text-amber-300' : 'text-white'
                    }`}
                    title="تجربة تنبيه صوتي"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{audioPlayed ? 'جاري الرنين...' : 'صوت التنبيه'}</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('qibla')}
                    className="flex items-center gap-1 font-semibold text-emerald-100 hover:text-white bg-white/10 px-3 py-1 rounded-full transition"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    القبلة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Daily Prayer Cards */}
          <div className="space-y-2.5">
            {prayerData.times.map(prayer => (
              <div
                key={prayer.key}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  prayer.isNext
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.01]'
                    : prayer.passed
                    ? 'bg-white dark:bg-[#15241f] border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 opacity-85'
                    : 'bg-white dark:bg-[#15241f] border-emerald-100 dark:border-emerald-950 text-gray-900 dark:text-gray-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      prayer.isNext
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {prayer.key === 'fajr' || prayer.key === 'sunrise' ? (
                      <Sun className="w-5 h-5" />
                    ) : prayer.key === 'maghrib' || prayer.key === 'isha' ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{prayer.nameAr}</h4>
                    <span className="text-[11px] opacity-75">{prayer.name}</span>
                  </div>
                </div>

                <div className="text-left flex items-center gap-3">
                  <span className="font-bold text-base tracking-wide">{prayer.time}</span>
                  {prayer.isNext && (
                    <span className="text-xs bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                      القادمة
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Method & Settings Panel */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                طريقة الحساب الفلكي:
              </span>

              <select
                value={calculationMethod}
                onChange={e => setCalculationMethod(e.target.value as CalculationMethod)}
                className="bg-gray-50 dark:bg-[#111f1a] border border-gray-200 dark:border-gray-800 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer max-w-[200px]"
              >
                {Object.values(CALCULATION_METHODS).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Hijri Adjustment */}
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 pt-2.5">
              <span>ضبط التاريخ الهجري (فرق الرؤية):</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setHijriAdjustment(prev => prev - 1)}
                  className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold hover:bg-gray-200"
                >
                  -
                </button>
                <span className="font-bold w-6 text-center">{hijriAdjustment > 0 ? `+${hijriAdjustment}` : hijriAdjustment}</span>
                <button
                  onClick={() => setHijriAdjustment(prev => prev + 1)}
                  className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
