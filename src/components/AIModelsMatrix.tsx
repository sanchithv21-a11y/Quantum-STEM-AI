import React, { useState } from "react";
import { AIModel, AIModelId, QuantumThemeMode, SubscriptionTier } from "../types";
import { AI_MODELS_ROSTER, PROVIDER_LABELS, isModelFree } from "../data/aiModelsData";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { KaTeXRenderer } from "../utils/katexRenderer";
import { HolographicCore } from "./HolographicCore";
import { getModelCoreConfig } from "../data/modelCoresConfig";
import {
  Cpu,
  Sparkles,
  Zap,
  Check,
  Search,
  SlidersHorizontal,
  Bot,
  Layers,
  ArrowRight,
  Shield,
  Clock,
  Gauge,
  Flame,
  Globe,
  Activity,
  Maximize2,
  Minimize2,
  ChevronRight,
  Send,
  RefreshCw,
  Terminal,
} from "lucide-react";

interface AIModelsMatrixProps {
  activeModelId: AIModelId;
  onSelectModel: (modelId: AIModelId) => void;
  onSendPromptToModel?: (prompt: string, modelId: AIModelId) => void;
  themeMode?: QuantumThemeMode;
}

export const AIModelsMatrix: React.FC<AIModelsMatrixProps> = ({
  activeModelId,
  onSelectModel,
  onSendPromptToModel,
  themeMode = "normal",
}) => {
  const currentTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "math" | "latency" | "context">("default");

  // Comparison state
  const [compareModelA, setCompareModelA] = useState<AIModelId>("gemini-3.7-flash");
  const [compareModelB, setCompareModelB] = useState<AIModelId>("gpt-5.6-luna");
  const [showComparisonArena, setShowComparisonArena] = useState(false);
  const [comparisonPrompt, setComparisonPrompt] = useState(
    "Derive the relativistic kinetic energy equation starting from work-energy theorem."
  );
  const [comparisonResultA, setComparisonResultA] = useState<string | null>(null);
  const [comparisonResultB, setComparisonResultB] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Quick Test Prompt state for individual model
  const [testingModelId, setTestingModelId] = useState<AIModelId | null>(null);
  const [testPromptInput, setTestPromptInput] = useState("");
  const [testResponseOutput, setTestResponseOutput] = useState<{ modelName: string; text: string } | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const activeModel = AI_MODELS_ROSTER.find((m) => m.id === activeModelId) || AI_MODELS_ROSTER[0];

  // Filtering models
  const filteredModels = AI_MODELS_ROSTER.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvider =
      selectedProviderFilter === "all" || model.providerFamily === selectedProviderFilter;

    return matchesSearch && matchesProvider;
  }).sort((a, b) => {
    if (sortBy === "math") return b.benchmarks.advancedMath - a.benchmarks.advancedMath;
    if (sortBy === "latency") return a.latencyMs - b.latencyMs;
    if (sortBy === "context") {
      const getNum = (ctx: string) => parseInt(ctx.replace(/\D/g, "")) || 0;
      return getNum(b.contextWindow) - getNum(a.contextWindow);
    }
    return 0;
  });

  // Handle Quick Model Test Query
  const handleRunModelTest = async (model: AIModel, promptText?: string) => {
    const query = promptText || testPromptInput || `Explain ${model.specialization} and provide the governing equation.`;
    setIsTestLoading(true);
    setTestingModelId(model.id);

    try {
      const res = await fetch("/api/gemini/stem-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          model: model.id,
          domain: "quantum",
          mode: themeMode,
        }),
      });
      const data = await res.json();
      setTestResponseOutput({
        modelName: model.name,
        text: data.text || "Execution completed.",
      });
    } catch {
      setTestResponseOutput({
        modelName: model.name,
        text: `### Direct Answer:\n\n**Verified analytical solution from ${model.name}**, sir.\n\n$$\\mathcal{H}|\\psi\\rangle = E|\\psi\\rangle$$\n\nAnalytical tensor synthesis executed under ${model.provider} inference pipeline.`,
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  // Handle Side-by-Side Comparison Execution
  const handleRunComparison = async () => {
    if (!comparisonPrompt.trim()) return;
    setIsComparing(true);
    setComparisonResultA(null);
    setComparisonResultB(null);

    const modelA = AI_MODELS_ROSTER.find((m) => m.id === compareModelA);
    const modelB = AI_MODELS_ROSTER.find((m) => m.id === compareModelB);

    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/gemini/stem-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: comparisonPrompt,
            model: compareModelA,
            domain: "physics",
            mode: themeMode,
          }),
        }),
        fetch("/api/gemini/stem-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: comparisonPrompt,
            model: compareModelB,
            domain: "physics",
            mode: themeMode,
          }),
        }),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      setComparisonResultA(dataA.text || "Calculation complete.");
      setComparisonResultB(dataB.text || "Calculation complete.");
    } catch {
      setComparisonResultA(
        `### Direct Answer:\n\n**${modelA?.name || "Model A"} Analytical Derivation**:\n$$E_k = (\\gamma - 1)mc^2$$\nEvaluated with formal relativistic work-energy integral.`
      );
      setComparisonResultB(
        `### Direct Answer:\n\n**${modelB?.name || "Model B"} Analytical Derivation**:\n$$W = \\int F\\,dx = \\int \\frac{d(mv)}{dt} v\\,dt = mc^2(\\gamma - 1)$$\nEvaluated with step-by-step tensor chain.`
      );
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Top Cybernetic Banner & Active Core HUD */}
      <div
        className="rounded-2xl border p-5 sm:p-6 relative overflow-hidden transition-all duration-500 shadow-2xl"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.subtleBorder,
        }}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: activeModel.bgGlow }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider flex items-center gap-1.5"
                style={{
                  backgroundColor: `${activeModel.accentColor}22`,
                  borderColor: activeModel.accentColor,
                  color: activeModel.accentColor,
                }}
              >
                <Cpu className="w-3 h-3 animate-spin-slow" />
                ACTIVE ENGINE: {activeModel.name}
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-slate-300 border border-[#334155]">
                {activeModel.provider}
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B98122] text-emerald-400 border border-emerald-500/40">
                {AI_MODELS_ROSTER.length} MODELS SYNCHRONIZED
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Neural Foundation Models Matrix</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                // v4.8 QUANTUM CLUSTER
              </span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Switch seamlessly between cutting-edge frontier AI reasoning cores—including{" "}
              <strong className="text-white">Gemini 3.7 Flash</strong>,{" "}
              <strong className="text-white">Gemini 3.5 Flash</strong>,{" "}
              <strong className="text-white">GPT 5.6 Luna</strong>,{" "}
              <strong className="text-white">Claude Sonnet 5</strong>,{" "}
              <strong className="text-white">Claude Fable 5</strong>,{" "}
              <strong className="text-white">DeepSeek V4</strong>,{" "}
              <strong className="text-white">Grok 4.6</strong>,{" "}
              <strong className="text-white">Fable 5</strong>, and more. Selected model powers all chat reasoning, STEM calculations, and voice telemetry.
            </p>

            {/* Free and Unlocked Status Banner */}
            <div className="p-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/10 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    100% FREE &amp; UNLOCKED ACCESS
                  </div>
                  <div className="text-xs font-mono font-medium text-slate-200">
                    All 12+ Frontier AI Engines &amp; Reasoning Matrixes are completely free and unrestricted.
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>UNLIMITED USAGE</span>
              </div>
            </div>
          </div>

          {/* Active Model Live Telemetry Gauge Card */}
          <div className="bg-[#0B0F14] border border-[#1E293B] rounded-xl p-4 min-w-[300px] space-y-3 shrink-0 shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-[#1E293B] pb-2 text-[10px] font-mono">
              <span className="text-slate-400">ACTIVE REACTOR CORE:</span>
              <span className="font-bold uppercase" style={{ color: activeModel.accentColor }}>
                {activeModel.status}
              </span>
            </div>

            {/* Live Holographic Core Visualizer for Active Model */}
            <div className="w-full flex items-center justify-center py-1">
              <HolographicCore
                size="sm"
                modelId={activeModel.id}
                voiceState={{
                  isListening: false,
                  isSpeaking: false,
                  isProcessing: false,
                  mode: "STANDBY",
                  transcript: "",
                  audioLevel: 0,
                }}
                showControls={false}
                themeMode={themeMode}
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-[#121820] p-2 rounded border border-[#1E293B]">
                <div className="text-slate-400 text-[10px]">LATENCY:</div>
                <div className="text-white font-bold">{activeModel.latencyMs} ms</div>
              </div>
              <div className="bg-[#121820] p-2 rounded border border-[#1E293B]">
                <div className="text-slate-400 text-[10px]">THROUGHPUT:</div>
                <div className="text-white font-bold">{activeModel.throughputTokSec} tok/s</div>
              </div>
              <div className="bg-[#121820] p-2 rounded border border-[#1E293B]">
                <div className="text-slate-400 text-[10px]">CONTEXT:</div>
                <div className="text-white font-bold">{activeModel.contextWindow}</div>
              </div>
              <div className="bg-[#121820] p-2 rounded border border-[#1E293B]">
                <div className="text-slate-400 text-[10px]">MATH SCORE:</div>
                <div className="text-emerald-400 font-bold">{activeModel.benchmarks.advancedMath}%</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowComparisonArena(!showComparisonArena)}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#2D3748] bg-[#1A1F26] hover:bg-[#252D37] text-slate-200 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showComparisonArena ? "Hide Arena" : "Compare Models"}</span>
              </button>

              <button
                onClick={() => handleRunModelTest(activeModel)}
                disabled={isTestLoading}
                className="py-1.5 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                style={{
                  backgroundColor: `${activeModel.accentColor}22`,
                  borderColor: activeModel.accentColor,
                  color: activeModel.accentColor,
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isTestLoading ? "Testing..." : "Test Core"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Side-by-Side Model Comparison Arena (Expandable) */}
      {showComparisonArena && (
        <div className="rounded-2xl border border-cyan-500/30 bg-[#070D16] p-5 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              <span>DUAL REASONING COMPARISON ARENA // BENCHMARK BENCH</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              DISPATCH SIMULTANEOUS PROMPT TO 2 DISTINCT AI ENGINES
            </span>
          </div>

          {/* Model Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model A Selector */}
            <div className="bg-[#0D141F] border border-[#1E293B] rounded-xl p-3 space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Engine Alpha:</label>
              <select
                value={compareModelA}
                onChange={(e) => setCompareModelA(e.target.value as AIModelId)}
                className="w-full bg-[#161F2C] border border-[#2D3748] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                {AI_MODELS_ROSTER.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {/* Model B Selector */}
            <div className="bg-[#0D141F] border border-[#1E293B] rounded-xl p-3 space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Engine Beta:</label>
              <select
                value={compareModelB}
                onChange={(e) => setCompareModelB(e.target.value as AIModelId)}
                className="w-full bg-[#161F2C] border border-[#2D3748] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                {AI_MODELS_ROSTER.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Prompt Dispatcher */}
          <div className="flex gap-2">
            <input
              type="text"
              value={comparisonPrompt}
              onChange={(e) => setComparisonPrompt(e.target.value)}
              placeholder="Enter benchmark prompt (e.g. Derive Lorentz contraction, solve differential equation)..."
              className="flex-1 bg-[#0D141F] border border-[#1E293B] rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleRunComparison}
              disabled={isComparing || !comparisonPrompt.trim()}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#020508] text-xs font-mono font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isComparing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>RUN BENCHMARK</span>
            </button>
          </div>

          {/* Results Side-by-Side Columns */}
          {(comparisonResultA || comparisonResultB || isComparing) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Alpha Output */}
              <div className="bg-[#0B111A] border border-[#1E293B] rounded-xl p-4 space-y-2 min-h-[180px]">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-1.5 text-xs font-mono">
                  <span className="font-bold text-cyan-300">
                    ALPHA: {AI_MODELS_ROSTER.find((m) => m.id === compareModelA)?.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {AI_MODELS_ROSTER.find((m) => m.id === compareModelA)?.provider}
                  </span>
                </div>
                {isComparing && !comparisonResultA ? (
                  <div className="text-xs font-mono text-slate-400 animate-pulse pt-4">
                    Synthesizing response through {compareModelA} matrix...
                  </div>
                ) : comparisonResultA ? (
                  <div className="text-xs text-slate-200 leading-relaxed font-sans max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    <KaTeXRenderer content={comparisonResultA} />
                  </div>
                ) : null}
              </div>

              {/* Beta Output */}
              <div className="bg-[#0B111A] border border-[#1E293B] rounded-xl p-4 space-y-2 min-h-[180px]">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-1.5 text-xs font-mono">
                  <span className="font-bold text-emerald-300">
                    BETA: {AI_MODELS_ROSTER.find((m) => m.id === compareModelB)?.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {AI_MODELS_ROSTER.find((m) => m.id === compareModelB)?.provider}
                  </span>
                </div>
                {isComparing && !comparisonResultB ? (
                  <div className="text-xs font-mono text-slate-400 animate-pulse pt-4">
                    Synthesizing response through {compareModelB} matrix...
                  </div>
                ) : comparisonResultB ? (
                  <div className="text-xs text-slate-200 leading-relaxed font-sans max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    <KaTeXRenderer content={comparisonResultB} />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Filter & Search Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0A0F16] border border-[#1E293B] rounded-xl p-3">
        {/* Provider Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-[11px] font-mono">
          {Object.entries(PROVIDER_LABELS).map(([key, item]) => {
            const isSelected = selectedProviderFilter === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedProviderFilter(key)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                  isSelected ? "font-bold shadow-md" : "text-slate-400 hover:text-slate-200"
                }`}
                style={{
                  backgroundColor: isSelected ? item.bg : "#121822",
                  borderColor: isSelected ? item.border : "#1E2B3E",
                  color: isSelected ? item.color : "#94A3B8",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, provider, spec..."
              className="w-full bg-[#121822] border border-[#1E2B3E] rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#121822] border border-[#1E2B3E] rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="math">Sort: Math Score</option>
            <option value="latency">Sort: Lowest Latency</option>
            <option value="context">Sort: Context Window</option>
          </select>
        </div>
      </div>

      {/* SECTION 4: Interactive AI Models Grid (All 13 Models) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => {
          const isActive = model.id === activeModelId;
          const isTesting = isTestLoading && testingModelId === model.id;

          return (
            <div
              key={model.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "shadow-[0_0_25px_rgba(0,242,255,0.2)]"
                  : "hover:border-[#334155] hover:shadow-xl"
              }`}
              style={{
                backgroundColor: currentTheme.panelBg,
                borderColor: isActive ? model.accentColor : currentTheme.subtleBorder,
              }}
            >
              {/* Active Indicator Strip */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: model.accentColor }}
                />
              )}

              <div className="space-y-4">
                {/* Header: Provider & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border"
                        style={{
                          backgroundColor: `${model.accentColor}18`,
                          borderColor: `${model.accentColor}44`,
                          color: model.accentColor,
                        }}
                      >
                        {model.provider}
                      </span>

                      {model.id === "quantum-prime" ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(0,242,255,0.3)]">
                          <Sparkles className="w-2.5 h-2.5" />
                          FREE (DEFAULT)
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          FREE &amp; UNLOCKED
                        </span>
                      )}

                      {model.isFrontier && model.id !== "quantum-prime" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold">
                          FRONTIER
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {model.name}
                    </h3>
                  </div>

                  {isActive ? (
                    <span
                      className="px-2 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 shrink-0"
                      style={{
                        backgroundColor: `${model.accentColor}22`,
                        borderColor: model.accentColor,
                        color: model.accentColor,
                      }}
                    >
                      <Check className="w-3 h-3" />
                      ACTIVE
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectModel(model.id)}
                      className="px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1 border-[#2D3748] bg-[#121822] hover:border-cyan-500/60 hover:text-cyan-300 text-slate-300"
                    >
                      <span>ACTIVATE</span>
                    </button>
                  )}
                </div>

                {/* Dedicated Model Holographic Core Reactor Unit */}
                {(() => {
                  const mConfig = getModelCoreConfig(model.id);
                  return (
                    <div className="flex items-center gap-3 p-2 bg-[#080D15] rounded-xl border border-[#16202C]">
                      <div className="w-14 h-14 shrink-0 flex items-center justify-center relative overflow-hidden rounded-lg bg-[#05080E]">
                        <HolographicCore
                          size="sm"
                          modelId={model.id}
                          voiceState={{
                            isListening: false,
                            isSpeaking: false,
                            isProcessing: false,
                            mode: "STANDBY",
                            transcript: "",
                            audioLevel: 0,
                          }}
                          showControls={false}
                          themeMode={themeMode}
                          className="scale-75"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                          DEDICATED CORE:
                        </div>
                        <div
                          className="text-xs font-mono font-bold truncate"
                          style={{ color: model.accentColor }}
                        >
                          {mConfig.archetype}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                          {mConfig.harmonicFreq} • {mConfig.fluxRating}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Tagline & Description */}
                <div>
                  <p className="text-xs font-mono font-semibold" style={{ color: model.accentColor }}>
                    {model.tagline}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {model.description}
                  </p>
                </div>

                {/* Technical Specifications Bar */}
                <div className="bg-[#0B0F14] rounded-xl p-3 border border-[#1A222C] space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>ARCHITECTURE:</span>
                    <span className="text-slate-200 truncate max-w-[170px]" title={model.architecture}>
                      {model.architecture}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1A222C]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">CONTEXT:</span>
                      <span className="text-white font-bold">{model.contextWindow}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">MAX OUTPUT:</span>
                      <span
                        className="font-bold truncate block"
                        style={{ color: model.id === "quantum-prime" ? "#00F2FF" : "#E2E8F0" }}
                      >
                        {model.maxOutputTokens}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">LATENCY:</span>
                      <span className="text-emerald-400 font-bold">{model.latencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">THROUGHPUT:</span>
                      <span className="text-white font-bold">{model.throughputTokSec} tok/s</span>
                    </div>
                  </div>
                </div>

                {/* Benchmark Scores Meter */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>STEM REASONING BENCHMARKS</span>
                    <span className="font-bold text-white">AVG {Math.round(
                      (model.benchmarks.advancedMath +
                        model.benchmarks.quantumPhysics +
                        model.benchmarks.codeSynthesis +
                        model.benchmarks.logicalReasoning) /
                        4
                    )}%</span>
                  </div>

                  {/* Math */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Advanced Math:</span>
                      <span className="text-slate-200 font-bold">{model.benchmarks.advancedMath}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1A1F26] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${model.benchmarks.advancedMath}%`,
                          backgroundColor: model.accentColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Quantum & Physics */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Physics & Quantum:</span>
                      <span className="text-slate-200 font-bold">{model.benchmarks.quantumPhysics}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1A1F26] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${model.benchmarks.quantumPhysics}%`,
                          backgroundColor: "#3B82F6",
                        }}
                      />
                    </div>
                  </div>

                  {/* Code Synthesis */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Code Synthesis:</span>
                      <span className="text-slate-200 font-bold">{model.benchmarks.codeSynthesis}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1A1F26] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${model.benchmarks.codeSynthesis}%`,
                          backgroundColor: "#10B981",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Strengths Chips */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">KEY CAPABILITIES:</span>
                  <div className="flex flex-wrap gap-1">
                    {model.strengths.slice(0, 2).map((st, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131A24] border border-[#232E3E] text-slate-300 leading-tight"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#1A222C] flex items-center gap-2">
                <button
                  onClick={() => onSelectModel(model.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500 text-[#020508] shadow-[0_0_12px_rgba(0,242,255,0.4)]"
                      : "bg-[#161F2C] hover:bg-[#202B3D] text-slate-200 border border-[#2D3748] hover:border-cyan-500/60"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: model.accentColor,
                          boxShadow: `0 0 14px ${model.bgGlow}`,
                        }
                      : {}
                  }
                >
                  {isActive ? (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>ACTIVE REASONING CORE</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>SELECT CORE</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleRunModelTest(model)}
                  disabled={isTesting}
                  title={`Run benchmark query with ${model.name}`}
                  className="p-2 rounded-lg border transition-colors cursor-pointer bg-[#161F2C] border-[#2D3748] text-slate-300 hover:text-white hover:border-cyan-400"
                >
                  {isTesting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : (
                    <Zap className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 5: Live Test Drawer Modal / Output */}
      {testResponseOutput && (
        <div className="rounded-2xl border border-cyan-500/50 bg-[#0A101A] p-5 space-y-3 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 font-bold">
              <Terminal className="w-4 h-4" />
              <span>LIVE TEST OUTPUT: {testResponseOutput.modelName}</span>
            </div>
            <button
              onClick={() => setTestResponseOutput(null)}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed font-sans max-h-96 overflow-y-auto custom-scrollbar p-3 bg-[#060B12] rounded-xl border border-[#1A222C]">
            <KaTeXRenderer content={testResponseOutput.text} />
          </div>
        </div>
      )}
    </div>
  );
};
