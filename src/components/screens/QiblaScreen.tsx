import React, { useState, useEffect } from 'react';
import { calculateQiblaDirection, calculateDistanceToKaabaKm, CityPreset } from '../../utils/prayerTimes';
import { Compass, MapPin, Navigation, Sparkles, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface QiblaScreenProps {
  selectedCity: CityPreset;
  onSelectCity?: (city: CityPreset) => void;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ selectedCity }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasCompassSupport, setHasCompassSupport] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [manualOffset, setManualOffset] = useState<number>(0);

  const qiblaAngle = Math.round(calculateQiblaDirection(selectedCity.lat, selectedCity.lng));
  const distanceKm = calculateDistanceToKaabaKm(selectedCity.lat, selectedCity.lng);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS WebKit compass heading
      if ((e as any).webkitCompassHeading !== undefined) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android standard (0 = north if absolute, or relative)
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(heading);
        setHasCompassSupport(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // Check if iOS 13+ permission is required
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // Must be triggered by user gesture
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
        window.addEventListener('deviceorientationabsolute' as any, handleOrientation, true);
        setPermissionGranted(true);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
        window.removeEventListener('deviceorientationabsolute' as any, handleOrientation, true);
      }
    };
  }, []);

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res === 'granted') {
          setPermissionGranted(true);
          const handleOrientation = (e: DeviceOrientationEvent) => {
            const heading = (e as any).webkitCompassHeading || (e.alpha !== null ? (360 - e.alpha) % 360 : null);
            if (heading !== null) {
              setDeviceHeading(heading);
              setHasCompassSupport(true);
            }
          };
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (err) {
        console.error('Error requesting orientation permission', err);
      }
    }
  };

  const currentHeading = deviceHeading !== null ? (deviceHeading + manualOffset + 360) % 360 : 0;
  // Needle points relative to the device's top
  const needleRotation = (qiblaAngle - currentHeading + 360) % 360;
  const isFacingQibla = Math.abs(needleRotation) < 4 || Math.abs(needleRotation - 360) < 4;

  useEffect(() => {
    if (isFacingQibla && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [isFacingQibla]);

  return (
    <div className="space-y-5 pb-24 text-center animate-fadeIn">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">بوصلة واتجاه القبلة</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">تحديد دقيق لاتجاه الكعبة المشرفة بمكة المكرمة</p>
      </div>

      {/* City & Qibla Angle Card */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          {selectedCity.nameAr}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-xs">
          <Navigation className="w-3.5 h-3.5 text-amber-600" />
          زاوية القبلة: {qiblaAngle}° من الشمال
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-300 text-xs font-bold shadow-xs">
          <span>🕋 البعد: {distanceKm.toLocaleString('ar-EG')} كم</span>
        </div>
      </div>

      {/* Facing Qibla Banner */}
      {isFacingQibla ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>أنت باتجاه الكعبة المشرفة الآن! 🕋</span>
        </div>
      ) : (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {hasCompassSupport
            ? `قم بتدوير الهاتف حتى تشير الإبرة الذهبية للأعلى (${Math.round(needleRotation)}° متبقية)`
            : 'بوصلة حية: اضبط هاتفك في وضع أفقي مستوٍ'}
        </div>
      )}

      {/* Interactive Compass Dial */}
      <div className="flex justify-center py-4">
        <div className="relative w-72 h-72 rounded-full border-8 border-emerald-600/20 dark:border-emerald-600/30 bg-white dark:bg-[#15241f] shadow-2xl flex items-center justify-center transition-all duration-300">
          {/* Outer Ring Ticks */}
          <div className="absolute inset-2 rounded-full border border-dashed border-emerald-200 dark:border-emerald-900/80 pointer-events-none" />

          {/* Cardinal Directions */}
          <div className="absolute top-3 font-extrabold text-xs text-emerald-600">شمال (N)</div>
          <div className="absolute bottom-3 font-extrabold text-xs text-gray-400">جنوب (S)</div>
          <div className="absolute right-3 font-extrabold text-xs text-gray-400">شرق (E)</div>
          <div className="absolute left-3 font-extrabold text-xs text-gray-400">غرب (W)</div>

          {/* Compass Dial Rose (Rotates with device heading) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-200 pointer-events-none"
            style={{
              transform: `rotate(-${currentHeading}deg)`
            }}
          >
            {/* Degree Markers */}
            <div className="absolute top-8 w-1 h-3 bg-red-500 rounded-full" />
            <div className="absolute bottom-8 w-0.5 h-2 bg-gray-300 dark:bg-gray-700" />
            <div className="absolute right-8 w-2 h-0.5 bg-gray-300 dark:bg-gray-700" />
            <div className="absolute left-8 w-2 h-0.5 bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Kaaba Direction Needle */}
          <div
            className="w-full h-full absolute top-0 left-0 flex items-center justify-center transition-transform duration-300 pointer-events-none"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            <div className="w-2 h-32 bg-gradient-to-t from-transparent via-amber-400 to-amber-500 rounded-full flex flex-col items-center justify-start relative -top-8 shadow-md">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-lg -top-3.5 relative border-2 border-white dark:border-[#15241f]">
                🕋
              </div>
            </div>
          </div>

          {/* Center Hub */}
          <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center z-10 border transition-all ${
            isFacingQibla
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg ring-4 ring-emerald-300/40'
              : 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
          }`}>
            <Compass className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-bold mt-0.5">{Math.round(currentHeading)}°</span>
          </div>
        </div>
      </div>

      {/* Permission Button for iOS or manual sensor enable */}
      {typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && !permissionGranted && (
        <button
          onClick={requestOrientationPermission}
          className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-md inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          تفعيل حساس البوصلة والحركة
        </button>
      )}

      {/* Advice Box */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-100 text-right leading-relaxed max-w-md mx-auto space-y-1.5">
        <p className="font-bold flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          إرشادات الدقة الفائقة للقبلة:
        </p>
        <ul className="space-y-1 text-[11px] list-disc list-inside text-gray-600 dark:text-gray-300">
          <li>ضع الهاتف بشكل أفقي مستوٍ تماماً على راحة يدك أو على طاولة.</li>
          <li>ابتعد عن الأجهزة الإلكترونية أو المجالات المغناطيسية لضمان دقة الحساس.</li>
          <li>حرك الهاتف بشكل رقم (8) بالهواء لمعايرة البوصلة إن لزم الأمر.</li>
        </ul>
      </div>
    </div>
  );
};
