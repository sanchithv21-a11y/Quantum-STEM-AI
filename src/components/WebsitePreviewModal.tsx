import React, { useState, useRef } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Download,
  Copy,
  Check,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import { speakQuantumMaleVoice } from "../utils/maleVoiceEngine";

interface WebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  code: string;
  framework?: string;
  themeMode?: QuantumThemeMode;
}

export const WebsitePreviewModal: React.FC<WebsitePreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  code,
  framework = "HTML5 + Responsive CSS",
  themeMode = "normal",
}) => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  if (!isOpen) return null;

  const handleCopyCode = () => {
    playQuantumClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    playQuantumClick();
    const safeName = title.toLowerCase().replace(/[^a-z0-9]/g, "_") || "quantum_website";
    const blob = new Blob([code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    playQuantumClick();
    const blob = new Blob([code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const getViewportWidth = () => {
    if (viewport === "mobile") return "max-w-[390px]";
    if (viewport === "tablet") return "max-w-[768px]";
    return "w-full";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div
        className={`w-full ${
          isFullscreen ? "h-full max-w-none" : "max-w-6xl h-[92vh]"
        } bg-[#060D17] border border-cyan-500/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 relative`}
      >
        {/* Modal Top Header */}
        <div className="px-4 py-3 bg-[#0A1424] border-b border-[#1E2E48] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate font-mono">{title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hidden sm:inline">
                  {framework}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                Synthesized in Quantum Build Mode &bull; Production-Ready Single File
              </p>
            </div>
          </div>

          {/* Viewport & Tab Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tab switch Preview / Code */}
            <div className="flex items-center bg-[#070F1B] border border-slate-700/80 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => {
                  playQuantumClick();
                  setActiveTab("preview");
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "preview"
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => {
                  playQuantumClick();
                  setActiveTab("code");
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "code"
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code</span>
              </button>
            </div>

            {/* Viewport Selector (When in preview mode) */}
            {activeTab === "preview" && (
              <div className="hidden md:flex items-center bg-[#070F1B] border border-slate-700/80 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => {
                    playQuantumClick();
                    setViewport("desktop");
                  }}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewport === "desktop" ? "bg-slate-700 text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                  title="Desktop View (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    playQuantumClick();
                    setViewport("tablet");
                  }}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewport === "tablet" ? "bg-slate-700 text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    playQuantumClick();
                    setViewport("mobile");
                  }}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewport === "mobile" ? "bg-slate-700 text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Reload button */}
            <button
              onClick={() => {
                playQuantumClick();
                setIframeKey((prev) => prev + 1);
              }}
              className="p-1.5 rounded-lg border border-slate-700/80 bg-[#070F1B] text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
              title="Refresh / Reload Preview"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Download HTML */}
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-[#070F1B] text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download standalone HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Open in new tab */}
            <button
              onClick={handleOpenNewTab}
              className="p-1.5 rounded-lg border border-slate-700/80 bg-[#070F1B] text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
              title="Open in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => {
                playQuantumClick();
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1.5 rounded-lg border border-slate-700/80 bg-[#070F1B] text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                playQuantumClick();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-red-500/30 bg-red-950/30 text-red-300 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 relative bg-[#040811] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          {activeTab === "preview" ? (
            <div
              className={`h-full ${getViewportWidth()} transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 bg-white shadow-2xl relative flex flex-col`}
            >
              <iframe
                key={iframeKey}
                srcDoc={code}
                title={title}
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                className="w-full h-full border-none bg-white"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-xl border border-slate-800 bg-[#060D17] flex flex-col overflow-hidden">
              <div className="p-2.5 bg-[#091322] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">STANDALONE HTML SOURCE CODE</span>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 hover:bg-cyan-500/30 transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar bg-[#040914]">
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {code}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-4 py-2 bg-[#0A1424] border-t border-[#1E2E48] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Sandbox Live &bull; Responsive CSS Enabled</span>
          </div>
          <span>Built with Sovereign Quantum Build Mode</span>
        </div>
      </div>
    </div>
  );
};
