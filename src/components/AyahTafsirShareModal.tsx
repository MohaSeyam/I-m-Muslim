import React, { useRef, useState, useEffect } from 'react';
import { PageAyahExtended } from '../utils/quranService';
import { toArabicNumerals } from '../data/quranData';
import {
  X,
  BookOpen,
  Share2,
  Copy,
  Volume2,
  VolumeX,
  Check,
  Sparkles,
  Download,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Bookmark
} from 'lucide-react';

interface AyahTafsirShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAyah: PageAyahExtended | null;
  allPageAyahs: PageAyahExtended[];
  surahNameArabic: string;
  surahNumber: number;
  onToggleBookmark?: (ayah: PageAyahExtended) => void;
  isBookmarked?: boolean;
}

export const AyahTafsirShareModal: React.FC<AyahTafsirShareModalProps> = ({
  isOpen,
  onClose,
  initialAyah,
  allPageAyahs,
  surahNameArabic,
  surahNumber: _surahNumber,
  onToggleBookmark,
  isBookmarked = false
}) => {
  const [activeTab, setActiveTab] = useState<'tafsir' | 'share' | 'rangeShare'>('tafsir');
  const [startAyahNumber, setStartAyahNumber] = useState<number>(1);
  const [endAyahNumber, setEndAyahNumber] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [imageTheme, setImageTheme] = useState<'emerald' | 'gold' | 'dark' | 'cream'>('emerald');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardCanvasRef = useRef<HTMLDivElement | null>(null);

  // Sync state when initialAyah changes
  useEffect(() => {
    if (initialAyah) {
      setStartAyahNumber(initialAyah.numberInSurah);
      setEndAyahNumber(initialAyah.numberInSurah);
      setActiveTab('tafsir');
    }
  }, [initialAyah]);

  if (!isOpen || !initialAyah) return null;

  const safeAyahs = allPageAyahs || [];

  // Selected range of ayahs on the current page
  const minAyahInPage = safeAyahs.length > 0 ? Math.min(...safeAyahs.map(a => a.numberInSurah)) : 1;
  const maxAyahInPage = safeAyahs.length > 0 ? Math.max(...safeAyahs.map(a => a.numberInSurah)) : 1;

  const validStart = Math.min(startAyahNumber, endAyahNumber);
  const validEnd = Math.max(startAyahNumber, endAyahNumber);

  const selectedRangeAyahs = safeAyahs.filter(
    a => a.numberInSurah >= validStart && a.numberInSurah <= validEnd
  );

  // Formatted range text with diacritics and ayah badges
  const rangeFormattedText = selectedRangeAyahs
    .map(a => `${a.textArabic} ﴿${toArabicNumerals(a.numberInSurah)}﴾`)
    .join(' ');

  const singleAyahFullText = `﴿ ${initialAyah.textArabic} ﴾ [سورة ${surahNameArabic}: الآية ${toArabicNumerals(initialAyah.numberInSurah)}]`;

  const rangeShareFullText = selectedRangeAyahs.length === 1
    ? singleAyahFullText
    : `﴿ ${rangeFormattedText} ﴾\n[سورة ${surahNameArabic}: الآيات ${toArabicNumerals(validStart)} - ${toArabicNumerals(validEnd)}]\n— تطبيق أنا مسلم`;

  // Copy handler
  const handleCopyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Web Share API handler
  const handleShareNative = async (text: string, title: string) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text
        });
      } catch (e) {
        handleCopyText(text);
      }
    } else {
      handleCopyText(text);
    }
  };

  // Generate and download/share image using HTML5 Canvas drawing
  const handleGenerateCardImage = async () => {
    setIsGeneratingImage(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1350; // High resolution 4:5 Instagram/WhatsApp portrait size
      canvas.width = width;
      canvas.height = height;

      // Themes config
      const themes = {
        emerald: {
          bg1: '#0B241E',
          bg2: '#04130F',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          border: '#D4AF37',
          textColor: '#FFFFFF',
          accentColor: '#F59E0B',
          metaColor: '#A7F3D0'
        },
        gold: {
          bg1: '#1F1A12',
          bg2: '#0F0C08',
          cardBg: 'rgba(212, 175, 55, 0.07)',
          border: '#FBBF24',
          textColor: '#FFFDF5',
          accentColor: '#FBBF24',
          metaColor: '#FDE68A'
        },
        dark: {
          bg1: '#111827',
          bg2: '#030712',
          cardBg: 'rgba(255, 255, 255, 0.04)',
          border: '#4B5563',
          textColor: '#F9FAFB',
          accentColor: '#38BDF8',
          metaColor: '#9CA3AF'
        },
        cream: {
          bg1: '#FBF9F2',
          bg2: '#EFE7DA',
          cardBg: '#FFFFFF',
          border: '#C29B38',
          textColor: '#1F2937',
          accentColor: '#92400E',
          metaColor: '#4B5563'
        }
      };

      const t = themes[imageTheme];

      // 1. Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, t.bg1);
      grad.addColorStop(1, t.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Decorative Islamic Border
      ctx.strokeStyle = t.border;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      ctx.lineWidth = 1.5;
      ctx.strokeRect(55, 55, width - 110, height - 110);

      // Corner ornaments
      const corners = [
        [40, 40],
        [width - 40, 40],
        [40, height - 40],
        [width - 40, height - 40]
      ];
      ctx.fillStyle = t.accentColor;
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Top Header: Basmalah & Surah Info
      ctx.fillStyle = t.accentColor;
      ctx.font = 'bold 36px "Amiri Quran", "Amiri", "Traditional Arabic", serif';
      ctx.textAlign = 'center';
      ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, 140);

      ctx.fillStyle = t.metaColor;
      ctx.font = 'bold 32px "Amiri", sans-serif';
      const rangeLabel = validStart === validEnd
        ? `سُورَةُ ${surahNameArabic} • الآية ${toArabicNumerals(validStart)}`
        : `سُورَةُ ${surahNameArabic} • الآيات ${toArabicNumerals(validStart)} - ${toArabicNumerals(validEnd)}`;
      ctx.fillText(rangeLabel, width / 2, 200);

      // 4. Main Ayah Text Box
      const textToDraw = selectedRangeAyahs.length === 1
        ? `﴿ ${initialAyah.textArabic} ﴾`
        : `﴿ ${rangeFormattedText} ﴾`;

      ctx.fillStyle = t.textColor;
      ctx.font = 'bold 44px "Amiri Quran", "KFGQPC Uthman Taha Naskh", "Amiri", serif';
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

      // Text wrapping function
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        const lines: string[] = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        // Center vertically in the body box
        const totalHeight = lines.length * lineHeight;
        const startY = y - totalHeight / 2 + lineHeight / 2;

        lines.forEach((l, idx) => {
          ctx.fillText(l.trim(), x, startY + idx * lineHeight);
        });
      };

      wrapText(textToDraw, width / 2, height / 2 + 10, width - 200, 85);

      // 5. Bottom Brand & Footer
      ctx.fillStyle = t.accentColor;
      ctx.font = 'bold 28px "Amiri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('تطبيق أنا مسلم — القرآن الكريم والأذكار', width / 2, height - 100);

      // Export to Image & Trigger Download / Share
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGeneratingImage(false);
          return;
        }

        const fileName = `Ayah-${initialAyah.surahNumber}-${validStart}-${validEnd}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `آية من سورة ${surahNameArabic}`,
              text: rangeShareFullText
            });
            setIsGeneratingImage(false);
            return;
          } catch (e) {}
        }

        // Fallback: Direct Download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsGeneratingImage(false);
      }, 'image/png');

    } catch (e) {
      console.error('Error generating card image', e);
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm backdrop-fade-smooth select-none">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0E1420] rounded-3xl border border-coolgreen-600/30 dark:border-white/10 shadow-2xl overflow-hidden modal-pop-smooth text-gray-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 bg-gradient-to-r from-coolgreen-900 via-coolgreen-800 to-coolgreen-950 dark:from-[#151D2A] dark:to-[#0B101A] text-white flex items-center justify-between border-b border-coolgreen-700/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold font-display text-sm">
              {toArabicNumerals(initialAyah.numberInSurah)}
            </div>
            <div>
              <h3 className="font-extrabold font-display text-base text-emerald-300">
                سورة {surahNameArabic}
              </h3>
              <p className="text-[11px] text-emerald-100 dark:text-slate-300 font-sans">
                الآية {toArabicNumerals(initialAyah.numberInSurah)} • صفحة {toArabicNumerals(initialAyah.page || 1)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(initialAyah)}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  isBookmarked
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-emerald-300'
                }`}
                title={isBookmarked ? 'إزالة الفاصل / العلامة' : 'وضع علامة مرجعية / فاصل'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline text-[11px] font-sans">
                  {isBookmarked ? 'معلّمة كفاصل' : 'حفظ كفاصل'}
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Switches */}
        <div className="flex items-center p-1.5 bg-gray-100 dark:bg-[#151E2E] border-b border-gray-200 dark:border-white/10 text-xs font-bold font-sans">
          <button
            onClick={() => setActiveTab('tafsir')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'tafsir'
                ? 'bg-white dark:bg-[#24314A] text-coolgreen-900 dark:text-emerald-300 shadow-2xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>التفسير الميسر</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'share'
                ? 'bg-white dark:bg-[#24314A] text-coolgreen-900 dark:text-emerald-300 shadow-2xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة الآية</span>
          </button>

          <button
            onClick={() => setActiveTab('rangeShare')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'rangeShare'
                ? 'bg-white dark:bg-[#24314A] text-coolgreen-900 dark:text-emerald-300 shadow-2xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>تحديد عدة آيات</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: TAFSIR */}
          {activeTab === 'tafsir' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Ayah Box */}
              <div className="p-4 rounded-2xl bg-coolgreen-50/70 dark:bg-[#141C2B] border border-coolgreen-600/30 dark:border-white/10 text-center">
                <p className="font-quran text-lg sm:text-xl text-gray-950 dark:text-slate-100 font-bold leading-loose">
                  ﴿ {initialAyah.textArabic} ﴾
                </p>
                <div className="mt-2 text-xs font-bold text-coolgreen-800 dark:text-emerald-400 font-sans">
                  [سورة {surahNameArabic}: {toArabicNumerals(initialAyah.numberInSurah)}]
                </div>
              </div>

              {/* Tafsir Content */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#121927] border border-gray-200 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-coolgreen-900 dark:text-emerald-300 font-display border-b border-gray-200 dark:border-white/10 pb-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>التفسير الميسر وبيان المعنى:</span>
                </div>
                <p className="text-sm sm:text-base text-gray-800 dark:text-slate-200 leading-relaxed text-justify font-sans">
                  {initialAyah.tafseer || 'التفسير الميسر: هداية وتدبر لآيات الله الكريمة وبيان مقاصدها العظيمة.'}
                </p>
              </div>

              {/* Action Buttons in Tafsir */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopyText(`﴿ ${initialAyah.textArabic} ﴾\n[سورة ${surahNameArabic}: ${toArabicNumerals(initialAyah.numberInSurah)}]\n\nالتفسير:\n${initialAyah.tafseer}`)}
                  className="flex-1 py-2.5 rounded-xl bg-coolgreen-50 dark:bg-[#1C2538] hover:bg-coolgreen-100 dark:hover:bg-[#25324C] text-coolgreen-900 dark:text-emerald-300 border border-coolgreen-600/20 dark:border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم نسخ التفسير' : 'نسخ الآية مع التفسير'}</span>
                </button>

                <button
                  onClick={() => handleShareNative(`﴿ ${initialAyah.textArabic} ﴾\n[سورة ${surahNameArabic}: ${toArabicNumerals(initialAyah.numberInSurah)}]\n\nالتفسير:\n${initialAyah.tafseer}\n— تطبيق أنا مسلم`, `تفسير آية من سورة ${surahNameArabic}`)}
                  className="py-2.5 px-4 rounded-xl bg-coolgreen-800 hover:bg-coolgreen-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: SHARE SINGLE & RANGE OF AYAHS */}
          {(activeTab === 'share' || activeTab === 'rangeShare') && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Range Selector in Multi-Ayah Mode */}
              {activeTab === 'rangeShare' && (
                <div className="p-3.5 rounded-2xl bg-coolgreen-50/70 dark:bg-[#141C2B] border border-coolgreen-600/20 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-coolgreen-950 dark:text-emerald-300 font-sans">
                      تحديد نطاق الآيات من هذه الصفحة ({toArabicNumerals(minAyahInPage)} إلى {toArabicNumerals(maxAyahInPage)}):
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 font-sans">
                      {toArabicNumerals(selectedRangeAyahs.length)} {selectedRangeAyahs.length === 1 ? 'آية' : 'آيات'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-slate-400 block font-sans">
                        من الآية رقم:
                      </label>
                      <select
                        value={startAyahNumber}
                        onChange={e => setStartAyahNumber(Number(e.target.value))}
                        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#1C2538] border border-gray-300 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-slate-100"
                      >
                        {allPageAyahs.map(a => (
                          <option key={`start_${a.numberInSurah}`} value={a.numberInSurah}>
                            الآية {toArabicNumerals(a.numberInSurah)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-slate-400 block font-sans">
                        إلى الآية رقم:
                      </label>
                      <select
                        value={endAyahNumber}
                        onChange={e => setEndAyahNumber(Number(e.target.value))}
                        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#1C2538] border border-gray-300 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-slate-100"
                      >
                        {allPageAyahs.map(a => (
                          <option key={`end_${a.numberInSurah}`} value={a.numberInSurah}>
                            الآية {toArabicNumerals(a.numberInSurah)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Live Preview Card */}
              <div 
                ref={cardCanvasRef}
                className={`p-5 sm:p-6 rounded-2xl border-2 shadow-xl space-y-3 relative overflow-hidden transition-all duration-300 ${
                  imageTheme === 'emerald'
                    ? 'bg-gradient-to-br from-[#0B241E] via-[#061A15] to-[#04130F] text-white border-emerald-500/50'
                    : imageTheme === 'gold'
                    ? 'bg-gradient-to-br from-[#121A26] via-[#0E1520] to-[#0A0F17] text-slate-100 border-slate-600'
                    : imageTheme === 'dark'
                    ? 'bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#030712] text-slate-100 border-slate-700'
                    : 'bg-gradient-to-br from-[#F5F9F6] via-[#EEF5F0] to-[#E5EFE8] text-coolgreen-950 border-emerald-600/30'
                }`}
              >
                {/* Corner Decorative Dots */}
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-70 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-70 pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-70 pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-70 pointer-events-none" />

                <div className="flex items-center justify-between border-b pb-2 border-white/10 dark:border-black/10">
                  <span className={`text-xs font-bold font-display ${
                    imageTheme === 'cream' ? 'text-emerald-900' : 'text-emerald-300'
                  }`}>
                    سُورَةُ {surahNameArabic}
                  </span>
                  <span className={`text-[11px] font-sans ${
                    imageTheme === 'cream' ? 'text-gray-600' : 'text-emerald-200 dark:text-slate-300'
                  }`}>
                    {validStart === validEnd
                      ? `الآية ${toArabicNumerals(validStart)}`
                      : `الآيات ${toArabicNumerals(validStart)} - ${toArabicNumerals(validEnd)}`}
                  </span>
                </div>

                <div className="text-center text-xs opacity-75 font-quran pt-1">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>

                <p className={`font-quran text-base sm:text-lg font-bold leading-loose text-center py-3 ${
                  imageTheme === 'cream' ? 'text-gray-950' : 'text-emerald-50'
                }`}>
                  {activeTab === 'share' ? `﴿ ${initialAyah.textArabic} ﴾` : `﴿ ${rangeFormattedText} ﴾`}
                </p>

                <div className={`text-center text-[10px] font-sans border-t pt-2 border-white/10 dark:border-black/10 ${
                  imageTheme === 'cream' ? 'text-emerald-900' : 'text-gray-400'
                }`}>
                  تطبيق أنا مسلم • القرآن الكريم والأذكار
                </div>
              </div>

              {/* Card Image Color Theme Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 font-sans block">
                  سمة ولون بطاقة الصورة:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'emerald', label: 'زمردي', bg: 'bg-emerald-800 text-white' },
                    { id: 'gold', label: 'كحلي', bg: 'bg-slate-800 text-white' },
                    { id: 'dark', label: 'ليلي', bg: 'bg-slate-950 text-white' },
                    { id: 'cream', label: 'فاتح', bg: 'bg-emerald-50 text-emerald-950' },
                  ].map(th => (
                    <button
                      key={th.id}
                      onClick={() => setImageTheme(th.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer border ${th.bg} ${
                        imageTheme === th.id ? 'ring-2 ring-emerald-400 border-white' : 'border-transparent opacity-75'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions: Copy Text, Share Text, Export as Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {/* 1. Copy formatted text */}
                <button
                  onClick={() => handleCopyText(rangeShareFullText)}
                  className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-[#1C2538] hover:bg-gray-200 dark:hover:bg-[#25324C] text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ كنص'}</span>
                </button>

                {/* 2. Share formatted text */}
                <button
                  onClick={() => handleShareNative(rangeShareFullText, `آيات من سورة ${surahNameArabic}`)}
                  className="py-2.5 px-3 rounded-xl bg-coolgreen-800 hover:bg-coolgreen-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة نصية</span>
                </button>

                {/* 3. Export & Share as Photo Image */}
                <button
                  onClick={handleGenerateCardImage}
                  disabled={isGeneratingImage}
                  className="py-2.5 px-3 rounded-xl bg-coolgreen-800 hover:bg-coolgreen-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isGeneratingImage ? 'جاري الإنشاء...' : 'مشاركة كصورة'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
