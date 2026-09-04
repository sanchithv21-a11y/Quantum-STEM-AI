import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Layers,
  Cpu,
  Calculator,
  Mic,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  Code,
  BookOpen,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { QuantumThemeMode } from "../types";
import { QuantumTheme } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";

export interface TourStep {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
  spokenText: string;
  targetView?: "dashboard" | "basic" | "stem" | "calculator" | "desktop" | "models" | "codingz" | "history";
  targetEdition?: "basic" | "ultra" | "codingz";
  actionLabel?: string;
}

interface AppTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  activeTheme: QuantumTheme;
  themeMode: QuantumThemeMode;
  onSpeakText?: (text: string) => void;
  onStopSpeaking?: () => void;
  isSpeakingAudio?: boolean;
  onNavigateView?: (
    view: "dashboard" | "basic" | "stem" | "calculator" | "desktop" | "models" | "codingz" | "history",
    edition?: "basic" | "ultra" | "codingz"
  ) => void;
}

export const AppTourGuide: React.FC<AppTourGuideProps> = ({
  isOpen,
  onClose,
  userName = "Commander",
  activeTheme,
  onSpeakText,
  onStopSpeaking,
  isSpeakingAudio = false,
  onNavigateView,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
  const hasSpokenInitialRef = useRef(false);

  // Clean user name - strip out generic OAuth provider names such as "Google", "Apple", etc.
  const rawFirst = userName ? userName.trim().split(" ")[0] : "";
  const isGenericOrProvider = !rawFirst || /^(google|apple|github|microsoft|user|guest|commander)$/i.test(rawFirst);
  const welcomeTitle = isGenericOrProvider ? "Welcome to Quantum AI!" : `Welcome to Quantum AI, ${rawFirst}!`;
  const welcomeSpoken = isGenericOrProvider
    ? "Welcome to Quantum AI, sir! All frontier AI engines and supercomputing tools are unlocked and completely free for your account. Let us take a brief guided tour of your workspace, or you can skip at any time."
    : `Welcome to Quantum AI, ${rawFirst}! All frontier AI engines and supercomputing tools are unlocked and completely free for your account. Let us take a brief guided tour of your workspace, or you can skip at any time.`;

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: welcomeTitle,
      badge: "PLATFORM OVERVIEW",
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      description:
        "Your sovereign intelligence environment is fully unlocked and ready. You now have unlimited access to 12+ frontier AI models, specialized STEM solvers, and developer sandboxes with zero subscription fees.",
      highlights: [
        "100% Free Lifetime Access with all model locks and paywalls removed",
        "Multimodal STEM reasoning, LaTeX proofs, and interactive graphs",
        "Local cryptographic session memory and encrypted identity",
      ],
      spokenText: welcomeSpoken,
      targetView: "dashboard",
      targetEdition: "ultra",
      actionLabel: "View Workspace Hub",
    },
    {
      id: "editions",
      title: "Three Powerful Editions in One",
      badge: "EDITION SWITCHER",
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      description:
        "Easily switch between three specialized operating modes using the edition selector in the top-left corner of your header.",
      highlights: [
        "1. Quantum Basic: Everyday information, fundamental science, and clear answers",
        "2. Quantum Ultra: Deep theoretical physics, tensor calculus, and advanced STEM engines",
        "3. Codingz: Full-stack code IDE, multi-language compiler, and sandbox synthesizer",
      ],
      spokenText:
        "Use the top left edition switcher to move seamlessly between Quantum Basic for everyday science, Quantum Ultra for theoretical calculations, and Codingz for full multi-language software development.",
      targetView: "basic",
      targetEdition: "basic",
      actionLabel: "Preview Quantum Basic",
    },
    {
      id: "models",
      title: "Frontier AI Models Matrix",
      badge: "ALL 12+ MODELS UNLOCKED",
      icon: <Cpu className="w-6 h-6 text-indigo-400" />,
      description:
        "Freely orchestrate the world's leading AI engines with zero restrictions. Switch models on the fly during any inquiry or computational derivation.",
      highlights: [
        "Claude 3.7 Sonnet & Opus: Supreme reasoning, step-by-step logic, and code generation",
        "DeepSeek R1 & V3: Open-weight mathematical powerhouse with recursive chain-of-thought",
        "Gemini 2.5 Pro & Flash: Massive multimodal context window and lightning speed",
        "GPT 5.6 Luna & Llama 3.3: Frontier language understanding and versatile STEM capabilities",
      ],
      spokenText:
        "In the AI Models Matrix, freely select between leading frontier engines including Claude 3.7, DeepSeek R1, Gemini 2.5 Pro, and GPT 5.6 Luna. All models are unlocked with zero tier limits.",
      targetView: "models",
      targetEdition: "ultra",
      actionLabel: "Open AI Models Matrix",
    },
    {
      id: "stem",
      title: "STEM Deck & 3D Calculators",
      badge: "HIGH-PRECISION MATH",
      icon: <Calculator className="w-6 h-6 text-amber-400" />,
      description:
        "Directly execute symbolic calculus, differential equations, Fourier transforms, and 3D parametric graphing right inside the matrix.",
      highlights: [
        "Interactive Formula Presets across Physics, Chemistry, Orbital, and Calculus",
        "Dynamic LaTeX rendering with step-by-step mathematical proofs",
        "Desktop Bridge & Terminal integration for executing computational scripts",
      ],
      spokenText:
        "The STEM Deck and Engineering Calculators provide high-precision symbolic calculus, LaTeX derivations, formula presets, and interactive graphing for your scientific inquiries.",
      targetView: "stem",
      targetEdition: "ultra",
      actionLabel: "Inspect STEM Deck",
    },
    {
      id: "voice",
      title: "QUANTUM Voice & Real-Time Telemetry",
      badge: "VOICE AGENT HUD",
      icon: <Mic className="w-6 h-6 text-cyan-400" />,
      description:
        "Communicate with the AI naturally using voice commands, push-to-talk, and live audio frequency visualizers.",
      highlights: [
        "Push-to-Talk (PTT) with microphone acoustic feedback protection",
        "Real-time audio spectrum analyzer and holographic reactor core",
        "Automatic voice synthesis with natural British and conversational tones",
      ],
      spokenText:
        "Use push-to-talk or hands-free voice commands to ask questions, synthesize code, or execute formulas aloud. You can toggle audio narration and voice settings at any time.",
      targetView: "dashboard",
      targetEdition: "ultra",
      actionLabel: "View Voice HUD",
    },
    {
      id: "ready",
      title: "You're All Set to Explore!",
      badge: "TOUR COMPLETED",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      description:
        "Your sovereign workspace is fully initialized. You can re-open this tour, browse the User Manual, or switch themes anytime from the top navigation bar.",
      highlights: [
        "Everything is 100% Free and persistently saved to your profile",
        "Daily Peer-Reviewed STEM News updated continuously",
        "Access User Manual for comprehensive platform guides and AI doubt solving",
      ],
      spokenText:
        "You are now ready to explore! Dive in, run experiments, or ask me any question to get started. Welcome aboard!",
      targetView: "dashboard",
      targetEdition: "ultra",
      actionLabel: "Launch Sovereign Workspace",
    },
  ];

  const currentStep = tourSteps[currentStepIndex];

  // AI Speech Trigger Function
  const speakCurrentStep = (stepIdx: number) => {
    if (voiceMuted) return;
    const textToSpeak = tourSteps[stepIdx]?.spokenText;
    if (!textToSpeak) return;

    setIsLocalSpeaking(true);

    if (onSpeakText) {
      onSpeakText(textToSpeak);
    } else if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.name.includes("UK English Male") ||
            v.name.includes("Daniel") ||
            v.name.includes("Oliver") ||
            v.name.includes("Alex") ||
            (v.lang.startsWith("en-GB") && !v.name.includes("Female"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setIsLocalSpeaking(false);
      utterance.onerror = () => setIsLocalSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop Speech
  const stopSpeech = () => {
    setIsLocalSpeaking(false);
    if (onStopSpeaking) {
      onStopSpeaking();
    } else if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Initial speech on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      hasSpokenInitialRef.current = false;
      // Slight delay so DOM mounts and speech synth initializes
      const timer = setTimeout(() => {
        speakCurrentStep(0);
        hasSpokenInitialRef.current = true;
      }, 400);

      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    } else {
      stopSpeech();
    }
  }, [isOpen]);

  // Handle step changes
  const handleStepChange = (newIndex: number) => {
    playQuantumClick();
    stopSpeech();
    setCurrentStepIndex(newIndex);

    // Optionally change view to show the user the feature
    const nextStep = tourSteps[newIndex];
    if (onNavigateView && nextStep.targetView) {
      onNavigateView(nextStep.targetView, nextStep.targetEdition);
    }

    setTimeout(() => {
      speakCurrentStep(newIndex);
    }, 150);
  };

  // Handle Skip Button
  const handleSkipTour = () => {
    playQuantumClick();
    stopSpeech();
    try {
      localStorage.setItem("quantum_app_tour_completed", "true");
    } catch {}
    onClose();
  };

  // Handle Finish Button
  const handleFinishTour = () => {
    playQuantumClick();
    stopSpeech();
    try {
      localStorage.setItem("quantum_app_tour_completed", "true");
    } catch {}
    onClose();
  };

  // Toggle Mute
  const handleToggleMute = () => {
    playQuantumClick();
    if (!voiceMuted) {
      stopSpeech();
      setVoiceMuted(true);
    } else {
      setVoiceMuted(false);
      setTimeout(() => {
        speakCurrentStep(currentStepIndex);
      }, 100);
    }
  };

  // Replay Speech
  const handleReplaySpeech = () => {
    playQuantumClick();
    stopSpeech();
    setTimeout(() => {
      speakCurrentStep(currentStepIndex);
    }, 100);
  };

  if (!isOpen) return null;

  const isLastStep = currentStepIndex === tourSteps.length - 1;
  const isSpeakingNow = isSpeakingAudio || isLocalSpeaking;

  return (
    <div
      id="quantum-app-tour-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle 800px at 50% 50%, ${activeTheme.primary}40, transparent 70%)`,
        }}
      />

      {/* Main Tour Modal Card */}
      <div
        id="quantum-app-tour-card"
        className="relative w-full max-w-2xl rounded-2xl border bg-[#070D18]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300 border-cyan-500/40"
        style={{
          boxShadow: `0 0 40px ${activeTheme.primary}25, inset 0 0 20px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Top Progress Ribbon */}
        <div className="w-full bg-[#0D1829] h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-500"
            style={{
              width: `${((currentStepIndex + 1) / tourSteps.length) * 100}%`,
            }}
          />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#1E293B] bg-[#0A1220]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                  QUANTUM PLATFORM TOUR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                  STEP {currentStepIndex + 1} OF {tourSteps.length}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Sovereign STEM Matrix Onboarding
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Audio Telemetry Indicator & Mute Toggle */}
            <button
              onClick={handleToggleMute}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                voiceMuted
                  ? "border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white"
                  : isSpeakingNow
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse"
                  : "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              }`}
              title={voiceMuted ? "Unmute AI Voice Narration" : "Mute AI Voice Narration"}
            >
              {voiceMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">{isSpeakingNow ? "SPEAKING..." : "VOICE ON"}</span>
                  {/* Mini animated sound frequency bars */}
                  {isSpeakingNow && (
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
                      <span className="w-0.5 h-3 bg-cyan-300 animate-pulse delay-75" />
                      <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150" />
                    </div>
                  )}
                </>
              )}
            </button>

            {/* Replay Audio Button */}
            {!voiceMuted && (
              <button
                onClick={handleReplaySpeech}
                className="p-1.5 rounded-lg border border-[#1E293B] bg-[#0E1726] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Replay Voice Explanation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Skip Tour Button (Top-Right) */}
            <button
              onClick={handleSkipTour}
              className="p-1.5 rounded-lg border border-[#1E293B] bg-[#0E1726] hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* Step Icon & Category Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  backgroundColor: `${activeTheme.primary}15`,
                  borderColor: `${activeTheme.primary}60`,
                }}
              >
                {currentStep.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {currentStep.badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {currentStep.title}
                </h2>
              </div>
            </div>

            {/* Free and Unlocked Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% FREE</span>
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {currentStep.description}
          </p>

          {/* Feature Highlights Card */}
          <div className="p-3.5 rounded-xl border border-[#1E293B] bg-[#0A111E]/80 space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Key Capabilities</span>
            </div>
            <div className="space-y-1.5">
              {currentStep.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Interactive Preview Button */}
          {currentStep.actionLabel && onNavigateView && currentStep.targetView && (
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
              <div className="text-xs font-mono text-cyan-300/90">
                Want to check out this workspace right now?
              </div>
              <button
                type="button"
                onClick={() => {
                  playQuantumClick();
                  onNavigateView(currentStep.targetView!, currentStep.targetEdition);
                }}
                className="px-3 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentStep.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Step Dots indicator */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {tourSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepChange(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? "w-8 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Jump to ${step.title}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-[#1E293B] bg-[#070D18]">
          {/* Prominent Skip Tour Button requested by User */}
          <button
            id="quantum-tour-skip-button"
            type="button"
            onClick={handleSkipTour}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 bg-[#0B1220] hover:bg-[#121B2D] text-slate-300 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>SKIP TOUR</span>
          </button>

          {/* Navigation Controls: Previous / Next / Finish */}
          <div className="flex items-center gap-2.5 ml-auto">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={() => handleStepChange(currentStepIndex - 1)}
                className="px-3.5 py-2 rounded-xl border border-[#1E293B] bg-[#0B1322] hover:bg-[#131F36] text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS</span>
              </button>
            )}

            {!isLastStep ? (
              <button
                type="button"
                onClick={() => handleStepChange(currentStepIndex + 1)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishTour}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-mono text-xs font-bold shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>FINISH &amp; START EXPLORING</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
