import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { surahsList, juzData, toArabicNumerals, getPageMeta, PageMetaInfo } from '../../data/quranData';
import { fetchPageAyahs, preloadAdjacentPages, PageAyahExtended } from '../../utils/quranService';
import {
  getQuranLastReadPage,
  saveQuranLastReadPage,
  getQuranPageBookmark,
  saveQuranPageBookmark,
  saveQuranLastRead,
  saveRibbonBookmark,
  getQuranBookmarks,
  saveQuranBookmarks,
  recordQuranPageRead,
  QuranBookmark
} from '../../utils/quranStorage';
import { getStoredSettings } from '../../utils/settingsStorage';
import { SurahDrawerModal } from '../SurahDrawerModal';
import { QuranTypographyModal } from '../QuranTypographyModal';
import { AyahTafsirShareModal } from '../AyahTafsirShareModal';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookOpen,
  Maximize2,
  Minimize2,
  Search,
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';

interface QuranScreenProps {
  initialPageNumber?: number;
  initialSurahNumber?: number;
  initialAyahNumber?: number;
  onNavigate?: (tab: string, subParam?: any) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

interface PageSection {
  surahNumber: number;
  surahInfo: typeof surahsList[0];
  isSurahStart: boolean;
  ayahs: PageAyahExtended[];
}

export const QuranScreen: React.FC<QuranScreenProps> = ({
  initialPageNumber,
  initialSurahNumber,
  initialAyahNumber: _initialAyahNumber,
  onNavigate: _onNavigate,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  // 1. Current Page State (1 to 604)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPageNumber && initialPageNumber >= 1 && initialPageNumber <= 604) {
      return initialPageNumber;
    }
    if (initialSurahNumber) {
      const found = surahsList.find(s => s.number === initialSurahNumber);
      if (found && found.pageNumber) return found.pageNumber;
    }
    return getQuranLastReadPage();
  });

  // Settings for Font Size & Font Family
  const [settings, setSettings] = useState(() => getStoredSettings());

  useEffect(() => {
    if (initialPageNumber && initialPageNumber >= 1 && initialPageNumber <= 604) {
      setCurrentPage(initialPageNumber);
    } else if (initialSurahNumber) {
      const found = surahsList.find(s => s.number === initialSurahNumber);
      if (found && found.pageNumber) {
        setCurrentPage(found.pageNumber);
      }
    }
  }, [initialPageNumber, initialSurahNumber]);

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getStoredSettings());
    };
    window.addEventListener('app_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('app_settings_changed', handleSettingsChange);
  }, []);

  // Page metadata
  const pageMeta: PageMetaInfo = useMemo(() => getPageMeta(currentPage), [currentPage]);

  // Bookmarking
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(() => getQuranPageBookmark());
  const isCurrentPageBookmarked = bookmarkedPage === currentPage;
  const [bookmarksList, setBookmarksList] = useState<QuranBookmark[]>(() => getQuranBookmarks());

  // Drawer / Index Modal
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Quick Jump Input dialog
  const [isJumpDialogOpen, setIsJumpDialogOpen] = useState<boolean>(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>(currentPage.toString());

  // Typography Settings Modal
  const [isTypographyModalOpen, setIsTypographyModalOpen] = useState<boolean>(false);

  // Ayah Tafsir & Share Modal
  const [isTafsirShareModalOpen, setIsTafsirShareModalOpen] = useState<boolean>(false);
  const [activeModalAyah, setActiveModalAyah] = useState<PageAyahExtended | null>(null);

  // Fast Page Slider visibility and dragging state
  const [showPageSlider, setShowPageSlider] = useState<boolean>(false);
  const [sliderPageValue, setSliderPageValue] = useState<number>(currentPage);

  useEffect(() => {
    setSliderPageValue(currentPage);
  }, [currentPage]);

  // Ayahs on page
  const [pageAyahs, setPageAyahs] = useState<PageAyahExtended[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);
  const [selectedAyah, setSelectedAyah] = useState<PageAyahExtended | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Fetch page data & update last read
  useEffect(() => {
    saveQuranLastReadPage(currentPage);
    saveQuranLastRead({
      surahNumber: pageMeta.primarySurah.number,
      surahNameArabic: pageMeta.primarySurah.nameArabic,
      ayahNumberInSurah: 1,
      timestamp: Date.now()
    });
    recordQuranPageRead(currentPage);

    let isMounted = true;
    setIsLoadingAyahs(true);
    setSelectedAyah(null);

    fetchPageAyahs(currentPage).then(res => {
      if (isMounted) {
        setPageAyahs(res.ayahs);
        setIsLoadingAyahs(false);
      }
    });

    preloadAdjacentPages(currentPage);

    return () => {
      isMounted = false;
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [currentPage, pageMeta]);

  // Page Navigation Handlers
  const goToNextPage = useCallback(() => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
    } else {
      showToast('أنت في الصفحة الأخيرة من المصحف الشريف');
    }
  }, [currentPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      showToast('أنت في الصفحة الأولى من المصحف الشريف');
    }
  }, [currentPage]);

  const handleJumpToPage = (targetPage: number) => {
    const valid = Math.max(1, Math.min(604, targetPage));
    setCurrentPage(valid);
    setIsJumpDialogOpen(false);
  };

  const handleSelectSurah = (surahNumber: number, targetPage?: number) => {
    if (targetPage && targetPage >= 1 && targetPage <= 604) {
      setCurrentPage(targetPage);
    } else {
      const s = surahsList.find(item => item.number === surahNumber);
      if (s?.pageNumber) {
        setCurrentPage(s.pageNumber);
      }
    }
    setIsDrawerOpen(false);
  };

  const handleSelectJuz = (juzNumber: number) => {
    const j = juzData.find(item => item.number === juzNumber || item.juzNumber === juzNumber);
    if (j) {
      setCurrentPage(j.pageNumber || j.startPage || 1);
    }
    setIsDrawerOpen(false);
  };

  // Bookmark Toggle
  const toggleBookmark = () => {
    if (isCurrentPageBookmarked) {
      saveQuranPageBookmark(null);
      setBookmarkedPage(null);
      showToast('تمت إزالة الفاصل');
    } else {
      saveQuranPageBookmark(currentPage);
      setBookmarkedPage(currentPage);
      saveRibbonBookmark({
        id: `page_${currentPage}`,
        type: 'page',
        title: `صفحة ${toArabicNumerals(currentPage)} - سورة ${pageMeta.primarySurah.nameArabic}`,
        pageNumber: currentPage,
        surahNumber: pageMeta.primarySurah.number,
        surahName: pageMeta.primarySurah.nameArabic,
        timestamp: Date.now()
      });
      showToast(`تم تثبيت الفاصل في الصفحة ${toArabicNumerals(currentPage)}`);
    }
  };

  // Long-press timer references for Ayah interactions
  const ayahLongPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAyahLongPressTriggeredRef = useRef<boolean>(false);

  const startAyahLongPress = (ayah: PageAyahExtended) => {
    isAyahLongPressTriggeredRef.current = false;
    if (ayahLongPressTimerRef.current) clearTimeout(ayahLongPressTimerRef.current);

    ayahLongPressTimerRef.current = setTimeout(() => {
      isAyahLongPressTriggeredRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(40); } catch {}
      }
      setSelectedAyah(ayah);
      setActiveModalAyah(ayah);
      setIsTafsirShareModalOpen(true);
    }, 450);
  };

  const cancelAyahLongPress = () => {
    if (ayahLongPressTimerRef.current) {
      clearTimeout(ayahLongPressTimerRef.current);
      ayahLongPressTimerRef.current = null;
    }
  };

  const handleAyahClick = (_ayah: PageAyahExtended) => {
    if (isAyahLongPressTriggeredRef.current) {
      isAyahLongPressTriggeredRef.current = false;
      return;
    }
  };

  const handleToggleAyahBookmark = (ayah: PageAyahExtended) => {
    const isAlready = bookmarksList.some(b => b.surahNumber === ayah.surahNumber && b.ayahNumberInSurah === ayah.numberInSurah);
    if (isAlready) {
      const updated = bookmarksList.filter(b => !(b.surahNumber === ayah.surahNumber && b.ayahNumberInSurah === ayah.numberInSurah));
      setBookmarksList(updated);
      saveQuranBookmarks(updated);
      showToast(`تمت إزالة الفاصل`);
    } else {
      const newBm: QuranBookmark = {
        id: `${ayah.surahNumber}_${ayah.numberInSurah}`,
        surahNumber: ayah.surahNumber,
        ayahNumberInSurah: ayah.numberInSurah,
        surahNameArabic: pageMeta.primarySurah.nameArabic,
        ayahTextArabic: ayah.textArabic,
        ayahText: ayah.textArabic,
        pageNumber: currentPage,
        timestamp: Date.now()
      };
      const updated = [newBm, ...bookmarksList];
      setBookmarksList(updated);
      saveQuranBookmarks(updated);
      saveQuranPageBookmark(currentPage);
      setBookmarkedPage(currentPage);
      showToast(`تم حفظ الفاصل عند الآية ${toArabicNumerals(ayah.numberInSurah)} من سورة ${pageMeta.primarySurah.nameArabic}`);
    }
  };

  // Keyboard navigation & Fullscreen shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isJumpDialogOpen || isDrawerOpen || isTypographyModalOpen) return;
      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'Escape' && isFullscreen) {
        onToggleFullscreen?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, isJumpDialogOpen, isDrawerOpen, isTypographyModalOpen, isFullscreen, onToggleFullscreen]);

  // Touch Gesture Handling:
  // 1. Pinch-to-zoom / Pinch-to-exit with TWO FINGERS (باستخدام أصبعين للداخل أو الخارج)
  // 2. Double-tap to toggle fullscreen
  // 3. Swipe left/right for page turn
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const initialPinchDistRef = useRef<number | null>(null);
  const pinchTriggeredRef = useRef<boolean>(false);
  const lastTapTimeRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture initiated
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialPinchDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchTriggeredRef.current = false;
      return;
    }

    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null && !pinchTriggeredRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const delta = currentDist - initialPinchDistRef.current;

      // Pinch Out (expanding fingers > 35px) -> Enter Fullscreen
      if (!isFullscreen && delta > 35) {
        pinchTriggeredRef.current = true;
        initialPinchDistRef.current = null;
        if (typeof navigator !== 'undefined' && navigator.vibrate) try { navigator.vibrate(25); } catch {}
        onToggleFullscreen?.();
        showToast('وضع القراءة بملء الشاشة');
      }
      // Pinch In (pinching fingers together < -35px) -> Exit Fullscreen
      else if (isFullscreen && delta < -35) {
        pinchTriggeredRef.current = true;
        initialPinchDistRef.current = null;
        if (typeof navigator !== 'undefined' && navigator.vibrate) try { navigator.vibrate(25); } catch {}
        onToggleFullscreen?.();
        showToast('الخروج من ملء الشاشة');
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pinchTriggeredRef.current) {
      pinchTriggeredRef.current = false;
      initialPinchDistRef.current = null;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    // Horizontal swipe check
    if (touchStartXRef.current !== null && touchStartYRef.current !== null && e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
      const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

      // Clean swipe threshold
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
        // A swipe occurred -> immediately reset lastTapTime to prevent triggering double-tap
        lastTapTimeRef.current = 0;
        touchStartXRef.current = null;
        touchStartYRef.current = null;

        if (diffX < 0) {
          // Swiped Right-to-Left -> go to PREVIOUS page
          goToPrevPage();
        } else {
          // Swiped Left-to-Right -> go to NEXT page
          goToNextPage();
        }
        return;
      }
    }

    // Single touch ended with minimal movement (tap)
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const getFontFamilyClass = () => {
    const family = settings.quranFontFamily || 'uthmani';
    if (family === 'amiri') return 'font-quran';
    if (family === 'scheherazade') return 'font-naskh';
    return 'font-uthmani';
  };

  const fontSizePx = settings.quranFontSizeNumeric || 24;
  const lineHeightVal = settings.quranLineHeightNumeric || 2.4;

  const pageSections: PageSection[] = useMemo(() => {
    if (!pageAyahs || pageAyahs.length === 0) return [];

    const sections: PageSection[] = [];
    let currentSection: PageSection | null = null;

    pageAyahs.forEach(ayah => {
      const isStartOfSurah = ayah.numberInSurah === 1;

      if (!currentSection || currentSection.surahNumber !== ayah.surahNumber || isStartOfSurah) {
        const surahInfo = surahsList.find(s => s.number === ayah.surahNumber) || pageMeta.primarySurah;
        currentSection = {
          surahNumber: ayah.surahNumber,
          surahInfo,
          isSurahStart: isStartOfSurah,
          ayahs: [ayah]
        };
        sections.push(currentSection);
      } else {
        currentSection.ayahs.push(ayah);
      }
    });

    return sections;
  }, [pageAyahs, pageMeta]);

  return (
    <div className={`flex-1 min-h-0 w-full flex flex-col relative select-none font-sans screen-fade-in ${isFullscreen ? 'h-full p-0 m-0' : ''}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-800/95 text-emerald-300 dark:text-emerald-200 px-4 py-2 rounded-2xl shadow-xl border border-emerald-400/30 text-xs font-bold font-sans animate-scaleUp flex items-center gap-2 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar (Hidden in Fullscreen Mode!) */}
      {!isFullscreen && (
        <div className="w-full flex items-center justify-between px-2 sm:px-4 landscape:px-3 py-1.5 sm:py-2 landscape:py-1 bg-white/80 dark:bg-[#0F141C]/90 backdrop-blur-md rounded-2xl border border-coolgreen-600/15 dark:border-white/10 shadow-xs mb-1.5 sm:mb-2 landscape:mb-1 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coolgreen-50 dark:bg-[#182030] hover:bg-coolgreen-100 dark:hover:bg-[#202B40] text-coolgreen-900 dark:text-slate-100 border border-coolgreen-600/20 dark:border-white/10 text-xs font-bold transition duration-150 cursor-pointer"
              title="فهرس السور والأجزاء"
            >
              <BookOpen className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
              <span className="font-display font-bold text-[12px] sm:text-xs">
                فهرس السور
              </span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 rounded-xl bg-gray-50 dark:bg-[#182030] hover:bg-coolgreen-50 dark:hover:bg-[#202B40] text-coolgreen-800 dark:text-emerald-400 border border-gray-200 dark:border-white/10 transition cursor-pointer"
              title="بحث سريع في السور"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setIsTypographyModalOpen(true)}
              className="p-2 rounded-xl bg-gray-50 dark:bg-[#182030] hover:bg-coolgreen-50 dark:hover:bg-[#202B40] text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-white/10 transition cursor-pointer"
              title="تغيير حجم الخط وتباعد الأسطر"
            >
              <SlidersHorizontal className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
            </button>

            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isCurrentPageBookmarked
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-gray-50 dark:bg-[#182030] text-gray-700 dark:text-slate-200 border-gray-200 dark:border-white/10 hover:border-emerald-500'
              }`}
              title={isCurrentPageBookmarked ? 'إزالة الفاصل' : 'حفظ فاصل في هذه الصفحة'}
            >
              <Bookmark className={`w-4 h-4 ${isCurrentPageBookmarked ? 'fill-white' : ''}`} />
            </button>

            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="p-2 rounded-xl bg-gray-50 dark:bg-[#182030] hover:bg-gray-100 dark:hover:bg-[#202B40] text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-white/10 transition cursor-pointer"
                title="وضع القراءة بملء الشاشة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Mushaf Page Frame (Pure page in Fullscreen mode!) */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 min-h-0 relative flex flex-col bg-[#FAF8F2] dark:bg-[#0E131C] overflow-hidden mushaf-page-frame ${
          isFullscreen 
            ? 'rounded-none border-none shadow-none h-full w-full' 
            : 'rounded-3xl border-2 border-coolgreen-600/20 dark:border-white/10 shadow-xl'
        }`}
      >
        {/* Subtle Ornamental Corner Details */}
        <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-coolgreen-600/40 dark:border-emerald-400/30 rounded-tr-lg pointer-events-none" />
        <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-coolgreen-600/40 dark:border-emerald-400/30 rounded-tl-lg pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-coolgreen-600/40 dark:border-emerald-400/30 rounded-br-lg pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-coolgreen-600/40 dark:border-emerald-400/30 rounded-bl-lg pointer-events-none" />

        {/* Ribbon Bookmark Indicator Tag (Hanging Silk Ribbon) */}
        {(isCurrentPageBookmarked || bookmarksList.some(b => b.pageNumber === currentPage)) && (
          <div 
            onClick={toggleBookmark}
            className="absolute top-0 right-7 z-30 w-7 sm:w-8 h-12 sm:h-14 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 text-white flex flex-col items-center justify-start shadow-lg shadow-black/25 cursor-pointer group transition-transform hover:translate-y-1 animate-fadeIn"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)'
            }}
            title="فاصل القراءة مثبت في هذه الصفحة (اضغط للإزالة أو التعديل)"
          >
            <Bookmark className="w-4 h-4 fill-amber-300 text-amber-200 mt-1.5 drop-shadow-xs" />
          </div>
        )}

        {/* Top Quranic Page Header (Inside Mushaf Frame - Surah, Bookmark & Juz) */}
        <div className="px-3 sm:px-6 py-1.5 sm:py-2 border-b border-coolgreen-600/15 dark:border-white/10 flex items-center justify-between text-xs font-bold select-none bg-emerald-500/5 dark:bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-coolgreen-950 dark:text-emerald-300 text-xs sm:text-sm font-extrabold flex items-center gap-1">
              سُورَةُ {pageMeta.primarySurah.nameArabic}
            </span>
            <button
              onClick={toggleBookmark}
              className={`p-1 px-2 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer border ${
                isCurrentPageBookmarked
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40 shadow-2xs'
                  : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-slate-300 border-transparent hover:border-coolgreen-600/20'
              }`}
              title={isCurrentPageBookmarked ? 'تم تثبيت الفاصل في هذه الصفحة (اضغط للإزالة)' : 'حفظ فاصل في هذه الصفحة'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isCurrentPageBookmarked ? 'fill-amber-500 text-amber-600 dark:text-amber-400' : 'text-gray-400'}`} />
              <span>{isCurrentPageBookmarked ? 'فاصل محفوظ' : 'تثبيت فاصل'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedPage && bookmarkedPage !== currentPage && (
              <button
                onClick={() => setCurrentPage(bookmarkedPage)}
                className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 px-2 py-0.5 rounded-lg border border-emerald-500/30 transition cursor-pointer flex items-center gap-1"
                title={`الانتقال إلى موضع الفاصل المحفوظ (صفحة ${toArabicNumerals(bookmarkedPage)})`}
              >
                <Bookmark className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                <span>الفاصل: ص {toArabicNumerals(bookmarkedPage)}</span>
              </button>
            )}
            <span className="font-sans text-coolgreen-800 dark:text-slate-300 text-[11px] sm:text-xs font-medium">
              {pageMeta.juzName || pageMeta.juz?.juzNameArabic || `الجزء ${pageMeta.juzNumber || 1}`}
            </span>
          </div>
        </div>

        {/* Page Content Container */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 flex flex-col justify-start text-justify font-quran select-text">
          {isLoadingAyahs ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-coolgreen-800 dark:text-emerald-400">
              <div className="w-9 h-9 border-3 border-coolgreen-500/30 dark:border-white/10 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs font-sans font-bold">جاري تحميل صفحة المصحف الشريف...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {pageSections.map((section, secIdx) => (
                <div key={`section-${section.surahNumber}-${secIdx}`} className="space-y-3">
                  {section.isSurahStart && (
                    <div className="my-4 text-center select-none">
                      <div className="relative py-2.5 px-6 rounded-2xl surah-header-plaque shadow-xs flex items-center justify-center gap-3">
                        <span className="text-coolgreen-900 dark:text-emerald-300 text-sm font-display font-extrabold">
                          سُورَةُ {section.surahInfo.nameArabic}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 font-sans font-medium">
                          ({section.surahInfo.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {toArabicNumerals(section.surahInfo.numberOfAyahs)} آية)
                        </span>
                      </div>

                      {section.surahInfo.number !== 9 && section.surahInfo.number !== 1 && (
                        <div className="mt-3 text-center text-xl sm:text-2xl font-bold text-gray-900 dark:text-emerald-200 font-quran">
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-gray-950 dark:text-[#FFFDF7] font-semibold tracking-normal text-justify ${getFontFamilyClass()}`}
                    style={{
                      direction: 'rtl',
                      textAlignLast: 'center',
                      fontSize: `${fontSizePx}px`,
                      lineHeight: lineHeightVal
                    }}
                  >
                    {section.ayahs.map((ayah) => {
                      const isSelected = selectedAyah?.number === ayah.number;
                      const isBookmarkedAyah = bookmarksList.some(b => b.surahNumber === ayah.surahNumber && b.ayahNumberInSurah === ayah.numberInSurah);

                      return (
                        <span
                          key={ayah.number}
                          onClick={() => handleAyahClick(ayah)}
                          onMouseDown={() => startAyahLongPress(ayah)}
                          onMouseUp={cancelAyahLongPress}
                          onMouseLeave={cancelAyahLongPress}
                          onTouchStart={() => startAyahLongPress(ayah)}
                          onTouchEnd={cancelAyahLongPress}
                          onTouchMove={cancelAyahLongPress}
                          className={`inline cursor-pointer rounded-lg px-0.5 transition-colors duration-150 relative ayah-interactive ${
                            isBookmarkedAyah
                              ? 'bg-emerald-500/25 dark:bg-emerald-500/25 text-coolgreen-950 dark:text-emerald-100 ring-1 ring-emerald-500/50 font-bold'
                              : isSelected
                              ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-coolgreen-950 dark:text-emerald-100'
                              : 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15'
                          }`}
                          title={`آية ${toArabicNumerals(ayah.numberInSurah)} • اضغط مطولاً للتفسير والمشاركة وحفظ الفاصل`}
                        >
                          {ayah.textArabic}
                          <span className="quran-ayah-badge text-emerald-700 dark:text-emerald-400 font-bold select-none mx-0.5 inline-flex items-center gap-0.5">
                            {isBookmarkedAyah && (
                              <Bookmark className="w-3 h-3 fill-amber-500 text-amber-600 dark:text-amber-400 inline" />
                            )}
                            <span>۝{toArabicNumerals(ayah.numberInSurah)}</span>
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traditional Page Number at bottom of Mushaf page */}
        <div className="py-1 text-center select-none flex-shrink-0 text-xs font-bold text-coolgreen-800 dark:text-emerald-300 font-display">
          — {toArabicNumerals(currentPage)} —
        </div>

        {/* Minimal Unobtrusive Fullscreen Exit Button (Floating Bottom-Left) */}
        {isFullscreen && onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="absolute bottom-3 left-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all cursor-pointer z-30 shadow-md"
            title="خروج من ملء الشاشة (أو ضم بإصبعين للداخل)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        )}

        {/* Fast Page Slider Drawer (Swipeable slider between pages 1 and 604) */}
        {!isFullscreen && showPageSlider && (
          <div className="p-3 bg-white/95 dark:bg-[#141C2B]/95 backdrop-blur-md border-t border-coolgreen-600/20 dark:border-white/10 space-y-2 modal-pop-smooth flex-shrink-0">
            <div className="flex items-center justify-between text-xs font-bold font-sans">
              <span className="text-coolgreen-900 dark:text-emerald-300">
                السحب السريع بين الصفحات (1 - 604):
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                صفحة {toArabicNumerals(sliderPageValue)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold font-sans">
                {toArabicNumerals(1)}
              </span>
              <input
                type="range"
                min={1}
                max={604}
                value={sliderPageValue}
                onChange={e => {
                  const val = Number(e.target.value);
                  setSliderPageValue(val);
                  setCurrentPage(val);
                }}
                className="flex-1 h-3 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coolgreen-700 dark:accent-emerald-400"
              />
              <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold font-sans">
                {toArabicNumerals(604)}
              </span>
            </div>
          </div>
        )}

        {/* 3. Page Footer Bar (Page Number & Navigation Controls - Hidden in Fullscreen!) */}
        {!isFullscreen && (
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 landscape:py-1 bg-gray-50/90 dark:bg-[#0B0F17]/95 border-t border-coolgreen-600/15 dark:border-white/10 flex items-center justify-between text-xs select-none flex-shrink-0">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#141A26] border border-gray-200 dark:border-white/10 hover:bg-coolgreen-50 dark:hover:bg-[#1C2538] text-gray-800 dark:text-slate-200 font-bold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xs"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
              <span className="hidden sm:inline font-sans text-[11px]">السابقة</span>
            </button>

            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  setJumpPageInput(currentPage.toString());
                  setIsJumpDialogOpen(true);
                }}
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-xl hover:bg-coolgreen-50 dark:hover:bg-[#182030] transition border border-transparent hover:border-coolgreen-600/20 dark:hover:border-white/10"
                title="انقر للانتقال لصفحة محددة"
              >
                <span className="font-display font-extrabold text-sm text-coolgreen-950 dark:text-emerald-300">
                  صفحة {toArabicNumerals(currentPage)}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-sans">
                  من {toArabicNumerals(604)}
                </span>
              </div>

              <button
                onClick={() => setShowPageSlider(!showPageSlider)}
                className={`p-1.5 rounded-xl transition cursor-pointer border ${
                  showPageSlider
                    ? 'bg-coolgreen-800 text-white border-coolgreen-900 dark:bg-emerald-600 dark:text-white'
                    : 'bg-white dark:bg-[#182030] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:bg-gray-100'
                }`}
                title="شريط السحب السريع بين الصفحات"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= 604}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#141A26] border border-gray-200 dark:border-white/10 hover:bg-coolgreen-50 dark:hover:bg-[#1C2538] text-gray-800 dark:text-slate-200 font-bold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-2xs"
              title="الصفحة التالية"
            >
              <span className="hidden sm:inline font-sans text-[11px]">التالية</span>
              <ChevronLeft className="w-4 h-4 text-coolgreen-700 dark:text-emerald-400" />
            </button>
          </div>
        )}
      </div>

      {/* Ayah Tafsir & Multi-Ayah Share Modal */}
      <AyahTafsirShareModal
        isOpen={isTafsirShareModalOpen}
        onClose={() => setIsTafsirShareModalOpen(false)}
        initialAyah={activeModalAyah}
        allPageAyahs={pageAyahs}
        surahNameArabic={pageMeta.primarySurah.nameArabic}
        surahNumber={pageMeta.primarySurah.number}
        onToggleBookmark={handleToggleAyahBookmark}
        isBookmarked={Boolean(activeModalAyah && bookmarksList.some(b => b.surahNumber === activeModalAyah.surahNumber && b.ayahNumberInSurah === activeModalAyah.numberInSurah))}
      />

      {/* Quick Jump Page Modal */}
      {isJumpDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs backdrop-fade-smooth select-none">
          <div 
            className="w-full max-w-xs bg-white dark:bg-[#121824] rounded-3xl border border-coolgreen-600/30 dark:border-white/10 shadow-2xl p-5 space-y-4 modal-pop-smooth"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h4 className="font-extrabold font-display text-sm text-gray-900 dark:text-slate-100">
                انتقال سريع لرقم الصفحة
              </h4>
              <button onClick={() => setIsJumpDialogOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600 dark:text-slate-400 font-sans block">
                أدخل رقم الصفحة (1 - 604):
              </label>
              <input
                type="number"
                min={1}
                max={604}
                value={jumpPageInput}
                onChange={e => setJumpPageInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleJumpToPage(Number(jumpPageInput));
                }}
                className="w-full text-center py-2.5 px-3 rounded-2xl bg-gray-50 dark:bg-[#1C2538] border border-coolgreen-600/30 dark:border-white/10 text-xl font-bold font-display text-coolgreen-900 dark:text-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleJumpToPage(Number(jumpPageInput))}
                className="flex-1 py-2.5 rounded-xl bg-coolgreen-700 hover:bg-coolgreen-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                انتقال
              </button>
              <button
                onClick={() => setIsJumpDialogOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-[#1C2538] text-gray-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Surah Index & Juz Drawer Modal */}
      <SurahDrawerModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPage={currentPage}
        onSelectSurah={handleSelectSurah}
        onSelectJuz={handleSelectJuz}
      />

      {/* Typography Configuration Modal */}
      <QuranTypographyModal
        isOpen={isTypographyModalOpen}
        onClose={() => setIsTypographyModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};
