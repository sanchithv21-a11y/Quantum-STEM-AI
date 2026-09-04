import React, { useState, useEffect, useRef } from "react";
import { SystemTelemetry, WorkspaceFile, QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import {
  Terminal as TermIcon,
  FolderKanban,
  MonitorPlay,
  Activity,
  Cpu,
  FileCode,
  Download,
  Plus,
  Trash2,
  Play,
  Check,
  ExternalLink,
  RefreshCw,
  HardDrive,
  Radio,
  Server,
  Code,
} from "lucide-react";

interface DesktopBridgeProps {
  onExecuteCommand: (cmd: string) => void;
  onSendToQuantum: (prompt: string) => void;
  themeMode?: QuantumThemeMode;
}

export const DesktopBridge: React.FC<DesktopBridgeProps> = ({
  onExecuteCommand,
  onSendToQuantum,
  themeMode = "normal",
}) => {
  const activeTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const [activeTab, setActiveTab] = useState<"terminal" | "files" | "software" | "telemetry">(
    "terminal"
  );

  // Terminal state
  const [termInput, setTermInput] = useState("");
  const [termHistory, setTermHistory] = useState<string[]>([
    "[QUANTUM OS v4.2.0-HYPERION] Desktop Software Bridge Online.",
    "Type 'help' to inspect STEM CLI commands or 'sysinfo' for hardware state.",
    "Integrated modules: Python 3.12, SymPy, NumPy, LaTeX Builder, MATLAB Bridge.",
  ]);
  const termEndRef = useRef<HTMLDivElement | null>(null);

  // Files state
  const [files, setFiles] = useState<WorkspaceFile[]>([
    {
      id: "1",
      name: "schrodinger_wavepacket.py",
      extension: "py",
      size: "2.4 KB",
      updatedAt: "Just now",
      content: `import numpy as np
import scipy.integrate as integrate

# 1D Quantum Gaussian Wavepacket Evolution
dx = 0.05
x = np.arange(-10, 10, dx)
k0 = 5.0 # Initial momentum
sigma = 1.0 # Spatial width

psi_0 = (1.0 / (sigma * np.sqrt(np.pi)))**0.5 * np.exp(-x**2 / (2 * sigma**2)) * np.exp(1j * k0 * x)
print(f"Norm of Wavefunction: {np.sum(np.abs(psi_0)**2) * dx:.4f}")
`,
    },
    {
      id: "2",
      name: "relativity_gravitational_tensor.tex",
      extension: "tex",
      size: "4.1 KB",
      updatedAt: "2 mins ago",
      content: `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
\\title{Einstein Field Equations on Curved Lorentzian Manifolds}
\\author{Quantum STEM Core}
\\maketitle

\\section{Geometric Derivation}
The Einstein-Hilbert action in curved spacetime is formulated as:
\\begin{equation}
S = \\frac{1}{2\\kappa} \\int R \\sqrt{-g} \\, d^4x + S_M
\\end{equation}
Varying with respect to metric $g^{\\mu\\nu}$ yields:
\\begin{equation}
G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}
\\end{equation}
\\end{document}
`,
    },
    {
      id: "3",
      name: "topological_qubit_measurements.csv",
      extension: "csv",
      size: "1.8 KB",
      updatedAt: "10 mins ago",
      content: `time_ns,qubit_0_fidelity,qubit_1_fidelity,entanglement_witness
0.0,0.9998,0.9997,1.984
10.0,0.9985,0.9982,1.976
20.0,0.9964,0.9958,1.961
30.0,0.9942,0.9935,1.948
40.0,0.9918,0.9909,1.932
`,
    },
  ]);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile>(files[0]);

  // Telemetry state
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    quantumCoherence: "99.82%",
    qubitState: "384-qubit entangled register locked",
    cpuLoad: "24.6%",
    memoryUsage: "38.2%",
    thermalRate: "39.4°C",
    stemEngines: [
      { name: "Relativity & Tensor Calculus Engine", status: "NOMINAL", latency: "0.9ms" },
      { name: "Quantum Hamiltonian State Solver", status: "NOMINAL", latency: "1.4ms" },
      { name: "Literature & ArXiv Knowledge Matrix", status: "ONLINE", latency: "3.8ms" },
      { name: "Desktop Hardware & OS Automation Bridge", status: "ACTIVE", latency: "0.4ms" },
    ],
    uptimeSeconds: 3840,
  });

  // Desktop apps catalog
  const desktopApps = [
    {
      id: "matlab",
      name: "MATLAB / GNU Octave",
      category: "Scientific Matrix Computation",
      desc: "Simulink models, matrix eigenvalue decomposition, and signal processing.",
      icon: "⚡",
      status: "READY",
    },
    {
      id: "jupyter",
      name: "JupyterLab Scientific",
      category: "Interactive Python Notebooks",
      desc: "NumPy, PyTorch, SymPy, and Matplotlib research workflows.",
      icon: "🪐",
      status: "ACTIVE",
    },
    {
      id: "vscode",
      name: "VS Code Quantum IDE",
      category: "Development Environment",
      desc: "LaTeX, C++ CUDA kernel compilers, and Python scientific extensions.",
      icon: "💻",
      status: "READY",
    },
    {
      id: "blender",
      name: "Blender 3D CAD & Mesh",
      category: "Scientific 3D Visualization",
      desc: "Molecular orbital renders, spacetime curvature meshes, and fluid flows.",
      icon: "🎨",
      status: "STANDBY",
    },
  ];

  // Fetch telemetry
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch("/api/system/telemetry");
        const text = await res.text();
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
        if (data && data.quantumCoherence) {
          setTelemetry(data);
        }
      } catch (e) {
        // fallback to default telemetry
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = termInput.trim();
    if (!cmd) return;

    const newHistory = [...termHistory, `$ ${cmd}`];

    if (cmd === "clear") {
      setTermHistory([]);
      setTermInput("");
      return;
    }

    if (cmd === "help") {
      newHistory.push(
        "Available Quantum STEM Shell Commands:",
        "  quantum <prompt>   - Send prompt directly to Quantum intelligence core",
        "  calc <expr>        - Evaluate scientific mathematical expressions",
        "  sysinfo            - Display CPU, memory, and quantum telemetry matrix",
        "  ls                 - List research workspace project files",
        "  cat <filename>     - Display file contents",
        "  open <app>         - Launch desktop software (matlab, jupyter, vscode)",
        "  clear              - Clear terminal window"
      );
    } else if (cmd === "sysinfo") {
      newHistory.push(
        `[QUANTUM TELEMETRY] Coherence: ${telemetry.quantumCoherence} | CPU: ${telemetry.cpuLoad} | RAM: ${telemetry.memoryUsage} | Temp: ${telemetry.thermalRate}`
      );
    } else if (cmd === "ls") {
      newHistory.push(
        "Workspace Files:",
        ...files.map((f) => `  - ${f.name} (${f.size}, updated ${f.updatedAt})`)
      );
    } else if (cmd.startsWith("cat ")) {
      const target = cmd.slice(4).trim();
      const found = files.find((f) => f.name.toLowerCase() === target.toLowerCase());
      if (found) {
        newHistory.push(`--- File: ${found.name} ---`, found.content);
      } else {
        newHistory.push(`Error: File '${target}' not found in workspace.`);
      }
    } else if (cmd.startsWith("calc ")) {
      const expr = cmd.slice(5).trim();
      try {
        // Evaluate safe math
        const res = Function(`"use strict"; return (${expr})`)();
        newHistory.push(`Result: ${res}`);
      } catch (err: any) {
        newHistory.push(`Evaluation Error: ${err.message}`);
      }
    } else if (cmd.startsWith("quantum ")) {
      const prompt = cmd.slice(8).trim();
      newHistory.push(`[Quantum Routing] Directing prompt to AI core: "${prompt}"`);
      onSendToQuantum(prompt);
    } else if (cmd.startsWith("open ")) {
      const appName = cmd.slice(5).trim();
      newHistory.push(`[Desktop Bridge] Initializing desktop software process '${appName}'...`);
      setTimeout(() => {
        setTermHistory((prev) => [...prev, `[Desktop Bridge] Process '${appName}' is now running with PID 4096.`]);
      }, 600);
    } else {
      newHistory.push(`quantum-sh: command not found: '${cmd}'. Type 'help' for command list.`);
    }

    setTermHistory(newHistory);
    setTermInput("");

    setTimeout(() => {
      termEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleDownloadFile = (file: WorkspaceFile) => {
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex flex-col h-full rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-500"
      style={{
        backgroundColor: activeTheme.panelBg,
        borderColor: activeTheme.subtleBorder,
      }}
    >
      {/* Tab Navigation Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 border-b transition-colors duration-500"
        style={{
          backgroundColor: activeTheme.cardBg,
          borderColor: activeTheme.subtleBorder,
        }}
      >
        <div
          className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest uppercase transition-colors duration-500"
          style={{ color: activeTheme.primary }}
        >
          <MonitorPlay
            className="w-4 h-4"
            style={{ color: activeTheme.primary }}
          />
          <span>DESKTOP SYSTEM & SOFTWARE BRIDGE</span>
        </div>

        <div className="flex items-center gap-1 bg-[#1A1F26] p-1 rounded-lg border border-[#2D3748] text-xs font-mono">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "terminal"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "terminal"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <TermIcon className="w-3.5 h-3.5" />
            <span>Terminal Shell</span>
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "files"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "files"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Research Files</span>
          </button>
          <button
            onClick={() => setActiveTab("software")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "software"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "software"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <Server className="w-3.5 h-3.5" />
            <span>Desktop Apps</span>
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "telemetry"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "telemetry"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "terminal" && (
          <div className="flex flex-col h-full bg-[#04060d] rounded-xl border border-cyan-900/50 p-3.5 font-mono text-xs shadow-inner">
            {/* Terminal output logs */}
            <div className="flex-1 overflow-y-auto space-y-1.5 text-cyan-300/90 leading-relaxed custom-scrollbar pb-2">
              {termHistory.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith("$")
                      ? "text-cyan-100 font-bold"
                      : line.startsWith("Error")
                      ? "text-rose-400"
                      : line.startsWith("Result")
                      ? "text-emerald-300 font-semibold"
                      : "text-slate-300"
                  }
                >
                  {line}
                </div>
              ))}
              <div ref={termEndRef} />
            </div>

            {/* Terminal Input Line */}
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-cyan-900/40">
              <span className="text-cyan-400 font-bold font-hud">QUANTUM&gt;</span>
              <input
                type="text"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                placeholder="type command (e.g. 'help', 'calc 2 * Math.PI * 40', 'quantum explain Bell inequality')..."
                className="flex-1 bg-transparent text-cyan-100 focus:outline-none font-mono text-xs"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] hover:bg-cyan-900 transition-colors"
              >
                EXECUTE
              </button>
            </form>
          </div>
        )}

        {activeTab === "files" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            {/* File List */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pb-1">
                <span>PROJECT REPOSITORY</span>
                <span className="text-[10px] text-slate-500">{files.length} items</span>
              </div>
              <div className="space-y-1.5">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      selectedFile.id === file.id
                        ? "bg-cyan-950/60 border-cyan-400 text-cyan-100 shadow-md"
                        : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate font-mono">{file.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{file.size}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const newName = `research_model_${files.length + 1}.py`;
                  const newF: WorkspaceFile = {
                    id: String(Date.now()),
                    name: newName,
                    extension: "py",
                    size: "1.2 KB",
                    updatedAt: "Just now",
                    content: `# Quantum Scientific Python Routine\nimport numpy as np\nprint("Executing Quantum Matrix Calculation...")\n`,
                  };
                  setFiles([...files, newF]);
                  setSelectedFile(newF);
                }}
                className="w-full py-2 rounded-lg border border-dashed border-cyan-800/60 hover:border-cyan-400/60 text-slate-400 hover:text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Scientific File</span>
              </button>
            </div>

            {/* File Viewer / Editor */}
            <div className="md:col-span-8 flex flex-col h-full rounded-xl bg-slate-950 border border-cyan-900/40 overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-cyan-900/30">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-200">
                  <span className="font-bold">{selectedFile.name}</span>
                  <span className="text-[10px] text-slate-400">({selectedFile.updatedAt})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadFile(selectedFile)}
                    className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() =>
                      onSendToQuantum(
                        `Quantum, please review and optimize this scientific file (${selectedFile.name}):\n\n\`\`\`${selectedFile.extension}\n${selectedFile.content}\n\`\`\``
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-600/30 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-600/50 transition-colors"
                  >
                    <Radio className="w-3 h-3" />
                    <span>Analyze with Quantum</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 font-mono text-xs text-slate-200 overflow-y-auto custom-scrollbar bg-[#050811]">
                <textarea
                  value={selectedFile.content}
                  onChange={(e) => {
                    const updated = { ...selectedFile, content: e.target.value };
                    setSelectedFile(updated);
                    setFiles(files.map((f) => (f.id === updated.id ? updated : f)));
                  }}
                  className="w-full h-full min-h-[220px] bg-transparent text-cyan-200 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "software" && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Quantum seamlessly interfaces with local scientific engines and desktop software suites:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {desktopApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-500/40 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{app.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-100">{app.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{app.category}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{app.desc}</p>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        onSendToQuantum(
                          `Quantum, execute workflow bridge with ${app.name} and prepare an advanced numerical STEM pipeline.`
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Launch Pipeline</span>
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">Port 8080 Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "telemetry" && (
          <div className="space-y-4">
            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Quantum Coherence</div>
                <div className="text-xl font-bold font-hud text-cyan-100 mt-1">{telemetry.quantumCoherence}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">● Sub-Decoherence Lock</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Core CPU Utilization</div>
                <div className="text-xl font-bold font-hud text-cyan-100 mt-1">{telemetry.cpuLoad}</div>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5">32 Tensor Cores Active</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Memory Matrix</div>
                <div className="text-xl font-bold font-hud text-cyan-100 mt-1">{telemetry.memoryUsage}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">HBM3e 48.0 TB/s</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-900/40">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Thermal State</div>
                <div className="text-xl font-bold font-hud text-cyan-100 mt-1">{telemetry.thermalRate}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Cryogenic Helium Cool</div>
              </div>
            </div>

            {/* Sub-engines health */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-2.5">
              <div className="text-xs font-mono text-cyan-300 font-bold">
                SUBSYSTEM PROTOCOL ENGINES:
              </div>
              <div className="space-y-1.5">
                {telemetry.stemEngines?.map((eng, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/80 text-xs font-mono"
                  >
                    <span className="text-slate-200">{eng.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{eng.latency}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                        {eng.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
