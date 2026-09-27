import React, { useState } from "react";
import { Gamepad2, Play, Code2, HelpCircle, Download, Copy, Check, Sparkles, Trophy } from "lucide-react";
import { DetectedGame } from "../utils/gameDetector";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";

interface GameInvitationCardProps {
  game: DetectedGame;
  onPlayGame: () => void;
  onViewCode?: () => void;
  themeMode?: QuantumThemeMode;
}

export const GameInvitationCard: React.FC<GameInvitationCardProps> = ({
  game,
  onPlayGame,
  onViewCode,
  themeMode = "normal",
}) => {
  const [copied, setCopied] = useState(false);
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    playQuantumClick();
    try {
      navigator.clipboard.writeText(game.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    playQuantumClick();
    const safeName = game.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const blob = new Blob([game.code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName || "quantum_game"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="my-4 rounded-2xl border p-4 sm:p-5 relative overflow-hidden transition-all duration-300 shadow-xl"
      style={{
        backgroundColor: "#070E1B",
        borderColor: `${theme.primary}55`,
        boxShadow: `0 0 25px ${theme.glowEffect}25`,
      }}
    >
      {/* Background Subtle Accent Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 blur-3xl pointer-events-none rounded-full opacity-20"
        style={{ backgroundColor: theme.primary }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Game Title & Badge */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
            style={{
              backgroundColor: `${theme.primary}20`,
              borderColor: `${theme.primary}60`,
              color: theme.primary,
            }}
          >
            <Gamepad2 className="w-6 h-6 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                100% Playable Game Ready
              </span>
              <span
                className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor:
                    game.difficulty === "Extreme"
                      ? "#ef444422"
                      : game.difficulty === "Hard"
                      ? "#f59e0b22"
                      : "#10b98122",
                  borderColor:
                    game.difficulty === "Extreme"
                      ? "#ef444466"
                      : game.difficulty === "Hard"
                      ? "#f59e0b66"
                      : "#10b98166",
                  color:
                    game.difficulty === "Extreme"
                      ? "#f87171"
                      : game.difficulty === "Hard"
                      ? "#fbbf24"
                      : "#34d399",
                }}
              >
                {game.difficulty} Difficulty
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {game.title}
            </h3>

            {/* Exact question requested by user */}
            <p className="text-sm font-semibold text-cyan-300 mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Do you want to play the game you created, sir?</span>
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <button
            onClick={() => {
              playQuantumClick();
              onPlayGame();
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 text-slate-950 hover:brightness-110"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 0 20px ${theme.glowEffect}55`,
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Yes, Play Game Now</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy HTML5 Game Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy Code"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download Game as .html"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Quick Controls summary strip */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Controls:</span>
          <span className="text-slate-300">Arrow Keys / WASD • Spacebar = Action • Touch D-Pad</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-emerald-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>Play as long as you want • High score saved</span>
        </div>
      </div>
    </div>
  );
};
