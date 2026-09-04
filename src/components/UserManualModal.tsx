import React, { useState } from "react";
import { QuantumThemeMode, STEMDomain } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import {
  BookOpen,
  X,
  Sparkles,
  HelpCircle,
  Zap,
  Code,
  Clock,
  Cpu,
  Mic,
  Calculator,
  Compass,
  ArrowRight,
  CheckCircle2,
  Copy,
  MessageSquare,
  FileText,
  Lightbulb,
  Send,
  Loader2,
  Terminal,
  Layers,
  ChevronRight,
  Bot,
  Flame,
  Volume2,
  Check,
} from "lucide-react";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string, domain?: STEMDomain, mode?: QuantumThemeMode) => void;
  onSwitchEdition?: (edition: "basic" | "ultra" | "codingz") => void;
  onSelectModel?: (modelId: any) => void;
  onStartTour?: () => void;
  themeMode?: QuantumThemeMode;
}

type ManualTab =
  | "quickstart"
  | "editions"
  | "modes"
  | "models"
  | "voice"
  | "tools"
  | "assistant";

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  onSwitchEdition,
  onSelectModel,
  onStartTour,
  themeMode = "normal",
}) => {
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const [activeTab, setActiveTab] = useState<ManualTab>("quickstart");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // AI Models Interactive State
  const [selectedAIKey, setSelectedAIKey] = useState<string>("quantum-prime");
  const [modelCategoryFilter, setModelCategoryFilter] = useState<
    "all" | "frontier" | "math_reasoning" | "speed" | "platform_engines"
  >("all");

  // AI Assistant State (Doubt Clarifier & Summarizer)
  const [assistantSubTab, setAssistantSubTab] = useState<"doubt" | "summarize">("doubt");
  const [doubtInput, setDoubtInput] = useState("");
  const [doubtResponse, setDoubtResponse] = useState<string | null>(null);
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);

  const [summaryInput, setSummaryInput] = useState("");
  const [summaryStyle, setSummaryStyle] = useState<"bullets" | "oneliner" | "eli5" | "actionplan">("bullets");
  const [summaryResponse, setSummaryResponse] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAskDoubt = async (queryToAsk?: string) => {
    const q = queryToAsk || doubtInput;
    if (!q.trim()) return;

    setIsDoubtLoading(true);
    setDoubtResponse(null);
    try {
      const res = await fetch("/api/gemini/manual-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "doubt",
          query: q,
        }),
      });
      const data = await res.json();
      setDoubtResponse(data.text || "Here is the guidance for your query.");
    } catch {
      setDoubtResponse(
        `### 💡 Quick Answer for: "${q}"\n\nTo use this feature:\n1. Choose an edition at the top (Quantum Basic, Quantum Ultra, or Codingz).\n2. Select your desired response timing (Normal 20-30s, Build 10-20 min, Relax 1-2 min, Fast 10-15s, Ultra Instinct 5 min).\n3. Type in the bottom input bar or click VOICE PTT to speak!`
      );
    } finally {
      setIsDoubtLoading(false);
    }
  };

  const handleSummarize = async (customText?: string, overrideStyle?: "bullets" | "oneliner" | "eli5" | "actionplan") => {
    const text = customText || summaryInput;
    const style = overrideStyle || summaryStyle;

    setIsSummaryLoading(true);
    setSummaryResponse(null);
    try {
      const res = await fetch("/api/gemini/manual-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summarize",
          textToSummarize: text,
          style,
        }),
      });
      const data = await res.json();
      setSummaryResponse(data.text || "Summary generated successfully.");
    } catch {
      setSummaryResponse(
        `### 📋 Manual Summary:\n- **Quantum Platform**: Comprehensive AI suite with 3 Editions (Basic, Ultra, Codingz).\n- **5 Pacing Modes**: Normal (20–30s), Build (10–20 min), Relax (1–2 min), Fast (10–15s), Ultra Instinct (5 min).\n- **QUANTUM Prime**: 10M token context horizon for huge projects and instant STEM formulas.`
      );
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const quickDoubtQuestions = [
    "How do I build a complete web app or project in Build Mode (10-20 min)?",
    "What is the difference between Quantum Basic, Ultra, and Codingz?",
    "How does the exclusive 10 Million Token Context Horizon work?",
    "How do I use Voice PTT and hands-free continuous listening?",
    "Which response mode is best for simple homework questions?",
    "How do I run Python or JavaScript in the Sci-Kernel sandbox?",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: "#080C12",
          borderColor: theme.subtleBorder,
          boxShadow: `0 0 45px ${theme.glowColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: theme.subtleBorder, backgroundColor: theme.panelBg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner"
              style={{
                backgroundColor: theme.activeBadgeBg,
                borderColor: theme.primary,
              }}
            >
              <BookOpen className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-white">
                  QUANTUM PLATFORM USER MANUAL
                </h2>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                  style={{
                    backgroundColor: theme.activeBadgeBg,
                    borderColor: theme.primary,
                    color: theme.primary,
                  }}
                >
                  INTERACTIVE GUIDE &amp; AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Complete operating guide, edition selector, pacing modes, and built-in doubt clarifying AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Take Guided App Tour Button */}
            {onStartTour && (
              <button
                onClick={() => {
                  onClose();
                  onStartTour();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer hover:scale-105"
                title="Launch Guided Voice Tour of Platform"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>START TOUR</span>
              </button>
            )}

            {/* Quick 1-Click Summarize Manual Button */}
            <button
              onClick={() => {
                setActiveTab("assistant");
                setAssistantSubTab("summarize");
                handleSummarize(
                  "Quantum Platform complete overview: 3 Editions (Basic, Ultra, Codingz), 5 pacing modes, 10M token context horizon QUANTUM Prime, and developer tools.",
                  "bullets"
                );
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer hover:scale-105"
              style={{
                backgroundColor: theme.activeBadgeBg,
                borderColor: theme.primary,
                color: theme.primary,
              }}
              title="Summarize entire platform in 3 bullets"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI SUMMARIZE MANUAL</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-800 bg-[#101720] text-slate-400 hover:text-white hover:border-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div
          className="px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0 text-xs font-mono"
          style={{ borderColor: theme.subtleBorder, backgroundColor: "#0B1118" }}
        >
          <button
            onClick={() => setActiveTab("quickstart")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "quickstart"
                ? "font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "quickstart"
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}55`,
                  }
                : {}
            }
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Quick Start</span>
          </button>

          <button
            onClick={() => setActiveTab("editions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "editions"
                ? "font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "editions"
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}55`,
                  }
                : {}
            }
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Three Editions</span>
          </button>

          <button
            onClick={() => setActiveTab("modes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "modes"
                ? "font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "modes"
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}55`,
                  }
                : {}
            }
          >
            <Clock className="w-3.5 h-3.5" />
            <span>3. Pacing Modes</span>
          </button>

          <button
            onClick={() => setActiveTab("models")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "models"
                ? "font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "models"
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}55`,
                  }
                : {}
            }
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>4. AI Models (10M Horizon)</span>
          </button>

          <button
            onClick={() => setActiveTab("voice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "voice"
                ? "font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "voice"
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}55`,
                  }
                : {}
            }
          >
            <Mic className="w-3.5 h-3.5" />
            <span>5. Voice HUD</span>
          </button>

          <button
            onClick={() => setActiveTab("tools")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "tools"
                ? "font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "tools"
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}55`,
                  }
                : {}
            }
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>6. Desmos &amp; Tools</span>
          </button>

          {/* AI Doubt Clarifier & Summarizer Tab (Highlighted) */}
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap border ml-auto ${
              activeTab === "assistant"
                ? "font-bold shadow-md bg-cyan-500/20 text-cyan-300 border-cyan-400"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            <Bot className="w-3.5 h-3.5 animate-bounce" />
            <span className="font-bold">✨ MANUAL AI (Doubt &amp; Summarize)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
          {/* TAB 1: QUICK START */}
          {activeTab === "quickstart" && (
            <div className="space-y-6 animate-fade-in">
              <div
                className="p-4 rounded-xl border relative overflow-hidden"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.subtleBorder,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-mono text-white">
                      Welcome to the Quantum Superintelligence Platform
                    </h3>
                    <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                      Whether you need quick school science homework answers, advanced physics and calculus equations, full-stack website and app code generation, or hands-free voice collaboration — this platform has you covered.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Simple Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        STEP 1
                      </span>
                      <Layers className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white font-mono">Pick Your Edition</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choose between <strong>Quantum Basic</strong> (school &amp; general science), <strong>Quantum Ultra</strong> (hard physics &amp; math), or <strong>Codingz</strong> (code IDE &amp; project builder) in the top header.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Selector:</span>
                    <span className="text-emerald-400 font-bold">Top Left Header</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        STEP 2
                      </span>
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white font-mono">Select Response Mode</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Need speed? Choose <strong>Fast [10–15s]</strong> or <strong>Normal [20–30s]</strong>. Building a full app? Switch to <strong>Build [10–20 min]</strong>. Need an easy masterclass? Pick <strong>Ultra Instinct [5 min]</strong>.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Selector:</span>
                    <span className="text-cyan-400 font-bold">Pills above Chat Input</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">
                        STEP 3
                      </span>
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white font-mono">Ask, Speak or Upload</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Type your question, upload a screenshot or image of an equation, or click <strong>VOICE PTT</strong> at the top right to talk directly with the AI!
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Interactions:</span>
                    <span className="text-purple-400 font-bold">Text, Image &amp; Voice</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Interactive Starter Prompts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Try These Instant Examples (Click to Load in Chat)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">1-CLICK EXECUTION</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      title: "🚀 Build a Full-Stack React Weather App",
                      prompt: "Build a complete modern React Weather dashboard with responsive Tailwind CSS, hourly forecast graph, and search filtering.",
                      edition: "codingz" as const,
                      mode: "build" as const,
                      domain: "computer_science" as const,
                      tag: "Build Mode (10–20 min)",
                    },
                    {
                      title: "⚛️ Schrödinger Wave Equation Derivation",
                      prompt: "Derive the time-dependent Schrödinger wave equation for a 1D quantum harmonic oscillator with step-by-step KaTeX math.",
                      edition: "ultra" as const,
                      mode: "ultra_instinct" as const,
                      domain: "quantum" as const,
                      tag: "Ultra Instinct (5 min)",
                    },
                    {
                      title: "🌿 How Photosynthesis Works (Simple & Detailed)",
                      prompt: "Explain how photosynthesis works in plants with a simple everyday factory analogy and light-dependent vs dark reactions.",
                      edition: "basic" as const,
                      mode: "relax" as const,
                      domain: "biology" as const,
                      tag: "Relax Mode (1–2 min)",
                    },
                    {
                      title: "⚡ Quick Formula: Kinetic Energy of 1500kg car at 100km/h",
                      prompt: "Calculate the kinetic energy of a 1500 kg vehicle traveling at 100 km/h in Joules and MegaJoules.",
                      edition: "ultra" as const,
                      mode: "fast" as const,
                      domain: "physics" as const,
                      tag: "Fast Mode (10–15s)",
                    },
                  ].map((ex, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onSwitchEdition) onSwitchEdition(ex.edition);
                        if (onSelectPrompt) onSelectPrompt(ex.prompt, ex.domain, ex.mode);
                        onClose();
                      }}
                      className="p-3 rounded-xl border border-slate-800 bg-[#0E1520] hover:border-cyan-500/50 hover:bg-[#121B2A] transition-all cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 font-mono">
                            {ex.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{ex.prompt}</p>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 inline-block mt-1">
                          {ex.tag}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THREE EDITIONS */}
          {activeTab === "editions" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                {/* 1. Quantum Basic */}
                <div className="p-4 rounded-xl border bg-[#091512] border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-300 font-mono">
                          QUANTUM BASIC EDITION (School &amp; Everyday Science)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Accessible Science, School Curriculum &amp; Intuitive Foundational Knowledge
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onSwitchEdition) onSwitchEdition("basic");
                        onClose();
                      }}
                      className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-all cursor-pointer"
                    >
                      SWITCH TO BASIC
                    </button>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Designed for students, high schoolers, curious minds, and everyday questions.</li>
                    <li>Explains science, biology, chemistry, earth science, space, and math in simple, friendly terms.</li>
                    <li>Avoids intimidating dense academic jargon and focuses on relatable analogies and clean examples.</li>
                  </ul>
                </div>

                {/* 2. Quantum Ultra */}
                <div className="p-4 rounded-xl border bg-[#08151D] border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-cyan-300 font-mono">
                          QUANTUM ULTRA EDITION (Advanced STEM &amp; Supercomputer OS)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Theoretical Physics, Higher Mathematics, Voice HUD &amp; Desktop Bridge
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onSwitchEdition) onSwitchEdition("ultra");
                        onClose();
                      }}
                      className="px-3 py-1 rounded text-xs font-mono font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-all cursor-pointer"
                    >
                      SWITCH TO ULTRA
                    </button>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Advanced calculus, quantum mechanics, Gaussian path integrals, and astrophysics.</li>
                    <li>Real-time KaTeX LaTeX equation parsing, copyable LaTeX notation, and physics step derivations.</li>
                    <li>Integrated Voice HUD Push-to-Talk, Holographic Reactor Core, and ArXiv research citations.</li>
                  </ul>
                </div>

                {/* 3. Codingz */}
                <div className="p-4 rounded-xl border bg-[#0C1518] border-teal-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center font-mono font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-teal-300 font-mono">
                          CODINGZ EDITION (Multi-Language IDE, Compiler &amp; Stuffs)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Full-Stack Web/App Generator, Multi-Language Sandbox &amp; AI Copilot
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onSwitchEdition) onSwitchEdition("codingz");
                        onClose();
                      }}
                      className="px-3 py-1 rounded text-xs font-mono font-bold bg-teal-500 text-black hover:bg-teal-400 transition-all cursor-pointer"
                    >
                      SWITCH TO CODINGZ
                    </button>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Full IDE supporting Python, JavaScript, TypeScript, Rust, C++, HTML/React, and SQL.</li>
                    <li>Live code execution in the scientific sandbox with instant stdout logs and timing metrics.</li>
                    <li>Instant synthesis of production code, algorithms, unit tests, and software architectures.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PACING MODES */}
          {activeTab === "modes" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-3.5 rounded-xl border bg-[#0D141E] border-slate-800 text-xs font-mono text-slate-300">
                Each mode configures the AI's speed, depth, and output structure to match your exact goals:
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Normal Mode",
                    badge: "20–30s",
                    color: "#00F2FF",
                    purpose: "Quick and basic reply within 20 to 30 seconds",
                    description: "Ideal for everyday questions. Gives a clear direct answer under 'Direct Answer:', key definitions, and standard formulas without extra fluff.",
                  },
                  {
                    name: "Build Mode",
                    badge: "10–20 min",
                    color: "#10B981",
                    purpose: "To build real life projects or app or website etc within 10 to 20 minutes",
                    description: "Complete production-ready software systems, web applications, full file structures, schemas, styles, and step-by-step blueprints ready to deploy.",
                  },
                  {
                    name: "Relax Mode",
                    badge: "1–2 min",
                    color: "#EC4899",
                    purpose: "Simple and detailed answer within 1 to 2 minutes",
                    description: "Gentle, comfortable, and thoroughly detailed explanations using intuitive everyday analogies, step-by-step walkthroughs, and zero intimidating jargon.",
                  },
                  {
                    name: "Fast Mode",
                    badge: "10–15s",
                    color: "#EF4444",
                    purpose: "Fastest answers and explanation within 10 to 15 seconds",
                    description: "Ultra-high velocity. States the direct numeric answer and key formulas in the very first sentence with concise bullet points.",
                  },
                  {
                    name: "Ultra Instinct Mode",
                    badge: "5 min",
                    color: "#A855F7",
                    purpose: "Answers in a detailed and easy way to understand within 5 minutes",
                    description: "5-minute masterclass comprehension. Breaks down complex quantum mechanics, relativity, or advanced math into crystal-clear intuitive mental models.",
                  },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border bg-[#0A1017] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ borderColor: `${m.color}33` }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-sm font-bold font-mono text-white">{m.name}</span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border"
                          style={{
                            backgroundColor: `${m.color}20`,
                            borderColor: m.color,
                            color: m.color,
                          }}
                        >
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: m.color }}>
                        {m.purpose}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ALL AI MODELS & ENGINES IN THE PLATFORM */}
          {activeTab === "models" && (
            <div className="space-y-6 animate-fade-in">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
                <span className="text-slate-500 text-[11px] shrink-0 font-bold">CATEGORY:</span>
                {[
                  { id: "all", label: "ALL 19 AI ENGINES" },
                  { id: "frontier", label: "FRONTIER & OMNI" },
                  { id: "math_reasoning", label: "DEEP MATH & PROOFS" },
                  { id: "speed", label: "HIGH SPEED & VOICE" },
                  { id: "platform_engines", label: "PLATFORM AUTONOMOUS CORES" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setModelCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg border font-bold transition-all shrink-0 cursor-pointer ${
                      modelCategoryFilter === cat.id
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                        : "bg-[#0B1017] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Top Highlight: Selected AI Details Inspector (Opens when ANY model is clicked) */}
              {(() => {
                const ALL_AI_CATALOG = [
                  {
                    id: "quantum-prime",
                    name: "QUANTUM Prime",
                    provider: "Quantum AI Labs",
                    category: "frontier",
                    tagline: "The Sovereign All-Rounder AI • Massive 10M Token Horizon & Ultra-Fast Synthesis",
                    color: "#00F2FF",
                    contextWindow: "10,000,000 Tokens (Exclusive Horizon)",
                    maxOutputTokens: "262,144 Tokens",
                    latency: "55 ms",
                    throughput: "350 tok/sec",
                    architecture: "Hyper-Dimensional Quantum Synaptic Matrix (Dual Photonic Resonance)",
                    overview:
                      "The default sovereign powerhouse AI engineered to excel universally across every STEM discipline, full-stack software development, live Voice HUD, and complex quantum mechanics with zero latency.",
                    primaryUses: [
                      "Universal All-Rounder: Solving complex STEM problems, university-level physics, calculus derivations, and chemistry reactions.",
                      "Massive Multi-File & Repository Synthesis: Exploring entire software architectures or massive research papers with 10M token memory.",
                      "Step-by-Step KaTeX LaTeX Math: Generates beautiful, formal mathematical proofs with zero-latency equation rendering.",
                      "Hands-Free Voice HUD Orchestration: Speaks crisp direct answers in real-time without buffering.",
                      "Production Application Synthesis: Building full web applications, backends, and databases in Build Mode (10–20 min).",
                    ],
                    whenToUse:
                      "Use QUANTUM Prime as your default daily driver for all general-purpose tasks, massive projects, voice interaction, and multi-disciplinary science.",
                    samplePrompts: [
                      "Derive the relativistic kinetic energy equation starting from the work-energy theorem with KaTeX steps.",
                      "Generate a complete full-stack real-time analytics dashboard with React, Tailwind, and WebSockets.",
                      "Explain quantum entanglement and Bell's inequality with step-by-step mathematical formalism.",
                    ],
                  },
                  {
                    id: "gemini-3.7-flash",
                    name: "Gemini 3.7 Flash",
                    provider: "Google DeepMind",
                    category: "frontier",
                    tagline: "Hybrid Multimodal Reasoning & High-Speed Vector Calculus",
                    color: "#38BDF8",
                    contextWindow: "2,000,000 Tokens",
                    maxOutputTokens: "65,536 Tokens",
                    latency: "120 ms",
                    throughput: "210 tok/sec",
                    architecture: "Native Multimodal Sparse-Dense MoE (Google TPU v6 Pods)",
                    overview:
                      "Google DeepMind's flagship frontier model combining breakthrough inference speed with deep multimodal reasoning, vector calculus, and seamless code synthesis.",
                    primaryUses: [
                      "Multimodal Visual Analysis: Interpreting circuit diagrams, spectrograms, histology slides, and complex engineering schematics.",
                      "Tensor & Matrix Calculus: Multi-variable differentials, gradient tensors, and coordinate transformations.",
                      "ArXiv Research Cross-Referencing: Ingesting multiple dense scientific papers simultaneously.",
                      "High-Speed Scientific Q&A: Sub-second accurate answers with structured markdown explanations.",
                    ],
                    whenToUse:
                      "Select Gemini 3.7 Flash when you have visual data, diagrams, large multi-document contexts, or need fast multimodal problem solving.",
                    samplePrompts: [
                      "Calculate the metric tensor and Christoffel symbols for the Schwarzschild spacetime metric.",
                      "Analyze how CRISPR-Cas9 performs targeted genomic double-strand breaks at the molecular level.",
                    ],
                  },
                  {
                    id: "gemini-3.5-flash",
                    name: "Gemini 3.5 Flash",
                    provider: "Google DeepMind",
                    category: "speed",
                    tagline: "Sub-100ms Ultra-Low Latency & High-Throughput Streaming",
                    color: "#0EA5E9",
                    contextWindow: "1,000,000 Tokens",
                    maxOutputTokens: "32,768 Tokens",
                    latency: "75 ms",
                    throughput: "280 tok/sec",
                    architecture: "Compact MoE Latent Distillation (TPU Trillium)",
                    overview:
                      "Ultra-lightweight and lightning-fast inference engine tailored for real-time conversational streaming, instant unit conversions, and rapid validation.",
                    primaryUses: [
                      "Instant Formula Validation: Rapid sanity checks on arithmetic, physical constants, and algebra.",
                      "High-Velocity Voice HUD: Zero-lag voice conversations and immediate speech-to-text response.",
                      "Unit Transformations & Dimensional Analysis: Converting between metric, imperial, Planck, and atomic units.",
                      "Code Syntax & Bug Checking: Instant linting and quick syntax fix suggestions.",
                    ],
                    whenToUse:
                      "Choose Gemini 3.5 Flash when you need maximum speed, sub-100ms responses, or rapid-fire voice interaction.",
                    samplePrompts: [
                      "Convert 450 horsepower to kilowatts, BTU/hr, and Joules per second with exact calculations.",
                      "Quick check: What is the escape velocity of Mars in km/s and mph?",
                    ],
                  },
                  {
                    id: "claude-3.7-sonnet",
                    name: "Claude 3.7 Sonnet",
                    provider: "Anthropic",
                    category: "frontier",
                    tagline: "Hybrid Thinking & Architectural Code Synthesis",
                    color: "#F97316",
                    contextWindow: "200,000 Tokens",
                    maxOutputTokens: "64,000 Tokens",
                    latency: "210 ms",
                    throughput: "135 tok/sec",
                    architecture: "Constitutional Transformer + Dynamic Extended Thinking Loop",
                    overview:
                      "Anthropic's pinnacle hybrid thinking model, excelling in nuanced mathematical deductions, elegant software design patterns, and clean code refactoring.",
                    primaryUses: [
                      "Software Architecture & Full-Stack Refactoring: Designing clean modular codebases, design patterns, and idiomatic TypeScript.",
                      "Nuanced Theoretical Proofs: Step-by-step axiomatic deduction with clear linguistic and mathematical explanations.",
                      "Algorithm Complexity Optimization: Converting brute force algorithms into O(N log N) or dynamic programming solutions.",
                      "Deep Philosophical & STEM Analysis: Exploring the ethical, theoretical, and practical implications of scientific breakthroughs.",
                    ],
                    whenToUse:
                      "Select Claude 3.7 Sonnet when building complex software systems, writing publication-quality explanations, or solving subtle mathematical puzzles.",
                    samplePrompts: [
                      "Design a distributed event-driven microservices architecture for handling 50,000 IoT sensor streams per second.",
                      "Prove that the square root of 2 is irrational using proof by contradiction with formal step-by-step logic.",
                    ],
                  },
                  {
                    id: "claude-3.5-haiku",
                    name: "Claude 3.5 Haiku",
                    provider: "Anthropic",
                    category: "speed",
                    tagline: "Compact High-Velocity Code & Data Extraction",
                    color: "#FB923C",
                    contextWindow: "200,000 Tokens",
                    maxOutputTokens: "8,192 Tokens",
                    latency: "85 ms",
                    throughput: "260 tok/sec",
                    architecture: "Distilled Constitutional Transformer",
                    overview:
                      "Blazing-fast reasoning engine combining Anthropic's safety and precision with rapid token generation for scripts, utilities, and quick queries.",
                    primaryUses: [
                      "Rapid Code Snippet Generation: Generating regex, SQL queries, utility functions, and shell scripts.",
                      "Text Parsing & Structured Extraction: Extracting JSON, tables, and key parameters from unstructured notes.",
                      "Quick Homework Verification: Verifying calculus derivatives and algebra steps instantly.",
                    ],
                    whenToUse:
                      "Use Claude 3.5 Haiku for quick coding scripts, fast answers, and streamlined data extraction.",
                    samplePrompts: [
                      "Write a Python script using pandas to parse a CSV of temperature readings and plot a 7-day rolling average.",
                      "Generate a regular expression to match valid ISO 8601 timestamps with optional milliseconds.",
                    ],
                  },
                  {
                    id: "deepseek-r1",
                    name: "DeepSeek R1",
                    provider: "DeepSeek",
                    category: "math_reasoning",
                    tagline: "Open-Weights Reinforcement Reasoning & Chain-of-Thought Proofs",
                    color: "#3B82F6",
                    contextWindow: "128,000 Tokens",
                    maxOutputTokens: "32,768 Tokens",
                    latency: "340 ms",
                    throughput: "95 tok/sec",
                    architecture: "Large-Scale Reinforcement Learning (DeepSeek-R1-Zero Base)",
                    overview:
                      "State-of-the-art pure reinforcement reasoning model, renowned for exhaustive mathematical chain-of-thought derivations, competitive programming, and theorem verification.",
                    primaryUses: [
                      "Competitive Mathematics (AIME / IMO): Solving high-difficulty combinatorial, algebraic, and number theory problems.",
                      "Exhaustive Chain-of-Thought: Self-reflective reasoning that checks every step for logical consistency.",
                      "Theorem Proving & Boundary Verification: Verifying mathematical bounds, inequalities, and topological spaces.",
                      "Complex Logic & Puzzles: Multi-stage logical deduction where every intermediate premise is validated.",
                    ],
                    whenToUse:
                      "Choose DeepSeek R1 for hardcore math competitions, Olympiad homework, formal proofs, and complex algorithmic reasoning.",
                    samplePrompts: [
                      "Find all positive integer solutions (x, y, z) to 3^x + 4^y = 5^z with complete step-by-step proof.",
                      "Evaluate the improper integral integral from 0 to infinity of (ln x)^2 / (1 + x^2) dx using contour integration.",
                    ],
                  },
                  {
                    id: "deepseek-v3",
                    name: "DeepSeek V3",
                    provider: "DeepSeek",
                    category: "frontier",
                    tagline: "Multi-Head Latent Attention & High-Efficiency Polymath",
                    color: "#60A5FA",
                    contextWindow: "128,000 Tokens",
                    maxOutputTokens: "16,384 Tokens",
                    latency: "140 ms",
                    throughput: "190 tok/sec",
                    architecture: "671B Parameter MoE with Multi-Head Latent Attention (MLA)",
                    overview:
                      "Efficient frontier MoE model delivering outstanding general knowledge, multilingual STEM proficiency, and polymathic problem solving.",
                    primaryUses: [
                      "General STEM Computations: Engineering mechanics, thermodynamic cycles, and circuit simulations.",
                      "Multilingual Technical Translation: Translating scientific papers and code comments across languages.",
                      "Code Refactoring & Scripting: Polyglot development across C++, Python, Rust, and Go.",
                    ],
                    whenToUse:
                      "Great for high-efficiency code generation, engineering calculations, and polyglot STEM explanations.",
                    samplePrompts: [
                      "Explain how the Carnot cycle maximizes thermodynamic efficiency and calculate work output for given temperatures.",
                    ],
                  },
                  {
                    id: "gpt-5.6-luna",
                    name: "GPT 5.6 Luna",
                    provider: "OpenAI",
                    category: "math_reasoning",
                    tagline: "Frontier Cognitive Reasoning & Autonomous Math Proofs",
                    color: "#10B981",
                    contextWindow: "1,500,000 Tokens",
                    maxOutputTokens: "65,536 Tokens",
                    latency: "190 ms",
                    throughput: "145 tok/sec",
                    architecture: "Neuromorphic Latent Transformer + Q* Search Graph",
                    overview:
                      "OpenAI's pinnacle reasoning system featuring autonomous theorem proving, self-verifying algorithmic chains, and high-order dimensional calculus solvers.",
                    primaryUses: [
                      "Autonomous Mathematical Proofs: Formalizing conjectures, differential geometry, and real analysis proofs.",
                      "Non-Linear Dynamics & Chaos Theory: Phase portraits, Lyapunov exponents, and strange attractors.",
                      "Quantum State Vector Transformations: Density matrices, unitary time evolution, and quantum gate operations.",
                      "Recursive Algorithmic Verification: Verifying correctness and invariance in mission-critical software systems.",
                    ],
                    whenToUse:
                      "Choose GPT 5.6 Luna for doctoral-level research, rigorous mathematical proof construction, and non-linear physical systems.",
                    samplePrompts: [
                      "Derive the Navier-Stokes equations from conservation of momentum and mass for an incompressible Newtonian fluid.",
                    ],
                  },
                  {
                    id: "gpt-5-omni",
                    name: "GPT 5 Omni",
                    provider: "OpenAI",
                    category: "frontier",
                    tagline: "Native Omni-Modality • Vision, Code & Real-Time Voice Synthesis",
                    color: "#059669",
                    contextWindow: "1,000,000 Tokens",
                    maxOutputTokens: "32,768 Tokens",
                    latency: "110 ms",
                    throughput: "230 tok/sec",
                    architecture: "End-to-End Multimodal Transformer Architecture",
                    overview:
                      "Universal multimodal intelligence unifying text, images, video frames, audio waveforms, and code into a single unified latent representation.",
                    primaryUses: [
                      "Visual STEM Problem Solving: Reading handwriting, blackboard math notes, and lab apparatus photos.",
                      "Natural Voice Interaction: Fluid conversational cadence with lifelike emotion and inflection.",
                      "Interactive Science Tutoring: Explaining complex concepts adaptively based on user responses.",
                      "Full-Stack Web Development: Generating frontend interfaces, styling, and server endpoints.",
                    ],
                    whenToUse:
                      "Use GPT 5 Omni for multimodal queries, visual diagrams, interactive audio conversations, and general tutoring.",
                    samplePrompts: [
                      "Create an interactive HTML5 canvas simulation of planetary orbital mechanics with gravity vectors.",
                    ],
                  },
                  {
                    id: "gpt-4.5",
                    name: "GPT-4.5 Orion",
                    provider: "OpenAI",
                    category: "frontier",
                    tagline: "Broad World Knowledge & Creative Precision",
                    color: "#34D399",
                    contextWindow: "128,000 Tokens",
                    maxOutputTokens: "16,384 Tokens",
                    latency: "180 ms",
                    throughput: "160 tok/sec",
                    architecture: "Massive Dense Transformer",
                    overview:
                      "OpenAI's largest dense knowledge model, renowned for unmatched world knowledge breadth, nuanced prose, and empathetic conversational guidance.",
                    primaryUses: [
                      "Interdisciplinary Science & History: Tracing the historical discovery of quantum mechanics and relativity.",
                      "Deep Literature & Technical Writing: Drafting research proposals, technical whitepapers, and curriculum syllabi.",
                      "Broad Conceptual Understanding: Explaining complex physics with rich historical context and deep intuition.",
                    ],
                    whenToUse:
                      "Select GPT-4.5 for deep interdisciplinary topics, essay writing, history of science, and rich conceptual explanations.",
                    samplePrompts: [
                      "Write a comprehensive conceptual overview of how the Higgs field generates mass for fundamental particles.",
                    ],
                  },
                  {
                    id: "grok-3-ultra",
                    name: "Grok-3 Ultra",
                    provider: "xAI",
                    category: "frontier",
                    tagline: "Colossus Supercomputer Compute • Unfiltered Physics & Astrophysics",
                    color: "#E11D48",
                    contextWindow: "1,000,000 Tokens",
                    maxOutputTokens: "32,768 Tokens",
                    latency: "130 ms",
                    throughput: "205 tok/sec",
                    architecture: "Dense MoE trained on 100k H100 Colossus Cluster",
                    overview:
                      "Trained on the world's largest supercomputing cluster, Grok-3 Ultra delivers relentless scientific curiosity, orbital mechanics calculations, and rocket propulsion physics.",
                    primaryUses: [
                      "Aerospace & Rocket Propulsion: Tsiolkovsky rocket equation, specific impulse, nozzle expansion, and delta-v budgets.",
                      "Astrophysics & Cosmology: Dark matter halos, cosmic microwave background radiation, and stellar nucleosynthesis.",
                      "Unfiltered Direct Answers: Honest, mathematically direct answers without sugarcoating.",
                    ],
                    whenToUse:
                      "Use Grok-3 Ultra for rocket propulsion, orbital mechanics, cosmic physics, and no-nonsense engineering queries.",
                    samplePrompts: [
                      "Calculate the delta-v budget required for a Hohmann transfer from Low Earth Orbit (LEO) to Geostationary Orbit (GEO).",
                    ],
                  },
                  {
                    id: "llama-3.3-70b",
                    name: "Llama 3.3 70B",
                    provider: "Meta AI",
                    category: "frontier",
                    tagline: "Open-Source Sovereign Research & Algorithmic Excellence",
                    color: "#8B5CF6",
                    contextWindow: "128,000 Tokens",
                    maxOutputTokens: "8,192 Tokens",
                    latency: "115 ms",
                    throughput: "220 tok/sec",
                    architecture: "Dense Autoregressive Transformer with Grouped Query Attention (GQA)",
                    overview:
                      "Meta's flagship open-weights model, delivering robust computer science fundamentals, data structures, and transparent research analysis.",
                    primaryUses: [
                      "Computer Science Fundamentals: Graph algorithms, sorting networks, tree traversals, and dynamic programming.",
                      "Open Science & Reproducibility: Formulating open methodologies and verifiable benchmark comparisons.",
                      "Data Pipelines & Machine Learning: Designing PyTorch neural networks, loss functions, and backpropagation steps.",
                    ],
                    whenToUse:
                      "Use Llama 3.3 70B for computer science algorithms, open science questions, and machine learning pipeline design.",
                    samplePrompts: [
                      "Implement Dijkstra's shortest path algorithm in Python using a min-heap with time complexity analysis.",
                    ],
                  },
                  {
                    id: "mistral-large-2",
                    name: "Mistral Large 2",
                    provider: "Mistral AI",
                    category: "frontier",
                    tagline: "European Polyglot Frontier & Precision Code Synthesis",
                    color: "#EC4899",
                    contextWindow: "128,000 Tokens",
                    maxOutputTokens: "16,384 Tokens",
                    latency: "150 ms",
                    throughput: "175 tok/sec",
                    architecture: "123B Parameter Dense Polyglot Matrix",
                    overview:
                      "Engineered in Europe for high reasoning accuracy, native multilingual proficiency across dozens of languages, and robust software engineering.",
                    primaryUses: [
                      "Multilingual STEM Education: Explaining physics and math in French, German, Spanish, and English.",
                      "API Design & Backend Services: Writing idiomatic REST and GraphQL APIs with OpenAPI specifications.",
                      "Mathematical Logic & Precision: Step-by-step calculus proofs with strict logical consistency.",
                    ],
                    whenToUse:
                      "Choose Mistral Large 2 for multilingual technical documentation, European language STEM queries, and API design.",
                    samplePrompts: [
                      "Explain the Maxwell-Boltzmann distribution of molecular speeds and derive the root-mean-square velocity.",
                    ],
                  },
                  {
                    id: "qwen-2.5-max",
                    name: "Qwen 2.5 Max",
                    provider: "Alibaba Cloud",
                    category: "math_reasoning",
                    tagline: "Ultra-High Math Olympiad & Synthetic STEM Engine",
                    color: "#F59E0B",
                    contextWindow: "128,000 Tokens",
                    maxOutputTokens: "16,384 Tokens",
                    latency: "160 ms",
                    throughput: "165 tok/sec",
                    architecture: "Dense High-Capacity MoE with Positional Rotary Embeddings",
                    overview:
                      "Top-tier mathematical performer across global benchmarks, excelling in Olympiad-grade algebra, synthetic geometry, and matrix algebra.",
                    primaryUses: [
                      "Olympiad Algebra & Geometry: Solving high-level polynomial systems, Euclidean proofs, and matrix diagonalization.",
                      "Chemical Reaction Engineering: Stoichiometry, equilibrium constants (Kc, Kp), and Gibbs free energy calculations.",
                      "Synthetic STEM Problem Solving: Generating customized practice problems with complete solution keys.",
                    ],
                    whenToUse:
                      "Select Qwen 2.5 Max for chemistry thermodynamics, high-difficulty algebra problems, and synthetic math challenges.",
                    samplePrompts: [
                      "Calculate the equilibrium composition and Gibbs free energy change for the Haber-Bosch ammonia synthesis at 450°C and 200 atm.",
                    ],
                  },
                  {
                    id: "quantum-basic-core",
                    name: "Quantum Basic Science AI Tutor",
                    provider: "Quantum AI Labs (Basic Edition)",
                    category: "platform_engines",
                    tagline: "Intuitive School Science, Everyday Curriculums & Friendly Analogies",
                    color: "#10B981",
                    contextWindow: "1,000,000 Tokens",
                    maxOutputTokens: "16,384 Tokens",
                    latency: "60 ms",
                    throughput: "300 tok/sec",
                    architecture: "Simplified Pedagogical Neural Adapter",
                    overview:
                      "Specialized foundational science engine designed for students, high schoolers, and beginners. Strips away intimidating jargon and delivers crystal-clear everyday analogies.",
                    primaryUses: [
                      "School Homework & Test Prep: Step-by-step help with physics, chemistry, biology, earth science, and algebra.",
                      "Everyday Real-World Analogies: Explains complex concepts (e.g. electricity as flowing water pipes, cells as cities).",
                      "Friendly Non-Intimidating Guidance: Zero academic gatekeeping; focuses on curiosity, fun experiments, and easy retention.",
                      "Instant Concept Summaries: Generates quick revision flashcards and memory tricks.",
                    ],
                    whenToUse:
                      "Click to switch to Quantum Basic Edition whenever you want friendly, accessible, student-friendly science without dense math jargon.",
                    samplePrompts: [
                      "How do plants turn sunlight into food? Explain like I am 12 years old with a fun kitchen analogy.",
                      "Why is the sky blue during the day and red during sunset?",
                    ],
                  },
                  {
                    id: "codingz-copilot-engine",
                    name: "Codingz AI Copilot & Compiler Engine",
                    provider: "Quantum AI Labs (Codingz Edition)",
                    category: "platform_engines",
                    tagline: "Full-Stack Web/App Generator, Multi-Language Compiler & Live Sandbox",
                    color: "#14B8A6",
                    contextWindow: "2,000,000 Tokens",
                    maxOutputTokens: "65,536 Tokens",
                    latency: "70 ms",
                    throughput: "320 tok/sec",
                    architecture: "Multi-Language Syntax Tree Transformer + Scientific Sandbox Runtime",
                    overview:
                      "Autonomous software engineering engine powering the Codingz Edition. Writes production code in Python, JS/TS, Rust, C++, and React, and executes scripts directly inside the live sandbox.",
                    primaryUses: [
                      "Full-Stack Web & App Generation: Creates production React apps, Tailwind styling, state stores, and APIs.",
                      "Live Scientific Code Execution: Runs Python scripts with NumPy, SciPy, and matplotlib in real time.",
                      "Automated Compiler Diagnostics: Diagnoses runtime errors, stack traces, and type errors instantly.",
                      "Algorithm Benchmarking: Measures execution time, memory usage, and Big-O efficiency curves.",
                    ],
                    whenToUse:
                      "Switch to Codingz Edition when you want to write, edit, run, and compile code across 7+ programming languages in an interactive IDE.",
                    samplePrompts: [
                      "Build a 3D solar system gravitational simulation using Three.js and HTML5 Canvas.",
                      "Write a Python script to compute Mandelbrot set fractals and output ASCII visualization.",
                    ],
                  },
                  {
                    id: "quantum-voice-engine",
                    name: "Quantum Neural Voice & Audio Engine",
                    provider: "Quantum AI Labs",
                    category: "platform_engines",
                    tagline: "Hands-Free Voice HUD, Real-Time Speech-to-Text & Neural Audio Readout",
                    color: "#EF4444",
                    contextWindow: "Real-Time Audio Stream",
                    maxOutputTokens: "Vocal Synthesis",
                    latency: "40 ms",
                    throughput: "Live Audio",
                    architecture: "Web Speech Neural Audio Pipeline + Acoustic Feedback Isolator",
                    overview:
                      "Autonomous voice intelligence system powering the top-right Voice PTT and Chat HUD. Enables hands-free spoken queries and delivers natural speech readout.",
                    primaryUses: [
                      "Hands-Free Push-to-Talk (PTT): Click the mic button or press spacebar to speak queries naturally.",
                      "Continuous Listening: Keep the microphone open for fluid, conversational dialogue with the AI.",
                      "LaTeX-Aware Vocal Synthesis: Cleans up complex math symbols into natural spoken English (e.g. 'hbar' -> 'Planck constant over 2 pi').",
                      "Acoustic Feedback Protection: Mutes recognition while speaking to prevent audio feedback loops.",
                    ],
                    whenToUse:
                      "Use whenever your hands are busy, during laboratory experiments, or when you prefer auditory learning.",
                    samplePrompts: [
                      "Click VOICE PTT and ask: 'Quantum, what is the speed of light in vacuum?'",
                    ],
                  },
                  {
                    id: "desmos-math-engine",
                    name: "Desmos Graphing & Calculus Engine",
                    provider: "Desmos / Quantum Core",
                    category: "platform_engines",
                    tagline: "2D/3D Parametric Graphing, Coordinate Geometry & Symbolic Calculus",
                    color: "#8B5CF6",
                    contextWindow: "Parametric Equations",
                    maxOutputTokens: "Interactive Canvas",
                    latency: "16 ms (60 FPS)",
                    throughput: "Hardware Accelerated",
                    architecture: "WebGL 2.0 Coordinate Engine & KaTeX Equation Parser",
                    overview:
                      "Interactive mathematical graphing engine for plotting functions, parametric curves, polar plots, and trigonometric equations in real time.",
                    primaryUses: [
                      "Function Plotting: Plotting polynomials, exponentials, logarithms, and periodic functions.",
                      "Interactive Sliders: Dynamically adjusting parameters (e.g. amplitude, frequency, phase shift).",
                      "Polar & Parametric Coordinates: Plotting cardioids, lemniscates, and Lissajous curves.",
                      "Calculus Tangents & Integrals: Visualizing derivatives, tangent slopes, and definite integral areas.",
                    ],
                    whenToUse:
                      "Open from the Tools tab or Engineering Calculator when you need visual geometric intuition and graph curves.",
                    samplePrompts: [
                      "Plot f(x) = sin(x) * exp(-0.1*x) and visualize the damped oscillation envelope.",
                    ],
                  },
                  {
                    id: "manual-assistant-ai",
                    name: "AI Doubt Clarifier & Text Summarizer",
                    provider: "Quantum AI Labs",
                    category: "platform_engines",
                    tagline: "Platform Guide, 1-Click Text Simplifier & Doubt Clarification AI",
                    color: "#10B981",
                    contextWindow: "1,000,000 Tokens",
                    maxOutputTokens: "16,384 Tokens",
                    latency: "80 ms",
                    throughput: "250 tok/sec",
                    architecture: "Context-Grounded Platform Assistant",
                    overview:
                      "Embedded AI helper directly inside this User Manual. Answers any question about using the website, explains buttons and features, and summarizes long text into concise action items.",
                    primaryUses: [
                      "Platform Guidance: Explains every button, pacing mode, edition, and feature of the Quantum platform.",
                      "Doubt Clarification: Resolves user confusion about formulas, scientific terms, or navigation.",
                      "Instant Text Summarizer: Condenses entire user manuals, homework problems, or research into 3 bullet points, 1-line TL;DR, or ELI5 analogies.",
                      "1-Click Action Plans: Turns complex instructions into clean step-by-step checklists.",
                    ],
                    whenToUse:
                      "Use right now in the 'AI Doubt Clarifier' sub-tab whenever you have questions about how to use the app or need quick text summaries.",
                    samplePrompts: [
                      "How do I use Build Mode to create an app?",
                      "Summarize the differences between the 5 pacing modes.",
                    ],
                  },
                ];

                const filteredCatalog = ALL_AI_CATALOG.filter((m) => {
                  if (modelCategoryFilter === "all") return true;
                  return m.category === modelCategoryFilter;
                });

                const activeSelectedAI =
                  ALL_AI_CATALOG.find((m) => m.id === selectedAIKey) || ALL_AI_CATALOG[0];

                return (
                  <div className="space-y-4">
                    {/* Active Selected AI Detailed Inspector Card */}
                    <div
                      className="p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 shadow-2xl"
                      style={{
                        backgroundColor: "#090E16",
                        borderColor: activeSelectedAI.color,
                        boxShadow: `0 0 30px ${activeSelectedAI.color}25`,
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border"
                              style={{
                                backgroundColor: `${activeSelectedAI.color}20`,
                                borderColor: activeSelectedAI.color,
                                color: activeSelectedAI.color,
                              }}
                            >
                              SELECTED AI ENGINE
                            </span>
                            <span className="text-xs font-mono text-slate-400 font-bold">
                              {activeSelectedAI.provider}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {activeSelectedAI.architecture.split("(")[0]}
                            </span>
                          </div>

                          <h3
                            className="text-lg sm:text-xl font-bold font-mono tracking-tight"
                            style={{ color: activeSelectedAI.color }}
                          >
                            {activeSelectedAI.name}
                          </h3>

                          <p className="text-xs font-semibold text-slate-200">
                            {activeSelectedAI.tagline}
                          </p>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {activeSelectedAI.overview}
                          </p>

                          {/* Technical Telemetry Badges */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                            <div className="p-2 rounded-lg bg-black/50 border border-slate-800">
                              <span className="text-slate-500 block text-[9px]">CONTEXT HORIZON</span>
                              <span className="font-bold text-cyan-300">{activeSelectedAI.contextWindow}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/50 border border-slate-800">
                              <span className="text-slate-500 block text-[9px]">OUTPUT BUDGET</span>
                              <span className="font-bold text-slate-200">{activeSelectedAI.maxOutputTokens}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/50 border border-slate-800">
                              <span className="text-slate-500 block text-[9px]">LATENCY</span>
                              <span className="font-bold text-emerald-400">{activeSelectedAI.latency}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/50 border border-slate-800">
                              <span className="text-slate-500 block text-[9px]">SPEED</span>
                              <span className="font-bold text-purple-300">{activeSelectedAI.throughput}</span>
                            </div>
                          </div>

                          {/* Primary Uses Section (Requested by user) */}
                          <div className="pt-3 space-y-2">
                            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                              <Zap className="w-3.5 h-3.5" style={{ color: activeSelectedAI.color }} />
                              <span>Primary Uses &amp; Best Applications:</span>
                            </h4>
                            <div className="space-y-1.5 text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-slate-800">
                              {activeSelectedAI.primaryUses.map((use, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                    style={{ color: activeSelectedAI.color }}
                                  />
                                  <span>{use}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* When to Use Guidance */}
                          <div className="p-2.5 rounded-lg border border-slate-800 bg-[#070B10] text-xs">
                            <span className="text-slate-400 font-mono text-[10px] font-bold block uppercase text-cyan-400">
                              💡 PRO-TIP / WHEN TO CHOOSE THIS AI:
                            </span>
                            <p className="text-slate-300 text-xs mt-0.5">{activeSelectedAI.whenToUse}</p>
                          </div>

                          {/* Sample Practice Prompts */}
                          <div className="pt-2 space-y-2">
                            <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                              1-Click Practice Queries with {activeSelectedAI.name}:
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {activeSelectedAI.samplePrompts.map((promptText, pIdx) => (
                                <button
                                  key={pIdx}
                                  onClick={() => {
                                    if (activeSelectedAI.id === "quantum-basic-core" && onSwitchEdition) {
                                      onSwitchEdition("basic");
                                    } else if (activeSelectedAI.id === "codingz-copilot-engine" && onSwitchEdition) {
                                      onSwitchEdition("codingz");
                                    } else if (onSelectModel) {
                                      onSelectModel(activeSelectedAI.id);
                                    }
                                    if (onSelectPrompt) {
                                      onSelectPrompt(promptText);
                                    }
                                    onClose();
                                  }}
                                  className="text-left p-2.5 rounded-lg border border-slate-800 bg-[#0E1520] hover:border-cyan-500/50 hover:bg-[#121B2A] transition-all flex items-center justify-between gap-2 text-xs font-mono text-slate-300 group cursor-pointer"
                                >
                                  <span className="line-clamp-1">{promptText}</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Quick Action Sidebar */}
                        <div className="shrink-0 flex flex-col gap-2 w-full md:w-52">
                          <button
                            onClick={() => {
                              if (activeSelectedAI.id === "quantum-basic-core" && onSwitchEdition) {
                                onSwitchEdition("basic");
                              } else if (activeSelectedAI.id === "codingz-copilot-engine" && onSwitchEdition) {
                                onSwitchEdition("codingz");
                              } else if (onSelectModel) {
                                onSelectModel(activeSelectedAI.id);
                              }
                              onClose();
                            }}
                            className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold text-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
                            style={{
                              backgroundColor: activeSelectedAI.color,
                              boxShadow: `0 0 20px ${activeSelectedAI.color}40`,
                            }}
                          >
                            <Bot className="w-4 h-4 text-black" />
                            <span>USE THIS AI NOW</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab("assistant");
                              setDoubtInput(`How do I best use ${activeSelectedAI.name} in this platform?`);
                            }}
                            className="w-full py-2 px-3 rounded-xl font-mono text-[11px] font-bold border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Ask Doubt about {activeSelectedAI.name.split(" ")[0]}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Grid: Click on ANY AI Card below to inspect its detailed uses */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <span>Click Any AI Below to View Details &amp; Uses:</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({filteredCatalog.length} available)
                          </span>
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-400">
                          👆 Click card to inspect
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredCatalog.map((ai) => {
                          const isSelected = selectedAIKey === ai.id;
                          return (
                            <div
                              key={ai.id}
                              onClick={() => setSelectedAIKey(ai.id)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-2.5 ${
                                isSelected
                                  ? "bg-[#101824] border-cyan-400 shadow-lg"
                                  : "bg-[#0A0E15] border-slate-800/80 hover:border-slate-700 hover:bg-[#0D131D]"
                              }`}
                              style={{
                                borderColor: isSelected ? ai.color : undefined,
                                boxShadow: isSelected ? `0 0 15px ${ai.color}33` : undefined,
                              }}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-1">
                                  <span
                                    className="text-xs font-mono font-bold group-hover:text-white transition-colors"
                                    style={{ color: isSelected ? ai.color : "#E2E8F0" }}
                                  >
                                    {ai.name}
                                  </span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                    {ai.provider.split(" ")[0]}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {ai.tagline}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono">
                                <span className="text-slate-500">{ai.contextWindow.split(" ")[0]} ctx</span>
                                <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                                  {isSelected ? "VIEWING USES ✓" : "CLICK TO VIEW USES →"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: VOICE HUD */}
          {activeTab === "voice" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      Hands-Free Voice HUD &amp; Push-To-Talk (PTT)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Interact with Quantum via natural voice commands without typing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-[#0A1017] border-slate-800 space-y-2">
                  <h5 className="text-xs font-mono font-bold text-cyan-400">1. PTT Push-to-Talk</h5>
                  <p className="text-xs text-slate-400">
                    Click the <strong>VOICE PTT</strong> button at the top right header (or inside the Chat HUD). Speak your command, then click again to stop and submit.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-[#0A1017] border-slate-800 space-y-2">
                  <h5 className="text-xs font-mono font-bold text-emerald-400">2. Continuous Listening</h5>
                  <p className="text-xs text-slate-400">
                    Toggle on <strong>Continuous Listening</strong> in the Chat HUD bar to have the AI continuously listen and respond when you finish speaking.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-[#0A1017] border-slate-800 space-y-2">
                  <h5 className="text-xs font-mono font-bold text-pink-400">3. Auto-Speak Readout</h5>
                  <p className="text-xs text-slate-400">
                    Enable <strong>Auto-Speak Response</strong> to have the neural voice synthesize and read the assistant's calculation aloud automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TOOLS & DESMOS */}
          {activeTab === "tools" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-sm font-bold font-mono text-white">Engineering &amp; Desmos Grapher</h5>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Interactive 2D &amp; 3D scientific graphing calculator. Plot functions, parametric curves, wavefunctions, and evaluate definite integrals with real-time sliders.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h5 className="text-sm font-bold font-mono text-white">Python Sci-Kernel &amp; Sandbox</h5>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Execute Python and JavaScript scientific models in a live execution sandbox. Evaluates NumPy matrices, SymPy symbolic math, and returns stdout logs.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <h5 className="text-sm font-bold font-mono text-white">KaTeX LaTeX Math Rendering</h5>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every equation generated by Quantum is rendered with mathematical precision in KaTeX. Click the copy icon on any formula to copy clean LaTeX code to your clipboard.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-[#0D141E] border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <h5 className="text-sm font-bold font-mono text-white">Desktop Software Bridge</h5>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simulated desktop integration with local file systems, terminal diagnostics, active processes, and background computing telemetry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI DOUBT CLARIFIER & MANUAL SUMMARIZER */}
          {activeTab === "assistant" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Box */}
              <div
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.06)",
                  borderColor: "rgba(16, 185, 129, 0.4)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                      <Bot className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold font-mono text-white">
                        MANUAL AI ASSISTANT: DOUBT CLARIFIER &amp; SUMMARIZER
                      </h3>
                      <p className="text-xs text-slate-300">
                        Got a doubt about using the AI or want to summarize any part of the site or your own notes? Ask below!
                      </p>
                    </div>
                  </div>

                  {/* Sub-Tabs: Doubt Clarifier vs Text Summarizer */}
                  <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-emerald-500/30 text-xs font-mono">
                    <button
                      onClick={() => setAssistantSubTab("doubt")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        assistantSubTab === "doubt"
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Doubt Clarifier
                    </button>
                    <button
                      onClick={() => setAssistantSubTab("summarize")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        assistantSubTab === "summarize"
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Summarizer
                    </button>
                  </div>
                </div>
              </div>

              {/* SUB-TAB 1: DOUBT CLARIFIER */}
              {assistantSubTab === "doubt" && (
                <div className="space-y-4">
                  {/* Quick Clickable Doubts */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Popular Questions &amp; Doubts (Click to Ask):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickDoubtQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDoubtInput(q);
                            handleAskDoubt(q);
                          }}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-slate-800 bg-[#0E1622] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskDoubt();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={doubtInput}
                      onChange={(e) => setDoubtInput(e.target.value)}
                      placeholder="Type your question or doubt (e.g., 'How do I generate a React app in Codingz?')..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0B1118] text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isDoubtLoading || !doubtInput.trim()}
                      className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      {isDoubtLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>CLARIFY DOUBT</span>
                    </button>
                  </form>

                  {/* AI Response Output Card */}
                  {doubtResponse && (
                    <div className="p-4 rounded-xl border border-emerald-500/40 bg-[#091512] space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-emerald-300">
                            QUANTUM GUIDE EXPLANATION
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(doubtResponse, "doubt")}
                          className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-emerald-300 cursor-pointer"
                        >
                          {copiedText === "doubt" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-xs text-slate-200 font-sans space-y-2 whitespace-pre-wrap leading-relaxed">
                        {doubtResponse}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: TEXT & MANUAL SUMMARIZER */}
              {assistantSubTab === "summarize" && (
                <div className="space-y-4">
                  {/* Preset Summaries */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>1-Click Quick Summaries:</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleSummarize(
                            "Summarize the entire Quantum Superintelligence platform, 3 Editions, 5 pacing modes, and 10M token context horizon.",
                            "bullets"
                          )
                        }
                        className="text-[11px] font-mono px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0E1622] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
                      >
                        ⚡ 3-Bullet Full Manual Summary
                      </button>
                      <button
                        onClick={() =>
                          handleSummarize(
                            "Summarize how the 5 response pacing modes work (Normal 20-30s, Build 10-20 min, Relax 1-2 min, Fast 10-15s, Ultra Instinct 5 min).",
                            "actionplan"
                          )
                        }
                        className="text-[11px] font-mono px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0E1622] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
                      >
                        ⏱️ 5 Modes Breakdown Summary
                      </button>
                      <button
                        onClick={() =>
                          handleSummarize(
                            "Explain how to use this website to a 10-year-old student with simple everyday analogies.",
                            "eli5"
                          )
                        }
                        className="text-[11px] font-mono px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0E1622] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
                      >
                        🌱 Explain Like I'm 5 (Super Simple)
                      </button>
                      <button
                        onClick={() =>
                          handleSummarize(
                            "Give a single 1-sentence executive summary of the entire Quantum OS platform.",
                            "oneliner"
                          )
                        }
                        className="text-[11px] font-mono px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0E1622] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
                      >
                        🎯 1-Sentence Executive Punchline
                      </button>
                    </div>
                  </div>

                  {/* Summary Style Selectors */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">Format:</span>
                    {[
                      { id: "bullets", label: "3-5 Bullets" },
                      { id: "oneliner", label: "1-Sentence TL;DR" },
                      { id: "eli5", label: "ELI5 (Beginner Analogy)" },
                      { id: "actionplan", label: "Step-by-Step Plan" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSummaryStyle(st.id as any)}
                        className={`px-2.5 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                          summaryStyle === st.id
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold"
                            : "bg-[#101720] border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Textarea for custom summary */}
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={summaryInput}
                      onChange={(e) => setSummaryInput(e.target.value)}
                      placeholder="Paste any article, manual section, homework question, or notes here to summarize instantly..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0B1118] text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSummarize()}
                        disabled={isSummaryLoading}
                        className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isSummaryLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        <span>SUMMARIZE TEXT</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Result Card */}
                  {summaryResponse && (
                    <div className="p-4 rounded-xl border border-emerald-500/40 bg-[#091512] space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-emerald-300">
                            AI SUMMARY ({summaryStyle.toUpperCase()})
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(summaryResponse, "summary")}
                          className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-emerald-300 cursor-pointer"
                        >
                          {copiedText === "summary" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Summary</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-xs text-slate-200 font-sans space-y-2 whitespace-pre-wrap leading-relaxed">
                        {summaryResponse}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="px-5 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0"
          style={{ borderColor: theme.subtleBorder, backgroundColor: theme.panelBg }}
        >
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Need more help? Ask the built-in AI Doubt Clarifier above anytime!</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("assistant");
                setAssistantSubTab("doubt");
              }}
              className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ask a Doubt</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-700 bg-[#101720] text-slate-200 hover:text-white hover:border-slate-500 font-bold transition-all cursor-pointer"
            >
              Close Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
