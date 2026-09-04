import React, { useState, useEffect, useRef } from "react";
import { QuantumThemeMode, STEMDomain } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import {
  Calculator,
  Compass,
  Layers,
  ArrowRightLeft,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Send,
  ExternalLink,
  Maximize2,
  Minimize2,
  BookOpen,
  Zap,
  Activity,
  Cpu,
  HelpCircle,
  Clock,
  Trash2,
} from "lucide-react";

interface EngineeringCalculatorProps {
  onSendToQuantum?: (prompt: string, domain?: STEMDomain) => void;
  themeMode?: QuantumThemeMode;
}

// Engineering Constants
const CONSTANTS = [
  { name: "π (Pi)", symbol: "π", value: Math.PI, desc: "Ratio of circle circumference to diameter" },
  { name: "e (Euler's Number)", symbol: "e", value: Math.E, desc: "Base of natural logarithm" },
  { name: "c (Speed of Light)", symbol: "c", value: 299792458, unit: "m/s", desc: "Speed of light in vacuum" },
  { name: "g (Std Gravity)", symbol: "g", value: 9.80665, unit: "m/s²", desc: "Standard gravitational acceleration" },
  { name: "h (Planck)", symbol: "h", value: 6.62607015e-34, unit: "J·s", desc: "Planck's quantum constant" },
  { name: "ε₀ (Permittivity)", symbol: "ε₀", value: 8.8541878128e-12, unit: "F/m", desc: "Vacuum electric permittivity" },
  { name: "μ₀ (Permeability)", symbol: "μ₀", value: 1.25663706212e-6, unit: "N/A²", desc: "Vacuum magnetic permeability" },
  { name: "R (Gas Constant)", symbol: "R", value: 8.314462618, unit: "J/(mol·K)", desc: "Universal molar gas constant" },
  { name: "k_B (Boltzmann)", symbol: "k_B", value: 1.380649e-23, unit: "J/K", desc: "Boltzmann thermal constant" },
  { name: "G (Gravitational)", symbol: "G", value: 6.6743e-11, unit: "m³/(kg·s²)", desc: "Newtonian gravitational constant" },
];

// Desmos Preset Engineering Curves
const DESMOS_PRESETS = [
  {
    name: "Damped Harmonic Oscillation",
    category: "Mechanical & Vibrations",
    latex: "y = e^{-0.15 x} \\cos(2 x)",
    description: "Second-order mass-spring-damper transient step response with exponential decaying envelope.",
  },
  {
    name: "Fourier Series (Square Wave N=5)",
    category: "Electrical & Signals",
    latex: "y = \\frac{4}{\\pi}(\\sin(x) + \\frac{1}{3}\\sin(3x) + \\frac{1}{5}\\sin(5x) + \\frac{1}{7}\\sin(7x))",
    description: "Odd harmonic Fourier superposition demonstrating harmonic synthesis.",
  },
  {
    name: "Resonance Frequency Response (Bode)",
    category: "Acoustics & Controls",
    latex: "y = \\frac{1}{\\sqrt{(1 - x^2)^2 + (2 \\cdot 0.1 \\cdot x)^2}}",
    description: "Dynamic magnification factor Q vs normalized frequency ratio (f / f₀).",
  },
  {
    name: "Parabolic Projectile Trajectory",
    category: "Civil & Aerodynamics",
    latex: "y = x \\tan(0.785) - \\frac{9.81 x^2}{2 \\cdot (30^2) \\cdot (\\cos(0.785))^2}",
    description: "2D Kinematic flight trajectory under constant gravitational field (v₀=30m/s, θ=45°).",
  },
  {
    name: "Gaussian Normal Distribution",
    category: "Probability & Quality Control",
    latex: "y = \\frac{1}{1.5 \\sqrt{2\\pi}} e^{-\\frac{(x - 0)^2}{2 \\cdot (1.5)^2}}",
    description: "Standard statistical normal bell curve distribution with mean μ=0 and σ=1.5.",
  },
  {
    name: "Euler-Bernoulli Beam Deflection",
    category: "Structural Engineering",
    latex: "y = -0.05 x^2 (3 \\cdot 10 - x)",
    description: "Deflection curve for a cantilever beam of length L=10 with point load at the free tip.",
  },
];

// Engineering Units & Conversion Categories
const UNIT_CATEGORIES = [
  {
    name: "Pressure / Stress",
    units: [
      { name: "Pascal (Pa)", factor: 1 },
      { name: "Kilopascal (kPa)", factor: 1e3 },
      { name: "Megapascal (MPa)", factor: 1e6 },
      { name: "Gigapascal (GPa)", factor: 1e9 },
      { name: "Bar (bar)", factor: 1e5 },
      { name: "Pounds per Sq Inch (psi)", factor: 6894.76 },
      { name: "Kilopounds per Sq Inch (ksi)", factor: 6.89476e6 },
      { name: "Atmosphere (atm)", factor: 101325 },
    ],
  },
  {
    name: "Force",
    units: [
      { name: "Newton (N)", factor: 1 },
      { name: "Kilonewton (kN)", factor: 1e3 },
      { name: "Meganewton (MN)", factor: 1e6 },
      { name: "Pound-force (lbf)", factor: 4.44822 },
      { name: "Kilogram-force (kgf)", factor: 9.80665 },
      { name: "Dyne (dyn)", factor: 1e-5 },
    ],
  },
  {
    name: "Power & Energy",
    units: [
      { name: "Watt (W)", factor: 1 },
      { name: "Kilowatt (kW)", factor: 1e3 },
      { name: "Megawatt (MW)", factor: 1e6 },
      { name: "Horsepower (HP mechanical)", factor: 745.7 },
      { name: "Joule (J)", factor: 1 },
      { name: "Kilojoule (kJ)", factor: 1e3 },
      { name: "Kilowatt-hour (kWh)", factor: 3.6e6 },
      { name: "British Thermal Unit (BTU)", factor: 1055.06 },
    ],
  },
  {
    name: "Length & Dimensions",
    units: [
      { name: "Meter (m)", factor: 1 },
      { name: "Millimeter (mm)", factor: 1e-3 },
      { name: "Centimeter (cm)", factor: 1e-2 },
      { name: "Kilometer (km)", factor: 1e3 },
      { name: "Inch (in)", factor: 0.0254 },
      { name: "Foot (ft)", factor: 0.3048 },
      { name: "Micrometer (μm)", factor: 1e-6 },
      { name: "Nanometer (nm)", factor: 1e-9 },
    ],
  },
];

export const EngineeringCalculator: React.FC<EngineeringCalculatorProps> = ({
  onSendToQuantum,
  themeMode = "normal",
}) => {
  const currentTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  // Active section tab
  const [activeTab, setActiveTab] = useState<"normal_calc" | "desmos" | "converters" | "quick_solvers">("normal_calc");

  // Normal / Scientific Calculator State
  const [expression, setExpression] = useState<string>("");
  const [displayResult, setDisplayResult] = useState<string>("0");
  const [history, setHistory] = useState<{ expr: string; res: string; timestamp: string }[]>([]);
  const [angleMode, setAngleMode] = useState<"DEG" | "RAD">("DEG");
  const [notationMode, setNotationMode] = useState<"NORMAL" | "ENG" | "SCI">("NORMAL");
  const [isSecondFunc, setIsSecondFunc] = useState<boolean>(false);
  const [isHyp, setIsHyp] = useState<boolean>(false);
  const [memoryVal, setMemoryVal] = useState<number>(0);
  const [lastAns, setLastAns] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Desmos mode state
  const [desmosType, setDesmosType] = useState<"graphing" | "scientific">("graphing");
  const [desmosFullscreen, setDesmosFullscreen] = useState<boolean>(false);

  // Unit Converter State
  const [convCategoryIndex, setConvCategoryIndex] = useState<number>(0);
  const [fromUnitIndex, setFromUnitIndex] = useState<number>(0);
  const [toUnitIndex, setToUnitIndex] = useState<number>(1);
  const [convInputValue, setConvInputValue] = useState<string>("100");

  // Quick Engineering Solvers State
  const [solverType, setSolverType] = useState<"ohms" | "stress" | "rc" | "reynolds" | "heat">("ohms");
  const [solverInputs, setSolverInputs] = useState<Record<string, number>>({
    v: 12,
    r: 100,
    force: 5000,
    area: 0.002,
    capacitance: 0.0001,
    res: 1000,
    density: 1000,
    velocity: 2.5,
    diameter: 0.05,
    viscosity: 0.001,
    conductivity: 0.8,
    areaHeat: 5,
    deltaT: 20,
    thickness: 0.15,
  });

  // Calculate Unit Converter Result
  const currentCategory = UNIT_CATEGORIES[convCategoryIndex] || UNIT_CATEGORIES[0];
  const fromUnit = currentCategory.units[fromUnitIndex] || currentCategory.units[0];
  const toUnit = currentCategory.units[toUnitIndex] || currentCategory.units[1];
  const convNumericInput = parseFloat(convInputValue) || 0;
  const convBaseValue = convNumericInput * fromUnit.factor;
  const convOutputValue = toUnit.factor !== 0 ? convBaseValue / toUnit.factor : 0;

  // Format numbers to engineering notation
  const formatEngineering = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return String(num);
    if (num === 0) return "0";

    if (notationMode === "SCI") {
      return num.toExponential(6);
    }

    if (notationMode === "ENG") {
      const exp = Math.floor(Math.log10(Math.abs(num)));
      const engExp = Math.floor(exp / 3) * 3;
      const engMantissa = num / Math.pow(10, engExp);
      const prefixes: Record<number, string> = {
        "-12": " p (pico)",
        "-9": " n (nano)",
        "-6": " µ (micro)",
        "-3": " m (milli)",
        "0": "",
        "3": " k (kilo)",
        "6": " M (mega)",
        "9": " G (giga)",
        "12": " T (tera)",
      };
      const prefix = prefixes[engExp] || ` × 10^${engExp}`;
      return `${engMantissa.toFixed(4)}${prefix}`;
    }

    // Normal mode
    if (Math.abs(num) < 1e-6 || Math.abs(num) >= 1e10) {
      return num.toExponential(6);
    }
    return Number(num.toFixed(8)).toString();
  };

  // Helper Factorial
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  // Safe Calculator Evaluation
  const evaluateExpression = (exprToEval: string): { success: boolean; result: number; formatted: string } => {
    if (!exprToEval.trim()) return { success: true, result: 0, formatted: "0" };

    try {
      // Replace tokens with JS Math methods & constants
      let sanitized = exprToEval
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/π/g, "PI")
        .replace(/\be\b/g, "E")
        .replace(/\bAns\b/g, `(${lastAns})`);

      // Handle factorials inside expressions (e.g. 5!)
      sanitized = sanitized.replace(/(\d+)!/g, "factorial($1)");

      // Handle powers ^ (convert to native JS exponentiation **)
      sanitized = sanitized.replace(/\^/g, "**");

      // Replace functions with scoped names
      const degToRad = Math.PI / 180;
      const radToDeg = 180 / Math.PI;
      const isDeg = angleMode === "DEG";

      const scope = {
        sin: (x: number) => Math.sin(isDeg ? x * degToRad : x),
        cos: (x: number) => Math.cos(isDeg ? x * degToRad : x),
        tan: (x: number) => Math.tan(isDeg ? x * degToRad : x),
        asin: (x: number) => (isDeg ? Math.asin(x) * radToDeg : Math.asin(x)),
        acos: (x: number) => (isDeg ? Math.acos(x) * radToDeg : Math.acos(x)),
        atan: (x: number) => (isDeg ? Math.atan(x) * radToDeg : Math.atan(x)),
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        asinh: Math.asinh,
        acosh: Math.acosh,
        atanh: Math.atanh,
        log: Math.log10,
        log2: Math.log2,
        ln: Math.log,
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        abs: Math.abs,
        exp: Math.exp,
        factorial,
        PI: Math.PI,
        E: Math.E,
      };

      // Safe JS Function Evaluation with scoped math environment
      // eslint-disable-next-line no-new-func
      const evalFunc = new Function(
        ...Object.keys(scope),
        `return (${sanitized});`
      );
      const res = evalFunc(...Object.values(scope));

      if (typeof res !== "number" || isNaN(res)) {
        return { success: false, result: NaN, formatted: "Error" };
      }

      return {
        success: true,
        result: res,
        formatted: formatEngineering(res),
      };
    } catch {
      return { success: false, result: NaN, formatted: "Syntax Error" };
    }
  };

  // Button Click Handler for Normal Calculator
  const handleKeyClick = (val: string) => {
    if (val === "AC") {
      setExpression("");
      setDisplayResult("0");
    } else if (val === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
    } else if (val === "=") {
      if (!expression.trim()) return;
      const evaluation = evaluateExpression(expression);
      if (evaluation.success) {
        setDisplayResult(evaluation.formatted);
        setLastAns(evaluation.result);
        setHistory((prev) => [
          {
            expr: expression,
            res: evaluation.formatted,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 19),
        ]);
      } else {
        setDisplayResult(evaluation.formatted);
      }
    } else if (val === "±") {
      if (expression.startsWith("-")) {
        setExpression((prev) => prev.slice(1));
      } else {
        setExpression((prev) => "-" + prev);
      }
    } else if (val === "1/x") {
      setExpression((prev) => `1/(${prev || displayResult})`);
    } else if (val === "x^2") {
      setExpression((prev) => `(${prev || displayResult})^2`);
    } else if (val === "x^3") {
      setExpression((prev) => `(${prev || displayResult})^3`);
    } else if (val === "x!") {
      const num = parseFloat(displayResult) || parseFloat(expression);
      if (!isNaN(num) && num >= 0 && Number.isInteger(num)) {
        const fact = factorial(num);
        setDisplayResult(formatEngineering(fact));
        setLastAns(fact);
      }
    } else if (val === "M+") {
      const num = parseFloat(displayResult) || 0;
      setMemoryVal((prev) => prev + num);
      notifyCopied(`Added ${num} to Memory (${memoryVal + num})`);
    } else if (val === "M-") {
      const num = parseFloat(displayResult) || 0;
      setMemoryVal((prev) => prev - num);
      notifyCopied(`Subtracted ${num} from Memory (${memoryVal - num})`);
    } else if (val === "MR") {
      setExpression((prev) => prev + memoryVal.toString());
    } else if (val === "MC") {
      setMemoryVal(0);
      notifyCopied("Memory Cleared (MC)");
    } else {
      setExpression((prev) => prev + val);
    }
  };

  const notifyCopied = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const copyToClipboard = (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch {
      // Safe fallback
    }
    notifyCopied("Copied to clipboard!");
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "normal_calc") return;
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key >= "0" && e.key <= "9") handleKeyClick(e.key);
      else if (e.key === "+") handleKeyClick("+");
      else if (e.key === "-") handleKeyClick("-");
      else if (e.key === "*") handleKeyClick("×");
      else if (e.key === "/") handleKeyClick("÷");
      else if (e.key === ".") handleKeyClick(".");
      else if (e.key === "(") handleKeyClick("(");
      else if (e.key === ")") handleKeyClick(")");
      else if (e.key === "^") handleKeyClick("^");
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleKeyClick("=");
      } else if (e.key === "Backspace") handleKeyClick("DEL");
      else if (e.key === "Escape") handleKeyClick("AC");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, expression, displayResult, lastAns, angleMode, notationMode]);

  return (
    <div
      id="engineering-calculator-root"
      className="w-full h-full flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-500 relative"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.subtleBorder,
      }}
    >
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-lg border bg-[#060B12] text-xs font-mono text-emerald-400 border-emerald-500/40 shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Top Header & Navigation Deck */}
      <div
        className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0"
        style={{ borderColor: currentTheme.subtleBorder }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-1.5 rounded-lg border"
            style={{
              backgroundColor: currentTheme.activeBadgeBg,
              borderColor: `${currentTheme.primary}44`,
              color: currentTheme.primary,
            }}
          >
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
                ENGINEERING & DESMOS COMPUTATION SUITE
              </span>
              <span
                className="text-[10px] font-mono px-2 py-0.2 rounded-full border uppercase font-semibold"
                style={{
                  backgroundColor: currentTheme.activeBadgeBg,
                  borderColor: `${currentTheme.primary}44`,
                  color: currentTheme.primary,
                }}
              >
                IEEE-754 SCIENTIFIC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Precision scientific calculator, Desmos dynamic graphing, conversion matrix & structural formulas
            </p>
          </div>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex items-center bg-[#070D16] p-1 rounded-xl border border-[#1A2533] text-xs font-mono">
          <button
            id="tab-normal-calc"
            onClick={() => setActiveTab("normal_calc")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "normal_calc"
                ? "border font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "normal_calc"
                ? {
                    backgroundColor: currentTheme.activeBadgeBg,
                    borderColor: `${currentTheme.primary}55`,
                    color: currentTheme.primary,
                  }
                : {}
            }
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Scientific Calculator</span>
          </button>

          <button
            id="tab-desmos"
            onClick={() => setActiveTab("desmos")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "desmos"
                ? "border font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "desmos"
                ? {
                    backgroundColor: currentTheme.activeBadgeBg,
                    borderColor: `${currentTheme.primary}55`,
                    color: currentTheme.primary,
                  }
                : {}
            }
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Desmos Graphing</span>
          </button>

          <button
            id="tab-converters"
            onClick={() => setActiveTab("converters")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "converters"
                ? "border font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "converters"
                ? {
                    backgroundColor: currentTheme.activeBadgeBg,
                    borderColor: `${currentTheme.primary}55`,
                    color: currentTheme.primary,
                  }
                : {}
            }
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Unit Converter</span>
          </button>

          <button
            id="tab-quick-solvers"
            onClick={() => setActiveTab("quick_solvers")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quick_solvers"
                ? "border font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={
              activeTab === "quick_solvers"
                ? {
                    backgroundColor: currentTheme.activeBadgeBg,
                    borderColor: `${currentTheme.primary}55`,
                    color: currentTheme.primary,
                  }
                : {}
            }
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Engineering Solvers</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {/* TAB 1: Normal & Scientific Engineering Calculator */}
        {activeTab === "normal_calc" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
            {/* Left Col (8 cols): The Calculator Hardware & Keypad */}
            <div className="lg:col-span-8 flex flex-col space-y-3">
              {/* LCD Display Screen */}
              <div className="bg-[#050910] border border-[#1E293B] rounded-xl p-4 shadow-inner relative flex flex-col justify-between min-h-[120px]">
                {/* Top status header */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cyan-400">ENGINEERING TI-99</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-emerald-400 font-semibold">
                      {angleMode}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-indigo-300 font-semibold">
                      {notationMode}
                    </span>
                    {memoryVal !== 0 && (
                      <span className="text-[10px] text-amber-400 font-bold">M: {memoryVal}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(displayResult)}
                      className="hover:text-slate-200 cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Copy result"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    {onSendToQuantum && (
                      <button
                        onClick={() =>
                          onSendToQuantum(
                            `Analyze and derive step-by-step engineering result for equation: ${expression || displayResult} = ${displayResult}`,
                            "engineering"
                          )
                        }
                        className="hover:text-cyan-300 cursor-pointer flex items-center gap-1 text-[10px] font-bold text-cyan-400"
                        title="Send calculation to Quantum AI for step-by-step mathematical derivation"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Derive in AI</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expression Input String */}
                <div className="w-full text-right overflow-x-auto py-1 font-mono text-sm sm:text-base text-slate-300 tracking-wider">
                  {expression || <span className="text-slate-600">Enter expression or formula...</span>}
                </div>

                {/* Big Result Output */}
                <div className="w-full text-right font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-end gap-2 overflow-x-auto">
                  <span className="text-slate-500 text-lg font-normal">=</span>
                  <span style={{ color: currentTheme.primary }}>{displayResult}</span>
                </div>
              </div>

              {/* Mode Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-[#080E17] p-2 rounded-lg border border-[#162130]">
                {/* Angle Toggle */}
                <div className="flex items-center gap-1 bg-[#0D1624] p-1 rounded-md border border-[#1F2E42]">
                  <button
                    onClick={() => setAngleMode("DEG")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      angleMode === "DEG" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" : "text-slate-400"
                    }`}
                  >
                    DEG
                  </button>
                  <button
                    onClick={() => setAngleMode("RAD")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      angleMode === "RAD" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" : "text-slate-400"
                    }`}
                  >
                    RAD
                  </button>
                </div>

                {/* Notation Mode */}
                <div className="flex items-center gap-1 bg-[#0D1624] p-1 rounded-md border border-[#1F2E42]">
                  <span className="text-[10px] text-slate-500 px-1">MODE:</span>
                  {(["NORMAL", "ENG", "SCI"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setNotationMode(m)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        notationMode === m ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50" : "text-slate-400"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Shift / 2nd & Hyperbolic toggles */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsSecondFunc(!isSecondFunc)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      isSecondFunc
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
                        : "bg-[#0D1624] border-[#1F2E42] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    2nd / INV
                  </button>
                  <button
                    onClick={() => setIsHyp(!isHyp)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      isHyp
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm"
                        : "bg-[#0D1624] border-[#1F2E42] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    HYP
                  </button>
                </div>
              </div>

              {/* Engineering Calculator Grid Keypad */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 font-mono text-xs select-none">
                {/* Row 1: Trigonometric & Memory / Clear */}
                <button
                  onClick={() => handleKeyClick(isHyp ? (isSecondFunc ? "asinh(" : "sinh(") : isSecondFunc ? "asin(" : "sin(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-cyan-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isHyp ? (isSecondFunc ? "sinh⁻¹" : "sinh") : isSecondFunc ? "sin⁻¹" : "sin"}
                </button>
                <button
                  onClick={() => handleKeyClick(isHyp ? (isSecondFunc ? "acosh(" : "cosh(") : isSecondFunc ? "acos(" : "cos(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-cyan-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isHyp ? (isSecondFunc ? "cosh⁻¹" : "cosh") : isSecondFunc ? "acos" : "cos"}
                </button>
                <button
                  onClick={() => handleKeyClick(isHyp ? (isSecondFunc ? "atanh(" : "tanh(") : isSecondFunc ? "atan(" : "tan(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-cyan-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isHyp ? (isSecondFunc ? "tanh⁻¹" : "tanh") : isSecondFunc ? "atan" : "tan"}
                </button>
                <button
                  onClick={() => handleKeyClick("(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-slate-300 cursor-pointer active:scale-95 transition-all text-center"
                >
                  (
                </button>
                <button
                  onClick={() => handleKeyClick(")")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-slate-300 cursor-pointer active:scale-95 transition-all text-center"
                >
                  )
                </button>
                <button
                  onClick={() => handleKeyClick("DEL")}
                  className="p-2.5 rounded-lg bg-[#2D1518] hover:bg-[#3D1D21] border border-[#522228] text-rose-400 font-bold cursor-pointer active:scale-95 transition-all text-center"
                >
                  DEL
                </button>
                <button
                  onClick={() => handleKeyClick("AC")}
                  className="p-2.5 rounded-lg bg-[#421318] hover:bg-[#5C1A22] border border-[#7A242E] text-rose-300 font-bold cursor-pointer active:scale-95 transition-all text-center shadow-sm"
                >
                  AC
                </button>

                {/* Row 2: Logs, Exponentials & Powers */}
                <button
                  onClick={() => handleKeyClick(isSecondFunc ? "e^(" : "ln(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isSecondFunc ? "eˣ" : "ln"}
                </button>
                <button
                  onClick={() => handleKeyClick(isSecondFunc ? "10^(" : "log(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isSecondFunc ? "10ˣ" : "log₁₀"}
                </button>
                <button
                  onClick={() => handleKeyClick("log2(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  log₂
                </button>
                <button
                  onClick={() => handleKeyClick("7")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  7
                </button>
                <button
                  onClick={() => handleKeyClick("8")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  8
                </button>
                <button
                  onClick={() => handleKeyClick("9")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  9
                </button>
                <button
                  onClick={() => handleKeyClick("÷")}
                  className="p-2.5 rounded-lg bg-[#162338] hover:bg-[#1F304B] border border-[#2B4366] text-cyan-300 font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  ÷
                </button>

                {/* Row 3: Roots, Powers, 4 5 6 * */}
                <button
                  onClick={() => handleKeyClick(isSecondFunc ? "cbrt(" : "sqrt(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isSecondFunc ? "∛x" : "√x"}
                </button>
                <button
                  onClick={() => handleKeyClick("^")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  xʸ
                </button>
                <button
                  onClick={() => handleKeyClick(isSecondFunc ? "x^3" : "x^2")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isSecondFunc ? "x³" : "x²"}
                </button>
                <button
                  onClick={() => handleKeyClick("4")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  4
                </button>
                <button
                  onClick={() => handleKeyClick("5")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  5
                </button>
                <button
                  onClick={() => handleKeyClick("6")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  6
                </button>
                <button
                  onClick={() => handleKeyClick("×")}
                  className="p-2.5 rounded-lg bg-[#162338] hover:bg-[#1F304B] border border-[#2B4366] text-cyan-300 font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  ×
                </button>

                {/* Row 4: 1/x, Factorial, 1 2 3 - */}
                <button
                  onClick={() => handleKeyClick("1/x")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  1/x
                </button>
                <button
                  onClick={() => handleKeyClick("x!")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  x!
                </button>
                <button
                  onClick={() => handleKeyClick("abs(")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-indigo-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  |x|
                </button>
                <button
                  onClick={() => handleKeyClick("1")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  1
                </button>
                <button
                  onClick={() => handleKeyClick("2")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  2
                </button>
                <button
                  onClick={() => handleKeyClick("3")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  3
                </button>
                <button
                  onClick={() => handleKeyClick("-")}
                  className="p-2.5 rounded-lg bg-[#162338] hover:bg-[#1F304B] border border-[#2B4366] text-cyan-300 font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  −
                </button>

                {/* Row 5: Constants, 0, ., Ans, + */}
                <button
                  onClick={() => handleKeyClick("π")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-emerald-400 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  π
                </button>
                <button
                  onClick={() => handleKeyClick("e")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-emerald-400 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  e
                </button>
                <button
                  onClick={() => handleKeyClick("Ans")}
                  className="p-2.5 rounded-lg bg-[#0C1420] hover:bg-[#132032] border border-[#1C2C40] text-amber-300 font-semibold cursor-pointer active:scale-95 transition-all text-center"
                >
                  Ans
                </button>
                <button
                  onClick={() => handleKeyClick("0")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  0
                </button>
                <button
                  onClick={() => handleKeyClick(".")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-white font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  .
                </button>
                <button
                  onClick={() => handleKeyClick("±")}
                  className="p-2.5 rounded-lg bg-[#111A26] hover:bg-[#1A2636] border border-[#243347] text-slate-300 font-bold cursor-pointer active:scale-95 transition-all text-center"
                >
                  ±
                </button>
                <button
                  onClick={() => handleKeyClick("+")}
                  className="p-2.5 rounded-lg bg-[#162338] hover:bg-[#1F304B] border border-[#2B4366] text-cyan-300 font-bold text-sm cursor-pointer active:scale-95 transition-all text-center"
                >
                  +
                </button>

                {/* Row 6: Memory row & Big Equal */}
                <button
                  onClick={() => handleKeyClick("M+")}
                  className="p-2 rounded-lg bg-[#131D2A] hover:bg-[#1A283B] border border-[#223348] text-amber-400 font-bold text-[10px] cursor-pointer"
                >
                  M+
                </button>
                <button
                  onClick={() => handleKeyClick("M-")}
                  className="p-2 rounded-lg bg-[#131D2A] hover:bg-[#1A283B] border border-[#223348] text-amber-400 font-bold text-[10px] cursor-pointer"
                >
                  M−
                </button>
                <button
                  onClick={() => handleKeyClick("MR")}
                  className="p-2 rounded-lg bg-[#131D2A] hover:bg-[#1A283B] border border-[#223348] text-amber-400 font-bold text-[10px] cursor-pointer"
                >
                  MR
                </button>
                <button
                  onClick={() => handleKeyClick("MC")}
                  className="p-2 rounded-lg bg-[#131D2A] hover:bg-[#1A283B] border border-[#223348] text-amber-400 font-bold text-[10px] cursor-pointer"
                >
                  MC
                </button>
                <button
                  onClick={() => handleKeyClick("%")}
                  className="p-2 rounded-lg bg-[#131D2A] hover:bg-[#1A283B] border border-[#223348] text-slate-300 font-semibold cursor-pointer"
                >
                  %
                </button>
                <button
                  onClick={() => handleKeyClick("=")}
                  className="col-span-2 p-2.5 rounded-lg text-slate-900 font-bold text-base cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
                  style={{
                    backgroundColor: currentTheme.primary,
                    boxShadow: `0 0 15px ${currentTheme.glowColor}`,
                  }}
                >
                  <span>= EVALUATE</span>
                </button>
              </div>

              {/* Engineering Constants Quick Tray */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>FUNDAMENTAL PHYSICAL & ENGINEERING CONSTANTS:</span>
                  <span className="text-slate-500">CLICK TO INSERT VALUE</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CONSTANTS.map((c) => (
                    <button
                      key={c.symbol}
                      onClick={() => {
                        setExpression((prev) => prev + c.value.toString());
                        notifyCopied(`Inserted ${c.name}`);
                      }}
                      title={`${c.name}: ${c.value} ${c.unit || ""} — ${c.desc}`}
                      className="px-2 py-1 rounded bg-[#0A111C] hover:bg-[#132034] border border-[#1D2E45] text-[10px] font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <span className="font-bold text-emerald-400">{c.symbol}</span>
                      <span className="text-slate-400 text-[9px]">{c.unit || ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col (4 cols): History Log & Engineering Math Reference */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              {/* Calculation History */}
              <div className="bg-[#050912] border border-[#1C2838] rounded-xl p-3 flex-1 flex flex-col justify-between min-h-[300px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CALCULATION AUDIT LOG</span>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => setHistory([])}
                      className="text-[10px] font-mono text-slate-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-1">
                  {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs font-mono py-8">
                      <Calculator className="w-6 h-6 mb-2 opacity-40" />
                      <span>No calculations logged yet</span>
                    </div>
                  ) : (
                    history.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-[#080E18] border border-[#162232] hover:border-cyan-500/40 transition-all font-mono text-xs cursor-pointer group"
                        onClick={() => {
                          setExpression(item.expr);
                          setDisplayResult(item.res);
                        }}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                          <span>{item.timestamp}</span>
                          <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to reload
                          </span>
                        </div>
                        <div className="text-slate-300 text-xs truncate">{item.expr}</div>
                        <div className="text-right font-bold text-emerald-400 text-sm">= {item.res}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Quick AI Prompt Helper */}
                {onSendToQuantum && (
                  <div className="mt-3 pt-2 border-t border-slate-800">
                    <button
                      onClick={() =>
                        onSendToQuantum(
                          `Perform an engineering analysis, dimensional verification, and mathematical proof for my current active calculations.`,
                          "engineering"
                        )
                      }
                      className="w-full py-2 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                      style={{
                        backgroundColor: currentTheme.activeBadgeBg,
                        borderColor: `${currentTheme.primary}44`,
                        color: currentTheme.primary,
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Full Quantum AI Engineering Audit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Desmos Interactive Graphing & Scientific Suite */}
        {activeTab === "desmos" && (
          <div className="space-y-4">
            {/* Desmos Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080F1B] p-3 rounded-xl border border-[#19273A]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-100">
                    DESMOS MATHEMATICS ENGINE
                  </span>
                </div>

                {/* Switch Desmos graphing vs scientific */}
                <div className="flex items-center bg-[#050A12] p-1 rounded-lg border border-[#182434] text-xs font-mono">
                  <button
                    onClick={() => setDesmosType("graphing")}
                    className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                      desmosType === "graphing"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Graphing Calculator
                  </button>
                  <button
                    onClick={() => setDesmosType("scientific")}
                    className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                      desmosType === "scientific"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Scientific Calculator
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDesmosFullscreen(!desmosFullscreen)}
                  className="px-3 py-1.5 rounded-lg border border-[#1E2D42] bg-[#0A121E] hover:bg-[#121F33] text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {desmosFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{desmosFullscreen ? "Collapse View" : "Expand Canvas"}</span>
                </button>

                <a
                  href={`https://www.desmos.com/${desmosType}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-[#1E2D42] bg-[#0A121E] hover:bg-[#121F33] text-xs font-mono text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Desmos.com</span>
                </a>
              </div>
            </div>

            {/* Embedded Live Desmos Frame */}
            <div
              className={`w-full rounded-xl border border-[#1F2E42] overflow-hidden bg-white shadow-2xl transition-all duration-300 ${
                desmosFullscreen ? "h-[850px]" : "h-[560px]"
              }`}
            >
              <iframe
                title="Desmos Live Calculator"
                src={
                  desmosType === "graphing"
                    ? "https://www.desmos.com/calculator"
                    : "https://www.desmos.com/scientific"
                }
                className="w-full h-full border-0"
                allow="clipboard-read; clipboard-write"
              />
            </div>

            {/* Desmos Engineering Formula Presets Tray */}
            <div className="bg-[#060B14] p-4 rounded-xl border border-[#19273A] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>ENGINEERING EQUATION PRESETS FOR DESMOS</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Click to copy LaTeX and paste into Desmos graph
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {DESMOS_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#09111E] border border-[#1B2B40] hover:border-cyan-500/50 transition-all font-mono space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {preset.category}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-[#04070D] border border-slate-800/80 text-emerald-400 text-xs truncate">
                      <code>{preset.latex}</code>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed">{preset.description}</p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => copyToClipboard(preset.latex)}
                        className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Equation</span>
                      </button>

                      {onSendToQuantum && (
                        <button
                          onClick={() =>
                            onSendToQuantum(
                              `Provide a deep step-by-step engineering derivation and physical significance for the curve: ${preset.name} (${preset.latex})`,
                              "engineering"
                            )
                          }
                          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Derivation</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Unit Converter */}
        {activeTab === "converters" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#060C16] border border-[#1C2A3C] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.activeBadgeBg,
                      borderColor: `${currentTheme.primary}44`,
                      color: currentTheme.primary,
                    }}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-slate-100">
                      HIGH-PRECISION ENGINEERING UNIT CONVERTER
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Convert between SI, Imperial, and standard engineering units with exact decimal precision
                    </p>
                  </div>
                </div>

                {/* Category selector */}
                <select
                  value={convCategoryIndex}
                  onChange={(e) => {
                    setConvCategoryIndex(Number(e.target.value));
                    setFromUnitIndex(0);
                    setToUnitIndex(1);
                  }}
                  className="bg-[#0B1422] border border-[#23354C] rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 cursor-pointer focus:outline-none focus:border-cyan-500"
                >
                  {UNIT_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={idx}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conversion Interactor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Input Unit Box */}
                <div className="bg-[#09121F] p-4 rounded-xl border border-[#1E2E42] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-400">INPUT VALUE & UNIT:</label>
                    <select
                      value={fromUnitIndex}
                      onChange={(e) => setFromUnitIndex(Number(e.target.value))}
                      className="bg-[#040810] border border-[#21334A] rounded px-2.5 py-1 text-xs font-mono text-slate-200 cursor-pointer"
                    >
                      {currentCategory.units.map((u, idx) => (
                        <option key={idx} value={idx}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="number"
                    value={convInputValue}
                    onChange={(e) => setConvInputValue(e.target.value)}
                    className="w-full bg-[#04070E] border border-[#1A293D] rounded-lg p-3 text-lg font-mono text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Enter magnitude..."
                  />

                  <div className="text-[10px] font-mono text-slate-500">
                    Baseline factor: {fromUnit.factor} SI units
                  </div>
                </div>

                {/* Output Unit Box */}
                <div className="bg-[#09121F] p-4 rounded-xl border border-[#1E2E42] space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-emerald-400 font-bold">CONVERTED OUTPUT:</label>
                    <select
                      value={toUnitIndex}
                      onChange={(e) => setToUnitIndex(Number(e.target.value))}
                      className="bg-[#040810] border border-[#21334A] rounded px-2.5 py-1 text-xs font-mono text-slate-200 cursor-pointer"
                    >
                      {currentCategory.units.map((u, idx) => (
                        <option key={idx} value={idx}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full bg-[#04070E] border border-emerald-500/30 rounded-lg p-3 text-lg font-mono text-emerald-400 font-bold flex items-center justify-between overflow-x-auto">
                    <span>{convOutputValue.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
                    <button
                      onClick={() => copyToClipboard(convOutputValue.toString())}
                      className="text-slate-400 hover:text-white cursor-pointer"
                      title="Copy value"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500">
                    Output target: {toUnit.name}
                  </div>
                </div>
              </div>

              {/* Conversion Formula Card */}
              <div className="p-3 rounded-lg bg-[#08101C] border border-[#19273A] text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>
                  <strong>Conversion Relation:</strong> 1 {fromUnit.name} ={" "}
                  {(fromUnit.factor / toUnit.factor).toLocaleString(undefined, { maximumFractionDigits: 8 })} {toUnit.name}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${convInputValue} ${fromUnit.name} = ${convOutputValue} ${toUnit.name}`
                    )
                  }
                  className="text-cyan-400 hover:text-cyan-200 cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Statement</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Quick Engineering Solvers */}
        {activeTab === "quick_solvers" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Solver Category Switcher */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "ohms", name: "Ohm's Law & Power", icon: Zap },
                { id: "stress", name: "Axial Stress & Strain", icon: Activity },
                { id: "rc", name: "RC Circuit Time Constant", icon: Cpu },
                { id: "reynolds", name: "Fluid Reynolds Number", icon: Compass },
                { id: "heat", name: "Fourier Heat Conduction", icon: BookOpen },
              ].map((s) => {
                const Icon = s.icon;
                const isSel = solverType === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSolverType(s.id as any)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isSel
                        ? "shadow-md"
                        : "bg-[#09111D] border-[#18273A] text-slate-400 hover:text-slate-200"
                    }`}
                    style={
                      isSel
                        ? {
                            backgroundColor: currentTheme.activeBadgeBg,
                            borderColor: currentTheme.primary,
                            color: currentTheme.primary,
                          }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Solver Module */}
            <div className="bg-[#060B14] border border-[#1A283C] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
              {/* Ohm's Law Solver */}
              {solverType === "ohms" && (
                <div className="space-y-4 font-mono">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-100">OHM'S LAW & ELECTRICAL POWER MATRIX</h4>
                    <p className="text-xs text-slate-400">{"Governing formulas: V = I · R, P = V · I = I²R = V² / R"}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">VOLTAGE (V) [Volts]:</label>
                      <input
                        type="number"
                        value={solverInputs.v}
                        onChange={(e) => setSolverInputs({ ...solverInputs, v: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded-lg p-2.5 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">RESISTANCE (R) [Ohms (Ω)]:</label>
                      <input
                        type="number"
                        value={solverInputs.r}
                        onChange={(e) => setSolverInputs({ ...solverInputs, r: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded-lg p-2.5 text-white mt-1"
                      />
                    </div>
                  </div>

                  {/* Calculated Output Matrix */}
                  {(() => {
                    const current = solverInputs.r !== 0 ? solverInputs.v / solverInputs.r : 0;
                    const power = solverInputs.v * current;
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 rounded-lg bg-[#0A1322] border border-cyan-500/30">
                          <span className="text-[10px] text-slate-400">CALCULATED CURRENT (I):</span>
                          <div className="text-xl font-bold text-cyan-400">{current.toFixed(4)} Amperes (A)</div>
                          <div className="text-[10px] text-slate-500">{(current * 1000).toFixed(2)} mA</div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0A1322] border border-emerald-500/30">
                          <span className="text-[10px] text-slate-400">DISSIPATED POWER (P):</span>
                          <div className="text-xl font-bold text-emerald-400">{power.toFixed(4)} Watts (W)</div>
                          <div className="text-[10px] text-slate-500">{(power / 1000).toFixed(3)} kW</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Stress & Strain Solver */}
              {solverType === "stress" && (
                <div className="space-y-4 font-mono">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-100">AXIAL NORMAL STRESS & STRUCTURAL PRESSURE</h4>
                    <p className="text-xs text-slate-400">{"Governing formula: σ = F / A"}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">APPLIED FORCE (F) [Newtons (N)]:</label>
                      <input
                        type="number"
                        value={solverInputs.force}
                        onChange={(e) => setSolverInputs({ ...solverInputs, force: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded-lg p-2.5 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">CROSS-SECTIONAL AREA (A) [m²]:</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={solverInputs.area}
                        onChange={(e) => setSolverInputs({ ...solverInputs, area: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded-lg p-2.5 text-white mt-1"
                      />
                    </div>
                  </div>

                  {(() => {
                    const stressPa = solverInputs.area !== 0 ? solverInputs.force / solverInputs.area : 0;
                    const stressMPa = stressPa / 1e6;
                    const stressPsi = stressPa / 6894.76;
                    return (
                      <div className="p-3 rounded-lg bg-[#0A1322] border border-cyan-500/30">
                        <span className="text-[10px] text-slate-400">CALCULATED NORMAL STRESS (σ):</span>
                        <div className="text-2xl font-bold text-cyan-400">{stressMPa.toFixed(3)} MPa</div>
                        <div className="text-xs text-slate-400 mt-1 flex gap-4">
                          <span>{stressPa.toLocaleString()} Pascals (Pa)</span>
                          <span>{stressPsi.toFixed(2)} psi</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* RC Circuit Solver */}
              {solverType === "rc" && (
                <div className="space-y-4 font-mono">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-100">RC CIRCUIT TIME CONSTANT & CUTOFF FREQUENCY</h4>
                    <p className="text-xs text-slate-400">{"Governing formulas: τ = R · C, f_c = 1 / (2πRC)"}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">RESISTANCE (R) [Ohms (Ω)]:</label>
                      <input
                        type="number"
                        value={solverInputs.res}
                        onChange={(e) => setSolverInputs({ ...solverInputs, res: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded-lg p-2.5 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">CAPACITANCE (C) [Farads (F)]:</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={solverInputs.capacitance}
                        onChange={(e) => setSolverInputs({ ...solverInputs, capacitance: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded-lg p-2.5 text-white mt-1"
                      />
                    </div>
                  </div>

                  {(() => {
                    const tau = solverInputs.res * solverInputs.capacitance;
                    const fc = tau > 0 ? 1 / (2 * Math.PI * tau) : 0;
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-[#0A1322] border border-indigo-500/30">
                          <span className="text-[10px] text-slate-400">TIME CONSTANT (τ = RC):</span>
                          <div className="text-xl font-bold text-indigo-300">{(tau * 1000).toFixed(2)} ms</div>
                          <div className="text-[10px] text-slate-500">{tau.toFixed(6)} seconds (63.2% charge time)</div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0A1322] border border-cyan-500/30">
                          <span className="text-[10px] text-slate-400">-3dB CUTOFF FREQUENCY (f_c):</span>
                          <div className="text-xl font-bold text-cyan-400">{fc.toFixed(2)} Hz</div>
                          <div className="text-[10px] text-slate-500">{(fc / 1000).toFixed(3)} kHz</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Reynolds Number Solver */}
              {solverType === "reynolds" && (
                <div className="space-y-4 font-mono">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-100">FLUID MECHANICS REYNOLDS NUMBER (Re)</h4>
                    <p className="text-xs text-slate-400">{"Governing formula: Re = (ρ · v · D) / μ"}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400">DENSITY (ρ) [kg/m³]:</label>
                      <input
                        type="number"
                        value={solverInputs.density}
                        onChange={(e) => setSolverInputs({ ...solverInputs, density: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">VELOCITY (v) [m/s]:</label>
                      <input
                        type="number"
                        value={solverInputs.velocity}
                        onChange={(e) => setSolverInputs({ ...solverInputs, velocity: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">DIAMETER (D) [m]:</label>
                      <input
                        type="number"
                        value={solverInputs.diameter}
                        onChange={(e) => setSolverInputs({ ...solverInputs, diameter: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">VISCOSITY (μ) [Pa·s]:</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={solverInputs.viscosity}
                        onChange={(e) => setSolverInputs({ ...solverInputs, viscosity: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                  </div>

                  {(() => {
                    const re =
                      solverInputs.viscosity !== 0
                        ? (solverInputs.density * solverInputs.velocity * solverInputs.diameter) / solverInputs.viscosity
                        : 0;
                    const isLaminar = re < 2300;
                    const isTurbulent = re > 4000;
                    return (
                      <div className="p-3 rounded-lg bg-[#0A1322] border border-cyan-500/30">
                        <span className="text-[10px] text-slate-400">REYNOLDS NUMBER (Re):</span>
                        <div className="text-2xl font-bold text-cyan-400">{re.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                        <div className="text-xs mt-1">
                          Flow Regime:{" "}
                          <strong className={isLaminar ? "text-emerald-400" : isTurbulent ? "text-rose-400" : "text-amber-400"}>
                            {isLaminar ? "LAMINAR (Re < 2300)" : isTurbulent ? "TURBULENT (Re > 4000)" : "TRANSITIONAL (2300 ≤ Re ≤ 4000)"}
                          </strong>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Heat Conduction Solver */}
              {solverType === "heat" && (
                <div className="space-y-4 font-mono">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-100">FOURIER 1D STEADY-STATE HEAT CONDUCTION</h4>
                    <p className="text-xs text-slate-400">{"Governing formula: Q = k · A · (ΔT / L)"}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400">CONDUCTIVITY (k) [W/m·K]:</label>
                      <input
                        type="number"
                        value={solverInputs.conductivity}
                        onChange={(e) => setSolverInputs({ ...solverInputs, conductivity: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">AREA (A) [m²]:</label>
                      <input
                        type="number"
                        value={solverInputs.areaHeat}
                        onChange={(e) => setSolverInputs({ ...solverInputs, areaHeat: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">TEMP DIFF (ΔT) [K or °C]:</label>
                      <input
                        type="number"
                        value={solverInputs.deltaT}
                        onChange={(e) => setSolverInputs({ ...solverInputs, deltaT: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">THICKNESS (L) [m]:</label>
                      <input
                        type="number"
                        value={solverInputs.thickness}
                        onChange={(e) => setSolverInputs({ ...solverInputs, thickness: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0A121E] border border-[#1F2E42] rounded p-2 text-white text-xs mt-1"
                      />
                    </div>
                  </div>

                  {(() => {
                    const q =
                      solverInputs.thickness !== 0
                        ? (solverInputs.conductivity * solverInputs.areaHeat * solverInputs.deltaT) / solverInputs.thickness
                        : 0;
                    return (
                      <div className="p-3 rounded-lg bg-[#0A1322] border border-amber-500/30">
                        <span className="text-[10px] text-slate-400">HEAT TRANSFER RATE (Q):</span>
                        <div className="text-2xl font-bold text-amber-400">{q.toFixed(2)} Watts (W)</div>
                        <div className="text-xs text-slate-400 mt-1">{(q / 1000).toFixed(3)} kW</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
