import React from "react";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import {
  BatteryCharging,
  BatteryMedium,
  SunDim,
  Zap,
  Volume2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface PowerSavingModeSectionProps {
  isPowerSavingMode: boolean;
  brightnessLevel: number;
  onToggleMode: () => void;
  onSetBrightnessLevel: (level: number) => void;
  onOpenConfirmationPrompt: () => void;
  themeMode?: QuantumThemeMode;
}

export const PowerSavingModeSection: React.FC<PowerSavingModeSectionProps> = ({
  isPowerSavingMode,
  brightnessLevel,
  onToggleMode,
  onSetBrightnessLevel,
  onOpenConfirmationPrompt,
  themeMode = "normal",
}) => {
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  return (
    <section
      id="power-saving-mode-section"
      className="w-full rounded-2xl border shadow-xl p-4 sm:p-5 transition-all duration-500 relative overflow-hidden backdrop-blur-md"
      style={{
        backgroundColor: theme.panelBg,
        borderColor: isPowerSavingMode ? `${theme.primary}88` : theme.subtleBorder,
        boxShadow: isPowerSavingMode ? `0 0 25px ${theme.glowColor}` : "none",
      }}
    >
      {/* High-Tech Tactical Corner Brackets */}
      <div
        className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 pointer-events-none opacity-60"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 pointer-events-none opacity-60"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 pointer-events-none opacity-60"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 pointer-events-none opacity-60"
        style={{ borderColor: theme.primary }}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-3 mb-4" style={{ borderColor: theme.subtleBorder }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all"
            style={{
              backgroundColor: isPowerSavingMode ? `${theme.primary}22` : "#0E1724",
              borderColor: isPowerSavingMode ? theme.primary : "#1E2A3B",
              color: isPowerSavingMode ? theme.primary : "#94A3B8",
            }}
          >
            {isPowerSavingMode ? (
              <SunDim className="w-5 h-5 animate-pulse text-cyan-400" />
            ) : (
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                Power Saving Mode
              </h2>
              <span
                id="power-saving-status-badge"
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold flex items-center gap-1"
                style={{
                  backgroundColor: isPowerSavingMode ? "rgba(6, 182, 212, 0.2)" : "rgba(100, 116, 139, 0.2)",
                  borderColor: isPowerSavingMode ? "#06B6D4" : "#475569",
                  color: isPowerSavingMode ? "#22D3EE" : "#94A3B8",
                }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPowerSavingMode ? "bg-cyan-400 animate-pulse" : "bg-slate-500"
                  }`}
                />
                {isPowerSavingMode ? "ACTIVE // SCREEN DIMMED" : "STANDBY // FULL POWER"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Reduces screen luminance &amp; thermal footprint to maximize battery life.
            </p>
          </div>
        </div>

        {/* Primary Interactive Click Trigger Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            id="power-saving-interactive-click-btn"
            onClick={() => {
              playQuantumClick();
              onOpenConfirmationPrompt();
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-lg hover:scale-105 border"
            style={{
              backgroundColor: isPowerSavingMode ? `${theme.primary}22` : theme.primary,
              borderColor: theme.primary,
              color: isPowerSavingMode ? theme.primary : "#05080C",
              boxShadow: `0 0 15px ${theme.glowColor}`,
            }}
            title="Click to engage Power Saving Mode and receive QUANTUM voice guidance"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPowerSavingMode ? "Configure Power Saving" : "Click: Power Saving Mode"}</span>
          </button>

          {isPowerSavingMode && (
            <button
              id="restore-full-brightness-btn"
              onClick={() => {
                playQuantumClick();
                onToggleMode();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
              title="Restore 100% Screen Brightness"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Brightness</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Interactive Click Card */}
        <div
          id="power-saving-clickable-card"
          onClick={() => {
            playQuantumClick();
            onOpenConfirmationPrompt();
          }}
          className="p-3.5 rounded-xl border bg-[#080E18] hover:bg-[#0C1524] cursor-pointer transition-all duration-300 group relative overflow-hidden"
          style={{
            borderColor: isPowerSavingMode ? `${theme.primary}55` : "#1E293B",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-bounce" />
              <span>VOICE QUERY &amp; DIALOG</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              CLICK HERE
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans italic group-hover:text-white transition-colors">
            &ldquo;Good choice sir because it will consume less power and screen will become little dim. Is that ok for you sir?&rdquo;
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-cyan-400">
            <span>Tap to hear voice confirmation</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Screen Dimming Level Slider */}
        <div className="p-3.5 rounded-xl border bg-[#080E18] border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <SunDim className="w-3.5 h-3.5 text-yellow-400" />
              <span>SCREEN LUMINANCE</span>
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {isPowerSavingMode ? `${brightnessLevel}% (Dimmed)` : "100% (Standard)"}
            </span>
          </div>

          <div className="space-y-1">
            <input
              id="power-saving-brightness-slider"
              type="range"
              min="40"
              max="85"
              step="5"
              value={brightnessLevel}
              disabled={!isPowerSavingMode}
              onChange={(e) => onSetBrightnessLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>Dimmer (40%)</span>
              <span>Default (70%)</span>
              <span>Mild (85%)</span>
            </div>
          </div>

          <p className="text-[10px] font-mono text-slate-400">
            {isPowerSavingMode
              ? "Screen dimmed to conserve watt hours."
              : "Enable power saving to adjust dimming level."}
          </p>
        </div>

        {/* Real-time Hardware Metrics */}
        <div className="p-3.5 rounded-xl border bg-[#080E18] border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>ENERGY CONSERVATION</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {isPowerSavingMode ? "-38% Watts" : "0% (Full Draw)"}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Quantum Thermal:</span>
              <span className={isPowerSavingMode ? "text-emerald-400 font-bold" : "text-slate-200"}>
                {isPowerSavingMode ? "31.4°C (Cooling)" : "38.2°C (Standard)"}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">GPU Animation Load:</span>
              <span className={isPowerSavingMode ? "text-cyan-400 font-bold" : "text-slate-200"}>
                {isPowerSavingMode ? "Low Overhead (60Hz)" : "Uncapped (120Hz)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
