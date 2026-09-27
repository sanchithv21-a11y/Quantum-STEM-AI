import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Sparkles,
  X,
  ChevronUp,
  ChevronDown,
  Terminal,
  Play,
  Flame,
  Volume2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { QuantumBotAvatar } from "./QuantumBotAvatar";
import { playQuantumBotChirp, playQuantumClick } from "../utils/soundEffects";
import { QuantumThemeMode } from "../types";

export interface QuantumBotWidgetProps {
  onOpenModal: () => void;
  onQuickTask?: (taskPrompt: string) => void;
  themeMode?: QuantumThemeMode;
}

const ROTATING_TIPS = [
  "⚡ Quantum Bot: Automate tasks 10x faster than any model!",
  "🧠 Grok-Grade Intelligence online. Ready to auto-solve math & code.",
  "🚀 Need instant code synthesis or physics proofs? Click me!",
  "⚡ Sub-200ms task automation ready. What shall we solve, sir?",
  "🔬 Zero-latency ArXiv & mathematical tensor acceleration active.",
];

export const QuantumBotWidget: React.FC<QuantumBotWidgetProps> = ({
  onOpenModal,
  onQuickTask,
  themeMode = "normal",
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem("quantum_bot_minimized") === "true";
    } catch {
      return false;
    }
  });

  const [tipIndex, setTipIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [quickInput, setQuickInput] = useState("");
  const [showQuickBar, setShowQuickBar] = useState(false);
  const [lastAvatarClickTime, setLastAvatarClickTime] = useState(0);
  const [happyMessage, setHappyMessage] = useState(false);

  // Rotate smart tips every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMinimized;
    setIsMinimized(next);
    try {
      localStorage.setItem("quantum_bot_minimized", String(next));
    } catch {}
    playQuantumClick();
  };

  const handleBotClick = () => {
    playQuantumBotChirp();
    onOpenModal();
  };

  const handleAvatarInteractiveClick = () => {
    const now = Date.now();
    // If clicked within 1.6s again, open the cockpit
    if (now - lastAvatarClickTime < 1600 && lastAvatarClickTime > 0) {
      onOpenModal();
      return;
    }
    setLastAvatarClickTime(now);
    setHappyMessage(true);
    setShowBubble(true);
    setTimeout(() => {
      setHappyMessage(false);
    }, 3000);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    playQuantumBotChirp();
    if (onQuickTask) {
      onQuickTask(quickInput);
    } else {
      onOpenModal();
    }
    setQuickInput("");
    setShowQuickBar(false);
  };

  return (
    <aside
      id="quantum-bot-floating-companion"
      aria-label="Quantum Bot Companion"
      className="fixed bottom-12 right-4 sm:bottom-14 sm:right-6 z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Speech / Status Thought Bubble */}
      <AnimatePresence>
        {!isMinimized && showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-2 max-w-[260px] sm:max-w-[300px] p-2.5 rounded-xl bg-[#060D1A]/95 border border-cyan-400/50 shadow-[0_4px_20px_rgba(0,242,255,0.25)] backdrop-blur-md text-xs font-mono relative"
          >
            {/* Triangular Speech Pointer */}
            <div className="absolute -bottom-2 right-8 w-3 h-3 bg-[#060D1A] border-r border-b border-cyan-400/50 rotate-45" />

            <div className="flex items-start justify-between gap-1.5 pb-1 mb-1 border-b border-cyan-500/20">
              <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-bold">
                <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>QUANTUM BOT // 10X SPEED</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
                title="Dismiss thought bubble"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <p
              onClick={handleBotClick}
              className="text-[11px] text-slate-200 leading-snug cursor-pointer hover:text-cyan-200 transition-colors"
            >
              {happyMessage ? (
                <span className="text-cyan-200 font-bold flex items-center gap-1.5 animate-pulse">
                  <span>Yay! 🥰 My eyes track your cursor! (Click again for Cockpit)</span>
                </span>
              ) : (
                ROTATING_TIPS[tipIndex]
              )}
            </p>

            {/* Quick Action Buttons inside Bubble */}
            <div className="mt-2 pt-1.5 border-t border-[#142036] flex items-center justify-between gap-1 text-[9px]">
              <button
                onClick={() => setShowQuickBar(!showQuickBar)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <Terminal className="w-3 h-3" />
                <span>{showQuickBar ? "Hide Input" : "Quick Automate"}</span>
              </button>

              <button
                onClick={handleBotClick}
                className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 cursor-pointer font-bold flex items-center gap-1"
              >
                <span>Open Cockpit</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* In-Bubble Quick Task Input */}
            {showQuickBar && (
              <form onSubmit={handleQuickSubmit} className="mt-2 pt-1 flex items-center gap-1">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Task to automate..."
                  className="flex-1 bg-[#02050C] border border-cyan-500/50 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-cyan-300 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-cyan-500 text-slate-950 rounded font-bold text-[10px] cursor-pointer hover:bg-cyan-400"
                >
                  Go
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Grok-Styled Bot Character */}
      <div className="flex items-center gap-2">
        {/* Minimize / Expand Toggle Button */}
        <button
          onClick={handleToggleMinimize}
          className="p-1 rounded-full bg-[#08101E]/90 hover:bg-[#122036] text-slate-400 hover:text-cyan-300 border border-cyan-500/40 shadow-md backdrop-blur-sm cursor-pointer transition-transform hover:scale-110"
          title={isMinimized ? "Expand Quantum Bot" : "Minimize Quantum Bot"}
        >
          {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isMinimized ? (
          /* Minimized Compact Badge */
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBotClick}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-[#070F1E] to-[#0A162B] border-2 border-cyan-400/70 text-cyan-300 shadow-[0_0_20px_rgba(0,242,255,0.35)] flex items-center gap-2 cursor-pointer font-mono font-bold text-xs"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <QuantumBotAvatar size="sm" showAura={false} interactive={false} />
            </div>
            <span>QUANTUM BOT</span>
            <span className="text-[9px] px-1 rounded bg-cyan-500/30 text-cyan-200">10X</span>
          </motion.div>
        ) : (
          /* Full Animated Floating Avatar */
          <div
            onClick={handleAvatarInteractiveClick}
            className="cursor-pointer group flex flex-col items-center"
            title="Click me to make me happy! (Double-click or tap 'Open Cockpit' to automate tasks)"
          >
            <QuantumBotAvatar
              size="md"
              state="idle"
              showAura={true}
              interactive={true}
              onClick={handleAvatarInteractiveClick}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
