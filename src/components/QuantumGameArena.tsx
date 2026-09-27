import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Code2,
  HelpCircle,
  Download,
  Copy,
  Check,
  Gamepad2,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Clock,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
} from "lucide-react";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { speakQuantumMaleVoice } from "../utils/maleVoiceEngine";
import { playQuantumClick } from "../utils/soundEffects";

interface QuantumGameArenaProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameCode: string;
  instructions?: string;
  difficulty?: "Normal" | "Medium" | "Hard" | "Extreme";
  genre?: string;
  themeMode?: QuantumThemeMode;
}

export const QuantumGameArena: React.FC<QuantumGameArenaProps> = ({
  isOpen,
  onClose,
  gameTitle,
  gameCode,
  instructions,
  difficulty = "Hard",
  genre = "Arcade Physics",
  themeMode = "normal",
}) => {
  const [activeTab, setActiveTab] = useState<"game" | "instructions" | "code">("game");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  // Track session play time (unlimited play time)
  useEffect(() => {
    if (isOpen && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused]);

  // Voice announcement on game open
  useEffect(() => {
    if (isOpen) {
      setElapsedSeconds(0);
      setIsPaused(false);
      // Auto-detect mobile for virtual touch controls
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      setShowMobileControls(isMobile);

      speakQuantumMaleVoice(
        `Launching ${gameTitle}, sir. You can play as long as you wish. Use the cross icon to exit whenever you are ready.`,
        { rate: 1.05 }
      );
    }
  }, [isOpen, gameTitle]);

  // Keyboard Escape listener to leave the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus iframe for immediate keyboard controls
  const handleIframeLoad = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.focus();
      }
    } catch {
      // Safe fallback
    }
  };

  // Restart game
  const handleRestart = () => {
    playQuantumClick();
    setIframeKey((prev) => prev + 1);
    setElapsedSeconds(0);
    setIsPaused(false);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    playQuantumClick();
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Copy Source Code
  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(gameCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Download HTML file
  const handleDownloadHtml = () => {
    playQuantumClick();
    const safeName = gameTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const blob = new Blob([gameCode], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName || "quantum_game"}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Virtual Key Dispatcher for Touch / Mobile controls
  const sendVirtualKey = (keyName: string, type: "keydown" | "keyup") => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        const keyMap: Record<string, { key: string; code: string; keyCode: number }> = {
          ArrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
          ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
          ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
          ArrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
          Space: { key: " ", code: "Space", keyCode: 32 },
          Enter: { key: "Enter", code: "Enter", keyCode: 13 },
        };
        const def = keyMap[keyName] || { key: keyName, code: keyName, keyCode: 0 };
        const event = new (iframe.contentWindow as any).KeyboardEvent(type, {
          key: def.key,
          code: def.code,
          keyCode: def.keyCode,
          which: def.keyCode,
          bubbles: true,
          cancelable: true,
        });
        iframe.contentWindow.dispatchEvent(event);
        iframe.contentDocument?.dispatchEvent(event);
      }
    } catch {
      // Cross-origin safe
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in duration-300"
    >
      <div
        className="w-full max-w-6xl h-[94vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden relative transition-all"
        style={{
          backgroundColor: "#060A12",
          borderColor: theme.subtleBorder,
          boxShadow: `0 0 40px ${theme.glowEffect}33`,
        }}
      >
        {/* Top Header Bar with Cross (X) Icon to Leave Game */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: "#0A101C",
            borderColor: theme.subtleBorder,
          }}
        >
          {/* Game Title & Metadata */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-inner"
              style={{
                backgroundColor: `${theme.primary}22`,
                borderColor: `${theme.primary}55`,
                color: theme.primary,
              }}
            >
              <Gamepad2 className="w-5 h-5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  {gameTitle}
                </h2>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase shrink-0 border"
                  style={{
                    backgroundColor:
                      difficulty === "Extreme"
                        ? "#ef444422"
                        : difficulty === "Hard"
                        ? "#f59e0b22"
                        : "#10b98122",
                    borderColor:
                      difficulty === "Extreme"
                        ? "#ef444466"
                        : difficulty === "Hard"
                        ? "#f59e0b66"
                        : "#10b98166",
                    color:
                      difficulty === "Extreme"
                        ? "#f87171"
                        : difficulty === "Hard"
                        ? "#fbbf24"
                        : "#34d399",
                  }}
                >
                  {difficulty} DIFFICULTY
                </span>
              </div>
              <p className="text-[11px] text-white/50 truncate font-mono">
                {genre} • Unlimited Play Session • Quantum Engine
              </p>
            </div>
          </div>

          {/* Center Tabs: Game / How to Play / Source Code */}
          <div className="hidden md:flex items-center gap-1 bg-[#050811] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                playQuantumClick();
                setActiveTab("game");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "game"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Game</span>
            </button>

            <button
              onClick={() => {
                playQuantumClick();
                setActiveTab("instructions");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "instructions"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Play</span>
            </button>

            <button
              onClick={() => {
                playQuantumClick();
                setActiveTab("code");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "code"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </button>
          </div>

          {/* Right Header Actions & Close (X) Icon */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Session Timer Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#050811] border border-slate-800 text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            {/* Quick Restart */}
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-white/70 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
              title="Restart Game (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="hidden sm:inline-flex p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-white/70 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* CROSS (X) ICON TO LEAVE THE GAME */}
            <button
              id="quantum-game-arena-exit-btn"
              onClick={() => {
                playQuantumClick();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 flex items-center gap-1.5 text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg hover:shadow-rose-500/20 active:scale-95"
              title="Leave Game (Esc)"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Leave Game</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around border-b border-slate-800/80 bg-[#080E18] p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab("game")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === "game" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-white/60"
            }`}
          >
            <Play className="w-3 h-3" />
            <span>Game</span>
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === "instructions" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-white/60"
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>How to Play</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === "code" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-white/60"
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Code</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 relative overflow-hidden bg-[#030712] flex flex-col">
          {/* 1. PLAYABLE GAME VIEWPORT */}
          {activeTab === "game" && (
            <div className="flex-1 w-full h-full relative flex flex-col">
              {/* Game Sandboxed Iframe */}
              <div className="flex-1 relative w-full h-full overflow-hidden bg-[#020617]">
                <iframe
                  ref={iframeRef}
                  key={iframeKey}
                  srcDoc={gameCode}
                  title={gameTitle}
                  onLoad={handleIframeLoad}
                  sandbox="allow-scripts allow-modals allow-pointer-lock allow-same-origin"
                  className="w-full h-full border-0 focus:outline-none"
                />

                {/* Floating "How to Play" Quick Hint Banner */}
                <div className="absolute top-2 left-2 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[11px] font-mono pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Controls: Arrow Keys / WASD • Spacebar = Action</span>
                </div>

                {/* Floating Mobile Touch Controls Toggle */}
                <button
                  onClick={() => setShowMobileControls(!showMobileControls)}
                  className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700/80 text-white/80 hover:text-cyan-400 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showMobileControls ? "Hide D-Pad" : "Show Touch D-Pad"}</span>
                </button>
              </div>

              {/* On-Screen Virtual Controls for Mobile Devices & Touchscreens */}
              {showMobileControls && (
                <div className="p-3 bg-[#070D18] border-t border-slate-800 flex items-center justify-between gap-4 select-none shrink-0">
                  {/* Virtual Directional D-Pad */}
                  <div className="grid grid-cols-3 gap-1.5 w-32 h-32">
                    <div />
                    <button
                      onPointerDown={() => sendVirtualKey("ArrowUp", "keydown")}
                      onPointerUp={() => sendVirtualKey("ArrowUp", "keyup")}
                      className="rounded-xl bg-slate-800/90 active:bg-cyan-500/40 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-md active:scale-95 transition-transform"
                    >
                      <ArrowUp className="w-6 h-6" />
                    </button>
                    <div />
                    <button
                      onPointerDown={() => sendVirtualKey("ArrowLeft", "keydown")}
                      onPointerUp={() => sendVirtualKey("ArrowLeft", "keyup")}
                      className="rounded-xl bg-slate-800/90 active:bg-cyan-500/40 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-md active:scale-95 transition-transform"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="rounded-xl bg-slate-900 border border-slate-800/60 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                      D-PAD
                    </div>
                    <button
                      onPointerDown={() => sendVirtualKey("ArrowRight", "keydown")}
                      onPointerUp={() => sendVirtualKey("ArrowRight", "keyup")}
                      className="rounded-xl bg-slate-800/90 active:bg-cyan-500/40 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-md active:scale-95 transition-transform"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>
                    <div />
                    <button
                      onPointerDown={() => sendVirtualKey("ArrowDown", "keydown")}
                      onPointerUp={() => sendVirtualKey("ArrowDown", "keyup")}
                      className="rounded-xl bg-slate-800/90 active:bg-cyan-500/40 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-md active:scale-95 transition-transform"
                    >
                      <ArrowDown className="w-6 h-6" />
                    </button>
                    <div />
                  </div>

                  {/* Virtual Action Buttons (Spacebar / Action) */}
                  <div className="flex items-center gap-3">
                    <button
                      onPointerDown={() => sendVirtualKey("Enter", "keydown")}
                      onPointerUp={() => sendVirtualKey("Enter", "keyup")}
                      className="w-14 h-14 rounded-2xl bg-slate-800/80 active:bg-amber-500/40 border border-slate-700 flex flex-col items-center justify-center text-amber-400 font-mono text-[11px] font-bold shadow-md active:scale-95 transition-transform"
                    >
                      <span>ENTER</span>
                    </button>
                    <button
                      onPointerDown={() => sendVirtualKey("Space", "keydown")}
                      onPointerUp={() => sendVirtualKey("Space", "keyup")}
                      className="w-20 h-20 rounded-2xl bg-cyan-500/20 active:bg-cyan-500/50 border-2 border-cyan-400 flex flex-col items-center justify-center text-cyan-300 font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform"
                    >
                      <Zap className="w-6 h-6 mb-0.5" />
                      <span>ACTION</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. HOW TO PLAY INSTRUCTIONS TAB */}
          {activeTab === "instructions" && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 max-w-4xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border border-cyan-500/30">
                <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-sm font-bold mb-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>HOW TO PLAY & MASTER {gameTitle.toUpperCase()}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Quantum has synthesized this interactive simulation with real-time physics, high-velocity collision loops, and progressive difficulty. You can play as much time as you want without restrictions.
                </p>
              </div>

              {/* Controls Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desktop Controls */}
                <div className="p-4 rounded-xl bg-[#0A101C] border border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <span>💻 Desktop & Laptop Controls</span>
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Navigation / Movement:</span>
                      <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Arrow Keys / W, A, S, D</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Action / Jump / Shoot:</span>
                      <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Spacebar</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Quick Restart:</span>
                      <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">R / Restart Button</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Leave Game:</span>
                      <span className="text-rose-400 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Esc / Cross Icon (X)</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Controls */}
                <div className="p-4 rounded-xl bg-[#0A101C] border border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span>📱 Mobile & Phone Controls</span>
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Directional D-Pad:</span>
                      <span className="text-emerald-300 font-bold">Touch Up/Down/Left/Right</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Action Button:</span>
                      <span className="text-emerald-300 font-bold">Cyan Action Button</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Screen Scaling:</span>
                      <span className="text-slate-300">Auto-Adapts to Portrait & Landscape</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400">Exit / Leave:</span>
                      <span className="text-rose-400">Top Right Cross Icon (X)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Objectives & Rules */}
              <div className="p-4 rounded-xl bg-[#0A101C] border border-slate-800 space-y-3">
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Objective & High Score Rules</span>
                </h3>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    • <strong>Primary Goal:</strong> Survive as long as possible, eliminate enemy hazards, and achieve the highest quantum score multiplier.
                  </p>
                  <p>
                    • <strong>Difficulty Escalation:</strong> As your score increases, enemy velocities, obstacle spawn density, and stage hazards accelerate exponentially.
                  </p>
                  <p>
                    • <strong>Replayability:</strong> When your shields deplete or a collision occurs, click Restart or press R to immediately re-enter the arena with zero loading lag.
                  </p>
                </div>
              </div>

              {/* Action Button to Resume Playing */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    playQuantumClick();
                    setActiveTab("game");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
                >
                  <Play className="w-4 h-4" />
                  <span>Back to Game Arena</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. SOURCE CODE INSPECTOR TAB */}
          {activeTab === "code" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Code Toolbar */}
              <div className="px-4 py-2.5 bg-[#090F1B] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>HTML5 / CSS / JavaScript Canvas Game Code</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    ({(gameCode.length / 1024).toFixed(1)} KB)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadHtml}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .html</span>
                  </button>
                </div>
              </div>

              {/* Code Pre Block */}
              <div className="flex-1 overflow-auto p-4 bg-[#030712] font-mono text-xs text-slate-300 custom-scrollbar leading-relaxed">
                <pre className="selection:bg-cyan-500/30">
                  <code>{gameCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Info Bar */}
        <div
          className="px-4 py-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 bg-[#070C16] shrink-0"
          style={{ borderColor: theme.subtleBorder }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Quantum Engine Sandbox: 60 FPS V-Sync Active</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Play as long as you want</span>
            <span className="text-slate-600">•</span>
            <button
              onClick={onClose}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Leave Game (Esc)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
