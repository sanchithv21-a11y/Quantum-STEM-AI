import React, { useState } from "react";
import katex from "katex";
import { Check, Copy, Terminal, Play } from "lucide-react";

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = "" }) => {
  const normalized = preprocessContent(content);
  return (
    <div className={`prose prose-invert max-w-full text-slate-200 leading-relaxed font-sans overflow-hidden break-words select-text ${className}`}>
      {renderMarkdownAndMathBlocks(normalized)}
    </div>
  );
};

/**
 * Preprocesses content before rendering:
 * 1. Converts \( ... \) to $ ... $ and \[ ... \] to $$ ... $$
 * 2. Normalizes accidental digit '0' in Big-O Landau complexity notation:
 *    e.g., $0(\log n)$ -> $O(\log n)$, $0(n)$ -> $O(n)$, $0(1)$ -> $O(1)$, $0(N \log N)$ -> $O(N \log N)$
 * 3. Normalizes un-bracketed Big-O typos like 0(\log n) or 0(n) into $O(...)$
 */
function preprocessContent(text: string): string {
  if (!text) return "";
  let processed = text;

  // 1. Replace \[ ... \] with $$ ... $$
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => `$$${formula}$$`);

  // 2. Replace \( ... \) with $ ... $
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => `$${formula}$`);

  // 3. Replace accidental $0(...) with $O(...) (Big-O zero typo)
  processed = processed.replace(/\$0\(([^$\n]+?)\)\$/g, (_, inner) => `$O(${inner})$`);

  // 4. Also handle bare Big-O typos with zero like 0(log n) or 0(n) or 0(1)
  processed = processed.replace(/(?<![\$\w])0\((n|\log n|1|n\s*\log\s*n|n\^?\d*|V\+E|N|N\s*\log\s*N)\)(?![\$])/gi, (_, inner) => `$O(${inner})$`);

  return processed;
}

function renderMarkdownAndMathBlocks(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Code Block: ```lang ... ```
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      nodes.push(
        <CodeSnippetBlock
          key={`code-${blockKey++}`}
          language={language}
          code={codeLines.join("\n")}
        />
      );
      continue;
    }

    // 3. Multi-line Block Math: $$ ... $$
    if (trimmed.startsWith("$$")) {
      // Check if closed on same line (e.g. $$ E = mc^2 $$)
      if (trimmed.length > 2 && trimmed.endsWith("$$")) {
        const mathFormula = trimmed.slice(2, -2).trim();
        nodes.push(renderBlockMath(mathFormula, `math-${blockKey++}`));
        i++;
        continue;
      }

      // Multi-line block math
      const mathLines: string[] = [];
      const firstLineContent = trimmed.slice(2).trim();
      if (firstLineContent) mathLines.push(firstLineContent);
      i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) {
        mathLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        const lastTrimmed = lines[i].trim();
        const lastLineContent = lastTrimmed.slice(0, -2).trim();
        if (lastLineContent) mathLines.push(lastLineContent);
        i++;
      }
      nodes.push(renderBlockMath(mathLines.join("\n"), `math-${blockKey++}`));
      continue;
    }

    // 4. Headings (#, ##, ###, ####)
    if (trimmed.startsWith("#### ")) {
      nodes.push(
        <h4 key={`h4-${blockKey++}`} className="text-sm font-bold text-cyan-300 uppercase tracking-wider mt-4 mb-2 flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
          <span className="flex-1 min-w-0 break-words">{renderInlineMathAndFormatting(trimmed.substring(5))}</span>
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${blockKey++}`} className="text-base sm:text-lg font-bold text-cyan-200 tracking-wide mt-4 mb-2 flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
          <span className="flex-1 min-w-0 break-words">{renderInlineMathAndFormatting(trimmed.substring(4))}</span>
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${blockKey++}`} className="text-lg sm:text-xl font-bold text-cyan-100 tracking-wide mt-5 mb-2.5 border-b border-cyan-900/40 pb-1 flex items-start gap-2">
          <span className="flex-1 min-w-0 break-words">{renderInlineMathAndFormatting(trimmed.substring(3))}</span>
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${blockKey++}`} className="text-xl sm:text-2xl font-black text-cyan-50 tracking-wide mt-6 mb-3">
          <span className="break-words">{renderInlineMathAndFormatting(trimmed.substring(2))}</span>
        </h1>
      );
      i++;
      continue;
    }

    // 5. Markdown Tables: | col1 | col2 |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      nodes.push(renderMarkdownTable(tableLines, `table-${blockKey++}`));
      continue;
    }

    // 6. Unordered List Items: - or * or +
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems: { indent: number; text: string }[] = [];
      while (i < lines.length && (/^\s*[-*+]\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && listItems.length > 0))) {
        const currLine = lines[i];
        if (/^\s*[-*+]\s+/.test(currLine)) {
          const match = currLine.match(/^(\s*)[-*+]\s+(.*)$/);
          if (match) {
            listItems.push({
              indent: match[1].length,
              text: match[2]
            });
          }
        } else if (listItems.length > 0) {
          // Continuation line of previous item
          listItems[listItems.length - 1].text += " " + currLine.trim();
        }
        i++;
      }

      nodes.push(
        <ul key={`ul-${blockKey++}`} className="space-y-2 my-2.5 pl-1">
          {listItems.map((item, lIdx) => (
            <li
              key={`li-${lIdx}`}
              className={`text-slate-200 leading-relaxed text-sm flex items-start gap-2 ${
                item.indent >= 2 ? "ml-4 pl-2 border-l border-cyan-500/20 text-slate-300" : ""
              }`}
            >
              <span className="text-cyan-400 text-xs mt-1 shrink-0 select-none">▸</span>
              <div className="flex-1 min-w-0 break-words">
                {renderInlineMathAndFormatting(item.text)}
              </div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Numbered List: 1. , 2. , etc.
    if (/^\d+\.\s+/.test(trimmed)) {
      const numberedItems: { num: string; text: string }[] = [];
      while (i < lines.length && (/^\s*\d+\.\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && numberedItems.length > 0))) {
        const currLine = lines[i];
        const match = currLine.match(/^\s*(\d+)\.\s+(.*)$/);
        if (match) {
          numberedItems.push({
            num: match[1],
            text: match[2]
          });
        } else if (numberedItems.length > 0) {
          numberedItems[numberedItems.length - 1].text += " " + currLine.trim();
        }
        i++;
      }

      nodes.push(
        <ol key={`ol-${blockKey++}`} className="space-y-2 my-2.5 pl-1">
          {numberedItems.map((item, lIdx) => (
            <li key={`oli-${lIdx}`} className="text-slate-200 leading-relaxed text-sm flex items-start gap-2.5">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-bold shrink-0 mt-0.5 select-none">
                {item.num}
              </span>
              <div className="flex-1 min-w-0 break-words">
                {renderInlineMathAndFormatting(item.text)}
              </div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Regular paragraph text (collect consecutive normal lines)
    const paragraphLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("$$") &&
      !lines[i].trim().startsWith("|") &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    nodes.push(
      <div key={`p-${blockKey++}`} className="text-slate-200 leading-relaxed text-sm my-2 break-words space-y-1">
        {paragraphLines.map((pLine, pIdx) => (
          <div key={`pl-${pIdx}`} className="min-w-0">
            {renderInlineMathAndFormatting(pLine)}
          </div>
        ))}
      </div>
    );
  }

  return nodes;
}

function renderBlockMath(mathFormula: string, key: string): React.ReactNode {
  try {
    const html = katex.renderToString(mathFormula, {
      displayMode: true,
      throwOnError: false,
    });
    return (
      <div
        key={key}
        className="my-3 p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-center overflow-x-auto max-w-full shadow-inner scrollbar-thin scrollbar-thumb-cyan-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <div key={key} className="my-3 p-3 rounded bg-red-950/40 text-red-300 font-mono text-xs border border-red-800/40 overflow-x-auto">
        {mathFormula}
      </div>
    );
  }
}

function renderMarkdownTable(tableLines: string[], key: string): React.ReactNode {
  if (tableLines.length < 2) return null;

  // Filter out separator lines like |---|---|
  const headerLine = tableLines[0];
  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter((h) => h.length > 0);

  const rowLines = tableLines.slice(1).filter((l) => !/^\|?[\s\-:|]+\|?$/.test(l));

  return (
    <div key={key} className="my-3.5 overflow-x-auto rounded-lg border border-cyan-500/20 bg-slate-900/60">
      <table className="w-full text-left text-xs font-sans text-slate-300">
        <thead className="bg-cyan-950/60 text-cyan-300 uppercase font-mono tracking-wider border-b border-cyan-900/50">
          <tr>
            {headers.map((head, idx) => (
              <th key={idx} className="px-3.5 py-2 font-semibold">
                {renderInlineMathAndFormatting(head)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-900/20">
          {rowLines.map((row, rIdx) => {
            const cells = row
              .split("|")
              .map((c) => c.trim())
              .filter((_, idx, arr) => (idx > 0 && idx < arr.length - 1) || arr.length === 1);
            return (
              <tr key={rIdx} className="hover:bg-cyan-950/20 transition-colors">
                {cells.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2">
                    {renderInlineMathAndFormatting(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderInlineMathAndFormatting(text: string): React.ReactNode[] {
  if (!text) return [];

  // Capture block math $$...$$ and inline math $...$
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderBoldItalics(text.substring(lastIndex, match.index), `txt-${lastIndex}`));
    }

    const mathExpr = match[0];
    const isBlock = mathExpr.startsWith("$$") && mathExpr.endsWith("$$");
    const rawFormula = isBlock ? mathExpr.slice(2, -2).trim() : mathExpr.slice(1, -1).trim();

    try {
      const html = katex.renderToString(rawFormula, {
        displayMode: isBlock,
        throwOnError: false,
      });

      if (isBlock) {
        parts.push(
          <div
            key={`math-${match.index}`}
            className="my-3 p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-center overflow-x-auto max-w-full shadow-inner"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        parts.push(
          <span
            key={`math-${match.index}`}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-cyan-950/50 text-cyan-100 font-normal text-sm border border-cyan-800/40 align-middle max-w-full overflow-x-auto select-text shadow-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
    } catch {
      parts.push(<code key={`err-${match.index}`} className="text-rose-400 font-mono text-xs">{rawFormula}</code>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(renderBoldItalics(text.substring(lastIndex), `txt-${lastIndex}`));
  }

  return parts;
}

function renderBoldItalics(text: string, keyPrefix: string): React.ReactNode {
  // Bold **text** and inline `code`
  const segments = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <span key={keyPrefix} className="break-words">
      {segments.map((seg, idx) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return (
            <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-cyan-100">
              {seg.slice(2, -2)}
            </strong>
          );
        }
        if (seg.startsWith("`") && seg.endsWith("`")) {
          return (
            <code
              key={`${keyPrefix}-c-${idx}`}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-xs border border-slate-700"
            >
              {seg.slice(1, -1)}
            </code>
          );
        }
        return seg;
      })}
    </span>
  );
}

const CodeSnippetBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const isPlayableGame =
    /(?:<canvas|requestanimationframe|game\s*loop|keydown|gameover|game\s*over)/i.test(code) &&
    (language.toLowerCase().includes("html") || language.toLowerCase().includes("js") || code.includes("<html"));

  const handleCopy = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
    } catch {
      // Safe fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchGame = () => {
    try {
      const event = new CustomEvent("quantum-launch-game", {
        detail: { code, title: "Quantum Synthesized Game" },
      });
      window.dispatchEvent(event);
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className="my-3 rounded-lg border border-cyan-500/20 bg-[#080d1a] overflow-hidden shadow-lg max-w-full">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-cyan-900/30 text-xs font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider font-bold">{language || "code"}</span>
          {isPlayableGame && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Interactive Game
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isPlayableGame && (
            <button
              onClick={handleLaunchGame}
              className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white px-2 py-0.5 rounded border border-cyan-500/40 text-xs font-mono cursor-pointer transition-all shadow-sm"
              title="Launch this game in Quantum Arena"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Play Game</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors px-2 py-0.5 rounded hover:bg-cyan-950/50 cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-cyan-500/40">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};
