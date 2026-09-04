import React, { useState } from "react";
import { QuantumThemeMode, AIModel, AIModelId, SubscriptionTier } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import {
  Crown,
  Sparkles,
  Zap,
  Check,
  X,
  Shield,
  Layers,
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Flame,
  Star,
  RefreshCw,
} from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetModel?: AIModel | null;
  currentTier: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
  themeMode?: QuantumThemeMode;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  targetModel,
  currentTier,
  onSelectTier,
  themeMode = "normal",
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isProcessingTier, setIsProcessingTier] = useState<SubscriptionTier | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activatedTierName, setActivatedTierName] = useState("");

  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  if (!isOpen) return null;

  const handleUpgrade = (tier: SubscriptionTier) => {
    playQuantumClick();
    setIsProcessingTier(tier);

    setTimeout(() => {
      onSelectTier(tier);
      setIsProcessingTier(null);
      setActivatedTierName(tier === "max" ? "QUANTUM MAX" : tier === "pro" ? "QUANTUM PRO" : "FREE TIER");
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#080D16] border border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden my-auto"
        style={{
          boxShadow: `0 0 40px rgba(0, 242, 255, 0.15)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
          title="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* PRIMARY RESTRICTION BANNER REQUESTED BY USER */}
          <div className="p-4 rounded-xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold uppercase tracking-wider">
                    UPGRADE REQUIRED
                  </span>
                  {targetModel && (
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      Target AI: <strong className="text-cyan-300">{targetModel.name}</strong> ({targetModel.provider})
                    </span>
                  )}
                </div>
                {/* The exact prompt message requested */}
                <h3 className="text-base sm:text-lg font-bold text-amber-300 tracking-wide font-mono mt-1">
                  pls upgrade to pro or max to use unlimited ai's
                </h3>
              </div>
            </div>

            <div className="text-[11px] font-mono text-amber-200/80 sm:text-right shrink-0">
              <span>Quantum AI is FREE forever.</span>
              <br />
              <span className="text-slate-400">All other 12+ Frontier AIs require Pro or Max.</span>
            </div>
          </div>

          {/* Header Description & Billing Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Quantum AI Subscription Matrix
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Unlock unlimited access to the world's most advanced frontier AI engines (Gemini 3.7 Flash, GPT 5.6 Luna, Claude Sonnet 5, DeepSeek R1, Grok 4.6, and more).
              </p>
            </div>

            {/* Billing Cycle Switch */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[9px] px-1 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                  SAVE 25%
                </span>
              </button>
            </div>
          </div>

          {/* 3 SUBSCRIPTION TIERS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* TIER 1: FREE (QUANTUM AI ONLY) */}
            <div
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                currentTier === "free"
                  ? "bg-[#0B121E] border-cyan-500/60 shadow-[0_0_20px_rgba(0,242,255,0.15)]"
                  : "bg-[#090E17] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                    DEFAULT INCLUDED
                  </span>
                  {currentTier === "free" && (
                    <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> CURRENT PLAN
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">Quantum Free</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Full sovereign access to Quantum AI.
                  </p>
                </div>

                <div className="py-2 border-y border-slate-800/80">
                  <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                  <span className="text-xs text-slate-400 font-mono"> / forever</span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-start gap-2 text-cyan-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>QUANTUM Prime AI (Unlimited &amp; Free)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>10,000,000 Token Quantum Horizon</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Interactive KaTeX Derivations &amp; Formulas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Voice Agent HUD &amp; Full-Stack Codingz IDE</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-500">
                    <X className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                    <span>Locked: Gemini, GPT-5, Claude &amp; DeepSeek</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpgrade("free")}
                  disabled={currentTier === "free" || isProcessingTier !== null}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentTier === "free"
                      ? "bg-slate-800/60 text-slate-400 cursor-default border border-slate-700/50"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                  }`}
                >
                  {currentTier === "free" ? "ACTIVE FREE TIER" : "Switch to Free"}
                </button>
              </div>
            </div>

            {/* TIER 2: QUANTUM PRO (POPULAR) */}
            <div
              className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all relative ${
                currentTier === "pro"
                  ? "bg-[#0B1522] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                  : "bg-[#09111C] border-emerald-500/60 hover:border-emerald-400 shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                MOST POPULAR
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                    PRO UNLIMITED
                  </span>
                  {currentTier === "pro" && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> ACTIVE PRO
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span>Quantum Pro</span>
                    <Crown className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Unlimited access to all 12+ Frontier AI engines.
                  </p>
                </div>

                <div className="py-2 border-y border-slate-800/80">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {billingCycle === "monthly" ? "$19" : "$14"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {" "}
                    / month {billingCycle === "yearly" && "(billed annually)"}
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 text-xs text-slate-200 font-mono">
                  <div className="flex items-start gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>UNLIMITED Access to All Frontier AIs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Gemini 3.7 Flash &amp; Gemini 3.5 Flash</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>GPT 5.6 Luna &amp; GPT 5.5 Turbo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Claude Sonnet 5 &amp; Claude Opus 4.8</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>DeepSeek R1, Grok 4.6 &amp; Qwen 3.7</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dual Model Comparison Arena &amp; Benchmarks</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpgrade("pro")}
                  disabled={isProcessingTier !== null}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
                    currentTier === "pro"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400 hover:bg-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 hover:scale-[1.02]"
                  }`}
                >
                  {isProcessingTier === "pro" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ACTIVATING PRO...</span>
                    </>
                  ) : currentTier === "pro" ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>PRO ACTIVE (CLICK TO RE-VERIFY)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>UPGRADE TO PRO</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TIER 3: QUANTUM MAX (ENTERPRISE / ULTIMATE) */}
            <div
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                currentTier === "max"
                  ? "bg-[#181120] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                  : "bg-[#120D1A] border-amber-500/50 hover:border-amber-400"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    MAX TITAN
                  </span>
                  {currentTier === "max" && (
                    <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> ACTIVE MAX
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span>Quantum Max</span>
                    <Crown className="w-4 h-4 text-amber-400" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Highest concurrency, TPU cluster &amp; AI swarm orchestration.
                  </p>
                </div>

                <div className="py-2 border-y border-slate-800/80">
                  <span className="text-3xl font-extrabold text-amber-400 font-mono">
                    {billingCycle === "monthly" ? "$39" : "$29"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {" "}
                    / month {billingCycle === "yearly" && "(billed annually)"}
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 text-xs text-slate-200 font-mono">
                  <div className="flex items-start gap-2 font-bold text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Everything in PRO Included</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Concurrent Multi-Agent AI Swarm Coding</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Priority Dedicated TPU v6 Cloud Inference</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Unlimited Audio Voice Agent Synthesizer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Early Alpha Access to Future Singularities</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpgrade("max")}
                  disabled={isProcessingTier !== null}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
                    currentTier === "max"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400 hover:bg-amber-500/30"
                      : "bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 hover:brightness-110 hover:scale-[1.02]"
                  }`}
                >
                  {isProcessingTier === "max" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ACTIVATING MAX...</span>
                    </>
                  ) : currentTier === "max" ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>MAX ACTIVE (CLICK TO RE-VERIFY)</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>UPGRADE TO MAX</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note & Security Assurance */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Instant Activation // Cancel anytime // Quantum SLA Guarantee</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white underline cursor-pointer text-xs"
            >
              Continue with Free Quantum AI
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fade-in space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-mono">
                {activatedTierName} ACTIVATED!
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                All 12+ Frontier AI engines are now unlocked for your session.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
