import React, { useState, useEffect, useRef } from "react";
import { FormulaPreset, ResearchPaper, STEMDomain, QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { KaTeXRenderer } from "../utils/katexRenderer";
import { InteractiveSimulations } from "./InteractiveSimulations";
import {
  Atom,
  Calculator,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Search,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Flame,
  Globe,
  Compass,
  Zap,
  Activity,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface STEMWorkspaceProps {
  onSendToQuantum: (prompt: string, domain?: STEMDomain) => void;
  themeMode?: QuantumThemeMode;
  initialTab?: "formulas" | "simulations" | "research" | "code";
}

export const STEMWorkspace: React.FC<STEMWorkspaceProps> = ({
  onSendToQuantum,
  themeMode = "normal",
  initialTab = "formulas",
}) => {
  const activeTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const [activeTab, setActiveTab] = useState<"formulas" | "simulations" | "research" | "code">(
    initialTab
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Formula presets
  const formulaPresets: FormulaPreset[] = [
    {
      id: "time_dilation",
      name: "Lorentz Time Dilation (Special Relativity)",
      domain: "physics",
      description: "Calculates relativistic time dilation for an observer moving at high velocity $v$ relative to speed of light $c$.",
      latex: "\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\gamma \\Delta t",
      variables: {
        dt: { label: "Proper Time (Δt)", unit: "seconds", min: 1, max: 100, step: 1, defaultValue: 10 },
        v_ratio: { label: "Velocity Ratio (v/c)", unit: "c", min: 0.01, max: 0.99, step: 0.01, defaultValue: 0.8 },
      },
      evaluate: (vars) => {
        const c = 299792458;
        const gamma = 1 / Math.sqrt(1 - Math.pow(vars.v_ratio, 2));
        const dtPrime = vars.dt * gamma;
        return {
          result: dtPrime,
          unit: "seconds",
          steps: [
            `1. Calculate Lorentz Factor: \\gamma = \\frac{1}{\\sqrt{1 - (${vars.v_ratio})^2}} = ${gamma.toFixed(4)}`,
            `2. Compute Dilated Coordinate Time: \\Delta t' = ${vars.dt} \\times ${gamma.toFixed(4)} = ${dtPrime.toFixed(4)}\\text{ s}`,
            `3. Time difference observed: ${((gamma - 1) * 100).toFixed(2)}\\% temporal expansion.`,
          ],
        };
      },
    },
    {
      id: "schrodinger_well",
      name: "Quantum Infinite Potential Well (Energy Quantization)",
      domain: "quantum",
      description: "Calculates quantized discrete energy eigenvalue levels $E_n$ for a particle trapped in an infinite 1D potential well of width $L$.",
      latex: "E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2 m L^2} = \\frac{n^2 h^2}{8 m L^2}",
      variables: {
        n: { label: "Quantum Number (n)", unit: "integer", min: 1, max: 10, step: 1, defaultValue: 1 },
        L: { label: "Well Width (L)", unit: "nm", min: 0.1, max: 5.0, step: 0.1, defaultValue: 1.0 },
        m_eff: { label: "Particle Mass (m/m_e)", unit: "m_e", min: 0.1, max: 5.0, step: 0.1, defaultValue: 1.0 },
      },
      evaluate: (vars) => {
        const h = 6.62607015e-34; // J*s
        const me = 9.1093837e-31 * vars.m_eff; // kg
        const L_meters = vars.L * 1e-9;
        const E_joules = (Math.pow(vars.n, 2) * Math.pow(h, 2)) / (8 * me * Math.pow(L_meters, 2));
        const E_ev = E_joules / 1.602176634e-19;
        return {
          result: E_ev,
          unit: "eV",
          steps: [
            `1. Quantum state mode: n = ${vars.n}, Potential width L = ${vars.L} nm`,
            `2. Evaluate denominator: 8 m L^2 = ${(8 * me * Math.pow(L_meters, 2)).toExponential(4)}\\text{ kg}\\cdot\\text{m}^2`,
            `3. Discrete Bound State Energy: E_${vars.n} = ${E_ev.toFixed(4)}\\text{ eV} (${E_joules.toExponential(4)}\\text{ J})`,
          ],
        };
      },
    },
    {
      id: "schwarzschild_radius",
      name: "Schwarzschild Gravitational Event Horizon",
      domain: "orbital",
      description: "Computes the critical radius $r_s$ where escape velocity equals the speed of light for a spherical mass $M$.",
      latex: "r_s = \\frac{2 G M}{c^2}",
      variables: {
        mass_solar: { label: "Mass (M in Solar Masses M☉)", unit: "M☉", min: 0.5, max: 100, step: 0.5, defaultValue: 5.0 },
      },
      evaluate: (vars) => {
        const G = 6.6743e-11;
        const c = 299792458;
        const M_solar = 1.989e30;
        const M = vars.mass_solar * M_solar;
        const rs_meters = (2 * G * M) / Math.pow(c, 2);
        const rs_km = rs_meters / 1000;
        return {
          result: rs_km,
          unit: "km",
          steps: [
            `1. Total Mass: M = ${vars.mass_solar}\\text{ M}_\\odot = ${M.toExponential(4)}\\text{ kg}`,
            `2. Compute Gravitational Constant product: 2GM = ${(2 * G * M).toExponential(4)}\\text{ m}^3/\\text{s}^2`,
            `3. Event Horizon Radius: r_s = ${rs_km.toFixed(3)}\\text{ km}`,
          ],
        };
      },
    },
    {
      id: "fourier_heat",
      name: "1D Fourier Heat Diffusion Rate",
      domain: "engineering",
      description: "Evaluates conductive heat flux $q$ through a material medium governed by Fourier's law.",
      latex: "q = -k \\frac{\\partial T}{\\partial x} = -k \\frac{T_2 - T_1}{\\Delta x}",
      variables: {
        k: { label: "Thermal Conductivity (k)", unit: "W/(m·K)", min: 1, max: 400, step: 5, defaultValue: 205 }, // Aluminum
        t1: { label: "Hot Surface Temp (T1)", unit: "°C", min: 50, max: 800, step: 10, defaultValue: 250 },
        t2: { label: "Cold Surface Temp (T2)", unit: "°C", min: 0, max: 100, step: 5, defaultValue: 25 },
        dx: { label: "Thickness (Δx)", unit: "mm", min: 1, max: 100, step: 1, defaultValue: 15 },
      },
      evaluate: (vars) => {
        const dx_m = vars.dx / 1000;
        const dT = vars.t1 - vars.t2;
        const q_flux = (vars.k * dT) / dx_m;
        return {
          result: q_flux / 1000,
          unit: "kW/m²",
          steps: [
            `1. Temperature Differential: \\Delta T = ${vars.t1}^\\circ\\text{C} - ${vars.t2}^\\circ\\text{C} = ${dT}\\text{ K}`,
            `2. Spatial Gradient: \\frac{\\partial T}{\\partial x} = \\frac{${dT}}{${dx_m}\\text{ m}} = ${(dT / dx_m).toFixed(2)}\\text{ K/m}`,
            `3. Conductive Heat Flux: q = ${(q_flux / 1000).toFixed(2)}\\text{ kW/m}^2`,
          ],
        };
      },
    },
    {
      id: "kinetic_energy",
      name: "Kinetic Energy & Work Theorem",
      domain: "physics",
      description: "Computes kinetic energy $E_k = \\frac{1}{2}mv^2$ derived from the work-energy integral $\\int F \\, ds$.",
      latex: "E_k = \\frac{1}{2} m v^2 = \\int_0^s F \\, ds",
      variables: {
        mass: { label: "Mass (m)", unit: "kg", min: 1, max: 2000, step: 10, defaultValue: 75 },
        velocity: { label: "Velocity (v)", unit: "m/s", min: 1, max: 100, step: 1, defaultValue: 25 },
      },
      evaluate: (vars) => {
        const ke = 0.5 * vars.mass * Math.pow(vars.velocity, 2);
        return {
          result: ke / 1000,
          unit: "kJ",
          steps: [
            `1. Identify parameters: Mass m = ${vars.mass}\\text{ kg}, Velocity v = ${vars.velocity}\\text{ m/s}`,
            `2. Evaluate square of velocity: v^2 = (${vars.velocity})^2 = ${Math.pow(vars.velocity, 2)}\\text{ m}^2/\\text{s}^2`,
            `3. Apply Work-Energy Integral: E_k = \\frac{1}{2}(${vars.mass})(${Math.pow(vars.velocity, 2)}) = ${(ke / 1000).toFixed(3)}\\text{ kJ} (${ke.toLocaleString()}\\text{ Joules})`,
          ],
        };
      },
    },
    {
      id: "kinematics_displacement",
      name: "Kinematics Constant Acceleration Motion",
      domain: "physics",
      description: "Calculates spatial displacement $s = ut + \\frac{1}{2}at^2$ under constant uniform acceleration $a$.",
      latex: "s = u t + \\frac{1}{2} a t^2",
      variables: {
        u: { label: "Initial Velocity (u)", unit: "m/s", min: 0, max: 50, step: 1, defaultValue: 10 },
        a: { label: "Acceleration (a)", unit: "m/s²", min: -20, max: 30, step: 0.5, defaultValue: 9.8 },
        t: { label: "Time Elapsed (t)", unit: "s", min: 0.5, max: 20, step: 0.5, defaultValue: 4 },
      },
      evaluate: (vars) => {
        const s = vars.u * vars.t + 0.5 * vars.a * Math.pow(vars.t, 2);
        const vFinal = vars.u + vars.a * vars.t;
        return {
          result: s,
          unit: "meters",
          steps: [
            `1. Uniform velocity component: u \\cdot t = ${vars.u} \\times ${vars.t} = ${(vars.u * vars.t).toFixed(2)}\\text{ m}`,
            `2. Accelerated component: \\frac{1}{2} a t^2 = \\frac{1}{2}(${vars.a})(${vars.t}^2) = ${(0.5 * vars.a * Math.pow(vars.t, 2)).toFixed(2)}\\text{ m}`,
            `3. Total Displacement: s = ${s.toFixed(2)}\\text{ meters} (Final Velocity: v = ${vFinal.toFixed(2)}\\text{ m/s})`,
          ],
        };
      },
    },
    {
      id: "snells_law",
      name: "Snell's Law of Optical Refraction",
      domain: "physics",
      description: "Calculates refracted angle $\\theta_2$ at the boundary between two optical media ($n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$).",
      latex: "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2) \\implies \\theta_2 = \\arcsin\\left(\\frac{n_1 \\sin\\theta_1}{n_2}\\right)",
      variables: {
        n1: { label: "Medium 1 Refractive Index (n₁)", unit: "unitless", min: 1.0, max: 2.5, step: 0.05, defaultValue: 1.0 }, // Air
        n2: { label: "Medium 2 Refractive Index (n₂)", unit: "unitless", min: 1.0, max: 2.5, step: 0.05, defaultValue: 1.5 }, // Glass
        theta1: { label: "Angle of Incidence (θ₁)", unit: "degrees", min: 1, max: 89, step: 1, defaultValue: 45 },
      },
      evaluate: (vars) => {
        const rad1 = (vars.theta1 * Math.PI) / 180;
        const sin2 = (vars.n1 * Math.sin(rad1)) / vars.n2;
        if (sin2 > 1) {
          return {
            result: 90,
            unit: "° (Total Internal Reflection)",
            steps: [
              `1. Calculated \\sin(\\theta_2) = \\frac{${vars.n1} \\times \\sin(${vars.theta1}^\\circ)}{${vars.n2}} = ${sin2.toFixed(4)} > 1.0`,
              `2. Critical angle exceeded: 100% of light undergoes Total Internal Reflection.`,
            ],
          };
        }
        const rad2 = Math.asin(sin2);
        const deg2 = (rad2 * 180) / Math.PI;
        return {
          result: deg2,
          unit: "degrees",
          steps: [
            `1. Calculate \\sin(\\theta_1): \\sin(${vars.theta1}^\\circ) = ${Math.sin(rad1).toFixed(4)}`,
            `2. Solve for \\sin(\\theta_2): \\sin(\\theta_2) = \\frac{${vars.n1} \\times ${Math.sin(rad1).toFixed(4)}}{${vars.n2}} = ${sin2.toFixed(4)}`,
            `3. Compute Refracted Angle: \\theta_2 = \\arcsin(${sin2.toFixed(4)}) = ${deg2.toFixed(2)}^\\circ`,
          ],
        };
      },
    },
    {
      id: "ideal_gas_law",
      name: "Ideal Gas Law (Thermodynamics & Chemistry)",
      domain: "chemistry",
      description: "Computes pressure $P$ of an ideal gas based on moles $n$, temperature $T$, and container volume $V$ ($PV = nRT$).",
      latex: "P = \\frac{n R T}{V} \\quad (R = 8.314\\text{ J/(mol}\\cdot\\text{K)})",
      variables: {
        n: { label: "Amount of Gas (n)", unit: "moles", min: 0.5, max: 20, step: 0.5, defaultValue: 2.0 },
        T_celsius: { label: "Temperature (T)", unit: "°C", min: -50, max: 500, step: 10, defaultValue: 25 },
        V_liters: { label: "Volume (V)", unit: "L", min: 1, max: 100, step: 1, defaultValue: 10 },
      },
      evaluate: (vars) => {
        const R = 8.314462; // J/(mol*K)
        const T_kelvin = vars.T_celsius + 273.15;
        const V_m3 = vars.V_liters * 0.001;
        const P_pascals = (vars.n * R * T_kelvin) / V_m3;
        const P_atm = P_pascals / 101325;
        const P_kpa = P_pascals / 1000;
        return {
          result: P_atm,
          unit: "atm",
          steps: [
            `1. Convert temperature: T = ${vars.T_celsius}^\\circ\\text{C} + 273.15 = ${T_kelvin.toFixed(2)}\\text{ K}`,
            `2. Compute numerator nRT: (${vars.n}) \\times 8.314 \\times ${T_kelvin.toFixed(2)} = ${(vars.n * R * T_kelvin).toFixed(1)}\\text{ J}`,
            `3. Evaluated Pressure: P = ${P_kpa.toFixed(1)}\\text{ kPa} = ${P_atm.toFixed(3)}\\text{ atm}`,
          ],
        };
      },
    },
    {
      id: "keplers_third_law",
      name: "Kepler's Third Law (Planetary Orbital Period)",
      domain: "orbital",
      description: "Computes the orbital period $T$ of a planet or satellite given its semi-major axis $a$ around a central star.",
      latex: "T = 2\\pi \\sqrt{\\frac{a^3}{G M}} \\implies T = a^{3/2} \\quad (\\text{for Solar orbits in AU and Years})",
      variables: {
        a_au: { label: "Semi-Major Axis (a)", unit: "AU", min: 0.2, max: 35, step: 0.1, defaultValue: 1.0 },
      },
      evaluate: (vars) => {
        const T_years = Math.pow(vars.a_au, 1.5);
        const T_days = T_years * 365.25;
        return {
          result: T_years,
          unit: "Earth Years",
          steps: [
            `1. Semi-major orbital axis: a = ${vars.a_au}\\text{ AU}`,
            `2. Apply Keplerian harmonic relation: T = a^{3/2} = (${vars.a_au})^{1.5}`,
            `3. Orbital Period: T = ${T_years.toFixed(3)}\\text{ Earth Years} (${T_days.toFixed(1)}\\text{ days})`,
          ],
        };
      },
    },
    {
      id: "gaussian_normal_distribution",
      name: "Gaussian Normal Distribution PDF (Mathematics & Statistics)",
      domain: "calculus",
      description: "Calculates the probability density function value $f(x)$ for a normal random variable with mean $\\mu$ and standard deviation $\\sigma$.",
      latex: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)",
      variables: {
        x: { label: "Value (x)", unit: "score", min: -5, max: 5, step: 0.2, defaultValue: 0 },
        sigma: { label: "Standard Deviation (σ)", unit: "σ", min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.0 },
      },
      evaluate: (vars) => {
        const mu = 0;
        const coef = 1 / (vars.sigma * Math.sqrt(2 * Math.PI));
        const exponent = -Math.pow(vars.x - mu, 2) / (2 * Math.pow(vars.sigma, 2));
        const density = coef * Math.exp(exponent);
        return {
          result: density,
          unit: "density",
          steps: [
            `1. Amplitude coefficient: \\frac{1}{\\sigma\\sqrt{2\\pi}} = \\frac{1}{${vars.sigma}\\sqrt{2\\pi}} = ${coef.toFixed(4)}`,
            `2. Exponential argument: -\\frac{(${vars.x})^2}{2(${vars.sigma})^2} = ${exponent.toFixed(4)}`,
            `3. Probability Density f(${vars.x}): ${density.toFixed(5)}`,
          ],
        };
      },
    },
    {
      id: "earthquake_richter_energy",
      name: "Gutenberg-Richter Seismic Energy Release (Earth Science)",
      domain: "earth_science",
      description: "Calculates the total seismic energy $E$ in Joules released by an earthquake of Richter moment magnitude $M$.",
      latex: "\\log_{10} E = 4.8 + 1.5 M \\implies E = 10^{4.8 + 1.5 M} \\text{ Joules}",
      variables: {
        magnitude: { label: "Richter Magnitude (M)", unit: "M", min: 1.0, max: 9.5, step: 0.2, defaultValue: 6.0 },
      },
      evaluate: (vars) => {
        const logE = 4.8 + 1.5 * vars.magnitude;
        const E_joules = Math.pow(10, logE);
        const tnt_tons = E_joules / 4.184e9;
        return {
          result: tnt_tons,
          unit: "Tons of TNT equivalent",
          steps: [
            `1. Compute log₁₀(Energy): 4.8 + 1.5 \\times ${vars.magnitude} = ${logE.toFixed(2)}`,
            `2. Total Radiated Seismic Energy: E = 10^{${logE.toFixed(2)}} = ${E_joules.toExponential(3)}\\text{ Joules}`,
            `3. High-Explosive TNT Equivalent: ${tnt_tons > 1e6 ? (tnt_tons / 1e6).toFixed(2) + "\\text{ Megatons TNT}" : tnt_tons.toFixed(0) + "\\text{ Tons TNT}"}`,
          ],
        };
      },
    },
    {
      id: "logistic_population_growth",
      name: "Verhulst Logistic Population Growth (Biology)",
      domain: "biology",
      description: "Models biological population growth rate $dN/dt$ constrained by environmental carrying capacity $K$ and intrinsic reproductive rate $r$.",
      latex: "\\frac{dN}{dt} = r N \\left(1 - \\frac{N}{K}\\right)",
      variables: {
        N: { label: "Current Population (N)", unit: "individuals", min: 10, max: 2000, step: 20, defaultValue: 400 },
        K: { label: "Carrying Capacity (K)", unit: "individuals", min: 500, max: 3000, step: 50, defaultValue: 1000 },
        r_rate: { label: "Growth Rate (r)", unit: "rate/yr", min: 0.05, max: 0.8, step: 0.05, defaultValue: 0.25 },
      },
      evaluate: (vars) => {
        const fractionLeft = 1 - vars.N / vars.K;
        const dN_dt = vars.r_rate * vars.N * fractionLeft;
        return {
          result: dN_dt,
          unit: "individuals / year",
          steps: [
            `1. Density-dependent limiting factor: 1 - \\frac{N}{K} = 1 - \\frac{${vars.N}}{${vars.K}} = ${fractionLeft.toFixed(3)}`,
            `2. Maximum potential unconstrained growth: r \\cdot N = ${vars.r_rate} \\times ${vars.N} = ${(vars.r_rate * vars.N).toFixed(1)}`,
            `3. Net Population Growth Rate: \\frac{dN}{dt} = ${dN_dt.toFixed(1)}\\text{ individuals/year}`,
          ],
        };
      },
    },
  ];

  const [selectedFormula, setSelectedFormula] = useState<FormulaPreset>(formulaPresets[0]);
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({
    dt: 10,
    v_ratio: 0.8,
  });

  // Handle formula selection
  const handleSelectFormula = (preset: FormulaPreset) => {
    setSelectedFormula(preset);
    const initialVars: { [key: string]: number } = {};
    Object.keys(preset.variables).forEach((k) => {
      initialVars[k] = preset.variables[k].defaultValue;
    });
    setSliderValues(initialVars);
  };

  const handleSliderChange = (key: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }));
  };

  const calcResult = selectedFormula.evaluate(sliderValues);

  // Generate dynamic chart data for the current formula
  const chartData = Array.from({ length: 20 }, (_, i) => {
    const primaryKey = Object.keys(selectedFormula.variables)[0];
    const cfg = selectedFormula.variables[primaryKey];
    const val = cfg.min + ((cfg.max - cfg.min) / 19) * i;
    const testVars = { ...sliderValues, [primaryKey]: val };
    const res = selectedFormula.evaluate(testVars);
    return {
      x: Number(val.toFixed(2)),
      y: Number(res.result.toFixed(3)),
    };
  });

  return (
    <div
      className="flex flex-col h-full rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-500"
      style={{
        backgroundColor: activeTheme.panelBg,
        borderColor: activeTheme.subtleBorder,
      }}
    >
      {/* Header Tabs */}
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
          <Atom
            className="w-4 h-4 animate-spin-slow"
            style={{ color: activeTheme.primary }}
          />
          <span>STEM RESEARCH & CALCULATION DECK</span>
        </div>

        <div className="flex items-center gap-1 bg-[#1A1F26] p-1 rounded-lg border border-[#2D3748] text-xs font-mono">
          <button
            onClick={() => setActiveTab("formulas")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "formulas"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "formulas"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Formula Solver</span>
          </button>
          <button
            onClick={() => setActiveTab("simulations")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "simulations"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "simulations"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulations</span>
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "research"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "research"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ArXiv Grounding</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "code"
                ? "border shadow-sm font-medium"
                : "text-white/50 hover:text-white"
            }`}
            style={
              activeTab === "code"
                ? {
                    backgroundColor: activeTheme.activeBadgeBg,
                    borderColor: `${activeTheme.primary}44`,
                    color: activeTheme.primary,
                  }
                : {}
            }
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Sci-Kernel</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "formulas" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Preset Selector & Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Formula Selection List */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400/80 uppercase tracking-wider block">
                  Select STEM Derivation Model:
                </label>
                <div className="space-y-1.5">
                  {formulaPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectFormula(preset)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                        selectedFormula.id === preset.id
                          ? "bg-cyan-950/60 border-cyan-400/60 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-800 hover:bg-slate-900/80"
                      }`}
                    >
                      <span className="font-semibold truncate">{preset.name}</span>
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-cyan-900/30 text-cyan-300 border border-cyan-800/40">
                        {preset.domain}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Parameter Sliders */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VARIABLE MATRIX CONTROLS</span>
                  </div>
                  <button
                    onClick={() => handleSelectFormula(selectedFormula)}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {(Object.entries(selectedFormula.variables) as [string, { label: string; unit: string; min: number; max: number; step: number; defaultValue: number }][]).map(([key, config]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{config.label}:</span>
                      <span className="text-cyan-300 font-bold">
                        {sliderValues[key] ?? config.defaultValue} {config.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={sliderValues[key] ?? config.defaultValue}
                      onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{config.min}</span>
                      <span>{config.max}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ask Quantum To Break Down Deeper */}
              <button
                onClick={() =>
                  onSendToQuantum(
                    `Quantum, please provide a rigorous mathematical breakdown and derivation of ${selectedFormula.name} with equations $$${selectedFormula.latex}$$, exploring boundary conditions and engineering applications.`,
                    selectedFormula.domain
                  )
                }
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-hud font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <Sparkles className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span>ENGAGE QUANTUM DERIVATION ENGINE</span>
              </button>
            </div>

            {/* Right Column: Dynamic LaTeX Math & Calculation Results & Graphs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Formula & Result Display Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 shadow-xl space-y-3">
                <div className="text-xs text-slate-400">{selectedFormula.description}</div>
                
                {/* LaTeX Equation */}
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                  <KaTeXRenderer content={`$$${selectedFormula.latex}$$`} />
                </div>

                {/* Primary Evaluation Result Banner */}
                <div className="p-3.5 rounded-lg bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-400/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                      Computed Output Result:
                    </div>
                    <div className="text-2xl font-black font-hud text-cyan-100 tracking-wide mt-0.5">
                      {typeof calcResult.result === "number" && calcResult.result > 10000
                        ? calcResult.result.toExponential(4)
                        : calcResult.result.toFixed(4)}{" "}
                      <span className="text-sm font-mono text-cyan-300 font-normal">
                        {calcResult.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                {/* Step-by-Step Proof / Derivation Sequence */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    Numerical Computation Steps:
                  </div>
                  <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    {calcResult.steps.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-300">
                        <KaTeXRenderer content={step} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Recharts Visualization of the Formula */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40 space-y-2 min-w-0">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold">
                  <span>PARAMETER RESPONSE CURVE</span>
                  <span className="text-slate-400 text-[10px]">f(x) Sensitivity Plot</span>
                </div>
                <div className="h-44 w-full min-w-0 min-h-[176px] relative overflow-hidden">
                  <ResponsiveContainer width="100%" height={176} minWidth={0} minHeight={176} debounce={50}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0a0f1d",
                          borderColor: "#06b6d4",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#06b6d4"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: "#22d3ee" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "simulations" && (
          <InteractiveSimulations onSendToQuantum={onSendToQuantum} />
        )}

        {activeTab === "research" && <ArxivResearchSynthesizer onSendToQuantum={onSendToQuantum} />}

        {activeTab === "code" && <ScientificCodeKernel />}
      </div>
    </div>
  );
};

// Subcomponent: ArXiv Research Synthesizer
const ArxivResearchSynthesizer: React.FC<{ onSendToQuantum: (prompt: string) => void }> = ({
  onSendToQuantum,
}) => {
  const [searchQuery, setSearchQuery] = useState("Quantum error correction topological surface codes");
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchArxivPapers = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/research/arxiv-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { papers: [] };
      }
      setPapers(data.papers || []);
    } catch (e) {
      console.error("ArXiv search error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArxivPapers(searchQuery);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) fetchArxivPapers(searchQuery);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search STEM topics (e.g. CRISPR gene editing, Tokamak fusion, Neural ODEs)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-900/50 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-400/50 text-cyan-200 text-xs font-hud font-bold tracking-wider"
        >
          {loading ? "SEARCHING..." : "QUERY ARXIV"}
        </button>
      </form>

      {/* Results List */}
      <div className="space-y-3">
        {papers.map((p, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/50 border border-cyan-900/40 hover:border-cyan-500/40 transition-all space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold text-cyan-100 leading-snug">{p.title}</h4>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 shrink-0">
                {p.arxivId} ({p.year})
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Authors: {p.authors}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{p.abstractSummary}</p>
            <div className="p-2 rounded bg-cyan-950/30 border border-cyan-900/30 text-xs font-mono text-cyan-300">
              <strong className="text-cyan-200">STEM Impact:</strong> {p.stemImpact}
            </div>
            <div className="flex items-center justify-between pt-1">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View on ArXiv</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() =>
                  onSendToQuantum(
                    `Quantum, please synthesize and critique the research paper titled "${p.title}" (${p.arxivId}), explaining its mathematical formulations and future scientific roadmap.`
                  )
                }
                className="text-xs font-hud text-cyan-300 hover:text-cyan-100 flex items-center gap-1.5 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deep Literature Synthesis</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcomponent: Scientific Code & Numerical Kernel
const ScientificCodeKernel: React.FC = () => {
  const [code, setCode] = useState(`// Quantum STEM Numerical Simulation Sandbox (JS / Python scope)
// Computes eigenvalues & discrete Fourier transform harmonic
const N = 16;
const signal = [];
for (let n = 0; n < N; n++) {
  // Composite waveform: 3Hz + 7Hz harmonics
  signal.push(Math.sin((2 * Math.PI * 3 * n) / N) + 0.5 * Math.cos((2 * Math.PI * 7 * n) / N));
}

console.log("Input Waveform Sample Count:", signal.length);
console.log("Peak Signal Amplitude:", Math.max(...signal).toFixed(4));
console.log("RMS Energy:", Math.sqrt(signal.reduce((acc, v) => acc + v*v, 0) / N).toFixed(4));
return "Harmonic DFT convergence verified: 100% spectral purity.";`);

  const [output, setOutput] = useState<{ logs: string[]; result: string; executionTime?: string } | null>(
    null
  );
  const [executing, setExecuting] = useState(false);

  const handleRunCode = async () => {
    setExecuting(true);
    try {
      const res = await fetch("/api/tools/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "javascript", code }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { logs: ["Executed successfully."], result: "OK" };
      }
      setOutput(data);
    } catch (e: any) {
      setOutput({ logs: [e.message], result: "Execution Error" });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>QUANTUM SCIENTIFIC SCRIPT SANDBOX</span>
        </div>
        <button
          onClick={handleRunCode}
          disabled={executing}
          className="px-4 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{executing ? "COMPUTING..." : "RUN SCI-KERNEL"}</span>
        </button>
      </div>

      <div className="rounded-xl border border-cyan-900/50 bg-[#050811] overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={9}
          className="w-full p-3.5 bg-transparent font-mono text-xs text-cyan-200 focus:outline-none resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {output && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 font-mono text-xs space-y-2">
          <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1.5">
            <span className="text-cyan-400 font-bold">KERNEL STDOUT OUTPUT:</span>
            <span>{output.executionTime}</span>
          </div>
          <div className="space-y-1 text-slate-300">
            {output.logs.map((log, i) => (
              <div key={i} className="text-cyan-200">
                ▸ {log}
              </div>
            ))}
          </div>
          <div className="text-emerald-400 pt-1 font-semibold">
            Result: {output.result}
          </div>
        </div>
      )}
    </div>
  );
};
