import { cleanTextForSpeech } from "./speechUtils";

// Blacklist of known female voice names, codes, and prefixes across Windows, macOS, iOS, Android, Linux
const FEMALE_VOICE_REGEX =
  /(female|woman|girl|zira|samantha|victoria|karen|hazel|susan|catherine|linda|heather|eva|fiona|tessa|veena|moira|stephanie|jenny|aria|ana|natasha|siri\s*female|en-us-x-sfg|en-us-x-tpf|en-gb-x-gba|en-in-x-cxe|en-au-x-aua|-female)/i;

// Preferred high-quality male voice names across desktop & mobile
const MALE_PREFERRED_NAMES = [
  "uk english male",
  "us english male",
  "google uk english male",
  "google us english male",
  "english (united kingdom) male",
  "english (united states) male",
  "daniel", // macOS, iOS, Windows, Chrome
  "oliver", // macOS, Windows
  "george", // Windows, UK
  "david", // Windows Microsoft David
  "mark", // Windows Microsoft Mark
  "arthur", // iOS, macOS
  "alex", // macOS, iOS
  "guy", // Microsoft Guy
  "ryan", // Microsoft Ryan
  "christopher", // Microsoft Christopher
  "eric", // Microsoft Eric
  "aaron", // iOS
  "fred", // macOS, iOS
  "rishi", // Indian English Male (macOS, iOS)
  // Android Google Speech Services Male Voice Codes:
  "en-gb-x-rjs", // Android UK Male
  "en-gb-x-fis", // Android UK Male
  "en-us-x-iom", // Android US Male
  "en-us-x-iol", // Android US Male
  "en-au-x-aub", // Android AU Male
  "en-in-x-cxx", // Android IN Male
  "male",
];

export interface MaleVoiceInfo {
  voice: SpeechSynthesisVoice | null;
  isExplicitMale: boolean;
  name: string;
  lang: string;
}

/**
 * Calculates a suitability score for a SpeechSynthesisVoice as a natural Male voice.
 * Positive = Male candidate (higher is better)
 * Negative = Female or unsuitable voice
 */
export function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const uri = (voice.voiceURI || "").toLowerCase();
  const combined = `${name} ${uri}`;

  // Strict disqualification of any female voice
  if (FEMALE_VOICE_REGEX.test(combined)) {
    return -1000;
  }

  let score = 0;

  // Explicit male indicator in name or voiceURI
  if (combined.includes("male") && !combined.includes("female")) {
    score += 200;
  }

  // Check against preferred male voice names
  for (let i = 0; i < MALE_PREFERRED_NAMES.length; i++) {
    const pref = MALE_PREFERRED_NAMES[i];
    if (combined.includes(pref)) {
      score += 150 - i * 4;
      break;
    }
  }

  // Language affinity: UK / US English gives the most natural, dignified cadence
  if (voice.lang.startsWith("en-GB") || voice.lang.startsWith("en_GB")) {
    score += 40;
  } else if (voice.lang.startsWith("en-US") || voice.lang.startsWith("en_US")) {
    score += 35;
  } else if (voice.lang.startsWith("en")) {
    score += 20;
  } else {
    score -= 80; // Non-English
  }

  // Native local voices often have less latency and cleaner frequency reproduction
  if (voice.localService) {
    score += 10;
  }

  return score;
}

let cachedMaleVoice: SpeechSynthesisVoice | null = null;
let cachedVoiceListLength = 0;

/**
 * Initializes and retrieves the best available male voice across Phone (Android/iOS) and Laptop (Windows/Mac).
 */
export function getUnifiedMaleVoice(): MaleVoiceInfo {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return {
      voice: null,
      isExplicitMale: false,
      name: "Speech Synthesis Unavailable",
      lang: "en-US",
    };
  }

  const voices = window.speechSynthesis.getVoices();

  // Return cached voice if voices haven't changed
  if (
    cachedMaleVoice &&
    voices.length === cachedVoiceListLength &&
    cachedVoiceListLength > 0
  ) {
    return {
      voice: cachedMaleVoice,
      isExplicitMale: true,
      name: cachedMaleVoice.name,
      lang: cachedMaleVoice.lang,
    };
  }

  if (!voices || voices.length === 0) {
    return {
      voice: null,
      isExplicitMale: false,
      name: "Default Male Synthesizer",
      lang: "en-US",
    };
  }

  cachedVoiceListLength = voices.length;

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -999;

  for (const voice of voices) {
    const score = scoreVoice(voice);
    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  // Fallback: If no positively scored voice found, pick any English voice that lacks female keywords
  if (!bestVoice || bestScore <= 0) {
    const nonFemaleEn = voices.find(
      (v) => v.lang.startsWith("en") && !FEMALE_VOICE_REGEX.test(v.name.toLowerCase())
    );
    bestVoice = nonFemaleEn || voices[0] || null;
  }

  cachedMaleVoice = bestVoice;

  return {
    voice: bestVoice,
    isExplicitMale: bestScore >= 40,
    name: bestVoice ? bestVoice.name : "Quantum Male Core",
    lang: bestVoice ? bestVoice.lang : "en-US",
  };
}

// Attach listener to refresh voice cache whenever browser loads new voices
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedMaleVoice = null;
    getUnifiedMaleVoice();
  };
}

export interface QuantumSpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  cleanFormatting?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
}

/**
 * Universal Male Speech Function
 * Guarantees a consistent, deep, dignified MALE voice on both Laptop and Phone.
 */
export function speakQuantumMaleVoice(
  text: string,
  options: QuantumSpeakOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    const {
      rate = 1.04,
      pitch,
      volume = 1.0,
      cleanFormatting = true,
      onStart,
      onEnd,
      onError,
    } = options;

    // Clean text of markdown/LaTeX if requested
    const spokenText = cleanFormatting ? cleanTextForSpeech(text) : text.trim();

    if (!spokenText) {
      resolve();
      return;
    }

    // Cancel prior speech and resume if paused (fixes iOS / mobile Safari pause freeze)
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }

    // Small timeout (25ms) prevents mobile Android Chrome audio drop bug when cancel() and speak() collide
    setTimeout(() => {
      try {
        const maleInfo = getUnifiedMaleVoice();
        const utterance = new SpeechSynthesisUtterance(spokenText);

        if (maleInfo.voice) {
          utterance.voice = maleInfo.voice;
          utterance.lang = maleInfo.voice.lang;
        }

        utterance.rate = rate;

        // Acoustic Masculinization:
        // Set pitch to 0.85 by default.
        // If device has a generic/unconfirmed voice (common on mobile phones),
        // pitch is lowered to 0.80 to guarantee an authoritative, resonant male baritone tone.
        if (pitch !== undefined) {
          utterance.pitch = pitch;
        } else {
          utterance.pitch = maleInfo.isExplicitMale ? 0.86 : 0.80;
        }

        utterance.volume = volume;

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          if (onEnd) onEnd();
          resolve();
        };

        utterance.onerror = (err) => {
          if (onError) onError(err);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Male voice synthesis error:", err);
        if (onError) onError(err);
        resolve();
      }
    }, 25);
  });
}

/**
 * Stops any ongoing male speech playback immediately
 */
export function stopQuantumMaleVoice() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
