import React, { useState } from "react";
import { VoiceConfig, VoiceState, QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Settings,
  Sparkles,
  Zap,
  ChevronUp,
  ChevronDown,
  Activity,
} from "lucide-react";

interface VoiceAgentHUDProps {
  voiceState: VoiceState;
  voiceConfig: VoiceConfig;
  onToggleListen: () => void;
  onToggleContinuous: () => void;
  onToggleAutoSpeak: () => void;
  onUpdateConfig: (config: Partial<VoiceConfig>) => void;
  onQuickCommand: (cmd: string) => void;
  themeMode?: QuantumThemeMode;
  className?: string;
}

export const VoiceAgentHUD: React.FC<VoiceAgentHUDProps> = ({
  voiceState,
  voiceConfig,
  onToggleListen,
  onToggleContinuous,
  onToggleAutoSpeak,
  onUpdateConfig,
  onQuickCommand,
  themeMode = "normal",
  className = "",
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const quickVoicePrompts = [
    "Quantum, calculate Schwarzschild radius for a 10 solar mass star",
    "Quantum, derive the Schrödinger equation for a harmonic oscillator",
    "Quantum, run a Python simulation of 1D wavepacket dispersion",
    "Quantum, search ArXiv for topological quantum error correction",
    "Quantum, calculate Lorentz time dilation at 0.95c",
    "Quantum, provide a full mathematical proof of Euler-Lagrange equations",
  ];

  return (
    <div
      className={`rounded-2xl border shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 transition-all duration-500 relative overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.panelBg,
        borderColor: theme.subtleBorder,
      }}
    >
      {/* Top Bar: Voice Status & Equalizer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Main Push to Talk / Toggle Button */}
          <button
            onClick={onToggleListen}
            className={`relative p-3 rounded-lg border transition-all flex items-center justify-center group cursor-pointer ${
              voiceState.isListening
                ? "text-[#020508] animate-pulse"
                : "bg-[#1A1F26] border-[#2D3748] hover:bg-[#2D3748]"
            }`}
            style={{
              backgroundColor: voiceState.isListening ? theme.primary : "#1A1F26",
              borderColor: voiceState.isListening ? theme.primary : "#2D3748",
              boxShadow: voiceState.isListening ? `0 0 20px ${theme.primary}` : "none",
              color: voiceState.isListening ? "#020508" : theme.primary,
            }}
            title={voiceState.isListening ? "Click to Stop Listening" : "Push to Speak to Quantum"}
          >
            {voiceState.isListening ? (
              <Mic className="w-5 h-5 animate-bounce" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            {voiceState.isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: theme.primary }}
                />
              </span>
            )}
          </button>

          {/* Voice State Title & Dynamic Equalizer Bars */}
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] uppercase tracking-widest font-mono font-bold"
                style={{ color: theme.primary }}
              >
                QUANTUM VOICE INTERFACE
              </span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: theme.activeBadgeBg,
                  borderColor: `${theme.primary}44`,
                  color: theme.primary,
                }}
              >
                {voiceState.mode}
              </span>
            </div>

            {/* Audio Wave Equalizer Animation */}
            <div className="flex items-end gap-1 mt-2 h-4">
              {Array.from({ length: 18 }).map((_, i) => {
                const isActive = voiceState.isListening || voiceState.isSpeaking;
                const heightPct = isActive
                  ? Math.max(20, Math.sin(i * 0.45 + Date.now() * 0.005) * 100 * (voiceState.audioLevel || 0.6))
                  : 15;
                return (
                  <span
                    key={i}
                    className="w-1 rounded-sm transition-all duration-75"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: voiceState.isSpeaking
                        ? "#FF007A"
                        : voiceState.isListening
                        ? theme.primary
                        : "#1E293B",
                      boxShadow:
                        voiceState.isSpeaking
                          ? "0 0 6px #FF007A"
                          : voiceState.isListening
                          ? `0 0 6px ${theme.primary}`
                          : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Action Icons: Auto-listen toggle, Voice Output Toggle, Settings */}
        <div className="flex items-center gap-2">
          {/* Continuous Auto-Listen Toggle */}
          <button
            onClick={onToggleContinuous}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              voiceConfig.continuousListening
                ? "shadow-sm"
                : "bg-[#1A1F26] text-white/50 border-[#2D3748] hover:text-white"
            }`}
            style={
              voiceConfig.continuousListening
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    borderColor: `${theme.primary}55`,
                    color: theme.primary,
                    boxShadow: `0 0 10px ${theme.glowColor}`,
                  }
                : {}
            }
            title="When active, Quantum listens continuously without needing to press the mic"
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                voiceConfig.continuousListening ? "animate-pulse" : ""
              }`}
              style={{
                color: voiceConfig.continuousListening ? theme.primary : "inherit",
              }}
            />
            <span className="hidden sm:inline">Auto-Listen</span>
          </button>

          {/* Voice Response Output Toggle */}
          <button
            onClick={onToggleAutoSpeak}
            className="p-2 rounded-lg border transition-all cursor-pointer"
            style={
              voiceConfig.autoSpeakResponse
                ? {
                    backgroundColor: theme.activeBadgeBg,
                    borderColor: `${theme.primary}55`,
                    color: theme.primary,
                  }
                : {
                    backgroundColor: "#1A1F26",
                    borderColor: "#2D3748",
                    color: "rgba(255,255,255,0.4)",
                  }
            }
            title={voiceConfig.autoSpeakResponse ? "Voice Audio Response Enabled" : "Voice Response Muted"}
          >
            {voiceConfig.autoSpeakResponse ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Voice Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-[#1A1F26] border border-[#2D3748] text-white/50 hover:text-white transition-colors cursor-pointer"
            title="Configure Voice Tone & Speech Rate"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Voice Live Transcript Output */}
      {voiceState.transcript && (
        <div
          className="px-4 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 animate-fadeIn"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: `${theme.primary}55`,
            color: theme.primary,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-ping shrink-0"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="text-white/40">Live Transcript:</span>
          <span className="font-semibold text-[#E2E8F0] italic">"{voiceState.transcript}"</span>
        </div>
      )}

      {/* Voice Configuration Drawer */}
      {showSettings && (
        <div
          className="p-4 rounded-xl border space-y-3 font-mono text-xs animate-fadeIn"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.subtleBorder,
          }}
        >
          <div
            className="font-bold flex items-center justify-between text-[11px] tracking-wider"
            style={{ color: theme.primary }}
          >
            <span>QUANTUM VOICE SYNTHESIS PARAMETERS</span>
            <span className="text-[10px] text-white/40">Voice Synthesis Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-[11px] block mb-1.5">
                Speech Rate: {voiceConfig.rate}x
              </label>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={voiceConfig.rate}
                onChange={(e) => onUpdateConfig({ rate: parseFloat(e.target.value) })}
                className="w-full h-1 bg-[#1A1F26] rounded"
                style={{ accentColor: theme.primary }}
              />
            </div>
            <div>
              <label className="text-white/50 text-[11px] block mb-1.5">
                Voice Pitch: {voiceConfig.pitch}
              </label>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={voiceConfig.pitch}
                onChange={(e) => onUpdateConfig({ pitch: parseFloat(e.target.value) })}
                className="w-full h-1 bg-[#1A1F26] rounded"
                style={{ accentColor: theme.primary }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick STEM Voice Commands Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
        <span className="text-white/40 font-mono text-[10px] shrink-0 uppercase tracking-widest flex items-center gap-1">
          <Zap className="w-3 h-3" style={{ color: theme.primary }} />
          <span>Quick Inquiries:</span>
        </span>
        {quickVoicePrompts.map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => onQuickCommand(cmd)}
            className="px-3 py-1.5 bg-[#1A1F26] border border-[#2D3748] rounded-full text-[11px] whitespace-nowrap cursor-pointer hover:bg-[#2D3748] hover:text-white text-[#E2E8F0] transition-all shrink-0 font-mono"
            style={{
              borderColor: "#2D3748",
            }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

