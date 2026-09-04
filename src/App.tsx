import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, STEMDomain, VoiceConfig, VoiceState, QuantumThemeMode, QuantumEdition, AIModelId, SubscriptionTier, AIModel, AuthUser } from "./types";
import { QUANTUM_THEMES } from "./lib/themeConfig";
import { AI_MODELS_ROSTER, isModelFree } from "./data/aiModelsData";
import { HolographicCore } from "./components/HolographicCore";
import { VoiceAgentHUD } from "./components/VoiceAgentHUD";
import { STEMWorkspace } from "./components/STEMWorkspace";
import { DesktopBridge } from "./components/DesktopBridge";
import { ChatHUD } from "./components/ChatHUD";
import { STEMDailyNewsModal } from "./components/STEMDailyNewsModal";
import { UserManualModal } from "./components/UserManualModal";
import { EngineeringCalculator } from "./components/EngineeringCalculator";
import { QuantumBasicDesk } from "./components/QuantumBasicDesk";
import { AIModelsMatrix } from "./components/AIModelsMatrix";
import { CodingzWorkspace } from "./components/CodingzWorkspace";
import { QuantumHistoryPage } from "./components/QuantumHistoryPage";
import { ExitConfirmationModal } from "./components/ExitConfirmationModal";
import { AuthModal } from "./components/AuthModal";
import { LoginPage } from "./components/LoginPage";
import { AppTourGuide } from "./components/AppTourGuide";
import { ProfileModal } from "./components/ProfileModal";
import { AboutModal } from "./components/AboutModal";
import { SupportModal } from "./components/SupportModal";
import { HeaderProfileVoice } from "./components/HeaderProfileVoice";
import { PowerSavingModal } from "./components/PowerSavingModal";
import { PowerSavingModeSection } from "./components/PowerSavingModeSection";
import { BrandLogo } from "./components/BrandLogo";
import { QuantumVoiceEngine } from "./utils/audioVoice";
import { playQuantumClick } from "./utils/soundEffects";
import {
  Atom,
  Cpu,
  Activity,
  Layers,
  Terminal,
  Calculator,
  Compass,
  Binary,
  BookOpen,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Zap,
  Clock,
  ShieldAlert,
  Maximize2,
  LayoutGrid,
  ChevronRight,
  Newspaper,
  Mic,
  Sliders,
  CheckCircle2,
  Eye,
  Shield,
  Code,
  HelpCircle,
  Power,
  History,
  ChevronDown,
  ChevronUp,
  Check,
  Lock,
  Crown,
  Key,
  User,
  Info,
  LifeBuoy,
  LogOut,
  SunDim,
  BatteryCharging,
} from "lucide-react";

export default function App() {
  // Active theme overdrive mode (Build -> green, Fast -> red, Ultra Instinct -> purple, Relax -> pink, Normal -> cyan)
  const [themeMode, setThemeMode] = useState<QuantumThemeMode>("normal");
  const currentTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  // User Authentication & Identity State (SSO via Google, Apple, GitHub, Microsoft, or Email)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("quantum_auth_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (typeof parsed.name === "string" && (/google/i.test(parsed.name) || /sanchith/i.test(parsed.name))) {
            parsed.name = "Sanchith V";
          }
          // Remove stock unsplash placeholders so user defaults to SV monogram
          if (parsed.avatarUrl && parsed.avatarUrl.includes("unsplash.com")) {
            parsed.avatarUrl = "";
          }
          try {
            localStorage.setItem("quantum_auth_user", JSON.stringify(parsed));
          } catch {}
        }
        return parsed;
      }
    } catch {}
    return null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string | null>(null);

  // First-time onboarding app tour state with AI voice narration
  const [showAppTour, setShowAppTour] = useState<boolean>(() => {
    try {
      const tourCompleted = localStorage.getItem("quantum_app_tour_completed");
      const userSaved = localStorage.getItem("quantum_auth_user");
      // If user is already logged in but hasn't completed the tour, show tour
      if (userSaved && !tourCompleted) {
        return true;
      }
    } catch {}
    return false;
  });

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setAuthNoticeMessage(null);
    try {
      localStorage.setItem("quantum_auth_user", JSON.stringify(user));
    } catch {}
    setShowUserDropdown(false);
    playQuantumClick();

    // Check if user has taken the app tour before
    try {
      const tourCompleted =
        localStorage.getItem("quantum_app_tour_completed") ||
        localStorage.getItem(`quantum_tour_done_${user.id}`);
      if (!tourCompleted) {
        // Automatically start the guided tour with AI voice
        setShowAppTour(true);
      }
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("quantum_auth_user");
    } catch {}
    setShowUserDropdown(false);
    playQuantumClick();
  };

  // Selected AI Reasoning Model Core (Default: QUANTUM Prime All-Rounder - 100% Free forever)
  const [activeModelId, setActiveModelId] = useState<AIModelId>("quantum-prime");
  const activeModelMeta =
    AI_MODELS_ROSTER.find((m) => m.id === activeModelId) || AI_MODELS_ROSTER[0];

  // Seamless Model Switching - 100% Free and Unrestricted for all users
  const handleSelectModel = (modelId: AIModelId) => {
    setActiveModelId(modelId);
    playQuantumClick();
    return true;
  };

  // Quantum Edition: 1st is "basic" (basic information and science queries), 2nd is "ultra" (advanced theoretical STEM & OS)
  const [edition, setEdition] = useState<QuantumEdition>("ultra");

  // Voice engine & state
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    audioLevel: 0,
    transcript: "",
    lastCommand: null,
    mode: "STANDBY",
  });

  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    voiceTone: "British Refined",
    rate: 1.05,
    pitch: 0.95,
    continuousListening: false,
    autoSpeakResponse: true,
    wakeWordEnabled: true,
  });

  const voiceEngineRef = useRef<QuantumVoiceEngine | null>(null);

  // Active view layout mode
  const [activeView, setActiveView] = useState<
    "dashboard" | "basic" | "stem" | "calculator" | "desktop" | "models" | "codingz" | "history" | "login" | "powersaving"
  >("dashboard");
  const [activeDomain, setActiveDomain] = useState<STEMDomain>("quantum");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [stemInitialTab, setStemInitialTab] = useState<"formulas" | "simulations" | "research" | "code">("formulas");

  // Power Saving Mode State & Screen Dimming Control
  const [isPowerSavingMode, setIsPowerSavingMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("quantum_power_saving") === "true";
    } catch {
      return false;
    }
  });
  const [powerSavingBrightness, setPowerSavingBrightness] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("quantum_power_saving_brightness");
      return saved ? Number(saved) : 70;
    } catch {
      return 70;
    }
  });
  const [showPowerSavingModal, setShowPowerSavingModal] = useState(false);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: `### QUANTUM STEM INTELLIGENCE ACTIVE // HYPERION CORE ONLINE

Online and ready, sir. I am **QUANTUM**, specialized in advanced STEM research, mathematical physics, and desktop computational synthesis.

All core subsystems are operating within nominal parameters:
- **Theoretical Physics & Tensor Calculus Matrix**: Ready
- **Quantum State & Schrödinger Solvers**: Synchronized
- **Desktop Software & Python Sci-Kernel Bridge**: Active
- **Neural Voice Synthesis & Hologram Telemetry**: Online

How may I assist your research objectives today, sir? You may speak naturally via voice or input any complex equation, scientific hypothesis, or desktop task below.`,
      timestamp: "08:00:00",
      domain: "quantum",
      suggestedFollowups: [
        "Calculate Lorentz time dilation at 0.99c",
        "Derive the Schrödinger wave equation for a quantum harmonic oscillator",
        "Search ArXiv for topological superconducting qubits",
        "Execute a Python simulation of 1D wavepacket dispersion",
      ],
    },
  ]);


  // System clock interval
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Initialize Voice Engine
  useEffect(() => {
    voiceEngineRef.current = new QuantumVoiceEngine(
      (updatedState) => {
        setVoiceState((prev) => ({ ...prev, ...updatedState }));
      },
      (command) => {
        handleSendMessage(command, undefined, activeDomain, true);
      }
    );

    return () => {
      voiceEngineRef.current?.stopListening();
      voiceEngineRef.current?.stopSpeaking();
    };
  }, [activeDomain]);

  // Handle Voice Toggle
  const handleToggleListen = () => {
    if (!currentUser) {
      playQuantumClick();
      if (voiceEngineRef.current) {
        voiceEngineRef.current.speak("Please first sign in and ask questions, sir.");
      } else if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Please first sign in and ask questions, sir.");
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
      setAuthNoticeMessage("Please first sign in and ask questions, sir");
      setShowAuthModal(true);
      return;
    }
    if (!voiceEngineRef.current) return;
    if (voiceState.isListening) {
      voiceEngineRef.current.stopListening();
    } else {
      voiceEngineRef.current.startListening();
    }
  };

  const handleToggleContinuous = () => {
    const next = !voiceConfig.continuousListening;
    setVoiceConfig((prev) => ({ ...prev, continuousListening: next }));
    if (voiceEngineRef.current) {
      voiceEngineRef.current.config.continuousListening = next;
    }
  };

  const handleToggleAutoSpeak = () => {
    const next = !voiceConfig.autoSpeakResponse;
    setVoiceConfig((prev) => ({ ...prev, autoSpeakResponse: next }));
    if (voiceEngineRef.current) {
      voiceEngineRef.current.config.autoSpeakResponse = next;
    }
  };

  const handleUpdateVoiceConfig = (newConfig: Partial<VoiceConfig>) => {
    setVoiceConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      if (voiceEngineRef.current) {
        voiceEngineRef.current.config = updated;
      }
      return updated;
    });
  };

  // Speak a message aloud using standard assistant voice HUD
  const handleSpeakMessage = (text: string) => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.speak(text);
    }
  };

  // Power Saving Mode Voice Guidance & Handlers
  const handleSpeakPowerSavingPrompt = (customText?: string) => {
    const textToSpeak =
      customText ||
      "Good choice sir because it will consume less power and screen will become little dim. Is that ok for you sir?";
    if (voiceEngineRef.current) {
      voiceEngineRef.current.speak(textToSpeak);
    } else if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenPowerSavingPrompt = () => {
    playQuantumClick();
    setShowPowerSavingModal(true);
    handleSpeakPowerSavingPrompt();
  };

  const handleConfirmPowerSaving = () => {
    setIsPowerSavingMode(true);
    try {
      localStorage.setItem("quantum_power_saving", "true");
    } catch {}
    const confirmMsg = "Power saving mode activated, sir. Screen brightness dimmed to conserve energy.";
    handleSpeakPowerSavingPrompt(confirmMsg);
  };

  const handleTogglePowerSaving = () => {
    if (isPowerSavingMode) {
      setIsPowerSavingMode(false);
      try {
        localStorage.setItem("quantum_power_saving", "false");
      } catch {}
      const restoreMsg = "Restoring standard display brightness and full power, sir.";
      handleSpeakPowerSavingPrompt(restoreMsg);
    } else {
      handleOpenPowerSavingPrompt();
    }
  };

  const handleSetBrightnessLevel = (lvl: number) => {
    setPowerSavingBrightness(lvl);
    try {
      localStorage.setItem("quantum_power_saving_brightness", String(lvl));
    } catch {}
  };

  // Send message to Quantum via server-side Gemini API
  const handleSendMessage = async (
    text: string,
    imageBase64?: string,
    domain: STEMDomain = activeDomain,
    isVoice = false,
    overrideModelId?: AIModelId
  ) => {
    if (!text && !imageBase64) return;

    // Gatekeeper: If user asks questions before signing in, prompt them to sign in first!
    if (!currentUser) {
      playQuantumClick();

      const userMessage: ChatMessage = {
        id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString(),
        domain,
        isVoiceInput: isVoice,
        imagePreview: imageBase64,
      };

      const authNoticeMessageContent = `### 🔒 ACCESS RESTRICTED // PLEASE SIGN IN FIRST\n\n**Please sign in first and ask questions, sir.**\n\nSigning in is **100% free with lifetime access**! Create your free account or connect via Google, Apple, GitHub, Microsoft, or Email to unlock all 12+ frontier AI models, real-time LaTeX proofs, interactive STEM solvers, and developer sandboxes.`;

      const assistantMessage: ChatMessage = {
        id: `asst-auth-${Date.now()}`,
        role: "assistant",
        content: authNoticeMessageContent,
        timestamp: new Date().toLocaleTimeString(),
        domain,
        suggestedFollowups: [
          "Sign In (100% Free)",
          "Take Guided App Tour",
          "Explore User Manual",
        ],
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      // Voice prompt: Vocalize "Please first sign in and ask questions, sir"
      if (voiceEngineRef.current) {
        voiceEngineRef.current.speak("Please first sign in and ask questions, sir.");
      } else if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Please first sign in and ask questions, sir.");
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }

      setAuthNoticeMessage("Please first sign in and ask questions, sir");
      setShowAuthModal(true);
      return;
    }

    const targetModelId = overrideModelId || activeModelId;
    const targetModelMeta =
      AI_MODELS_ROSTER.find((m) => m.id === targetModelId) || activeModelMeta;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      domain,
      isVoiceInput: isVoice,
      imagePreview: imageBase64,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    setVoiceState((prev) => ({ ...prev, isProcessing: true, mode: "PROCESSING" }));

    try {
      const response = await fetch("/api/gemini/stem-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          imageBase64,
          domain,
          mode: themeMode,
          edition: edition,
          model: targetModelId,
        }),
      });

      let data: any = {};
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { text: responseText.startsWith("<") ? "Calculation complete, sir." : responseText };
      }

      let assistantText = data.text || "Calculation complete, sir.";
      // Ensure the response explicitly says "sir" every time
      if (!/\bsir\b/i.test(assistantText)) {
        if (assistantText.includes("### Direct Answer:")) {
          assistantText = assistantText.replace(
            /### Direct Answer:\s*/i,
            "### Direct Answer:\nCertainly, sir. "
          );
        } else {
          assistantText = `Certainly, sir.\n\n${assistantText}`;
        }
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "assistant",
        content: assistantText,
        timestamp: new Date().toLocaleTimeString(),
        domain,
        model: data.model || targetModelId,
        modelName: data.modelName || targetModelMeta.name,
        suggestedFollowups: [
          `Analyze physical boundary conditions for this result`,
          `Plot computational response curve in Sci-Kernel`,
          `Review ArXiv literature related to this topic`,
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
      setVoiceState((prev) => ({ ...prev, isProcessing: false, mode: "STANDBY" }));

      // Auto-speak response if enabled (for main Voice HUD)
      if (voiceConfig.autoSpeakResponse) {
        if (voiceEngineRef.current) {
          voiceEngineRef.current.speak(assistantText);
        }
      }
    } catch (err: any) {
      console.error("STEM query error:", err);
      setIsProcessing(false);
      setVoiceState((prev) => ({ ...prev, isProcessing: false, mode: "STANDBY" }));

      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "assistant",
        content: `**QUANTUM SYSTEM NOTICE**: Analytical matrix synthesized your inquiry, sir. System is operating in high-precision mode.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div
      className="min-h-screen text-[#E2E8F0] font-sans flex flex-col relative overflow-x-hidden transition-colors duration-500"
      style={{
        backgroundColor: currentTheme.screenBg,
      }}
    >
      {/* Dynamic Radial Dot Matrix / Glow Backdrop */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 15%, ${currentTheme.primary}22 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] blur-[120px] pointer-events-none rounded-full transition-all duration-700 opacity-25"
        style={{
          backgroundColor: currentTheme.primary,
        }}
      />

      {/* Main OS Screen Layout with Dynamic Power Saving Dimming Filter */}
      <div
        id="quantum-os-viewport"
        className="flex-1 flex flex-col transition-all duration-700"
        style={{
          filter: isPowerSavingMode
            ? `brightness(${powerSavingBrightness}%) contrast(96%) saturate(92%)`
            : undefined,
        }}
      >
        {/* Top Sleek Navigation Header */}
        <header
        className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-2 shadow-lg transition-colors duration-500"
        style={{
          backgroundColor: `${currentTheme.screenBg}E6`,
          borderColor: currentTheme.subtleBorder,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* Top Row: Brand & Editions on Left, Sovereign Profile & Voice PTT on Right */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Top Left Corner: Logo & Quantum Edition Switcher (1st: Basic, 2nd: Ultra) */}
            <div className="flex flex-wrap items-center gap-3">
            {/* Dynamic Brand Logo */}
            <div 
              className="cursor-pointer"
              onClick={() => {
                playQuantumClick();
                setShowAboutModal(true);
              }}
              title="Quantum STEM AI - Click to view About & System Info"
            >
              <BrandLogo size="md" edition={edition} glow={true} />
            </div>

            {/* Edition Switcher Section: 1st is Quantum Basic, 2nd is Quantum Ultra, 3rd is Codingz */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 p-0.5 rounded-lg border bg-[#080D15] border-[#1E2B3E] font-mono text-xs">
                {/* 1st: QUANTUM BASIC */}
                <button
                  onClick={() => {
                    setEdition("basic");
                    setActiveView("basic");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                    edition === "basic"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="1. Quantum Basic: Essential information, science fundamentals, everyday phenomena, and accessible AI answers"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. QUANTUM BASIC</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold hidden sm:inline">
                    Science &amp; Info
                  </span>
                </button>

                {/* 2nd: FULL MATRIX (QUANTUM ULTRA) */}
                <button
                  onClick={() => {
                    setEdition("ultra");
                    setActiveView("dashboard");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                    edition === "ultra" || edition === "matrix" || activeView === "dashboard"
                      ? "border font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  style={
                    edition === "ultra" || edition === "matrix" || activeView === "dashboard"
                      ? {
                          backgroundColor: currentTheme.activeBadgeBg,
                          borderColor: `${currentTheme.primary}66`,
                          color: currentTheme.primary,
                        }
                      : {}
                  }
                  title="2. Full Matrix (Quantum Ultra): Advanced STEM Super-OS, mathematical physics, theoretical calculus, and telemetry"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>2. FULL MATRIX (ULTRA)</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold hidden sm:inline">
                    STEM Super-OS
                  </span>
                </button>

                {/* 3rd: CODINGZ */}
                <button
                  onClick={() => {
                    setEdition("codingz");
                    setActiveView("codingz");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                    edition === "codingz"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="3. Codingz: Multi-language Code IDE, sandbox compiler, AI algorithm synthesizer & developer power tools"
                >
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. CODINGZ</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold hidden sm:inline">
                    Code &amp; Stuffs
                  </span>
                </button>
              </div>

              <p
                className="text-[9px] uppercase tracking-wider font-mono mt-0.5 transition-colors duration-500"
                style={{
                  color:
                    edition === "basic"
                      ? "#10B981"
                      : edition === "codingz"
                      ? "#06B6D4"
                      : currentTheme.primary,
                }}
              >
                {edition === "basic"
                  ? "Basic Information & Science Hub • [BASIC EDITION]"
                  : edition === "codingz"
                  ? "Multi-Language IDE, Compiler Sandbox & Stuffs Suite • [CODINGZ EDITION]"
                  : `Full Matrix (STEM Super-OS) • Theoretical Physics & Math • [${currentTheme.label.toUpperCase()} MODE]`}
              </p>
            </div>
          </div>

          {/* Right Sleek Actions: User Profile / SSO Auth & Voice PTT */}
          <HeaderProfileVoice
            currentUser={currentUser}
            showUserDropdown={showUserDropdown}
            setShowUserDropdown={setShowUserDropdown}
            voiceState={voiceState}
            handleToggleListen={handleToggleListen}
            currentTheme={currentTheme}
            setShowAuthModal={setShowAuthModal}
            setActiveView={setActiveView}
            setShowProfileModal={setShowProfileModal}
            setShowAboutModal={setShowAboutModal}
            setShowManualModal={setShowManualModal}
            setShowSupportModal={setShowSupportModal}
            handleLogout={handleLogout}
            playQuantumClick={playQuantumClick}
          />
        </div>

        {/* Lower Row: Unified Navigation & Subsystem Toolbar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar pt-1 border-t border-[#1E293B]/40">
          <div
            className="flex items-center gap-1 p-1 rounded-lg border text-xs font-mono shrink-0 transition-colors duration-500"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.subtleBorder,
            }}
          >
              {/* Workspaces & Modes Dropdown with Small Arrow (Replacing first 3 items) */}
              <div className="relative">
                <button
                  onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeView === "dashboard" || activeView === "basic" || activeView === "codingz"
                      ? "border font-medium shadow-sm"
                      : "text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700"
                  }`}
                  style={
                    activeView === "dashboard" || activeView === "basic" || activeView === "codingz"
                      ? {
                          backgroundColor: currentTheme.activeBadgeBg,
                          borderColor: `${currentTheme.primary}44`,
                          color: currentTheme.primary,
                        }
                      : {}
                  }
                  title="Select Workspace Mode"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="font-semibold">
                    {activeView === "basic"
                      ? "Quantum Basic"
                      : activeView === "codingz"
                      ? "Codingz"
                      : "Full Matrix"}
                  </span>
                  {showWorkspaceDropdown ? (
                    <ChevronUp className="w-3 h-3 ml-0.5 opacity-70" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                  )}
                </button>

                {/* Dropdown Menu (Styled like Image 2) */}
                {showWorkspaceDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowWorkspaceDropdown(false)}
                    />
                    <div
                      className="absolute left-0 top-full mt-1.5 w-60 rounded-xl border z-50 p-1.5 backdrop-blur-xl bg-[#080D15]/95 border-[#1E2B3E] shadow-2xl flex flex-col gap-1"
                      style={{
                        boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${currentTheme.glowColor}`,
                      }}
                    >
                      {/* Full Matrix Option */}
                      <button
                        onClick={() => {
                          setActiveView("dashboard");
                          setEdition("ultra");
                          setShowWorkspaceDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          activeView === "dashboard"
                            ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Full Matrix (STEM Super-OS)</span>
                        </div>
                        {activeView === "dashboard" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2ff]" />
                        )}
                      </button>

                      {/* Quantum Basic Option */}
                      <button
                        onClick={() => {
                          setActiveView("basic");
                          setEdition("basic");
                          setShowWorkspaceDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          activeView === "basic"
                            ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Quantum Basic (Science)</span>
                        </div>
                        {activeView === "basic" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                        )}
                      </button>

                      {/* Codingz Option */}
                      <button
                        onClick={() => {
                          setActiveView("codingz");
                          setEdition("codingz");
                          setShowWorkspaceDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          activeView === "codingz"
                            ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Code className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Codingz (IDE &amp; Sandbox)</span>
                        </div>
                        {activeView === "codingz" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2ff]" />
                        )}
                      </button>

                      {/* Sovereign Auth & Identity Option */}
                      <button
                        onClick={() => {
                          setActiveView("login");
                          setShowWorkspaceDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left border-t border-[#1E2B3E]/60 pt-2 ${
                          activeView === "login"
                            ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Key className="w-3.5 h-3.5 text-purple-400" />
                          <span>Sovereign Identity</span>
                        </div>
                        {activeView === "login" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setStemInitialTab("formulas");
                  setActiveView("stem");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "stem" && stemInitialTab !== "simulations"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "stem" && stemInitialTab !== "simulations"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>STEM Deck</span>
              </button>

              <button
                onClick={() => {
                  setStemInitialTab("simulations");
                  setActiveView("stem");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "stem" && stemInitialTab === "simulations"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "stem" && stemInitialTab === "simulations"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
                title="Interactive Simulations Sandbox: Quantum, Chaos, Astrophysics, Gravity, Thermodynamics & Waves"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Simulations</span>
              </button>

              <button
                onClick={() => setActiveView("calculator")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "calculator"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "calculator"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Engineering &amp; Desmos</span>
              </button>

              <button
                onClick={() => setActiveView("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "desktop"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "desktop"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Desktop Bridge</span>
              </button>

              {/* Dedicated AI Models Matrix Tab */}
              <button
                onClick={() => setActiveView("models")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "models"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "models"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
                title={`AI Models Matrix (${AI_MODELS_ROSTER.length} Models) • Active Core: ${activeModelMeta.name}`}
              >
                <Cpu className="w-3.5 h-3.5 animate-spin-slow" style={{ color: activeModelMeta.accentColor }} />
                <span>AI Models</span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border max-w-[120px] truncate"
                  style={{
                    backgroundColor: `${activeModelMeta.accentColor}25`,
                    borderColor: activeModelMeta.accentColor,
                    color: activeModelMeta.accentColor,
                  }}
                >
                  {activeModelMeta.name}
                </span>
              </button>

              {/* Dedicated Session History Tab */}
              <button
                onClick={() => setActiveView("history")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "history"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "history"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
                title={`Session Inquiry Logs & Transcripts (${messages.length} exchanges)`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
                <span
                  className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                >
                  {messages.length}
                </span>
              </button>

              {/* Dedicated Power Saving Tab */}
              <button
                id="nav-power-saving-tab-btn"
                onClick={() => {
                  playQuantumClick();
                  setActiveView("powersaving");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeView === "powersaving"
                    ? "border font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                style={
                  activeView === "powersaving"
                    ? {
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }
                    : {}
                }
                title="Power Saving Mode Dashboard & Energy Governor"
              >
                <SunDim
                  className={`w-3.5 h-3.5 ${
                    isPowerSavingMode ? "text-cyan-400 animate-pulse" : "text-yellow-400"
                  }`}
                />
                <span>Power Saving</span>
                {isPowerSavingMode && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border bg-cyan-500/20 border-cyan-400 text-cyan-300">
                    DIMMED
                  </span>
                )}
              </button>
            </div>

            {/* Utility Subsystems: Tour, Daily News, User Manual, Exit */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dedicated App Tour Button */}
            <button
              onClick={() => {
                playQuantumClick();
                setShowAppTour(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Launch Guided Voice Tour of Quantum AI Platform"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>APP TOUR</span>
            </button>

            {/* Dedicated Daily STEM News Button */}
            <button
              onClick={() => setShowNewsModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer group shadow-lg"
              style={{
                backgroundColor: currentTheme.activeBadgeBg,
                borderColor: currentTheme.primary,
                color: currentTheme.primary,
                boxShadow: `0 0 15px ${currentTheme.glowColor}`,
              }}
              title="Open Daily Peer-Reviewed STEM Research News"
            >
              <Newspaper className="w-3.5 h-3.5 animate-pulse" />
              <span>DAILY STEM NEWS</span>
              <span
                className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border"
                style={{
                  backgroundColor: `${currentTheme.primary}33`,
                  borderColor: currentTheme.primary,
                  color: currentTheme.primary,
                }}
              >
                DISPATCH
              </span>
            </button>

            {/* Dedicated User Manual & AI Guide Button in Top Right */}
            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer group shadow-lg hover:scale-105"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                borderColor: "#10B981",
                color: "#10B981",
                boxShadow: "0 0 15px rgba(16, 185, 129, 0.25)",
              }}
              title="Open Interactive User Manual, Platform Guide & AI Doubt Clarifier"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>USER MANUAL</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hidden sm:inline">
                HELP &amp; AI
              </span>
            </button>

            {/* Dedicated Power Saving Mode Button in Header Toolbar */}
            <button
              id="toolbar-power-saving-btn"
              onClick={handleOpenPowerSavingPrompt}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer shadow-lg hover:scale-105 ${
                isPowerSavingMode
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                  : "bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
              title="Power Saving Mode: Click to activate dimming and voice guidance"
            >
              <SunDim
                className={`w-3.5 h-3.5 ${
                  isPowerSavingMode ? "text-cyan-400 animate-pulse" : "text-yellow-400"
                }`}
              />
              <span>POWER SAVING</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${
                  isPowerSavingMode
                    ? "bg-cyan-500/30 border-cyan-400 text-cyan-200"
                    : "bg-slate-800 border-slate-600 text-slate-400"
                }`}
              >
                {isPowerSavingMode ? `${powerSavingBrightness}% DIM` : "STANDBY"}
              </span>
            </button>

            {/* Dedicated Exit / Power Button: Asks "Are you sure you want to exit?" & Plays reactor spin-down sound */}
            <button
              onClick={() => {
                playQuantumClick();
                setShowExitModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer group shadow-lg hover:scale-105 bg-red-950/40 border-red-500/60 text-red-400 hover:bg-red-900/50 hover:border-red-400"
              style={{
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
              }}
              title="Shutdown Quantum Subsystems & Exit Application"
            >
              <Power className="w-3.5 h-3.5 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
              <span>EXIT</span>
            </button>
          </div>

        </div>
      </div>
    </header>

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 z-10">
        {/* Guest Preview Notice when unauthenticated */}
        {!currentUser && (
          <div className="w-full rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-[#09121F]/90 to-blue-950/60 p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 text-xs font-mono shadow-[0_0_25px_rgba(0,242,255,0.15)] backdrop-blur-md animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-inner">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white tracking-wider text-sm">
                    GUEST ACCESS ACTIVE // EXPLORE SEARCH &amp; QUANTUM CORE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                    100% Free
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  Browse our Quantum Arc Reactor Core, models roster, and search interface. To ask questions and compute derivations, please sign in first, sir.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
              <button
                onClick={() => {
                  playQuantumClick();
                  setAuthNoticeMessage("Please first sign in and ask questions, sir");
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>SIGN IN TO ASK QUESTIONS, SIR</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Arc: Symmetrical 3-Column Deck with Holographic Reactor Core situated directly in the EXACT MIDDLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Quantum Mode & Telemetry Diagnostics */}
          <div
            className="lg:col-span-3 rounded-2xl border shadow-xl p-4 flex flex-col justify-between transition-all duration-500 relative overflow-hidden"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.subtleBorder,
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: currentTheme.subtleBorder }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" style={{ color: currentTheme.primary }} />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
                    DIAGNOSTICS
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase"
                  style={{
                    backgroundColor: currentTheme.activeBadgeBg,
                    color: currentTheme.primary,
                  }}
                >
                  {currentTheme.label}
                </span>
              </div>

              {/* Pacing & Latency Mode Guidance */}
              <div className="bg-[#0B0F14] p-2.5 rounded-lg border border-[#1A222C] text-[11px] font-mono space-y-1">
                <div className="text-slate-400 text-[10px] flex items-center justify-between">
                  <span>RESPONSE PACING:</span>
                  <span className="font-bold" style={{ color: currentTheme.primary }}>
                    {themeMode === "normal" && "20–30s (QUICK & BASIC)"}
                    {themeMode === "build" && "10–20 MIN (PROJECT BUILDER)"}
                    {themeMode === "relax" && "1–2 MIN (SIMPLE & DETAILED)"}
                    {themeMode === "fast" && "10–15s (FASTEST ANSWERS)"}
                    {themeMode === "ultra_instinct" && "5 MIN (DETAILED & EASY)"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {currentTheme.modePurpose}
                </p>
              </div>

              {/* Quick Mode Switcher Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">OVERDRIVE SELECTOR:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(QUANTUM_THEMES) as QuantumThemeMode[]).map((m) => {
                    const t = QUANTUM_THEMES[m];
                    const isSelected = themeMode === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setThemeMode(m)}
                        title={`${t.label} Mode — ${t.modePurpose} (${t.timingCadence})`}
                        className={`text-[10px] font-mono px-2 py-1.5 rounded-md border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected ? "font-bold shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                        style={{
                          backgroundColor: isSelected ? t.activeBadgeBg : "#0B0F14",
                          borderColor: isSelected ? t.primary : "#1A222C",
                          color: isSelected ? t.primary : "#94A3B8",
                        }}
                      >
                        <div className="flex items-center gap-1 truncate">
                          <span className="truncate">{t.label}</span>
                          <span className="text-[9px] opacity-70">[{t.timingBadge}]</span>
                        </div>
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 ml-1"
                          style={{ backgroundColor: t.primary }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Core Metrics footer */}
            <div className="pt-3 border-t border-[#1A222C] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>COHERENCE: <strong style={{ color: currentTheme.primary }}>99.8%</strong></span>
              <span>THERMAL: <strong className="text-emerald-400">38.2°C</strong></span>
            </div>
          </div>

          {/* Center Column: CENTRAL STARK ARC REACTOR CORE */}
          <div
            className="lg:col-span-6 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border shadow-2xl relative overflow-hidden transition-all duration-500 min-h-[350px] backdrop-blur-md"
            style={{
              backgroundColor: `${currentTheme.panelBg}D9`,
              borderColor: `${currentTheme.primary}55`,
              boxShadow: `0 0 35px ${currentTheme.glowColor}`,
            }}
          >
            {/* High-Tech Tactical Corner Brackets (matching the QUANTUM HUD aesthetic) */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: currentTheme.primary }} />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: currentTheme.primary }} />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: currentTheme.primary }} />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: currentTheme.primary }} />

            {/* Core HUD Header */}
            <div
              className="w-full flex items-center justify-between text-[11px] uppercase font-mono tracking-widest transition-colors duration-500 mb-1.5 z-10"
              style={{ color: currentTheme.primary }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: currentTheme.primary }}
                />
                <span className="font-bold">
                  QUANTUM ARC REACTOR // {currentTheme.label.toUpperCase()} CORE
                </span>
              </div>

              <div className="text-[10px] font-mono tracking-wider" style={{ color: currentTheme.primary }}>
                STATUS:{" "}
                {voiceState.mode === "LISTENING"
                  ? "LISTENING"
                  : voiceState.mode === "SPEAKING"
                  ? "VOCALIZING"
                  : voiceState.mode === "PROCESSING"
                  ? "PROCESSING"
                  : "STANDBY"}
              </div>
            </div>

            {/* Interactive Arc Reactor Core */}
            <div className="my-auto py-1 z-10">
              <HolographicCore
                voiceState={voiceState}
                onCoreClick={handleToggleListen}
                size="lg"
                themeMode={themeMode}
                modelId={activeModelId}
                onSelectModel={handleSelectModel}
              />
            </div>

            {/* Core HUD Subtitle / Interaction Helper */}
            <div
              className="w-full pt-2 flex items-center justify-between border-t text-[10px] font-mono text-slate-400 transition-colors duration-500 z-10"
              style={{ borderColor: `${currentTheme.primary}22` }}
            >
              <span>{currentUser ? "TOUCH CORE TO ACTIVATE VOICE RECOGNITION" : "TOUCH CORE // PLEASE SIGN IN FIRST TO ASK QUESTIONS, SIR"}</span>
              <span className="font-bold uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                ENTANGLED MATRIX
              </span>
            </div>
          </div>

          {/* Right Column: Symmetrical Quantum Computing Telemetry Deck */}
          <div
            className="lg:col-span-3 rounded-2xl border shadow-xl p-4 flex flex-col justify-between transition-all duration-500 relative overflow-hidden"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.subtleBorder,
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: currentTheme.subtleBorder }}>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" style={{ color: currentTheme.primary }} />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
                    TELEMETRY MATRIX
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SYNCHRONIZED
                </span>
              </div>

              {/* Subsystems latency status */}
              <div className="space-y-2 text-[11px] font-mono">
                <div className="bg-[#0B0F14] p-2 rounded-lg border border-[#1A222C] flex items-center justify-between">
                  <span className="text-slate-400">Qubit Entanglement:</span>
                  <span className="font-bold text-slate-200">384 Qubits</span>
                </div>

                <div className="bg-[#0B0F14] p-2 rounded-lg border border-[#1A222C] flex items-center justify-between">
                  <span className="text-slate-400">Tensor Math Kernel:</span>
                  <span className="text-emerald-400 font-bold">0.8ms</span>
                </div>

                <div className="bg-[#0B0F14] p-2 rounded-lg border border-[#1A222C] flex items-center justify-between">
                  <span className="text-slate-400">Particle Sandbox:</span>
                  <span className="text-cyan-400 font-bold">2.4ms</span>
                </div>

                <div className="bg-[#0B0F14] p-2 rounded-lg border border-[#1A222C] flex items-center justify-between">
                  <span className="text-slate-400">ArXiv Synthesis:</span>
                  <span className="text-indigo-400 font-bold">4.1ms</span>
                </div>
              </div>

              {/* Quick Launch Dispatch links */}
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setEdition("basic");
                    setActiveView("basic");
                  }}
                  className="w-full py-2 px-2.5 rounded-lg border border-[#232D3B] bg-[#0E1520] hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 group-hover:text-emerald-300">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    1. Quantum Basic Desk
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Science Hub &rarr;</span>
                </button>

                <button
                  onClick={() => {
                    setEdition("codingz");
                    setActiveView("codingz");
                  }}
                  className="w-full py-2 px-2.5 rounded-lg border border-[#232D3B] bg-[#0E1520] hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 group-hover:text-emerald-300">
                    <Code className="w-3.5 h-3.5 text-emerald-400" />
                    2. Codingz &amp; Stuffs Studio
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">IDE &rarr;</span>
                </button>

                <button
                  onClick={() => setShowNewsModal(true)}
                  className="w-full py-2 px-2.5 rounded-lg border border-[#232D3B] bg-[#0E1520] hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 group-hover:text-cyan-300">
                    <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                    Daily STEM News
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">6 Updates</span>
                </button>

                <button
                  onClick={() => setActiveView("calculator")}
                  className="w-full py-2 px-2.5 rounded-lg border border-[#232D3B] bg-[#0E1520] hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 group-hover:text-emerald-300">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    Eng &amp; Desmos Calc
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Launch &rarr;</span>
                </button>
              </div>
            </div>

            {/* Telemetry bottom bar */}
            <div className="pt-3 border-t border-[#1A222C] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>ENTROPY: <strong className="text-slate-200">&Delta;S &lt; 0.001</strong></span>
              <span>CLOCK: <strong style={{ color: currentTheme.primary }}>{currentTime}</strong></span>
            </div>
          </div>
        </div>

        {/* Dedicated Quantum Voice & Audio Console */}
        <div className="w-full">
          <div className="flex items-center justify-between px-2 mb-2">
            <div
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
              style={{ color: currentTheme.primary }}
            >
              <Mic className="w-4 h-4" />
              <span className="font-bold">QUANTUM VOICE & AUDIO CONSOLE</span>
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                // SPEECH RECOGNITION, VOICE SYNTHESIS & REAL-TIME STEM QUERIES
              </span>
            </div>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase"
              style={{
                backgroundColor: currentTheme.activeBadgeBg,
                borderColor: `${currentTheme.primary}44`,
                color: currentTheme.primary,
              }}
            >
              VOICE ENGINE: {voiceState.mode}
            </span>
          </div>

          <VoiceAgentHUD
            voiceState={voiceState}
            voiceConfig={voiceConfig}
            onToggleListen={handleToggleListen}
            onToggleContinuous={handleToggleContinuous}
            onToggleAutoSpeak={handleToggleAutoSpeak}
            onUpdateConfig={handleUpdateVoiceConfig}
            onQuickCommand={(cmd) => handleSendMessage(cmd, undefined, activeDomain, true)}
            themeMode={themeMode}
            className="w-full"
          />
        </div>

        {/* Dynamic Multi-Deck Workspace Section */}
        {activeView === "basic" && (
          <div className="h-[740px]">
            <QuantumBasicDesk
              onSendQuery={(prompt, domain) =>
                handleSendMessage(prompt, undefined, domain || "physics")
              }
              messages={messages}
              isProcessing={isProcessing}
              onSpeakMessage={handleSpeakMessage}
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "dashboard" && (
          <div className="space-y-6">
            {/* Dedicated Section: Power Saving Mode */}
            <PowerSavingModeSection
              isPowerSavingMode={isPowerSavingMode}
              brightnessLevel={powerSavingBrightness}
              onToggleMode={handleTogglePowerSaving}
              onSetBrightnessLevel={handleSetBrightnessLevel}
              onOpenConfirmationPrompt={handleOpenPowerSavingPrompt}
              themeMode={themeMode}
            />

            {/* Upper Main: Full-Width Chat & Reasoning Stream */}
            <div className="w-full h-[620px]">
              <ChatHUD
                messages={messages}
                onSendMessage={handleSendMessage}
                onSpeakMessage={handleSpeakMessage}
                isProcessing={isProcessing}
                activeDomain={activeDomain}
                onSelectDomain={setActiveDomain}
                themeMode={themeMode}
                onSelectThemeMode={setThemeMode}
                activeModelId={activeModelId}
                onSelectModel={handleSelectModel}
                onOpenModelsMatrix={() => setActiveView("models")}
                onOpenHistory={() => setActiveView("history")}
                isLoggedIn={!!currentUser}
                onRequireSignIn={() => {
                  setAuthNoticeMessage("Please first sign in and ask questions, sir");
                  setShowAuthModal(true);
                }}
              />
            </div>

            {/* Down Below: STEM RESEARCH & CALCULATION DECK */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                  <Calculator className="w-4 h-4" />
                  <span className="font-bold">STEM RESEARCH & CALCULATION DECK</span>
                  <span className="text-[10px] text-slate-400 font-normal">// FORMULAS, SIMULATIONS, ARXIV & SCI-KERNEL</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  4 ENGINES ONLINE
                </span>
              </div>

              <div className="h-[640px]">
                <STEMWorkspace
                  initialTab={stemInitialTab}
                  onSendToQuantum={(prompt, domain) =>
                    handleSendMessage(prompt, undefined, domain || activeDomain)
                  }
                  themeMode={themeMode}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === "codingz" && (
          <div className="h-[760px]">
            <CodingzWorkspace
              onSendToQuantum={(prompt, domain) =>
                handleSendMessage(prompt, undefined, domain || "ai_neural")
              }
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "models" && (
          <div className="min-h-[760px]">
            <AIModelsMatrix
              activeModelId={activeModelId}
              onSelectModel={(id) => handleSelectModel(id)}
              onSendPromptToModel={(prompt, id) => {
                handleSelectModel(id);
                setActiveView("dashboard");
                handleSendMessage(prompt, undefined, activeDomain, false, id);
              }}
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "history" && (
          <div className="min-h-[760px]">
            <QuantumHistoryPage
              messages={messages}
              onClearHistory={() => {
                setMessages([
                  {
                    id: "init-" + Date.now(),
                    role: "assistant",
                    content: `### QUANTUM RE-INITIALIZATION // LOGS PURGED\n\nSession records have been cleared, sir. Subsystems remain synchronized and ready for new inquiries.`,
                    timestamp: new Date().toLocaleTimeString(),
                    domain: activeDomain,
                  },
                ]);
              }}
              onDeleteMessage={(id) => {
                setMessages((prev) => prev.filter((m) => m.id !== id));
              }}
              onRestoreToActivePrompt={(prompt, domain, modelId) => {
                if (domain) setActiveDomain(domain);
                if (modelId) {
                  handleSelectModel(modelId);
                }
                setActiveView("dashboard");
                handleSendMessage(prompt, undefined, domain || activeDomain, false, modelId);
              }}
              onSpeakMessage={handleSpeakMessage}
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "stem" && (
          <div className="h-[720px]">
            <STEMWorkspace
              initialTab={stemInitialTab}
              onSendToQuantum={(prompt, domain) =>
                handleSendMessage(prompt, undefined, domain || activeDomain)
              }
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "calculator" && (
          <div className="h-[740px]">
            <EngineeringCalculator
              onSendToQuantum={(prompt, domain) =>
                handleSendMessage(prompt, undefined, domain || activeDomain)
              }
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "desktop" && (
          <div className="h-[720px]">
            <DesktopBridge
              onExecuteCommand={(cmd) => handleSendMessage(`Execute command: ${cmd}`)}
              onSendToQuantum={(prompt) => handleSendMessage(prompt)}
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "login" && (
          <div className="min-h-[780px]">
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              currentUser={currentUser}
              onLogout={handleLogout}
              onBackToApp={() => setActiveView("dashboard")}
              themeMode={themeMode}
            />
          </div>
        )}

        {activeView === "powersaving" && (
          <div className="space-y-6 animate-fade-in">
            <PowerSavingModeSection
              isPowerSavingMode={isPowerSavingMode}
              brightnessLevel={powerSavingBrightness}
              onToggleMode={handleTogglePowerSaving}
              onSetBrightnessLevel={handleSetBrightnessLevel}
              onOpenConfirmationPrompt={handleOpenPowerSavingPrompt}
              themeMode={themeMode}
            />
          </div>
        )}
      </main>

      {/* Footer Status Bar */}
      <footer
        className="mt-auto border-t px-6 py-3 text-[10px] text-white/40 font-mono z-10 transition-colors duration-500"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.subtleBorder,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-6">
            <span
              className="flex items-center gap-1.5 transition-colors duration-500"
              style={{ color: currentTheme.primary }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentTheme.primary }}
              />
              CORE THEME: {currentTheme.label.toUpperCase()} [{currentTheme.primary}]
            </span>
            <span>SECURE UPLINK: 128.0.4.1</span>
            <span
              className="hidden sm:inline font-bold"
              style={{ color: activeModelMeta.accentColor }}
            >
              AI CORE: {activeModelMeta.name.toUpperCase()} [{activeModelMeta.provider.toUpperCase()}]
            </span>
          </div>

          <div className="flex items-center space-x-6 text-white/40">
            <span>MIC: {voiceState.isListening ? "ACTIVE" : "STANDBY"}</span>
            <span>SPEECH: {voiceConfig.autoSpeakResponse ? "ENABLED" : "MUTED"}</span>
            <div>&copy; 2142 QUANTUM TECHNOLOGIES GROUP</div>
          </div>
        </div>
      </footer>
      </div>

      {/* Screen Dimming Ambient Tint Layer when Power Saving Active */}
      {isPowerSavingMode && (
        <div
          id="power-saving-ambient-overlay"
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 bg-black/35"
          style={{ opacity: Math.max(0.1, ((100 - powerSavingBrightness) / 100) * 0.5) }}
          aria-hidden="true"
        />
      )}

      {/* Daily STEM News Interactive Modal */}
      <STEMDailyNewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        onAnalyzeTopic={(prompt) => {
          setShowNewsModal(false);
          setActiveView("dashboard");
          handleSendMessage(prompt);
        }}
        themeMode={themeMode}
      />

      {/* User Manual & AI Doubt Clarifier Interactive Modal */}
      <UserManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSelectModel={(modelId) => {
          handleSelectModel(modelId as AIModelId);
        }}
        onSelectPrompt={(prompt, domain, mode) => {
          if (domain) setActiveDomain(domain);
          if (mode) setThemeMode(mode);
          setActiveView("dashboard");
          handleSendMessage(prompt, undefined, domain || activeDomain);
        }}
        onSwitchEdition={(newEdition) => {
          setEdition(newEdition);
          if (newEdition === "basic") {
            setActiveView("basic");
          } else if (newEdition === "codingz") {
            setActiveView("codingz");
          } else {
            setActiveView("dashboard");
          }
        }}
        themeMode={themeMode}
        onStartTour={() => setShowAppTour(true)}
      />

      {/* Interactive App Tour Guide with Voice Speech & Skip Tour button */}
      <AppTourGuide
        isOpen={showAppTour}
        onClose={() => {
          setShowAppTour(false);
          if (voiceEngineRef.current) {
            voiceEngineRef.current.stopSpeaking();
          }
        }}
        userName={currentUser?.name}
        activeTheme={currentTheme}
        themeMode={themeMode}
        onSpeakText={(text) => {
          if (voiceEngineRef.current) {
            voiceEngineRef.current.speak(text);
          } else if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.05;
            utterance.pitch = 0.95;
            window.speechSynthesis.speak(utterance);
          }
        }}
        onStopSpeaking={() => {
          if (voiceEngineRef.current) {
            voiceEngineRef.current.stopSpeaking();
          }
          if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        }}
        isSpeakingAudio={voiceState.isSpeaking}
        onNavigateView={(view, editionTarget) => {
          setActiveView(view);
          if (editionTarget) {
            setEdition(editionTarget);
          }
        }}
      />

      {/* Exit Confirmation Dialog Modal: Asks 'Are you sure you want to exit?' with reactor spin-down sound */}
      <ExitConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        themeMode={themeMode}
      />

      {/* Power Saving Mode Confirmation Dialog Modal: Asks QUANTUM voice query & controls screen dimming */}
      <PowerSavingModal
        isOpen={showPowerSavingModal}
        onClose={() => setShowPowerSavingModal(false)}
        onConfirm={handleConfirmPowerSaving}
        themeMode={themeMode}
        isAlreadyActive={isPowerSavingMode}
        onSpeakPrompt={handleSpeakPowerSavingPrompt}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          try {
            localStorage.setItem("quantum_auth_user", JSON.stringify(updated));
          } catch {}
        }}
        onSignOut={handleLogout}
      />

      {/* About Quantum AI Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Support & Diagnostics Desk Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        onOpenHelpManual={() => setShowManualModal(true)}
      />

      {/* Sovereign Authentication Modal: Apple, Google, GitHub, Microsoft, and Email login */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthNoticeMessage(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
        themeMode={themeMode}
        noticeMessage={authNoticeMessage}
      />
    </div>
  );
}
