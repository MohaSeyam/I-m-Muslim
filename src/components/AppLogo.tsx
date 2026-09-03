import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 40, className = '', showText = false }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-teal-950 dark:from-slate-900 dark:via-emerald-950 dark:to-[#04120D] p-1.5 flex items-center justify-center shadow-lg shadow-emerald-950/25 dark:shadow-black/60 ring-1 ring-emerald-400/40 dark:ring-emerald-400/30 overflow-hidden flex-shrink-0 transition-all duration-300 group-hover:scale-105"
      >
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-400/30 dark:from-emerald-400/20 to-transparent pointer-events-none" />

        {/* Brand-New Islamic Holy Quran & Sacred Geometry Emblem */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.35)]"
        >
          <defs>
            <linearGradient id="mushafEmeraldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="0.4" stopColor="#10B981" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="mushafPageGrad" x1="30" y1="35" x2="70" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#F0FDF4" />
              <stop offset="1" stopColor="#D1FAE5" />
            </linearGradient>

            <linearGradient id="starLineGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6EE7B7" />
              <stop offset="0.5" stopColor="#10B981" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Outer Geometric Frame: Two Rotated Squares (Rub el Hizb) */}
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="8"
            stroke="url(#starLineGrad)"
            strokeWidth="1.8"
            strokeOpacity="0.5"
            fill="none"
          />
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="8"
            transform="rotate(45 50 50)"
            stroke="url(#starLineGrad)"
            strokeWidth="1.8"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* Inner Light Ring */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="#A7F3D0"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="2 3"
          />

          {/* Rehal Base (Islamic Wooden Quran Stand) */}
          <path
            d="M32 76 L50 62 L68 76"
            stroke="url(#mushafEmeraldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M38 72 L50 63 L62 72"
            stroke="#A7F3D0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />

          {/* Open Mushaf Pages (Left Wing) */}
          <path
            d="M50 36 C42 33 32 35 24 39 C23.5 45 23.5 54 24 60 C32 56 42 54 50 58 Z"
            fill="url(#mushafPageGrad)"
            stroke="#10B981"
            strokeWidth="1.2"
          />
          {/* Subtle Quran script lines on left page */}
          <line x1="28" y1="44" x2="45" y2="41" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="28" y1="49" x2="46" y2="46" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="30" y1="54" x2="44" y2="52" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />

          {/* Open Mushaf Pages (Right Wing) */}
          <path
            d="M50 36 C58 33 68 35 76 39 C76.5 45 76.5 54 76 60 C68 56 58 54 50 58 Z"
            fill="url(#mushafPageGrad)"
            stroke="#10B981"
            strokeWidth="1.2"
          />
          {/* Subtle Quran script lines on right page */}
          <line x1="55" y1="41" x2="72" y2="44" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="54" y1="46" x2="72" y2="49" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="56" y1="52" x2="70" y2="54" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />

          {/* Mushaf Spine & Ribbon Bookmark */}
          <line x1="50" y1="36" x2="50" y2="58" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M50 58 C51 63 53 66 54 69 L50 67 L46 69 C47 66 49 63 50 58 Z"
            fill="#34D399"
          />

          {/* Radiant Spiritual Crest (Top Star & Rays) */}
          <circle cx="50" cy="24" r="2.2" fill="#6EE7B7" />
          <circle cx="50" cy="24" r="4.5" stroke="#A7F3D0" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <span className="text-base font-extrabold text-gray-900 dark:text-slate-100 font-display leading-tight tracking-tight">
            أنا مسلم
          </span>
          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 font-sans leading-none">
            المصحف الشريف وحصن المسلم
          </span>
        </div>
      )}
    </div>
  );
};
