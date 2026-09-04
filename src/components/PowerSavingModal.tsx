import React, { useEffect, useState } from "react";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import {
  BatteryCharging,
  SunDim,
  Volume2,
  Check,
  X,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface PowerSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  themeMode?: QuantumThemeMode;
  isAlreadyActive?: boolean;
  onSpeakPrompt?: (text: string) => void;
}

export const PowerSavingModal: React.FC<PowerSavingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  themeMode = "normal",
  isAlreadyActive = false,
  onSpeakPrompt,
}) => {
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const promptText =
    "Good choice sir because it will consume less power and screen will become little dim. Is that ok for you sir?";

  const [isSpeakingAnimation, setIsSpeakingAnimation] = useState(false);

  // Automatically trigger speech and audio wave animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSpeakingAnimation(true);
      if (onSpeakPrompt) {
        onSpeakPrompt(promptText);
      }
      const timer = setTimeout(() => {
        setIsSpeakingAnimation(false);
      }, 5200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpeakAgain = () => {
    playQuantumClick();
    setIsSpeakingAnimation(true);
    if (onSpeakPrompt) {
      onSpeakPrompt(promptText);
    }
    setTimeout(() => {
      setIsSpeakingAnimation(false);
    }, 5200);
  };

  const handleConfirmAction = () => {
    playQuantumClick();
    onConfirm();
    onClose();
  };

  const handleCancelAction = () => {
    playQuantumClick();
    onClose();
  };

  return (
    <div
      id="power-saving-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="power-saving-modal-card"
        className="relative max-w-lg w-full rounded-2xl border p-6 shadow-2xl space-y-5 transition-all duration-300"
        style={{
          backgroundColor: "#080D15",
          borderColor: `${theme.primary}66`,
          boxShadow: `0 0 35px ${theme.glowColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${theme.primary}33` }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${theme.primary}1A`,
                borderColor: `${theme.primary}55`,
                color: theme.primary,
              }}
            >
              <SunDim className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-white tracking-wider flex items-center gap-2">
                <span>POWER SAVING MODE</span>
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase"
                  style={{
                    backgroundColor: `${theme.primary}22`,
                    borderColor: `${theme.primary}55`,
                    color: theme.primary,
                  }}
                >
                  SYSTEM OPTIMIZATION
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Quantum display luminance &amp; wattage regulation
              </p>
            </div>
          </div>
          <button
            id="close-power-saving-modal-btn"
            onClick={handleCancelAction}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Neural AI Audio Wave & Voice Query Speech Box */}
        <div
          className="p-4 rounded-xl border space-y-3 relative overflow-hidden"
          style={{
            backgroundColor: "#0B111B",
            borderColor: `${theme.primary}44`,
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5" style={{ color: theme.primary }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bold">QUANTUM VOICE CONFIRMATION</span>
            </div>
            <button
              id="replay-voice-prompt-btn"
              onClick={handleSpeakAgain}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Repeat Audio Voice"
            >
              <Volume2 className="w-3 h-3 text-cyan-400" />
              <span>Listen Again</span>
            </button>
          </div>

          {/* Spoken Quote Box */}
          <div className="bg-[#05080E] p-3.5 rounded-lg border border-cyan-500/30 relative">
            <p className="text-sm font-sans font-medium text-cyan-200 leading-relaxed italic">
              &ldquo;{promptText}&rdquo;
            </p>

            {/* Pulsing Audio Frequency Bars */}
            <div className="flex items-center gap-1 mt-3 pt-2 border-t border-cyan-500/20">
              {[40, 75, 25, 90, 60, 85, 30, 95, 50, 70, 35, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all duration-200"
                  style={{
                    height: isSpeakingAnimation ? `${Math.max(6, (h * Math.sin(i + 1)) % 22 + 6)}px` : "4px",
                    backgroundColor: theme.primary,
                    opacity: isSpeakingAnimation ? 0.9 : 0.35,
                  }}
                />
              ))}
              <span className="text-[10px] font-mono text-slate-400 ml-2">
                {isSpeakingAnimation ? "TRANSMITTING..." : "VOICE READY"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Impact Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0B111B] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>POWER DRAW</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Reduces estimated hardware energy load by up to ~38%.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0B111B] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <SunDim className="w-3.5 h-3.5" />
              <span>SCREEN LUMINANCE</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Softens display brightness to 70% for eye comfort and battery preservation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            id="cancel-power-saving-btn"
            onClick={handleCancelAction}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            id="confirm-power-saving-btn"
            onClick={handleConfirmAction}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-lg hover:scale-105"
            style={{
              backgroundColor: theme.primary,
              color: "#05080C",
              boxShadow: `0 0 20px ${theme.glowColor}`,
            }}
          >
            <Check className="w-4 h-4" />
            <span>{isAlreadyActive ? "Keep Dimmed & Active" : "Yes, it is ok, sir"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
