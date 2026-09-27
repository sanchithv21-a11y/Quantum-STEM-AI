import React, { useState } from "react";
import {
  Gamepad2,
  Play,
  Globe,
  Code2,
  HelpCircle,
  Download,
  Copy,
  Check,
  Sparkles,
  Trophy,
  ExternalLink,
  Layers,
  Monitor,
} from "lucide-react";
import { DetectedProject } from "../utils/projectDetector";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";

interface ProjectInvitationCardProps {
  project: DetectedProject;
  onLaunchProject: () => void;
  onViewCode?: () => void;
  themeMode?: QuantumThemeMode;
}

export const ProjectInvitationCard: React.FC<ProjectInvitationCardProps> = ({
  project,
  onLaunchProject,
  onViewCode,
  themeMode = "normal",
}) => {
  const [copied, setCopied] = useState(false);
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const isGame = project.type === "game";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    playQuantumClick();
    try {
      navigator.clipboard.writeText(project.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    playQuantumClick();
    const safeName = project.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const blob = new Blob([project.code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName || (isGame ? "quantum_game" : "quantum_website")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="my-4 rounded-2xl border p-4 sm:p-5 relative overflow-hidden transition-all duration-300 shadow-xl"
      style={{
        backgroundColor: "#070E1B",
        borderColor: isGame ? `${theme.primary}55` : "rgba(16, 185, 129, 0.4)",
        boxShadow: `0 0 25px ${isGame ? theme.glowColor : "rgba(16, 185, 129, 0.2)"}`,
      }}
    >
      {/* Background Accent Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 blur-3xl pointer-events-none rounded-full opacity-20"
        style={{ backgroundColor: isGame ? theme.primary : "#10B981" }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Project Title & Badge */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
            style={{
              backgroundColor: isGame ? `${theme.primary}20` : "rgba(16, 185, 129, 0.2)",
              borderColor: isGame ? `${theme.primary}60` : "rgba(16, 185, 129, 0.6)",
              color: isGame ? theme.primary : "#10B981",
            }}
          >
            {isGame ? <Gamepad2 className="w-6 h-6 animate-pulse" /> : <Globe className="w-6 h-6 animate-pulse" />}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {isGame ? "🎮 100% Playable Game Ready" : "🌐 Full Web App Synthesized"}
              </span>
              <span
                className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "rgba(0, 242, 255, 0.1)",
                  borderColor: "rgba(0, 242, 255, 0.3)",
                  color: "#38bdf8",
                }}
              >
                {isGame ? project.genre || "Arcade Physics" : project.framework || "Modern HTML5 + Tailwind"}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate font-sans">
              {project.title}
            </h3>

            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isGame
                ? "Self-contained HTML5 Canvas • Web Audio SFX • 60 FPS Engine"
                : "Responsive Viewports • Interactive DOM & State • Single-File Deployable"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Copy source code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Download standalone file (.html)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              playQuantumClick();
              onLaunchProject();
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold font-mono text-xs text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isGame ? theme.primary : "#10B981",
              boxShadow: `0 0 15px ${isGame ? theme.glowColor : "rgba(16, 185, 129, 0.4)"}`,
            }}
          >
            {isGame ? <Play className="w-4 h-4 fill-current" /> : <Monitor className="w-4 h-4" />}
            <span>{isGame ? "PLAY GAME NOW" : "PREVIEW LIVE WEBSITE"}</span>
          </button>
        </div>
      </div>

      {/* Mandatory closing question as specified in Quantum prompt */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-300/90">
        <span className="flex items-center gap-1.5 italic">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>
            {isGame
              ? "Do you want to play the game you created, sir?"
              : "Do you want to preview the website you created, sir?"}
          </span>
        </span>
        <span className="text-[10px] text-slate-400 hidden sm:inline">
          Built in Quantum Sovereign Build Mode
        </span>
      </div>
    </div>
  );
};
