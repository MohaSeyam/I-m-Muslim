import React, { useState, useEffect } from 'react';
import { QuranBookmark } from '../../types';
import {
  getQuranBookmarks,
  removeQuranBookmark,
  clearAllQuranBookmarks
} from '../../utils/quranStorage';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  Copy,
  Check,
  Share2,
  BookOpen,
  ArrowRight,
  Info,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

interface BookmarksScreenProps {
  onNavigate: (tab: string, subParam?: any) => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ onNavigate }) => {
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTafseerId, setActiveTafseerId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const list = getQuranBookmarks();
    setBookmarks(list);
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 2200);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    removeQuranBookmark(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
    showToast('تمت إزالة الآية من الإشارات المرجعية');
  };

  const handleClearAll = () => {
    clearAllQuranBookmarks();
    setBookmarks([]);
    setShowClearConfirm(false);
    showToast('تم مسح جميع الإشارات المرجعية');
  };

  const handleCopy = (bookmark: QuranBookmark, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `﴿${bookmark.ayahTextArabic}﴾ [سورة ${bookmark.surahNameArabic}: ${bookmark.ayahNumberInSurah}]${
      bookmark.ayahTextEnglish ? `\n\n"${bookmark.ayahTextEnglish}"` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedId(bookmark.id);
    showToast('تم نسخ نص الآية الكريمة');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (bookmark: QuranBookmark, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareText = `﴿${bookmark.ayahTextArabic}﴾ [سورة ${bookmark.surahNameArabic}: ${bookmark.ayahNumberInSurah}]`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `سورة ${bookmark.surahNameArabic} - آية ${bookmark.ayahNumberInSurah}`,
          text: shareText
        })
        .catch(() => {});
    } else {
      handleCopy(bookmark);
    }
  };

  const handleOpenInQuran = (bookmark: QuranBookmark) => {
    onNavigate('quran', {
      surahNumber: bookmark.surahNumber,
      ayahNumber: bookmark.ayahNumberInSurah
    });
  };

  const filteredBookmarks = bookmarks.filter(b => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      b.surahNameArabic.includes(query) ||
      (b.surahNameEnglish && b.surahNameEnglish.toLowerCase().includes(query)) ||
      b.ayahTextArabic.includes(query) ||
      (b.ayahTextEnglish && b.ayahTextEnglish.toLowerCase().includes(query)) ||
      b.ayahNumberInSurah.toString() === query ||
      b.surahNumber.toString() === query
    );
  });

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-700 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-amber-300" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('more')}
            className="p-1.5 rounded-xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition"
            title="العودة لشاشة المزيد"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              الإشارات المرجعية
              {bookmarks.length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-900">
                  {bookmarks.length} {bookmarks.length === 1 ? 'آية' : 'آيات'}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">الآيات القرآنية المحفوظة للرجوع السريع والتلاوة</p>
          </div>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            مسح الكل
          </button>
        )}
      </div>

      {/* Confirmation Modal for Clearing All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#15241f] rounded-3xl p-6 max-w-sm w-full border border-emerald-100 dark:border-emerald-950 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">مسح جميع الإشارات؟</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                هل أنت متأكد من حذف جميع الآيات المحفوظة في الإشارات المرجعية ({bookmarks.length} آية)؟
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-sm"
              >
                تأكيد المسح
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar if bookmarks exist */}
      {bookmarks.length > 0 && (
        <div className="relative">
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <input
            type="text"
            placeholder="ابحث في الآيات المحفوظة باسم السورة أو بنص الآية..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs transition"
          />
        </div>
      )}

      {/* Bookmarks List or Empty State */}
      {bookmarks.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
              لا توجد إشارات مرجعية محفوظة
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              يمكنك حفظ أي آية أثناء تلاوة القرآن الكريم بالضغط على زر "إشارة مرجعية" للرجوع إليها وتدبرها في أي وقت.
            </p>
          </div>
          <button
            onClick={() => onNavigate('quran')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition transform active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            الانتقال إلى المصحف الشريف
          </button>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 text-center space-y-2">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">لم يتم العثور على نتائج تطابق "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold underline"
          >
            إلغاء البحث
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map(b => (
            <div
              key={b.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#15241f] border border-emerald-100 dark:border-emerald-950 shadow-sm space-y-3.5 hover:border-emerald-400 dark:hover:border-emerald-700 transition group"
            >
              {/* Bookmark Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-200 dark:border-amber-900">
                    <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      سورة {b.surahNameArabic}
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-normal">
                        (الآية {b.ayahNumberInSurah})
                      </span>
                    </h4>
                    <span className="text-[10px] text-gray-400 block">
                      {b.surahNameEnglish || `السورة رقم ${b.surahNumber}`} • {formatDate(b.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => handleCopy(b, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title="نسخ الآية"
                  >
                    {copiedId === b.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={e => handleShare(b, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title="مشاركة الآية"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={e => handleDelete(b.id, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="حذف من الإشارات"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ayah Text */}
              <div
                onClick={() => handleOpenInQuran(b)}
                className="cursor-pointer bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40 group-hover:bg-emerald-50/70 dark:group-hover:bg-emerald-950/40 transition"
              >
                <p className="font-quran text-base sm:text-lg leading-loose text-right text-gray-900 dark:text-gray-100">
                  {b.ayahTextArabic} ﴿{b.ayahNumberInSurah}﴾
                </p>
                {b.ayahTextEnglish && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-sans text-left dir-ltr border-t border-emerald-100/60 dark:border-emerald-900/40 pt-2">
                    {b.ayahTextEnglish}
                  </p>
                )}
              </div>

              {/* Tafseer Collapse if available */}
              {b.tafseer && (
                <div>
                  <button
                    onClick={() => setActiveTafseerId(activeTafseerId === b.id ? null : b.id)}
                    className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    {activeTafseerId === b.id ? 'إخفاء التفسير الميسر' : 'عرض التفسير الميسر'}
                  </button>
                  {activeTafseerId === b.id && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed animate-fadeIn">
                      {b.tafseer}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Jump Button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">رقم السورة: {b.surahNumber}</span>
                <button
                  onClick={() => handleOpenInQuran(b)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs transition group-hover:shadow"
                >
                  <span>تلاوة في المصحف</span>
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
