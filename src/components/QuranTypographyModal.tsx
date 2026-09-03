import React from 'react';
import { X, Type, ZoomIn, Check, RotateCcw, AlignJustify, Sparkles } from 'lucide-react';
import { AppSettings, updateStoredSettings } from '../utils/settingsStorage';
import { toArabicNumerals } from '../data/quranData';

interface QuranTypographyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

export const QuranTypographyModal: React.FC<QuranTypographyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  const currentSize = settings.quranFontSizeNumeric || 24;
  const currentLineHeight = settings.quranLineHeightNumeric || 2.4;
  const currentFontFamily = settings.quranFontFamily || 'uthmani';

  const updateSize = (newSize: number) => {
    const clamped = Math.max(16, Math.min(42, newSize));
    let sizeCategory: AppSettings['quranFontSize'] = 'medium';
    if (clamped <= 18) sizeCategory = 'small';
    else if (clamped <= 23) sizeCategory = 'medium';
    else if (clamped <= 28) sizeCategory = 'large';
    else if (clamped <= 34) sizeCategory = 'xlarge';
    else sizeCategory = 'huge';

    const updated = updateStoredSettings({
      quranFontSizeNumeric: clamped,
      quranFontSize: sizeCategory
    });
    onSettingsChange(updated);
  };

  const updateLineHeight = (newLineHeight: number) => {
    const rounded = Math.round(Math.max(1.8, Math.min(3.4, newLineHeight)) * 10) / 10;
    let heightCategory: AppSettings['quranLineHeight'] = 'normal';
    if (rounded <= 2.0) heightCategory = 'compact';
    else if (rounded <= 2.4) heightCategory = 'normal';
    else if (rounded <= 2.8) heightCategory = 'relaxed';
    else heightCategory = 'spacious';

    const updated = updateStoredSettings({
      quranLineHeightNumeric: rounded,
      quranLineHeight: heightCategory
    });
    onSettingsChange(updated);
  };

  const updateFontFamily = (family: AppSettings['quranFontFamily']) => {
    const updated = updateStoredSettings({
      quranFontFamily: family
    });
    onSettingsChange(updated);
  };

  const handleResetDefaults = () => {
    const updated = updateStoredSettings({
      quranFontSizeNumeric: 24,
      quranFontSize: 'medium',
      quranLineHeightNumeric: 2.4,
      quranLineHeight: 'normal',
      quranFontFamily: 'uthmani'
    });
    onSettingsChange(updated);
  };

  const sizePresets = [
    { label: 'صغير', size: 18 },
    { label: 'متوسط', size: 24 },
    { label: 'كبير', size: 28 },
    { label: 'كبير جداً', size: 34 },
    { label: 'ضخم', size: 40 },
  ];

  const lineHeightPresets = [
    { label: 'متقارب', height: 2.0 },
    { label: 'عادي', height: 2.4 },
    { label: 'مريح', height: 2.8 },
    { label: 'واسع', height: 3.2 },
  ];

  const fontFamilies: { id: AppSettings['quranFontFamily']; name: string; fontClass: string; desc: string }[] = [
    { id: 'uthmani', name: 'الرسم العثماني (حفص)', fontClass: 'font-uthmani', desc: 'الرسم القياسي المعتمد لمصحف المدينة النبوية' },
    { id: 'amiri', name: 'الأميري القرآني', fontClass: 'font-quran', desc: 'خط نسخي إسلامي كلاسيكي عالي الدقة والجمال' },
    { id: 'scheherazade', name: 'شهرزاد الجديد', fontClass: 'font-naskh', desc: 'خط نسخ واضح ومريح للقراءة المطولة' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs backdrop-fade-smooth select-none">
      <div 
        className="w-full max-w-lg bg-[#FAF8F2] dark:bg-[#111622] border border-coolgreen-600/30 dark:border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] modal-pop-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-coolgreen-800 via-coolgreen-900 to-coolgreen-950 dark:from-slate-850 dark:via-slate-900 dark:to-[#0B0F17] text-white flex items-center justify-between border-b border-emerald-500/20 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-display text-white dark:text-slate-100">
                إعدادات الخط وتباعد الأسطر
              </h3>
              <p className="text-[11px] text-iceblue-200 dark:text-slate-400 font-sans">
                تخصيص تجربة القراءة وحفظها تلقائياً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 dark:text-slate-300 transition text-xs flex items-center gap-1 cursor-pointer font-sans"
              title="إعادة تعيين للإعدادات الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">افتراضي</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-5 flex-1 font-sans text-gray-900 dark:text-slate-100">
          
          {/* 1. Live Preview Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#182030] border border-coolgreen-500/20 dark:border-white/10 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-coolgreen-800 dark:text-emerald-400 font-bold mb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                معاينة حية فورية
              </span>
              <span>
                {toArabicNumerals(currentSize)}px • تباعد {toArabicNumerals(currentLineHeight)}
              </span>
            </div>
            <div
              className={`text-center select-none text-gray-900 dark:text-slate-100 ${
                currentFontFamily === 'amiri'
                  ? 'font-quran'
                  : currentFontFamily === 'scheherazade'
                  ? 'font-naskh'
                  : 'font-uthmani'
              }`}
              style={{
                fontSize: `${currentSize}px`,
                lineHeight: currentLineHeight,
              }}
            >
              ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ ﴾
            </div>
          </div>

          {/* 2. Font Size Control (حجم الخط) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold font-display flex items-center gap-1.5 text-gray-900 dark:text-slate-100">
                <ZoomIn className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
                حجم خط الآيات ({toArabicNumerals(currentSize)} نقطة)
              </label>
              
              {/* Stepper buttons */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#182030] p-1 rounded-xl border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => updateSize(currentSize - 2)}
                  disabled={currentSize <= 16}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#222D42] text-gray-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-sm transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                  title="تصغير الخط"
                >
                  -
                </button>
                <span className="w-10 text-center font-display font-extrabold text-sm text-coolgreen-900 dark:text-emerald-300">
                  {toArabicNumerals(currentSize)}
                </span>
                <button
                  onClick={() => updateSize(currentSize + 2)}
                  disabled={currentSize >= 42}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#222D42] text-gray-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-sm transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                  title="تكبير الخط"
                >
                  +
                </button>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="16"
              max="42"
              step="1"
              value={currentSize}
              onChange={(e) => updateSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coolgreen-600 dark:accent-emerald-400"
            />

            {/* Presets */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {sizePresets.map((p) => {
                const isActive = Math.abs(currentSize - p.size) <= 1;
                return (
                  <button
                    key={p.size}
                    onClick={() => updateSize(p.size)}
                    className={`py-1.5 px-1 rounded-xl text-xs font-bold transition duration-150 cursor-pointer border text-center ${
                      isActive
                        ? 'bg-coolgreen-800 dark:bg-emerald-600 text-white border-coolgreen-800 dark:border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-[#182030] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-coolgreen-500/40'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Line Spacing Control (تباعد الأسطر) */}
          <div className="space-y-2.5 pt-2 border-t border-gray-200/80 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold font-display flex items-center gap-1.5 text-gray-900 dark:text-slate-100">
                <AlignJustify className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
                تباعد الأسطر ({toArabicNumerals(currentLineHeight)})
              </label>

              {/* Stepper buttons */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#182030] p-1 rounded-xl border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => updateLineHeight(currentLineHeight - 0.2)}
                  disabled={currentLineHeight <= 1.8}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#222D42] text-gray-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-sm transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                  title="تضييق المسافة بين الأسطر"
                >
                  -
                </button>
                <span className="w-12 text-center font-display font-extrabold text-sm text-coolgreen-900 dark:text-emerald-300">
                  {toArabicNumerals(currentLineHeight)}
                </span>
                <button
                  onClick={() => updateLineHeight(currentLineHeight + 0.2)}
                  disabled={currentLineHeight >= 3.4}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#222D42] text-gray-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-sm transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                  title="توسيع المسافة بين الأسطر"
                >
                  +
                </button>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1.8"
              max="3.4"
              step="0.1"
              value={currentLineHeight}
              onChange={(e) => updateLineHeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coolgreen-600 dark:accent-emerald-400"
            />

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {lineHeightPresets.map((lh) => {
                const isActive = Math.abs(currentLineHeight - lh.height) <= 0.1;
                return (
                  <button
                    key={lh.label}
                    onClick={() => updateLineHeight(lh.height)}
                    className={`py-1.5 px-1 rounded-xl text-xs font-bold transition duration-150 cursor-pointer border text-center ${
                      isActive
                        ? 'bg-coolgreen-800 dark:bg-emerald-600 text-white border-coolgreen-800 dark:border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-[#182030] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-coolgreen-500/40'
                    }`}
                  >
                    {lh.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Font Family Selector */}
          <div className="space-y-2 pt-2 border-t border-gray-200/80 dark:border-white/10">
            <label className="text-xs sm:text-sm font-extrabold font-display flex items-center gap-1.5 text-gray-900 dark:text-slate-100">
              <Type className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
              نوع خط المصحف المعتمد
            </label>

            <div className="space-y-2">
              {fontFamilies.map((f) => {
                const isSelected = currentFontFamily === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => updateFontFamily(f.id)}
                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-coolgreen-50 dark:bg-[#182030] border-coolgreen-700 dark:border-emerald-500 shadow-xs ring-1 ring-coolgreen-700/30 dark:ring-emerald-500/30'
                        : 'bg-white dark:bg-[#141A26] border-gray-200 dark:border-white/10 hover:border-coolgreen-500/30'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-display text-gray-900 dark:text-slate-100">
                          {f.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-coolgreen-700 dark:bg-emerald-500/20 text-white dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                            المحدد
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
                        {f.desc}
                      </p>
                    </div>

                    <div className="w-6 h-6 rounded-full flex items-center justify-center border border-coolgreen-600/30 dark:border-emerald-400/30">
                      {isSelected ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-coolgreen-700 dark:bg-emerald-500 flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#0E131C] border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 dark:text-slate-400 font-sans">
            يتم الحفظ تلقائياً في ذاكرة الهاتف
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-coolgreen-700 hover:bg-coolgreen-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
