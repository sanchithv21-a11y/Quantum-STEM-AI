import { QuantumThemeMode } from "../types";

export interface QuantumTheme {
  id: QuantumThemeMode;
  label: string;
  colorName: string;
  icon: string;
  primary: string;
  primaryDark: string;
  glowColor: string;
  screenBg: string;
  bgTone: string;
  panelBg: string;
  cardBg: string;
  subtleBorder: string;
  accentBorder: string;
  activeBadgeBg: string;
  textGlow: string;
  tagline: string;
  timingCadence: string;
  timingBadge: string;
  modePurpose: string;
  particleColors: string[];
}

export const QUANTUM_THEMES: Record<QuantumThemeMode, QuantumTheme> = {
  normal: {
    id: "normal",
    label: "Normal",
    colorName: "Cyan",
    icon: "💎",
    primary: "#00F2FF",
    primaryDark: "#00b8c4",
    glowColor: "rgba(0, 242, 255, 0.4)",
    screenBg: "#020508",
    bgTone: "#020508",
    panelBg: "#0A0F16",
    cardBg: "#060B12",
    subtleBorder: "#1E293B",
    accentBorder: "rgba(0, 242, 255, 0.4)",
    activeBadgeBg: "rgba(0, 242, 255, 0.15)",
    textGlow: "0 0 12px rgba(0, 242, 255, 0.6)",
    tagline: "CORE CYAN // QUANTUM OS",
    timingCadence: "20 to 30 seconds",
    timingBadge: "20–30s",
    modePurpose: "Quick and basic reply within 20 to 30 seconds",
    particleColors: ["#00F2FF", "#38bdf8", "#FF007A", "#00F2FF", "#E2E8F0"],
  },
  build: {
    id: "build",
    label: "Build",
    colorName: "Green",
    icon: "🛠️",
    primary: "#10B981",
    primaryDark: "#059669",
    glowColor: "rgba(16, 185, 129, 0.45)",
    screenBg: "#020d06",
    bgTone: "#020d06",
    panelBg: "#061a0d",
    cardBg: "#041309",
    subtleBorder: "#0e381c",
    accentBorder: "rgba(16, 185, 129, 0.45)",
    activeBadgeBg: "rgba(16, 185, 129, 0.2)",
    textGlow: "0 0 12px rgba(16, 185, 129, 0.65)",
    tagline: "BUILD ARCHITECTURE // GREEN MATRIX",
    timingCadence: "10 to 20 minutes",
    timingBadge: "10–20 min",
    modePurpose: "To build real life projects or app or website etc within 10 to 20 minutes",
    particleColors: ["#10B981", "#34D399", "#6EE7B7", "#059669", "#A7F3D0"],
  },
  fast: {
    id: "fast",
    label: "Fast",
    colorName: "Red",
    icon: "⚡",
    primary: "#EF4444",
    primaryDark: "#DC2626",
    glowColor: "rgba(239, 68, 68, 0.45)",
    screenBg: "#0d0204",
    bgTone: "#0d0204",
    panelBg: "#1c0609",
    cardBg: "#130306",
    subtleBorder: "#3d0d14",
    accentBorder: "rgba(239, 68, 68, 0.45)",
    activeBadgeBg: "rgba(239, 68, 68, 0.2)",
    textGlow: "0 0 12px rgba(239, 68, 68, 0.65)",
    tagline: "OVERCLOCKED SPEED // RED ALERT",
    timingCadence: "10 to 15 seconds",
    timingBadge: "10–15s",
    modePurpose: "Fastest answers and explanation within 10 to 15 seconds",
    particleColors: ["#EF4444", "#F87171", "#FCA5A5", "#DC2626", "#FFA69E"],
  },
  ultra_instinct: {
    id: "ultra_instinct",
    label: "Ultra Instinct",
    colorName: "Purple",
    icon: "🔮",
    primary: "#A855F7",
    primaryDark: "#9333EA",
    glowColor: "rgba(168, 85, 247, 0.45)",
    screenBg: "#090212",
    bgTone: "#090212",
    panelBg: "#140520",
    cardBg: "#0e0317",
    subtleBorder: "#33104e",
    accentBorder: "rgba(168, 85, 247, 0.45)",
    activeBadgeBg: "rgba(168, 85, 247, 0.2)",
    textGlow: "0 0 12px rgba(168, 85, 247, 0.65)",
    tagline: "AUTONOMOUS REASONING // ULTRA INSTINCT PURPLE",
    timingCadence: "within 5 minutes",
    timingBadge: "5 min",
    modePurpose: "Answers in a detailed and easy way to understand within 5 minutes",
    particleColors: ["#A855F7", "#C084FC", "#E9D5FF", "#9333EA", "#F472B6"],
  },
  relax: {
    id: "relax",
    label: "Relax",
    colorName: "Pink",
    icon: "🌸",
    primary: "#EC4899",
    primaryDark: "#DB2777",
    glowColor: "rgba(236, 72, 153, 0.45)",
    screenBg: "#0f020a",
    bgTone: "#0f020a",
    panelBg: "#1c0514",
    cardBg: "#13030e",
    subtleBorder: "#3e0e2d",
    accentBorder: "rgba(236, 72, 153, 0.45)",
    activeBadgeBg: "rgba(236, 72, 153, 0.2)",
    textGlow: "0 0 12px rgba(236, 72, 153, 0.65)",
    tagline: "HARMONIC EQUILIBRIUM // RELAX PINK",
    timingCadence: "1 to 2 minutes",
    timingBadge: "1–2 min",
    modePurpose: "Simple and detailed answer within 1 to 2 minutes",
    particleColors: ["#EC4899", "#F472B6", "#FBCFE8", "#DB2777", "#FDA4AF"],
  },
};
