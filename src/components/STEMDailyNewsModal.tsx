import React, { useState } from "react";
import { STEMNewsArticle, QuantumThemeMode } from "../types";
import { DAILY_STEM_NEWS_ARTICLES } from "../data/stemNewsData";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import {
  Newspaper,
  X,
  Sparkles,
  ExternalLink,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Copy,
  Clock,
  Flame,
  ArrowRight,
  RefreshCw,
  Share2,
} from "lucide-react";

interface STEMDailyNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeTopic: (prompt: string) => void;
  themeMode?: QuantumThemeMode;
}

export const STEMDailyNewsModal: React.FC<STEMDailyNewsModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeTopic,
  themeMode = "normal",
}) => {
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const categories = [
    "All",
    "Quantum & Physics",
    "Astrophysics & Space",
    "AI & Mathematics",
    "Biotechnology",
    "Energy & Materials",
  ];

  const filteredArticles = DAILY_STEM_NEWS_ARTICLES.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCitation = (article: STEMNewsArticle) => {
    const citation = `${article.title}. ${article.source} (${article.publishedDate}). Ref: ${article.paperDoiOrArxiv || "Online"}`;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(citation).catch(() => {});
      }
    } catch {
      // Safe fallback
    }
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: "#080C11",
          borderColor: theme.subtleBorder,
          boxShadow: `0 0 40px ${theme.glowColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: theme.subtleBorder, backgroundColor: theme.panelBg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: theme.activeBadgeBg,
                borderColor: `${theme.primary}44`,
                color: theme.primary,
              }}
            >
              <Newspaper className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono text-slate-100 tracking-wider">
                  DAILY STEM NEWS DISPATCH
                </h2>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase"
                  style={{
                    backgroundColor: theme.activeBadgeBg,
                    borderColor: theme.primary,
                    color: theme.primary,
                  }}
                >
                  LIVE FEED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Peer-reviewed breakthroughs, arXiv preprints, space discoveries & physics milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg border border-[#2D3748] text-slate-400 hover:text-slate-100 hover:bg-[#1A222C] transition-all cursor-pointer"
              title="Refresh STEM Dispatches"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#2D3748] text-slate-400 hover:text-slate-100 hover:bg-[#1A222C] transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#1A222C] bg-[#0A0E14] flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by concept, paper, source..."
              className="w-full bg-[#05080C] border border-[#232D3B] text-slate-200 pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md border whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "font-bold shadow-md"
                      : "text-slate-400 border-[#1E293B] bg-[#0E1520] hover:text-slate-200"
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.activeBadgeBg : undefined,
                    borderColor: isSelected ? theme.primary : undefined,
                    color: isSelected ? theme.primary : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* News Feed List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No STEM news found matching &quot;{searchQuery}&quot; in category {selectedCategory}.
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="rounded-xl border p-4 sm:p-5 transition-all duration-300 relative group hover:border-cyan-500/50 bg-[#0B1017]"
                style={{
                  borderColor: theme.subtleBorder,
                }}
              >
                {/* Top Metas: Category, Source & Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: theme.activeBadgeBg,
                        borderColor: `${theme.primary}44`,
                        color: theme.primary,
                      }}
                    >
                      {article.category.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      {article.source}
                    </span>
                    {article.paperDoiOrArxiv && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16202E] text-slate-400 border border-[#232D3B]">
                        {article.paperDoiOrArxiv}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {article.publishedDate}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      IMPACT: {article.impactScore}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                  {article.summary}
                </p>

                {/* Key Breakthrough Takeaway Box */}
                <div className="bg-[#05080C] p-3 rounded-lg border border-[#1A2533] text-xs font-mono mb-3">
                  <span className="text-cyan-400 font-bold block mb-1 text-[11px]">
                    CORE SCIENTIFIC ADVANCEMENT:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {article.keyTakeaway}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#16202E]">
                  <div className="flex items-center gap-2">
                    {/* Analyze with Quantum Button */}
                    <button
                      onClick={() => {
                        onAnalyzeTopic(article.promptToAnalyze);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer text-[#020508]"
                      style={{
                        backgroundColor: theme.primary,
                        boxShadow: `0 0 15px ${theme.glowColor}`,
                      }}
                      title="Send this research problem to Quantum for instant derivation"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ANALYZE WITH QUANTUM</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Copy Citation */}
                    <button
                      onClick={() => handleCopyCitation(article)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#232D3B] text-slate-300 hover:text-slate-100 hover:bg-[#16202E] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Copy BibTeX / Paper Citation"
                    >
                      {copiedId === article.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Cite</span>
                        </>
                      )}
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    {article.readTime}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0"
          style={{ borderColor: theme.subtleBorder, backgroundColor: "#06090D" }}
        >
          <span>SYNCHRONIZED WITH ARXIV, NATURE & IEEE SCIENTIFIC REPOSITORIES</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#16202E] text-slate-200 hover:bg-[#202C3E] text-xs transition-all cursor-pointer font-mono"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
