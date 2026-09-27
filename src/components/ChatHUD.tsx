import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, STEMDomain, QuantumThemeMode, AIModelId, SubscriptionTier } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { AI_MODELS_ROSTER, isModelFree } from "../data/aiModelsData";
import { KaTeXRenderer } from "../utils/katexRenderer";
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Atom,
  Cpu,
  Layers,
  ArrowRight,
  Terminal,
  Zap,
  ChevronDown,
  History,
  Gamepad2,
} from "lucide-react";
import { extractGameFromResponse, DetectedGame } from "../utils/gameDetector";
import { extractProjectFromResponse, DetectedProject } from "../utils/projectDetector";
import { GameInvitationCard } from "./GameInvitationCard";
import { ProjectInvitationCard } from "./ProjectInvitationCard";

interface ChatHUDProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string, domain?: STEMDomain) => void;
  onSpeakMessage: (text: string) => void;
  isProcessing: boolean;
  activeDomain: STEMDomain;
  onSelectDomain: (domain: STEMDomain) => void;
  themeMode?: QuantumThemeMode;
  onSelectThemeMode?: (mode: QuantumThemeMode) => void;
  activeModelId?: AIModelId;
  onSelectModel?: (modelId: AIModelId) => void;
  onOpenModelsMatrix?: () => void;
  onOpenHistory?: () => void;
  onOpenQuantumBot?: () => void;
  onOpenPlayableGame?: (game: DetectedGame) => void;
  onOpenWebsitePreview?: (project: DetectedProject) => void;
  isLoggedIn?: boolean;
  onRequireSignIn?: () => void;
}

export const ChatHUD: React.FC<ChatHUDProps> = ({
  messages,
  onSendMessage,
  onSpeakMessage,
  isProcessing,
  activeDomain,
  onSelectDomain,
  themeMode = "normal",
  onSelectThemeMode,
  activeModelId = "quantum-prime",
  onSelectModel,
  onOpenModelsMatrix,
  onOpenHistory,
  onOpenQuantumBot,
  onOpenPlayableGame,
  onOpenWebsitePreview,
  isLoggedIn = true,
  onRequireSignIn,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const currentModelMeta =
    AI_MODELS_ROSTER.find((m) => m.id === activeModelId) || AI_MODELS_ROSTER[0];

  const modeOptions: {
    id: QuantumThemeMode;
    label: string;
    timing: string;
    purpose: string;
    dotColor: string;
    activeBorder: string;
    activeBg: string;
    textColor: string;
  }[] = [
    {
      id: "normal",
      label: "Normal",
      timing: "20–30s",
      purpose: "Quick and basic reply within 20 to 30 seconds",
      dotColor: "#00F2FF",
      activeBorder: "#00F2FF",
      activeBg: "rgba(0, 242, 255, 0.2)",
      textColor: "#00F2FF",
    },
    {
      id: "build",
      label: "Build",
      timing: "10–20 min",
      purpose: "To build real life projects or app or website etc within 10 to 20 minutes",
      dotColor: "#10B981",
      activeBorder: "#10B981",
      activeBg: "rgba(16, 185, 129, 0.2)",
      textColor: "#10B981",
    },
    {
      id: "relax",
      label: "Relax",
      timing: "1–2 min",
      purpose: "Simple and detailed answer within 1 to 2 minutes",
      dotColor: "#EC4899",
      activeBorder: "#EC4899",
      activeBg: "rgba(236, 72, 153, 0.2)",
      textColor: "#EC4899",
    },
    {
      id: "fast",
      label: "Fast",
      timing: "10–15s",
      purpose: "Fastest answers and explanation within 10 to 15 seconds",
      dotColor: "#EF4444",
      activeBorder: "#EF4444",
      activeBg: "rgba(239, 68, 68, 0.2)",
      textColor: "#EF4444",
    },
    {
      id: "ultra_instinct",
      label: "Ultra Instinct",
      timing: "5 min",
      purpose: "Detailed and easy way to understand within 5 minutes",
      dotColor: "#A855F7",
      activeBorder: "#A855F7",
      activeBg: "rgba(168, 85, 247, 0.2)",
      textColor: "#A855F7",
    },
  ];

  const domains: { id: STEMDomain; label: string; icon: string }[] = [
    { id: "physics", label: "Relativity & Physics", icon: "🌌" },
    { id: "quantum", label: "Quantum Mechanics", icon: "⚛️" },
    { id: "calculus", label: "Calculus & Analysis", icon: "📐" },
    { id: "orbital", label: "Astrophysics & Orbital", icon: "🪐" },
    { id: "engineering", label: "Engineering & CAD", icon: "⚙️" },
    { id: "ai_neural", label: "Neural & Bio-Informatics", icon: "🧬" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isProcessing) return;
    onSendMessage(inputText.trim(), selectedImage || undefined, activeDomain);
    setInputText("");
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyText = (id: string, text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch {
      // Safe fallback
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#060B12] rounded-2xl border border-[#1E293B] overflow-hidden shadow-2xl">
      {/* Header & STEM Domain Filter */}
      <div className="p-3.5 bg-[#0A0F16] border-b border-[#1E293B] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#00F2FF]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#00F2FF] uppercase">
              QUANTUM INTELLIGENCE MATRIX
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Model Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                style={{
                  backgroundColor: `${currentModelMeta.accentColor}18`,
                  borderColor: `${currentModelMeta.accentColor}66`,
                  color: currentModelMeta.accentColor,
                }}
                title="Active AI Reasoning Core. Click to change model."
              >
                <Cpu className="w-3 h-3 animate-spin-slow" />
                <span>{currentModelMeta.name}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Model Dropdown Menu */}
              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#0A101A] border border-[#1E293B] rounded-xl shadow-2xl z-50 p-1.5 space-y-1 max-h-72 overflow-y-auto custom-scrollbar animate-fade-in">
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-1 border-b border-[#1E293B] flex items-center justify-between">
                    <span>SELECT AI MODEL</span>
                    <span className="text-cyan-400 font-bold">{AI_MODELS_ROSTER.length} ENGINES</span>
                  </div>
                  {AI_MODELS_ROSTER.map((m) => {
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onSelectModel && onSelectModel(m.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                          activeModelId === m.id
                            ? "bg-[#1E293B] font-bold text-white"
                            : "text-slate-300 hover:bg-[#151D29] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.accentColor }} />
                          <span>{m.name}</span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1 rounded">
                            FREE
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400">{m.provider}</span>
                      </button>
                    );
                  })}
                  {onOpenModelsMatrix && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowModelDropdown(false);
                        onOpenModelsMatrix();
                      }}
                      className="w-full mt-1 py-1 text-center text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 border-t border-[#1E293B] cursor-pointer"
                    >
                      ⚡ Open Full AI Models Matrix &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F2FF22] border border-[#00F2FF44] text-[#00F2FF] hidden sm:inline">
              MATRIX: {activeDomain.toUpperCase()}
            </span>

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold text-slate-300 bg-slate-800/80 border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
                title="Open Session Inquiry History & Research Logs"
              >
                <History className="w-3 h-3 text-cyan-400" />
                <span>HISTORY ({messages.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDomain(d.id)}
              className={`px-3 py-1 rounded-md border font-mono flex items-center gap-1.5 whitespace-nowrap transition-all text-xs ${
                activeDomain === d.id
                  ? "bg-[#00F2FF22] border-[#00F2FF] text-[#00F2FF] shadow-sm font-medium"
                  : "bg-[#1A1F26] border-[#2D3748] text-white/50 hover:text-white hover:border-[#4B5563]"
              }`}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-sm ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-lg bg-[#00F2FF22] border border-[#00F2FF44] flex items-center justify-center text-[#00F2FF] shrink-0 shadow-[0_0_10px_rgba(0,242,255,0.2)] text-base"
                title={msg.modelName || "AI Companion"}
              >
                <Atom className="w-4 h-4 text-[#00F2FF] animate-spin-slow" />
              </div>
            )}

            <div
              className={`max-w-[88%] rounded-2xl p-4 transition-all ${
                msg.role === "user"
                  ? "bg-[#1A1F26] border border-[#2D3748] text-[#E2E8F0] rounded-tr-none shadow-md"
                  : "bg-[#0A0F16] border border-[#1E293B] text-[#E2E8F0] rounded-tl-none shadow-xl"
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] font-mono mb-2.5 pb-1.5 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="text-[#00F2FF] font-bold">
                    {msg.role === "user" ? "DIRECTOR / USER" : "QUANTUM STEM AI"}
                  </span>
                  {msg.role === "assistant" && (msg.modelName || msg.model) && (() => {
                    const msgModel = AI_MODELS_ROSTER.find(
                      (m) => m.id === msg.model || m.name === msg.modelName
                    );
                    const color = msgModel ? msgModel.accentColor : "#00F2FF";
                    return (
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: `${color}18`,
                          borderColor: `${color}44`,
                          color: color,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span>{msg.modelName || msg.model}</span>
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-[10px]">{msg.timestamp}</span>
                  {msg.role === "assistant" && (
                    <>
                      <button
                        onClick={() => onSpeakMessage(msg.content)}
                        className="p-1 text-white/40 hover:text-[#00F2FF] transition-colors"
                        title="Speak this response aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="p-1 text-white/40 hover:text-[#00F2FF] transition-colors"
                        title="Copy Markdown"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#00F2FF]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Image Preview if present */}
              {msg.imagePreview && (
                <div className="mb-3 rounded-lg overflow-hidden border border-[#00F2FF44] max-h-56">
                  <img
                    src={msg.imagePreview}
                    alt="Scientific diagram"
                    className="w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* KaTeX and Markdown Rendered STEM Content */}
              <KaTeXRenderer content={msg.content} />

              {/* Interactive Playable Game or Website Invitation Card */}
              {msg.role === "assistant" && (() => {
                const detectedProject = extractProjectFromResponse(msg.content);
                if (!detectedProject) return null;
                return (
                  <ProjectInvitationCard
                    project={detectedProject}
                    onLaunchProject={() => {
                      if (detectedProject.type === "game") {
                        onOpenPlayableGame?.({
                          title: detectedProject.title,
                          code: detectedProject.code,
                          instructions: detectedProject.instructions || "",
                          difficulty: detectedProject.difficulty || "Hard",
                          genre: detectedProject.genre || "Arcade Physics",
                          controls: detectedProject.controls || { desktop: "", mobile: "" },
                        });
                      } else {
                        onOpenWebsitePreview?.(detectedProject);
                      }
                    }}
                    themeMode={themeMode}
                  />
                );
              })()}

              {/* Followup suggestions if available */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-2">
                  <div className="text-[10px] font-mono text-[#00F2FF] uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#00F2FF]" />
                    <span>Recommended Inquiries:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(item, undefined, activeDomain)}
                        className="text-left text-xs font-mono px-3 py-1 rounded bg-[#1A1F26] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#00F2FF44] text-[#E2E8F0] hover:text-[#00F2FF] transition-all flex items-center gap-1.5"
                      >
                        <span>{item}</span>
                        <ArrowRight className="w-3 h-3 text-[#00F2FF] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality & verification disclaimer at end of assistant response */}
              {msg.role === "assistant" && (
                <div className="mt-3 pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px] text-slate-400/90 font-sans tracking-tight select-none">
                  <span>Quantum can make mistakes. Pls double check your response</span>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-[#1A1F26] border border-[#2D3748] flex items-center justify-center text-white/70 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && themeMode === "build" ? (
          <div className="p-4 rounded-xl bg-[#04160B] border border-emerald-500/50 space-y-2.5 animate-fade-in font-mono shadow-2xl">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="font-bold uppercase tracking-wider">
                  QUANTUM DEEP BUILD MODE ACTIVE: SYNTHESIZING ARCHITECTURE
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                GAMES &amp; WEBSITES ENGINE
              </span>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2 bg-[#062010] p-2 rounded-lg border border-emerald-900/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>Stage 1: Multi-File Blueprint &amp; System Specs</span>
              </div>
              <div className="flex items-center gap-2 bg-[#062010] p-2 rounded-lg border border-emerald-900/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Stage 2: 60 FPS Game Loop / Responsive DOM &amp; State</span>
              </div>
              <div className="flex items-center gap-2 bg-[#062010] p-2 rounded-lg border border-emerald-900/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Stage 3: Web Audio API SFX &amp; Physics / Shaders</span>
              </div>
              <div className="flex items-center gap-2 bg-[#062010] p-2 rounded-lg border border-emerald-900/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Stage 4: Syntax Verification &amp; Sandbox Bundling</span>
              </div>
            </div>

            {/* Glowing compilation progress bar */}
            <div className="w-full h-1.5 bg-[#052210] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 rounded-full animate-pulse w-4/5 shadow-[0_0_10px_#10B981]" />
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Deep compilation takes time for 100% complete runnable code without placeholders</span>
              <span className="text-emerald-400 font-bold">10–20 Min Cadence Mode</span>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0A0F16] border border-[#00F2FF44] text-[#00F2FF] text-xs font-mono animate-pulse">
            <Atom className="w-4 h-4 text-[#00F2FF] animate-spin" />
            <span>QUANTUM IS COMPUTING DERIVATIONS &amp; SOLVING MATRICES...</span>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 border-t space-y-2.5 transition-colors duration-500"
        style={{
          backgroundColor: activeTheme.panelBg,
          borderColor: activeTheme.subtleBorder,
        }}
      >
        {/* SEPARATE SECTION IN SEARCH BAR: THEME OVERDRIVE SELECTOR */}
        <div
          className="p-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 transition-all duration-300"
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: `${activeTheme.primary}33`,
          }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-white/60 pl-1">
            <Zap className="w-3.5 h-3.5" style={{ color: activeTheme.primary }} />
            <span className="font-bold text-white/80">OVERDRIVE MODE:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {modeOptions.map((opt) => {
              const isActive = themeMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectThemeMode && onSelectThemeMode(opt.id)}
                  className={`group relative px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isActive
                      ? "shadow-md scale-105 font-bold"
                      : "bg-[#101720] border-[#2D3748] text-white/60 hover:text-white hover:border-[#4B5563]"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: opt.activeBg,
                          borderColor: opt.activeBorder,
                          color: opt.textColor,
                          boxShadow: `0 0 10px ${opt.activeBorder}44`,
                        }
                      : {}
                  }
                  title={`${opt.label} Mode — ${opt.purpose} (${opt.timing})`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                    style={{
                      backgroundColor: opt.dotColor,
                      boxShadow: isActive ? `0 0 6px ${opt.dotColor}` : "none",
                    }}
                  />
                  <span>{opt.label}</span>
                  <span className="text-[9px] opacity-75 font-mono">[{opt.timing}]</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEPARATE SECTION IN SEARCH BAR: REASONING ENGINE SELECTOR */}
        <div
          className="p-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 transition-all duration-300"
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: `${currentModelMeta.accentColor}33`,
          }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-white/60 pl-1">
            <Cpu className="w-3.5 h-3.5" style={{ color: currentModelMeta.accentColor }} />
            <span className="font-bold text-white/80">REASONING CORE:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {AI_MODELS_ROSTER.slice(0, 9).map((m) => {
              const isSelected = activeModelId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectModel && onSelectModel(m.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1 ${
                    isSelected
                      ? "font-bold shadow-md scale-105"
                      : "bg-[#101720] border-[#2D3748] text-white/60 hover:text-white hover:border-[#4B5563]"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${m.accentColor}25`,
                          borderColor: m.accentColor,
                          color: m.accentColor,
                          boxShadow: `0 0 10px ${m.accentColor}44`,
                        }
                      : {}
                  }
                  title={`${m.name} (${m.provider}) - Free & Unlocked`}
                >
                  <span>{m.name}</span>
                </button>
              );
            })}
            {onOpenModelsMatrix && (
              <button
                type="button"
                onClick={onOpenModelsMatrix}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-cyan-400 bg-[#0A1624] border border-cyan-500/40 hover:bg-cyan-500/20 whitespace-nowrap cursor-pointer"
              >
                + All {AI_MODELS_ROSTER.length} Models &rarr;
              </button>
            )}

            {onOpenQuantumBot && (
              <button
                type="button"
                onClick={onOpenQuantumBot}
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold text-cyan-200 bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400/60 hover:border-cyan-300 hover:scale-105 whitespace-nowrap cursor-pointer shadow-sm flex items-center gap-1.5"
                title="Summon Quantum Bot (Grok-Engineered 10x Task Automator)"
              >
                <Zap className="w-3 h-3 text-cyan-400 fill-current animate-pulse" />
                <span>⚡ QUANTUM BOT (10X AUTO)</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Image thumbnail preview */}
        {selectedImage && (
          <div
            className="relative inline-block rounded-lg overflow-hidden border"
            style={{ borderColor: activeTheme.primary }}
          >
            <img src={selectedImage} alt="Preview" className="h-14 w-auto object-cover" />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 bg-[#FF007A] text-white rounded-bl px-1.5 text-[10px]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Guest Mode Search Bar Notice if not signed in */}
        {!isLoggedIn && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Search Bar &amp; Quantum Core Preview. <strong>Please sign in first to ask questions, sir.</strong>
              </span>
            </span>
            {onRequireSignIn && (
              <button
                type="button"
                onClick={onRequireSignIn}
                className="px-2.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px] hover:bg-cyan-400 transition-colors cursor-pointer shrink-0 ml-2"
              >
                SIGN IN (FREE)
              </button>
            )}
          </div>
        )}

        {/* Build Mode Active Status Banner */}
        {themeMode === "build" && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                <strong className="text-white">BUILD MODE ARMED:</strong> Able to generate complete 60 FPS Games, Websites &amp; Web Apps. (Takes time for production-ready code)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold hidden sm:inline">
              10–20 MIN CADENCE
            </span>
          </div>
        )}

        <div className="flex items-end gap-2.5">
          {/* File / Image Attachment Button for STEM Diagrams */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 w-11 flex items-center justify-center rounded-xl bg-[#0E1522] border border-[#233146] text-slate-400 hover:text-white hover:border-cyan-400/50 transition-all shrink-0 cursor-pointer shadow-sm"
            title="Upload STEM diagram, circuit, or equation photo"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Main Query Textarea / Writing Area */}
          <div className="relative flex-1">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if ((inputText.trim() || selectedImage) && !isProcessing) {
                    handleSubmit(e);
                  }
                }
              }}
              placeholder={
                isLoggedIn
                  ? `Ask Quantum in ${activeTheme.label} Mode (e.g. 'Derive relativistic Lorentz time dilation')...`
                  : "Ask a question (Please sign in first to submit questions, sir)..."
              }
              className="w-full bg-[#0A0F1A] border rounded-xl px-4 py-3 text-sm font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/60 shadow-inner resize-none transition-all leading-relaxed custom-scrollbar min-h-[44px] max-h-48"
              style={{
                borderColor: `${activeTheme.primary}55`,
              }}
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs px-1 py-0.5 rounded hover:bg-slate-800 transition-colors"
                title="Clear text"
              >
                ✕
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isProcessing}
            className="h-11 px-4 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed text-[#020508] text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
            style={{
              backgroundColor: activeTheme.primary,
              boxShadow: `0 0 14px ${activeTheme.glowColor}`,
            }}
          >
            <span>TRANSMIT</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
          <span>Press Enter to transmit • Shift+Enter for new line</span>
          <span>LaTeX &amp; KaTeX enabled</span>
        </div>

        <div className="text-center pt-1 border-t border-[#1E293B]/40 text-[11px] text-slate-400 font-sans tracking-tight select-none">
          Quantum can make mistakes. Pls double check your response
        </div>
      </form>
    </div>
  );
};
