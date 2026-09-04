import React from "react";
import { BrandLogo } from "./BrandLogo";
import {
  X,
  Sparkles,
  Cpu,
  Shield,
  Zap,
  Radio,
  CheckCircle2,
  Atom,
  Binary,
  Layers,
  Heart,
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-[#070D18] text-slate-100 shadow-2xl shadow-cyan-950/50 overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-[#1E293B] bg-gradient-to-r from-cyan-950/40 via-[#070D18] to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" glow={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">About Quantum AI</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.4.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Sovereign STEM Supercomputing &amp; Multimodal Matrix
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#1E293B] bg-[#0A111E] text-slate-400 hover:text-white hover:border-cyan-500/40 flex items-center justify-center transition-colors cursor-pointer"
            title="Close About"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Mission statement */}
          <div className="p-4 rounded-xl border border-[#1E293B] bg-[#0A111E]/80 leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Sovereign Scientific Intelligence</span>
            </div>
            <p className="text-xs text-slate-300">
              Quantum AI is a next-generation scientific computing platform engineered for researchers, engineers, mathematicians, and developers. Built from the ground up to offer zero-latency STEM derivations, interactive holographic visualizations, and 12+ frontier AI model reasoning cores.
            </p>
          </div>

          {/* Core Specifications */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider px-1">
              Architecture &amp; Capabilities
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-[#1E293B] bg-[#0A111E] space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>12+ Frontier AI Engines</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Zero-paywall access to Quantum Prime, Ultra, Code engines, and frontier models.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#1E293B] bg-[#0A111E] space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Local Analytical Matrix</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Instant offline STEM math, calculus, chemistry, and physics solver with 0ms latency.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#1E293B] bg-[#0A111E] space-y-1">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>Vocal Speech Core</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Integrated Push-To-Talk and acoustic feedback cancellation for natural dialogue.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#1E293B] bg-[#0A111E] space-y-1">
                <div className="flex items-center gap-2 text-blue-300 font-bold">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Privacy &amp; Encryption</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Client-side encrypted local memory, zero telemetry, zero data-mining trackers.
                </p>
              </div>
            </div>
          </div>

          {/* Subsystems Matrix */}
          <div className="p-4 rounded-xl border border-[#1E293B] bg-[#070D18] space-y-2">
            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              Subsystem Verification
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quantum Arc Core: Online</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Voice Engine: Active</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>STEM Solver: Calibrated</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lifetime License: 100% Free</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-2 flex items-center justify-between text-slate-500 text-[11px] border-t border-[#1E293B]">
            <div className="flex items-center gap-1.5">
              <span>Crafted for Sovereign Computing</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500/30" />
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
