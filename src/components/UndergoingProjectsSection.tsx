import React, { useState } from "react";
import { QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import {
  Mic,
  Car,
  ShieldCheck,
  Layers,
  Sparkles,
  Clock,
  Construction,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Code2,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface UndergoingProjectsSectionProps {
  themeMode?: QuantumThemeMode;
  className?: string;
  id?: string;
}

type ProjectId = "syntra" | "carx" | "cynova";

interface UndergoingProject {
  id: ProjectId;
  name: string;
  title: string;
  tagline: string;
  badge: string;
  stage: string;
  progressPercent: number;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  keyHighlights: string[];
  techStack: string[];
  statusDetails: { label: string; value: string }[];
}

const UNDERGOING_PROJECTS: UndergoingProject[] = [
  {
    id: "syntra",
    name: "SYNTRA",
    title: "SYNTRA - Personal voice AI agent",
    tagline: "Personal voice AI agent",
    badge: "Voice AI Agent",
    stage: "In Active Development",
    progressPercent: 68,
    accentColor: "#A855F7", // Purple
    accentBg: "rgba(168, 85, 247, 0.12)",
    borderColor: "rgba(168, 85, 247, 0.35)",
    icon: Mic,
    description:
      "A dedicated personal voice AI agent crafted for ultra-responsive vocal interaction, contextual acoustic reasoning, hands-free personal productivity, and natural speech synthesis.",
    keyHighlights: [
      "Natural conversational voice synthesis with human-like prosody",
      "Real-time voice command parsing & task automation",
      "Personalized memory buffer for recurring user preferences",
      "Acoustic noise suppression & low-latency edge speech processing",
    ],
    techStack: ["Neural TTS Engine", "Acoustic Transformer", "Speech LLM", "Audio Streaming"],
    statusDetails: [
      { label: "Category", value: "Personal Voice AI Agent" },
      { label: "Status", value: "Undergoing Development" },
      { label: "Current Phase", value: "Speech Synthesis & Tuning" },
      { label: "Access", value: "Upcoming Release" },
    ],
  },
  {
    id: "carx",
    name: "Carx",
    title: "Carx - All about cars and it's varients",
    tagline: "All about cars and it's varients",
    badge: "Automotive Platform",
    stage: "In Active Development",
    progressPercent: 74,
    accentColor: "#F59E0B", // Amber / Warm Orange
    accentBg: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.35)",
    icon: Car,
    description:
      "An encyclopedic automotive intelligence platform dedicated to all about cars and their variants, detailed trim specifications, performance comparisons, powertrains, and mechanical differences.",
    keyHighlights: [
      "Exhaustive variant-by-variant specs, trim differences & pricing",
      "Powertrain analysis: ICE engines, PHEV systems & modern EV setups",
      "Performance benchmarking: 0-100 km/h, dyno curves & lap times",
      "Visual trim comparisons with detailed option packages and interior variants",
    ],
    techStack: ["Automotive Telemetry DB", "Variant Matrix", "Specs Engine", "Visual 3D Models"],
    statusDetails: [
      { label: "Category", value: "Cars & Vehicle Variants" },
      { label: "Status", value: "Undergoing Development" },
      { label: "Current Phase", value: "Catalog & Variant Indexing" },
      { label: "Access", value: "Upcoming Release" },
    ],
  },
  {
    id: "cynova",
    name: "CYNOVA",
    title: "CYNOVA - A security based agent used for safety purpose",
    tagline: "A security based agent used for safety purpose",
    badge: "Security & Safety Agent",
    stage: "In Active Development",
    progressPercent: 62,
    accentColor: "#10B981", // Emerald Green
    accentBg: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    icon: ShieldCheck,
    description:
      "A proactive, security-based autonomous agent engineered specifically for safety purposes, vulnerability auditing, credential integrity checks, identity shielding, and personal digital defense.",
    keyHighlights: [
      "Autonomous security assessment for personal systems and devices",
      "Proactive safety guardian against tracking, phishing & data leaks",
      "Zero-trust credential verification & encryption validation",
      "Real-time alerts and actionable safety recommendations",
    ],
    techStack: ["Zero-Trust Guard", "Safety Sentinel", "Vulnerability Scanner", "Entropy Verifier"],
    statusDetails: [
      { label: "Category", value: "Security & Safety Agent" },
      { label: "Status", value: "Undergoing Development" },
      { label: "Current Phase", value: "Heuristic Safety Testing" },
      { label: "Access", value: "Upcoming Release" },
    ],
  },
];

export const UndergoingProjectsSection: React.FC<UndergoingProjectsSectionProps> = ({
  themeMode = "normal",
  className = "",
  id = "undergoing-projects-section",
}) => {
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId>("syntra");

  const activeProject =
    UNDERGOING_PROJECTS.find((p) => p.id === selectedProjectId) || UNDERGOING_PROJECTS[0];

  const handleSelectProject = (projectId: ProjectId) => {
    playQuantumClick();
    setSelectedProjectId(projectId);
  };

  return (
    <section
      id={id}
      className={`w-full rounded-2xl border shadow-xl p-4 sm:p-6 transition-all duration-500 relative overflow-hidden backdrop-blur-xl ${className}`}
      style={{
        backgroundColor: theme.panelBg,
        borderColor: `${theme.primary}44`,
        boxShadow: `0 10px 35px rgba(0,0,0,0.5), 0 0 20px ${theme.glowColor}`,
      }}
    >
      {/* Corner Accents */}
      <div
        className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 pointer-events-none opacity-70"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 pointer-events-none opacity-70"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 pointer-events-none opacity-70"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 pointer-events-none opacity-70"
        style={{ borderColor: theme.primary }}
      />

      {/* Header Section */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-5"
        style={{ borderColor: theme.subtleBorder }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1.5"
              style={{
                backgroundColor: `${theme.primary}18`,
                borderColor: `${theme.primary}50`,
                color: theme.primary,
              }}
            >
              <Construction className="w-3 h-3" />
              <span>UNDERGOING PROJECTS</span>
            </span>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>In Progress</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Undergoing Project</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Currently undergoing development projects. Explore what each upcoming application is about:
          </p>
        </div>

        {/* Project Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090E17] border border-[#1E2B3E] shrink-0 overflow-x-auto">
          {UNDERGOING_PROJECTS.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            const Icon = proj.icon;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(proj.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? "shadow-md scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border-transparent"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: proj.accentBg,
                        borderColor: proj.borderColor,
                        color: proj.accentColor,
                      }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{proj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Visible Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {UNDERGOING_PROJECTS.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const Icon = project.icon;

          return (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project.id)}
              className={`rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isSelected
                  ? "bg-[#0F1726] shadow-lg scale-[1.01]"
                  : "bg-[#0A101C]/80 hover:bg-[#0E1624] border-[#1C283C] hover:border-slate-600"
              }`}
              style={
                isSelected
                  ? {
                      borderColor: project.accentColor,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${project.accentColor}25`,
                    }
                  : {}
              }
            >
              <div>
                {/* Top Title & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center border shrink-0"
                      style={{
                        backgroundColor: `${project.accentColor}20`,
                        borderColor: `${project.accentColor}60`,
                        color: project.accentColor,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {project.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {project.badge}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded font-semibold uppercase border"
                    style={{
                      backgroundColor: `${project.accentColor}15`,
                      borderColor: `${project.accentColor}40`,
                      color: project.accentColor,
                    }}
                  >
                    {project.stage}
                  </span>
                </div>

                {/* Tagline / Subtitle */}
                <div
                  className="text-xs font-semibold px-2.5 py-1 rounded-md mb-2.5 border flex items-center gap-1.5"
                  style={{
                    backgroundColor: `${project.accentColor}10`,
                    borderColor: `${project.accentColor}30`,
                    color: project.accentColor,
                  }}
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="line-clamp-1">{project.tagline}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3 font-sans">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1 text-[11px] text-slate-400 font-mono mb-3">
                  {project.keyHighlights.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span className="line-clamp-1 text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Progress Bar */}
              <div className="pt-2 border-t border-[#1C283C]">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400">Development</span>
                  <span style={{ color: project.accentColor }} className="font-bold">
                    {project.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progressPercent}%`,
                      backgroundColor: project.accentColor,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Overview Card */}
      <div
        className="rounded-xl border p-4 sm:p-5 transition-all"
        style={{
          backgroundColor: activeProject.accentBg,
          borderColor: activeProject.borderColor,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-md"
              style={{
                backgroundColor: "#0B111D",
                borderColor: activeProject.borderColor,
                color: activeProject.accentColor,
              }}
            >
              <activeProject.icon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activeProject.title}
                </h3>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border"
                  style={{
                    backgroundColor: `${activeProject.accentColor}25`,
                    borderColor: activeProject.borderColor,
                    color: activeProject.accentColor,
                  }}
                >
                  {activeProject.stage}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                {activeProject.description}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/10">
          {activeProject.statusDetails.map((detail, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[#060A10]/70 border border-[#1E2B3E] font-mono text-xs"
            >
              <div className="text-slate-400 text-[10px] uppercase mb-0.5">{detail.label}</div>
              <div className="text-slate-200 font-semibold truncate">{detail.value}</div>
            </div>
          ))}
        </div>

        {/* Core Modules / Features list */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-xs font-mono font-bold uppercase text-slate-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: activeProject.accentColor }} />
            <span>Planned Modules &amp; Capabilities:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeProject.keyHighlights.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#060A10]/60 border border-[#1E2B3E] text-xs font-mono text-slate-300"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeProject.accentColor }}
                />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
