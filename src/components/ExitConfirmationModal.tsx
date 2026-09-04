import React, { useState } from "react";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import {
  Power,
  AlertTriangle,
  X,
  Check,
  RotateCcw,
  Cpu,
  ShieldAlert,
  Terminal,
} from "lucide-react";

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit?: () => void;
  themeMode?: QuantumThemeMode;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
  themeMode = "normal",
}) => {
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  if (!isOpen) return null;

  const handleExecuteExit = async () => {
    setIsShuttingDown(true);

    // After shutdown animation completes, transition to powered-off state or execute callback
    setTimeout(() => {
      setIsShuttingDown(false);
      setIsPoweredOff(true);
      if (onConfirmExit) {
        onConfirmExit();
      }
    }, 1500);
  };

  const handleReboot = () => {
    playQuantumClick();
    setIsPoweredOff(false);
    setIsShuttingDown(false);
    onClose();
    // Optional page reload or soft reset
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in"
      onClick={!isShuttingDown && !isPoweredOff ? onClose : undefined}
    >
      {isPoweredOff ? (
        /* Powered Down Black Screen State */
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-md w-full rounded-2xl border border-slate-800 bg-[#05080C] shadow-2xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
            <Power className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-mono font-bold text-slate-300">
              QUANTUM SYSTEM POWERED OFF
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              All neural reactor cores have safely decelerated and standby power is engaged.
            </p>
          </div>
          <button
            onClick={handleReboot}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500/20 hover:scale-105 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <RotateCcw className="w-4 h-4 animate-spin" />
            <span>RESTART QUANTUM OS</span>
          </button>
        </div>
      ) : isShuttingDown ? (
        /* Active Shutting Down Reactor Sequence */
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-md w-full rounded-2xl border border-red-500/40 bg-[#0A0608] shadow-2xl space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin flex items-center justify-center" />
            <Power className="w-8 h-8 text-red-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-mono font-bold text-red-300 tracking-wider">
              SHUTTING DOWN QUANTUM OS...
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Spinning down neural turbine cores &amp; saving session cache...
            </p>
          </div>
          <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-red-500/30">
            <div className="bg-red-500 h-full w-full animate-pulse origin-left transition-all duration-1000" />
          </div>
        </div>
      ) : (
        /* Confirmation Dialog Box */
        <div
          className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: "#0A0D14",
            borderColor: "rgba(239, 68, 68, 0.4)",
            boxShadow: "0 0 40px rgba(239, 68, 68, 0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-red-500/20 bg-red-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-red-200">
                  SYSTEM EXIT CONFIRMATION
                </h3>
                <p className="text-[10px] font-mono text-slate-400">
                  QUANTUM SUPERCOMPUTER OS
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2 py-2">
              <h2 className="text-lg font-bold text-white font-mono">
                Are you sure you want to exit?
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will spin down the quantum neural reactors, save active workspace sessions, and safely power off the interface.
              </p>
            </div>

            {/* Telemetry Status Preview */}
            <div className="p-3 rounded-xl border border-slate-800 bg-black/40 space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Core Temperature:</span>
                <span className="text-emerald-400">Nominal (0.015 K)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Session Context:</span>
                <span className="text-cyan-400">Buffered &amp; Preserved</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Power State:</span>
                <span className="text-slate-300">Ready for Standby</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer hover:border-slate-600"
              >
                Cancel / Stay
              </button>
              <button
                onClick={handleExecuteExit}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/60 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-500/20 group hover:scale-[1.02]"
              >
                <Power className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                <span>Confirm Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
