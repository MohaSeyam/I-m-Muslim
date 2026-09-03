import React, { useState } from 'react';
import { DhikrItem } from '../types';
import { toArabicNumerals } from '../data/quranData';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles
} from 'lucide-react';

interface DhikrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dhikr: DhikrItem | null;
  categoryTitle: string;
}

export const DhikrShareModal: React.FC<DhikrShareModalProps> = ({
  isOpen,
  onClose,
  dhikr,
  categoryTitle
}) => {
  const [copied, setCopied] = useState(false);
  const [imageTheme, setImageTheme] = useState<'emerald' | 'gold' | 'dark' | 'cream'>('emerald');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!isOpen || !dhikr) return null;

  const fullShareText = `${dhikr.textArabic}\n\n[التكرار: ${toArabicNumerals(dhikr.countTarget)} مرات]\n${dhikr.virtue ? `الفضل: ${dhikr.virtue}\n` : ''}${dhikr.reference ? `المصدر: ${dhikr.reference}\n` : ''}— من ${categoryTitle} • تطبيق أنا مسلم`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareNativeText = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: categoryTitle,
          text: fullShareText
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleGenerateCardImage = async () => {
    setIsGeneratingImage(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      const themes = {
        emerald: {
          bg1: '#0B241E',
          bg2: '#04130F',
          border: '#D4AF37',
          textColor: '#FFFFFF',
          accentColor: '#F59E0B',
          metaColor: '#A7F3D0',
          virtueColor: '#CBD5E1'
        },
        gold: {
          bg1: '#261E14',
          bg2: '#120E08',
          border: '#FBBF24',
          textColor: '#FFFDF5',
          accentColor: '#FBBF24',
          metaColor: '#FDE68A',
          virtueColor: '#E2E8F0'
        },
        dark: {
          bg1: '#111827',
          bg2: '#030712',
          border: '#4B5563',
          textColor: '#F9FAFB',
          accentColor: '#38BDF8',
          metaColor: '#9CA3AF',
          virtueColor: '#D1D5DB'
        },
        cream: {
          bg1: '#FAF7F0',
          bg2: '#EAE0D0',
          border: '#C29B38',
          textColor: '#1F2937',
          accentColor: '#92400E',
          metaColor: '#4B5563',
          virtueColor: '#475569'
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

      // 3. Top Header: Category Title & Count
      ctx.fillStyle = t.accentColor;
      ctx.font = 'bold 36px "Amiri", "Traditional Arabic", serif';
      ctx.textAlign = 'center';
      ctx.fillText(categoryTitle, width / 2, 140);

      ctx.fillStyle = t.metaColor;
      ctx.font = 'bold 28px "Amiri", sans-serif';
      ctx.fillText(`التكرار المطلوب: ${toArabicNumerals(dhikr.countTarget)} ${dhikr.countTarget === 1 ? 'مرة واحدة' : 'مرات'}`, width / 2, 195);

      // 4. Main Dhikr Text Box
      ctx.fillStyle = t.textColor;
      ctx.font = 'bold 42px "Amiri", "KFGQPC Uthman Taha Naskh", serif';
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

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

        const totalHeight = lines.length * lineHeight;
        const startY = y - totalHeight / 2 + lineHeight / 2;

        lines.forEach((l, idx) => {
          ctx.fillText(l.trim(), x, startY + idx * lineHeight);
        });
      };

      const centerY = dhikr.virtue ? height / 2 - 40 : height / 2;
      wrapText(dhikr.textArabic, width / 2, centerY, width - 180, 78);

      // 5. Virtue / Hadith box if exists
      if (dhikr.virtue) {
        ctx.fillStyle = t.accentColor;
        ctx.font = 'bold 26px "Amiri", sans-serif';
        ctx.fillText('فضل هذا الذكر:', width / 2, height - 260);

        ctx.fillStyle = t.virtueColor;
        ctx.font = '24px "Amiri", sans-serif';
        wrapText(dhikr.virtue, width / 2, height - 200, width - 220, 42);
      }

      // 6. Bottom Brand & Footer
      ctx.fillStyle = t.accentColor;
      ctx.font = 'bold 26px "Amiri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('تطبيق أنا مسلم — القرآن الكريم وحصن المسلم', width / 2, height - 90);

      // Export to Image
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGeneratingImage(false);
          return;
        }

        const fileName = `Dhikr-${dhikr.id}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: categoryTitle,
              text: fullShareText
            });
            setIsGeneratingImage(false);
            return;
          } catch {}
        }

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
      console.error('Error generating dhikr card image', e);
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm backdrop-fade-smooth select-none">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0E1420] rounded-3xl border border-coolgreen-600/30 dark:border-white/10 shadow-2xl overflow-hidden modal-pop-smooth text-gray-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-coolgreen-900 via-coolgreen-800 to-coolgreen-950 dark:from-[#151D2A] dark:to-[#0B101A] text-white flex items-center justify-between border-b border-coolgreen-700/30">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold font-display text-base text-emerald-300">
                مشاركة الذكر
              </h3>
              <p className="text-[11px] text-emerald-100 dark:text-slate-300 font-sans">
                {categoryTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4">
          {/* Dynamic Live Preview Card */}
          <div 
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
                imageTheme === 'cream' ? 'text-coolgreen-900' : 'text-emerald-300'
              }`}>
                {categoryTitle}
              </span>
              <span className={`text-[11px] font-sans ${
                imageTheme === 'cream' ? 'text-gray-600' : 'text-emerald-200 dark:text-slate-300'
              }`}>
                التكرار: {toArabicNumerals(dhikr.countTarget)}
              </span>
            </div>

            <p className={`font-quran text-base sm:text-lg font-bold leading-loose text-center py-3 ${
              imageTheme === 'cream' ? 'text-gray-950' : 'text-emerald-50'
            }`}>
              {dhikr.textArabic}
            </p>

            {dhikr.virtue && (
              <div className={`text-xs font-sans text-center px-2 py-1.5 rounded-xl border ${
                imageTheme === 'cream'
                  ? 'bg-coolgreen-50 text-coolgreen-950 border-coolgreen-200'
                  : 'bg-white/5 text-slate-200 border-white/10'
              }`}>
                <span className="font-bold">الفضل: </span>{dhikr.virtue}
              </div>
            )}

            <div className={`text-center text-[10px] font-sans border-t pt-2 border-white/10 dark:border-black/10 ${
              imageTheme === 'cream' ? 'text-coolgreen-900' : 'text-gray-400'
            }`}>
              تطبيق أنا مسلم • القرآن الكريم والأذكار
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 font-sans block">
              سمة ولون بطاقة الصورة:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'emerald', label: 'زمردي', bg: 'bg-emerald-800 text-white' },
                { id: 'gold', label: 'كحلي', bg: 'bg-slate-800 text-white' },
                { id: 'dark', label: 'ليلي', bg: 'bg-slate-900 text-white' },
                { id: 'cream', label: 'فاتح', bg: 'bg-emerald-50 text-coolgreen-950' },
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

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {/* Copy text */}
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-[#1C2538] hover:bg-gray-200 dark:hover:bg-[#25324C] text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ كنص'}</span>
            </button>

            {/* Share text */}
            <button
              onClick={handleShareNativeText}
              className="py-2.5 px-3 rounded-xl bg-coolgreen-800 hover:bg-coolgreen-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة نصية</span>
            </button>

            {/* Export as image */}
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
      </div>
    </div>
  );
};
