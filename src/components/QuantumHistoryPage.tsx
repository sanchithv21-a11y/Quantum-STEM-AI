import React, { useState, useMemo } from "react";
import { ChatMessage, STEMDomain, QuantumThemeMode, AIModelId } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { AI_MODELS_ROSTER } from "../data/aiModelsData";
import { KaTeXRenderer } from "../utils/katexRenderer";
import { playQuantumClick } from "../utils/soundEffects";
import {
  History,
  Search,
  Trash2,
  Download,
  Copy,
  Check,
  Filter,
  Calendar,
  Clock,
  Bot,
  User,
  Volume2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Layers,
  Cpu,
  FileText,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  FileCode,
  Tag,
  Share2,
} from "lucide-react";

interface QuantumHistoryPageProps {
  messages: ChatMessage[];
  onClearHistory: () => void;
  onDeleteMessage: (id: string) => void;
  onRestoreToActivePrompt: (prompt: string, domain?: STEMDomain, modelId?: AIModelId) => void;
  onSpeakMessage: (text: string) => void;
  themeMode?: QuantumThemeMode;
}

export const QuantumHistoryPage: React.FC<QuantumHistoryPageProps> = ({
  messages,
  onClearHistory,
  onDeleteMessage,
  onRestoreToActivePrompt,
  onSpeakMessage,
  themeMode = "normal",
}) => {
  const currentTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<"all" | "user" | "assistant">("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter messages based on search & filters
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Exclude empty or system init if user searches
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesContent = msg.content.toLowerCase().includes(query);
        const matchesDomain = msg.domain?.toLowerCase().includes(query);
        const matchesModel = msg.modelName?.toLowerCase().includes(query) || msg.model?.toLowerCase().includes(query);
        if (!matchesContent && !matchesDomain && !matchesModel) return false;
      }

      if (selectedDomain !== "all" && msg.domain !== selectedDomain) {
        return false;
      }

      if (selectedRole !== "all" && msg.role !== selectedRole) {
        return false;
      }

      if (selectedModel !== "all") {
        if (msg.model !== selectedModel && msg.modelName !== selectedModel) {
          return false;
        }
      }

      return true;
    });
  }, [messages, searchQuery, selectedDomain, selectedRole, selectedModel]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalCount = messages.length;
    const userQueries = messages.filter((m) => m.role === "user").length;
    const assistantResponses = messages.filter((m) => m.role === "assistant").length;
    const voiceCount = messages.filter((m) => m.isVoiceInput || m.isVoiceOutput).length;
    
    // Domain breakdown
    const domainsCount: Record<string, number> = {};
    messages.forEach((m) => {
      if (m.domain) {
        domainsCount[m.domain] = (domainsCount[m.domain] || 0) + 1;
      }
    });

    return {
      totalCount,
      userQueries,
      assistantResponses,
      voiceCount,
      domainsCount,
    };
  }, [messages]);

  // Selected message for details drawer
  const activeMessage = useMemo(() => {
    if (!selectedMessageId) return filteredMessages[0] || null;
    return messages.find((m) => m.id === selectedMessageId) || filteredMessages[0] || null;
  }, [messages, selectedMessageId, filteredMessages]);

  const handleCopy = (id: string, text: string) => {
    playQuantumClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    playQuantumClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quantum_stem_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportMarkdown = () => {
    playQuantumClick();
    let md = `# QUANTUM STEM INTELLIGENCE // RESEARCH & INQUIRY SESSION LOG\n\n`;
    md += `*Exported on: ${new Date().toLocaleString()}*\n`;
    md += `*Total Exchanges: ${messages.length}*\n\n---\n\n`;

    messages.forEach((msg, idx) => {
      md += `### [${msg.timestamp}] ${msg.role === "user" ? "👤 USER QUERY" : "🤖 QUANTUM AI"}`;
      if (msg.domain) md += ` | Domain: ${msg.domain.toUpperCase()}`;
      if (msg.modelName) md += ` | Engine: ${msg.modelName}`;
      md += `\n\n${msg.content}\n\n---\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quantum_session_transcript_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in font-sans">
      {/* Top Header Card */}
      <div
        className="p-6 rounded-2xl border backdrop-blur-xl relative overflow-hidden transition-all duration-500 shadow-2xl"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
          boxShadow: `0 0 35px ${currentTheme.glowColor}`,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div
                className="p-2 rounded-xl border flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: currentTheme.activeBadgeBg,
                  borderColor: currentTheme.primary,
                  color: currentTheme.primary,
                }}
              >
                <History className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                <span>SESSION AUDIT &amp; INQUIRY HISTORY</span>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full border font-mono font-bold"
                  style={{
                    backgroundColor: currentTheme.activeBadgeBg,
                    borderColor: currentTheme.primary,
                    color: currentTheme.primary,
                  }}
                >
                  {messages.length} ENTRIES
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Comprehensive log of all theoretical physics computations, LaTeX math derivations, code executions, and AI model syntheses conducted during this session. Filter, search, replay queries, or export full research transcripts.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold text-slate-300 bg-[#0B1017] border-slate-800 hover:border-slate-700 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Export session transcripts as a clean Markdown report"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT MARKDOWN</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold text-slate-300 bg-[#0B1017] border-slate-800 hover:border-slate-700 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Export complete session state as JSON for archiving"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT JSON</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={messages.length <= 1}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                messages.length <= 1
                  ? "opacity-50 cursor-not-allowed bg-red-950/20 border-red-900/30 text-red-400"
                  : "bg-red-950/40 border-red-500/50 text-red-400 hover:bg-red-900/60 hover:border-red-400"
              }`}
              title="Clear all messages and reset conversation history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR LOGS</span>
            </button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-800/80 mt-5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 space-y-0.5">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TOTAL EXCHANGES</span>
            <span className="text-base font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              {stats.totalCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 space-y-0.5">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">USER INQUIRIES</span>
            <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              {stats.userQueries}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 space-y-0.5">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">AI SYNTHESES</span>
            <span className="text-base font-bold text-purple-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-400" />
              {stats.assistantResponses}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 space-y-0.5">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">VOICE INTERACTIONS</span>
            <span className="text-base font-bold text-amber-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              {stats.voiceCount}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filtering Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, formulas, mathematical terms, or Python code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-[#0B1017] border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Domain Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border bg-[#0B1017] border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">ALL DOMAINS</option>
            <option value="physics">PHYSICS</option>
            <option value="calculus">CALCULUS</option>
            <option value="quantum">QUANTUM</option>
            <option value="engineering">ENGINEERING</option>
            <option value="chemistry">CHEMISTRY</option>
            <option value="biology">BIOLOGY</option>
            <option value="earth_science">EARTH SCIENCE</option>
            <option value="orbital">ORBITAL MECHANICS</option>
            <option value="ai_neural">AI &amp; CODE</option>
          </select>
        </div>

        {/* Role Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border bg-[#0B1017] border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">ALL ROLES</option>
            <option value="user">USER QUERIES</option>
            <option value="assistant">QUANTUM RESPONSES</option>
          </select>
        </div>

        {/* AI Model Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border bg-[#0B1017] border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">ALL AI ENGINES</option>
            {AI_MODELS_ROSTER.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Column View: Interactive List + Full Render Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: Timeline List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-800 bg-[#090E16] text-center space-y-3">
              <History className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
              <div className="text-sm font-mono text-slate-400 font-bold">No Matching History Records</div>
              <p className="text-xs text-slate-500">
                Try adjusting your search keywords or clearing domain filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("all");
                  setSelectedRole("all");
                  setSelectedModel("all");
                }}
                className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/20 cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              const isSelected = activeMessage?.id === msg.id;
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id || index}
                  onClick={() => {
                    playQuantumClick();
                    setSelectedMessageId(msg.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2 relative group ${
                    isSelected
                      ? "bg-[#0E1522] border-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "bg-[#090E16] border-slate-800/90 hover:border-slate-700 hover:bg-[#0B111B]"
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: currentTheme.primary,
                          boxShadow: `0 0 15px ${currentTheme.glowColor}`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span
                        className={`p-1 rounded-md border flex items-center justify-center ${
                          isUser
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                        }`}
                      >
                        {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </span>
                      <span className="font-bold text-slate-200">
                        {isUser ? "USER" : msg.modelName || "QUANTUM"}
                      </span>
                      {msg.domain && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                          {msg.domain}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {msg.content.replace(/[#*`]/g, "")}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                    <span className="text-slate-600">ID: {msg.id.slice(-6)}</span>
                    <span className="text-cyan-400/80 group-hover:text-cyan-300 flex items-center gap-0.5">
                      VIEW FULL LOG <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Message Details & KaTeX Renderer (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {activeMessage ? (
            <div
              className="p-6 rounded-2xl border bg-[#080D14] flex-1 flex flex-col justify-between shadow-2xl relative"
              style={{
                borderColor: currentTheme.panelBorder,
                boxShadow: `0 0 25px ${currentTheme.glowColor}`,
              }}
            >
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 ${
                        activeMessage.role === "user"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                      }`}
                    >
                      {activeMessage.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      {activeMessage.role === "user" ? "USER INQUIRY" : "AI SYNTHESIS LOG"}
                    </span>

                    {activeMessage.domain && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase font-bold text-[10px]">
                        DOMAIN: {activeMessage.domain}
                      </span>
                    )}

                    {activeMessage.modelName && (
                      <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/50 text-purple-300 font-bold text-[10px]">
                        ENGINE: {activeMessage.modelName}
                      </span>
                    )}
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(activeMessage.id, activeMessage.content)}
                      className="p-2 rounded-lg border bg-black/40 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                      title="Copy content to clipboard"
                    >
                      {copiedId === activeMessage.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onSpeakMessage(activeMessage.content)}
                      className="p-2 rounded-lg border bg-black/40 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer"
                      title="Read aloud using Neural Voice Engine"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {activeMessage.role === "user" && (
                      <button
                        onClick={() => {
                          playQuantumClick();
                          onRestoreToActivePrompt(
                            activeMessage.content,
                            activeMessage.domain,
                            activeMessage.model as AIModelId
                          );
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-cyan-500/20 border-cyan-400 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
                        title="Load this inquiry into active chat HUD"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>RE-RUN INQUIRY</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteMessage(activeMessage.id)}
                      className="p-2 rounded-lg border bg-red-950/30 border-red-800/40 text-red-400 hover:bg-red-900/50 hover:border-red-500 transition-all cursor-pointer"
                      title="Delete this message from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Render with KaTeX */}
                <div className="max-h-[480px] overflow-y-auto pr-2 custom-scrollbar space-y-3 text-xs leading-relaxed text-slate-200">
                  <KaTeXRenderer content={activeMessage.content} />
                </div>
              </div>

              {/* Timestamp & Metadata Footer */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-3">
                  <span>LOGGED: {activeMessage.timestamp}</span>
                  <span>RECORD ID: #{activeMessage.id}</span>
                </div>
                <div className="text-slate-400 font-bold">
                  STATUS: VERIFIED IN ARCHIVE
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-slate-800 bg-[#080D14] flex-1 flex flex-col items-center justify-center text-center text-slate-500">
              <History className="w-10 h-10 mb-2 opacity-40" />
              <p className="font-mono text-xs">Select any entry on the left to view detailed mathematical proofs and transcripts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl border bg-[#0B1017] border-red-500/50 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-mono text-white">Clear Entire History?</h3>
              <p className="text-xs text-slate-400">
                This will purge all {messages.length} session inquiry logs, calculations, and mathematical proofs from this session.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-mono font-bold hover:bg-slate-700 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl border border-red-500 bg-red-900/50 text-red-200 text-xs font-mono font-bold hover:bg-red-800 cursor-pointer"
              >
                CONFIRM PURGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
