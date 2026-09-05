/**
 * Islamic Audio & Recitation Service
 * Handles authentic Athan audio, Quran Ayah recitation with multiple reciters,
 * Adhkar & Salawat audio, synthesized Takbeerat, and tactile haptics.
 */

import { surahsList } from '../data/quranData';
import { getStoredSettings } from './settingsStorage';

export interface ReciterOption {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  identifier: string;
}

export const RECITERS_LIST: ReciterOption[] = [
  { id: 'alafasy', nameArabic: 'مشاري راشد العفاسي', nameEnglish: 'Mishary Rashid Alafasy', identifier: 'ar.alafasy' },
  { id: 'abdulbasit', nameArabic: 'عبد الباسط عبد الصمد (مرتل)', nameEnglish: 'Abdulbasit Abdulsamad', identifier: 'ar.abdulbasitmurattal' },
  { id: 'minshawi', nameArabic: 'محمد صديق المنشاوي', nameEnglish: 'Mohamed Siddiq Al-Minshawi', identifier: 'ar.minshawi' },
  { id: 'husary', nameArabic: 'محمود خليل الحصري', nameEnglish: 'Mahmoud Khalil Al-Husary', identifier: 'ar.husary' },
  { id: 'ajmy', nameArabic: 'أحمد بن علي العجمي', nameEnglish: 'Ahmed Al-Ajmy', identifier: 'ar.ahmedajamy' }
];

export interface AdhanAudioOption {
  id: string;
  nameArabic: string;
  location: string;
  audioUrl: string;
}

export const ADHAN_OPTIONS: AdhanAudioOption[] = [
  {
    id: 'makkah',
    nameArabic: 'أذان المسجد الحرام (مكة المكرمة)',
    location: 'مكة المكرمة',
    audioUrl: 'https://www.islamcan.com/audio/adhan/makkah.mp3'
  },
  {
    id: 'madinah',
    nameArabic: 'أذان المسجد النبوي الشريف',
    location: 'المدينة المنورة',
    audioUrl: 'https://www.islamcan.com/audio/adhan/madina.mp3'
  },
  {
    id: 'alaqsa',
    nameArabic: 'أذان المسجد الأقصى المبارك',
    location: 'القدس الشريف',
    audioUrl: 'https://www.islamcan.com/audio/adhan/al-aqsa.mp3'
  },
  {
    id: 'abdulbasit',
    nameArabic: 'أذان بصوت الشيخ عبد الباسط عبد الصمد',
    location: 'مصر',
    audioUrl: 'https://www.islamcan.com/audio/adhan/abdul-basit.mp3'
  }
];

class IslamicAudioService {
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isReciting: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Calculate global ayah index (1-6236) from surahNumber and ayahNumberInSurah
   */
  private getGlobalAyahNumber(surahNumber: number, ayahNumberInSurah: number): number {
    let globalIndex = 0;
    for (let i = 0; i < surahNumber - 1 && i < surahsList.length; i++) {
      globalIndex += (surahsList[i].numberOfAyahs || surahsList[i].ayahCount || 0);
    }
    return globalIndex + ayahNumberInSurah;
  }

  /**
   * Play specific Quran Ayah by Surah & Ayah number
   */
  playAyah(
    surahNumber: number,
    ayahNumberInSurah: number,
    reciterId: string = 'alafasy',
    onEnded?: () => void
  ): Promise<void> {
    this.stopAudio();
    this.isReciting = true;

    const globalAyah = this.getGlobalAyahNumber(surahNumber, ayahNumberInSurah);
    const reciter = RECITERS_LIST.find(r => r.id === reciterId) || RECITERS_LIST[0];
    const url = `https://cdn.islamic.network/quran/audio/128/${reciter.identifier}/${globalAyah}.mp3`;

    return new Promise((resolve) => {
      try {
        const audio = new Audio(url);
        this.currentAudio = audio;
        audio.volume = 1.0;

        audio.onended = () => {
          this.isReciting = false;
          if (this.currentAudio === audio) this.currentAudio = null;
          if (onEnded) onEnded();
          resolve();
        };

        audio.onerror = () => {
          this.isReciting = false;
          this.playSynthesizedTakbir();
          if (onEnded) onEnded();
          resolve();
        };

        audio.play().catch(() => {
          this.isReciting = false;
          this.playSynthesizedTakbir();
          if (onEnded) onEnded();
          resolve();
        });
      } catch (err) {
        this.isReciting = false;
        console.warn('Recitation audio error:', err);
        resolve();
      }
    });
  }

  /**
   * Play specific Quran Ayah by global Ayah index
   */
  playAyahRecitation(globalAyahNumber: number, onEnded?: () => void): HTMLAudioElement {
    this.stopAudio();
    this.isReciting = true;

    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    const audio = new Audio(url);
    this.currentAudio = audio;

    audio.onended = () => {
      this.isReciting = false;
      if (this.currentAudio === audio) this.currentAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      this.isReciting = false;
      this.playSynthesizedTakbir();
      if (onEnded) onEnded();
    };

    audio.play().catch(e => {
      this.isReciting = false;
      console.warn('Audio playback not allowed or offline', e);
      if (onEnded) onEnded();
    });

    return audio;
  }

  /**
   * Stop Quran recitation specifically
   */
  stopRecitation(): void {
    this.isReciting = false;
    this.stopAudio();
  }

  /**
   * Play Adhan audio
   */
  playAthan(adhanStyleId: string = 'makkah', onEnded?: () => void): HTMLAudioElement {
    this.stopAudio();

    const selectedAdhan = ADHAN_OPTIONS.find(a => a.id === adhanStyleId) || ADHAN_OPTIONS[0];
    const audio = new Audio(selectedAdhan.audioUrl);
    this.currentAudio = audio;
    audio.volume = 1.0;

    audio.onended = () => {
      if (this.currentAudio === audio) this.currentAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      // If network fails, play synthesized Takbir tones
      this.playSynthesizedTakbir();
      if (onEnded) onEnded();
    };

    audio.play().catch(() => {
      this.playSynthesizedTakbir();
      if (onEnded) onEnded();
    });

    return audio;
  }

  /**
   * Play tactile click / bead tone for Tasbih & Dhikr counter
   */
  playBeadClick(): void {
    try {
      if (typeof window !== 'undefined') {
        const settings = getStoredSettings();
        if (settings && settings.soundEffects === false) return;
      }

      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Play tactile light tap
   */
  playTapSound(): void {
    this.playBeadClick();
  }

  playClick(): void {
    this.playBeadClick();
  }

  playTaqbeel(): void {
    this.playDhikrCompletion();
  }

  /**
   * Play completion chime upon finishing dhikr or tasbih target,
   * strictly respecting the user's sound mute settings.
   */
  playDhikrCompletion(force: boolean = false): void {
    if (!force && typeof window !== 'undefined') {
      const settings = getStoredSettings();
      // If user muted completion sound or all sound effects, do not play
      if (settings && (settings.soundEffects === false || settings.dhikrCompletionSound === false)) {
        return;
      }
    }
    this.playCompletionChime();
  }

  /**
   * Play completion chime
   */
  playCompletionChime(): void {
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {
      // Audio context error
    }
  }

  /**
   * Synthesized Takbir tones as guaranteed offline fallback
   */
  playSynthesizedTakbir(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      // Allāhu Akbar sequence melody
      const melody = [
        { f: 392.00, d: 0.5 }, // G4 (Al-)
        { f: 440.00, d: 0.7 }, // A4 (-la-)
        { f: 349.23, d: 1.0 }, // F4 (-hu)
        { f: 440.00, d: 0.4 }, // A4 (Ak-)
        { f: 392.00, d: 1.2 }, // G4 (-bar)
      ];

      let t = now;
      melody.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + note.d + 0.1);

        t += note.d + 0.1;
      });
    } catch {}
  }

  /**
   * Read Dhikr or text aloud via Speech Synthesis in natural Arabic
   */
  speakDhikrArabic(text: string, onEnded?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\[\]\(\)\{\}]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.88; // Reverent, clear, calm speed
      utterance.pitch = 1.0;

      // Look for Arabic voice
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v =>
        v.lang.startsWith('ar') ||
        v.name.toLowerCase().includes('arabic') ||
        v.name.toLowerCase().includes('maged') ||
        v.name.toLowerCase().includes('tariq') ||
        v.name.toLowerCase().includes('laila') ||
        v.name.toLowerCase().includes('saudi')
      );
      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onend = () => {
        if (onEnded) onEnded();
      };
      utterance.onerror = () => {
        if (onEnded) onEnded();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
      if (onEnded) onEnded();
    }
  }

  /**
   * Stop any playing audio or speech
   */
  stopAudio(): void {
    this.isReciting = false;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  /**
   * Trigger haptic vibration if supported
   */
  vibrate(ms: number = 20): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {}
    }
  }
}

export const islamicAudio = new IslamicAudioService();
