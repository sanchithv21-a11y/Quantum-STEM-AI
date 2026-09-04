import React, { useState, useEffect, useRef } from "react";
import { playQuantumClick } from "../utils/soundEffects";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Sliders,
  Search,
  Sparkles,
  Zap,
  Activity,
  Compass,
  Atom,
  Flame,
  Globe,
  Settings2,
  HelpCircle,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export interface SimulationItem {
  id: string;
  name: string;
  category: "chaos" | "quantum" | "astrophysics" | "mechanics" | "thermodynamics" | "electromagnetism" | "relativity";
  categoryLabel: string;
  formula: string;
  iconName: "Atom" | "Activity" | "Globe" | "Zap" | "Flame" | "Compass";
  shortDesc: string;
  questionsAnswered: string[];
  presets: { name: string; params: Record<string, number | boolean> }[];
  defaultParams: Record<string, number | boolean>;
}

const SIMULATIONS_CATALOG: SimulationItem[] = [
  {
    id: "lorentz",
    name: "Lorenz Strange Attractor (Chaos Theory)",
    category: "chaos",
    categoryLabel: "Non-Linear Dynamics & Chaos",
    formula: "dx/dt = σ(y - x) | dy/dt = x(ρ - z) - y | dz/dt = xy - βz",
    iconName: "Activity",
    shortDesc: "Demonstrates sensitive dependence on initial conditions (Butterfly Effect) in non-linear phase space.",
    questionsAnswered: [
      "How does the butterfly effect work in physics?",
      "Why are long-term weather predictions chaotic and unpredictable?",
      "What is a strange attractor in phase space?",
      "How do two nearly identical starting states diverge exponentially over time?",
    ],
    presets: [
      { name: "Classic Butterfly", params: { sigma: 10, rho: 28, beta: 2.67, trailLength: 750, rotSpeed: 0.2 } },
      { name: "Intermittent Chaos", params: { sigma: 10, rho: 166, beta: 2.67, trailLength: 900, rotSpeed: 0.25 } },
      { name: "Stable Limit Cycle", params: { sigma: 10, rho: 13, beta: 2.67, trailLength: 500, rotSpeed: 0.15 } },
    ],
    defaultParams: {
      sigma: 10,
      rho: 28,
      beta: 2.67,
      trailLength: 750,
      rotSpeed: 0.2,
    },
  },
  {
    id: "wave",
    name: "Double-Slit Wave Interference (Quantum Mechanics)",
    category: "quantum",
    categoryLabel: "Quantum Mechanics & Optics",
    formula: "I(θ) = 4 I₀ cos²((π d sin θ)/λ) | Wave-Particle Duality",
    iconName: "Atom",
    shortDesc: "Simulates wave-particle interference and quantum wave function collapse when an observer watches.",
    questionsAnswered: [
      "Why do light and matter create alternating interference fringes?",
      "What is quantum wave-particle duality?",
      "What happens to the interference pattern when an observer detects which slit was used?",
      "How does changing slit separation or wavelength change fringe spacing?",
    ],
    presets: [
      { name: "Classic Dual Fringes", params: { slitSeparation: 32, wavelength: 0.25, detectorActive: false, waveSpeed: 3.5 } },
      { name: "Observer / Collapse", params: { slitSeparation: 32, wavelength: 0.25, detectorActive: true, waveSpeed: 3.5 } },
      { name: "High-Frequency Gamma", params: { slitSeparation: 45, wavelength: 0.42, detectorActive: false, waveSpeed: 4.8 } },
    ],
    defaultParams: {
      slitSeparation: 32,
      wavelength: 0.25,
      detectorActive: false,
      waveSpeed: 3.5,
    },
  },
  {
    id: "orbit",
    name: "N-Body Gravitational Orbital Sandbox (Keplerian Mechanics)",
    category: "astrophysics",
    categoryLabel: "Astrophysics & Gravitation",
    formula: "F = G(M·m)/r² | T² ∝ a³ (Kepler's 3rd Law)",
    iconName: "Globe",
    shortDesc: "Simulates multi-planetary elliptical orbits, orbital velocity conservation, and gravitational attraction.",
    questionsAnswered: [
      "How do planets orbit around stars according to Kepler's Laws?",
      "Why do planets travel faster at perihelion (closest approach) than aphelion?",
      "What happens to orbits if the central stellar mass increases or decreases?",
      "How does gravitational orbital eccentricity change a planetary trajectory?",
    ],
    presets: [
      { name: "Solar System (4 Planets)", params: { centralMass: 1.0, planetCount: 4, eccentricity: 0.2, showTrails: true, gravConst: 1.0 } },
      { name: "Supermassive Star", params: { centralMass: 2.4, planetCount: 5, eccentricity: 0.12, showTrails: true, gravConst: 1.4 } },
      { name: "High Eccentricity Comets", params: { centralMass: 1.2, planetCount: 3, eccentricity: 0.55, showTrails: true, gravConst: 1.0 } },
    ],
    defaultParams: {
      centralMass: 1.0,
      planetCount: 4,
      eccentricity: 0.2,
      showTrails: true,
      gravConst: 1.0,
    },
  },
  {
    id: "double_pendulum",
    name: "Double Pendulum Chaos Engine (Lagrangian Dynamics)",
    category: "mechanics",
    categoryLabel: "Classical Mechanics",
    formula: "d/dt(∂L/∂θ̇) - ∂L/∂θ = 0 | Non-Linear Coupled ODEs",
    iconName: "Activity",
    shortDesc: "A double-jointed pendulum that exhibits deterministic chaos, extreme sensitivity, and fractal phase paths.",
    questionsAnswered: [
      "Why is a double pendulum completely unpredictable even though physics is deterministic?",
      "How does energy exchange between coupled rotational oscillators?",
      "What do chaotic trajectory phase plots look like?",
      "What happens when the mass ratio between arms is varied?",
    ],
    presets: [
      { name: "Chaotic Loop", params: { length1: 75, length2: 65, mass1: 12, mass2: 10, gravity: 9.8, damping: 0.0003 } },
      { name: "Violent Whip", params: { length1: 90, length2: 45, mass1: 20, mass2: 6, gravity: 14.0, damping: 0.0001 } },
      { name: "Gentle Quasi-Periodic", params: { length1: 65, length2: 65, mass1: 10, mass2: 10, gravity: 6.0, damping: 0.001 } },
    ],
    defaultParams: {
      length1: 75,
      length2: 65,
      mass1: 12,
      mass2: 10,
      gravity: 9.8,
      damping: 0.0003,
    },
  },
  {
    id: "quantum_tunneling",
    name: "Quantum Barrier Tunneling & Wave Packet (Schrödinger Equation)",
    category: "quantum",
    categoryLabel: "Quantum Mechanics",
    formula: "T ≈ e^{-2 ∫ √(2m(V(x) - E))/ħ dx} | iħ ∂ψ/∂t = Ĥψ",
    iconName: "Atom",
    shortDesc: "Simulates a quantum wave packet impinging on a rectangular potential barrier with transmission and reflection.",
    questionsAnswered: [
      "How do quantum particles tunnel through barriers with higher energy than the particle?",
      "How does scanning tunneling microscopy (STM) or nuclear alpha decay happen?",
      "Why is tunneling probability exponentially dependent on barrier thickness?",
      "What happens to the phase and amplitude of the reflected vs transmitted wave?",
    ],
    presets: [
      { name: "Partial Tunneling (50%)", params: { barrierHeight: 48, barrierWidth: 32, packetEnergy: 40, packetWidth: 28 } },
      { name: "Total Opaque Barrier", params: { barrierHeight: 80, barrierWidth: 60, packetEnergy: 25, packetWidth: 24 } },
      { name: "High Energy Transmission", params: { barrierHeight: 30, barrierWidth: 25, packetEnergy: 65, packetWidth: 30 } },
    ],
    defaultParams: {
      barrierHeight: 48,
      barrierWidth: 32,
      packetEnergy: 40,
      packetWidth: 28,
    },
  },
  {
    id: "kinetic_gas",
    name: "Ideal Gas & Molecular Thermodynamics (Maxwell-Boltzmann)",
    category: "thermodynamics",
    categoryLabel: "Thermodynamics & Statistical Physics",
    formula: "PV = N k_B T | v_{rms} = √(3 k_B T / m) | P = (1/3) ρ ⟨v²⟩",
    iconName: "Flame",
    shortDesc: "Enclosed hard-sphere molecular collisions showing temperature, pressure, and velocity distribution.",
    questionsAnswered: [
      "How does temperature affect pressure in an enclosed gas according to PV=Nk_BT?",
      "What does the Maxwell-Boltzmann distribution of molecular velocities look like?",
      "Why do gas particles diffuse and collide faster when heated?",
      "How do microscopic particle impacts generate macroscopic wall pressure?",
    ],
    presets: [
      { name: "Room Temp STP (300K)", params: { temperature: 300, particleCount: 50, boxWidthPct: 80, gravityOn: false } },
      { name: "Superheated Gas (850K)", params: { temperature: 850, particleCount: 75, boxWidthPct: 80, gravityOn: false } },
      { name: "Atmospheric Stratification", params: { temperature: 260, particleCount: 65, boxWidthPct: 80, gravityOn: true } },
    ],
    defaultParams: {
      temperature: 300,
      particleCount: 50,
      boxWidthPct: 80,
      gravityOn: false,
    },
  },
  {
    id: "lorentz_force",
    name: "Lorentz Force & Particle Cyclotron (Electromagnetism)",
    category: "electromagnetism",
    categoryLabel: "Electrodynamics & Plasma",
    formula: "F = q(E + v × B) | r_{cyclotron} = (m v)/(q B)",
    iconName: "Zap",
    shortDesc: "Simulates charged particles accelerating in an electric field and curving in magnetic fields.",
    questionsAnswered: [
      "How does a magnetic field bend an electron or ion beam?",
      "How do particle accelerators and cyclotrons trap charged matter?",
      "What is the physical meaning of the right-hand rule force F = q(v × B)?",
      "Why does a magnetic field change a particle's direction but do zero work?",
    ],
    presets: [
      { name: "Cyclotron Circular Orbit", params: { bField: 2.8, eField: 0.0, charge: 1, initSpeed: 3.2 } },
      { name: "Crossed E×B Drift", params: { bField: 2.5, eField: 1.8, charge: 1, initSpeed: 2.5 } },
      { name: "Anti-Matter Positron Loop", params: { bField: -2.8, eField: 0.5, charge: -1, initSpeed: 3.2 } },
    ],
    defaultParams: {
      bField: 2.8,
      eField: 0.0,
      charge: 1,
      initSpeed: 3.2,
    },
  },
  {
    id: "black_hole",
    name: "Black Hole Gravitational Lensing & Geodesics (General Relativity)",
    category: "relativity",
    categoryLabel: "General Relativity & Cosmology",
    formula: "Δφ = 4GM / (c² b) | R_s = 2GM / c² | Photon Sphere = 1.5 R_s",
    iconName: "Compass",
    shortDesc: "Light ray deflection and photon capture around a Schwarzschild black hole with accretion ring.",
    questionsAnswered: [
      "How does gravity bend light paths around a supermassive black hole?",
      "What is the photon sphere where light orbits in a closed circle?",
      "Why does gravitational lensing create Einstein rings and double images?",
      "What happens to light rays with impact parameters inside the critical threshold?",
    ],
    presets: [
      { name: "Einstein Ring Deflection", params: { mass: 2.2, beamCount: 9, impactDistance: 38, showAccretion: true } },
      { name: "Extreme Photon Capture", params: { mass: 3.5, beamCount: 11, impactDistance: 24, showAccretion: true } },
      { name: "Weak Gravitational Lensing", params: { mass: 1.2, beamCount: 7, impactDistance: 50, showAccretion: false } },
    ],
    defaultParams: {
      mass: 2.2,
      beamCount: 9,
      impactDistance: 38,
      showAccretion: true,
    },
  },
];

const PRESET_POPULAR_QUESTIONS = [
  "How do planets orbit around stars?",
  "Why do waves interfere in double-slit?",
  "What is quantum tunneling?",
  "How does chaos emerge in a pendulum?",
  "How does temperature affect gas pressure?",
  "How does a magnetic field bend an electron?",
  "How does gravity bend light around a black hole?",
  "What is the butterfly effect?",
];

interface InteractiveSimulationsProps {
  onSendToQuantum: (prompt: string) => void;
}

export const InteractiveSimulations: React.FC<InteractiveSimulationsProps> = ({
  onSendToQuantum,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSimId, setActiveSimId] = useState<string>("lorentz");
  const [running, setRunning] = useState<boolean>(true);
  const [speedMult, setSpeedMult] = useState<number>(1.0);
  const [stepTick, setStepTick] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);

  // Hovered topic state for rich cursor inspection & displaying full sentence
  const [hoveredTopic, setHoveredTopic] = useState<SimulationItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Active simulation parameters state
  const activeSim =
    SIMULATIONS_CATALOG.find((s) => s.id === activeSimId) || SIMULATIONS_CATALOG[0];

  const [simParams, setSimParams] = useState<Record<string, number | boolean>>(
    () => ({ ...activeSim.defaultParams })
  );

  // Update parameters when simulation type changes
  useEffect(() => {
    setSimParams({ ...activeSim.defaultParams });
  }, [activeSimId]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // State persistence refs for continuous physics integrations
  const stateRef = useRef<any>({
    t: 0,
    lorentz: { x: 0.1, y: 0, z: 0, points: [] },
    pendulum: { th1: Math.PI / 2, th2: Math.PI / 2, w1: 0, w2: 0, trace: [] },
    planets: [
      { r: 42, angle: 0, speed: 0.04, color: "#38bdf8", size: 4 },
      { r: 76, angle: 1, speed: 0.025, color: "#34d399", size: 5.5 },
      { r: 122, angle: 2.5, speed: 0.015, color: "#f59e0b", size: 7 },
      { r: 172, angle: 4.2, speed: 0.009, color: "#818cf8", size: 6.5 },
      { r: 215, angle: 0.8, speed: 0.006, color: "#ec4899", size: 5 },
      { r: 260, angle: 3.1, speed: 0.004, color: "#06b6d4", size: 4.5 },
    ],
    gasParticles: [] as Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }>,
    charges: [] as Array<{ x: number; y: number; vx: number; vy: number; trail: Array<{ x: number; y: number }> }>,
    wavePackets: { x: -140, psiReal: [] as number[], psiImag: [] as number[] },
  });

  // Reset current simulation state
  const handleResetSimulation = () => {
    playQuantumClick();
    const s = stateRef.current;
    s.t = 0;
    s.lorentz = { x: 0.1 + Math.random() * 0.02, y: 0, z: 0, points: [] };
    s.pendulum = { th1: Math.PI / 2 + (Math.random() - 0.5) * 0.1, th2: Math.PI / 2, w1: 0, w2: 0, trace: [] };
    s.charges = [];
    s.wavePackets = { x: -140, psiReal: [], psiImag: [] };
    setStepTick((v) => v + 1);
  };

  // Interactive canvas click handler: perturbs or injects physical dynamics
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    playQuantumClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (activeSimId === "lorentz") {
      // Perturb chaotic trajectory to illustrate butterfly effect divergence
      if (stateRef.current.lorentz) {
        stateRef.current.lorentz.x += (Math.random() - 0.5) * 2.0;
        stateRef.current.lorentz.y += (Math.random() - 0.5) * 2.0;
      }
    } else if (activeSimId === "wave") {
      // Toggle observer quantum collapse
      handleParamChange("detectorActive", !simParams.detectorActive);
    } else if (activeSimId === "double_pendulum") {
      if (stateRef.current.pendulum) {
        stateRef.current.pendulum.th1 += (Math.random() - 0.5) * 0.8;
        stateRef.current.pendulum.th2 += (Math.random() - 0.5) * 1.2;
      }
    } else if (activeSimId === "kinetic_gas") {
      if (stateRef.current.gasParticles) {
        stateRef.current.gasParticles.forEach((p: any) => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.hypot(dx, dy) + 1;
          p.vx += (dx / dist) * 4;
          p.vy += (dy / dist) * 4;
        });
      }
    } else if (activeSimId === "orbit") {
      if (stateRef.current.planets) {
        stateRef.current.planets.forEach((p: any) => {
          p.angle += (Math.random() - 0.5) * 0.5;
        });
      }
    } else if (activeSimId === "black_hole") {
      setStepTick((v) => v + 1);
    }
  };

  // Initialize gas particles if needed
  useEffect(() => {
    const s = stateRef.current;
    const count = typeof simParams.particleCount === "number" ? simParams.particleCount : 50;
    const temp = typeof simParams.temperature === "number" ? simParams.temperature : 300;
    const vBase = Math.sqrt(temp / 300) * 1.5;

    s.gasParticles = Array.from({ length: count }, () => ({
      x: 30 + Math.random() * 280,
      y: 30 + Math.random() * 200,
      vx: (Math.random() - 0.5) * vBase * 2,
      vy: (Math.random() - 0.5) * vBase * 2,
      radius: 3.5,
      color: "#22d3ee",
    }));
  }, [simParams.particleCount, simParams.temperature, activeSimId]);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Subtle background fade for motion blur
      ctx.fillStyle = "rgba(5, 7, 13, 0.28)";
      ctx.fillRect(0, 0, width, height);

      // Draw background coordinate grid if enabled
      if (showGrid) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.04)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const s = stateRef.current;
      const dt = 0.02 * speedMult;
      s.t += dt;

      // 1. LORENZ ATTRACTOR
      if (activeSimId === "lorentz") {
        const sigma = Number(simParams.sigma ?? 10);
        const rho = Number(simParams.rho ?? 28);
        const beta = Number(simParams.beta ?? 2.67);
        const maxPts = Number(simParams.trailLength ?? 750);
        const rotSpeed = Number(simParams.rotSpeed ?? 0.2);

        const subSteps = Math.max(1, Math.round(8 * speedMult));
        const subDt = 0.01;

        for (let i = 0; i < subSteps; i++) {
          const dx = sigma * (s.lorentz.y - s.lorentz.x) * subDt;
          const dy = (s.lorentz.x * (rho - s.lorentz.z) - s.lorentz.y) * subDt;
          const dz = (s.lorentz.x * s.lorentz.y - beta * s.lorentz.z) * subDt;
          s.lorentz.x += dx;
          s.lorentz.y += dy;
          s.lorentz.z += dz;
          s.lorentz.points.push({ x: s.lorentz.x, y: s.lorentz.y, z: s.lorentz.z });
          if (s.lorentz.points.length > maxPts) s.lorentz.points.shift();
        }

        ctx.save();
        ctx.translate(cx, cy + 30);
        ctx.scale(6.2, 6.2);

        const angle = s.t * rotSpeed;
        ctx.beginPath();
        for (let i = 0; i < s.lorentz.points.length; i++) {
          const pt = s.lorentz.points[i];
          const px = pt.x * Math.cos(angle) - pt.y * Math.sin(angle);
          const py = -pt.z + 25;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 0.35;
        ctx.stroke();

        // Current head bead
        if (s.lorentz.points.length > 0) {
          const last = s.lorentz.points[s.lorentz.points.length - 1];
          const hx = last.x * Math.cos(angle) - last.y * Math.sin(angle);
          const hy = -last.z + 25;
          ctx.beginPath();
          ctx.arc(hx, hy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      // 2. DOUBLE-SLIT WAVE INTERFERENCE
      else if (activeSimId === "wave") {
        const d = Number(simParams.slitSeparation ?? 32);
        const k = Number(simParams.wavelength ?? 0.25);
        const speed = Number(simParams.waveSpeed ?? 3.5);
        const detectorOn = Boolean(simParams.detectorActive);

        const gridStep = 5;

        // Render wave field
        for (let x = 0; x < width; x += gridStep) {
          for (let y = 0; y < height; y += gridStep) {
            if (detectorOn) {
              // Collapsed to two localized particle beams
              const d1 = Math.abs(x - (cx - d));
              const d2 = Math.abs(x - (cx + d));
              const beam1 = Math.exp(-Math.pow(d1 / 18, 2));
              const beam2 = Math.exp(-Math.pow(d2 / 18, 2));
              const intensity = (beam1 + beam2) * 0.9;
              if (intensity > 0.08) {
                ctx.fillStyle = `rgba(234, 179, 8, ${intensity * 0.7})`;
                ctx.fillRect(x, y, gridStep, gridStep);
              }
            } else {
              // Quantum wave superposition interference
              const r1 = Math.hypot(x - (cx - d), y - (cy - 30));
              const r2 = Math.hypot(x - (cx + d), y - (cy - 30));
              const psi =
                Math.cos(k * r1 - s.t * speed) / Math.sqrt(r1 + 1) +
                Math.cos(k * r2 - s.t * speed) / Math.sqrt(r2 + 1);
              const intensity = Math.min(1, Math.abs(psi) * 2.8);

              if (intensity > 0.08) {
                ctx.fillStyle = `rgba(6, 182, 212, ${intensity * 0.65})`;
                ctx.fillRect(x, y, gridStep, gridStep);
              }
            }
          }
        }

        // Barrier with two slits
        ctx.fillStyle = "#1e293b";
        const barrierY = cy - 30;
        ctx.fillRect(0, barrierY - 4, cx - d - 10, 8);
        ctx.fillRect(cx - d + 10, barrierY - 4, d * 2 - 20, 8);
        ctx.fillRect(cx + d + 10, barrierY - 4, width - (cx + d + 10), 8);

        // Slit apertures glow
        ctx.fillStyle = detectorOn ? "#eab308" : "#22d3ee";
        ctx.fillRect(cx - d - 10, barrierY - 4, 20, 8);
        ctx.fillRect(cx + d - 10, barrierY - 4, 20, 8);

        // Observer Detector Indicator
        if (detectorOn) {
          ctx.fillStyle = "#eab308";
          ctx.font = "11px monospace";
          ctx.fillText("⚠️ DETECTOR ACTIVE // WAVE FUNCTION COLLAPSED TO PARTICLES", 16, 26);
        }
      }

      // 3. N-BODY ORBIT
      else if (activeSimId === "orbit") {
        const massM = Number(simParams.centralMass ?? 1.0);
        const count = Math.min(6, Math.max(1, Number(simParams.planetCount ?? 4)));
        const ecc = Number(simParams.eccentricity ?? 0.2);
        const showTrails = Boolean(simParams.showTrails);

        ctx.save();
        ctx.translate(cx, cy);

        // Central Star (Sun)
        ctx.beginPath();
        const sunRadius = 14 * Math.sqrt(massM);
        ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = massM > 1.8 ? "#38bdf8" : "#f59e0b";
        ctx.shadowColor = massM > 1.8 ? "#38bdf8" : "#f59e0b";
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Orbiting Bodies
        for (let i = 0; i < count; i++) {
          const p = s.planets[i];
          const speedFactor = Math.sqrt(massM) * speedMult;
          p.angle += p.speed * speedFactor;

          const a = p.r;
          const r = (a * (1 - ecc * ecc)) / (1 + ecc * Math.cos(p.angle));
          const px = r * Math.cos(p.angle);
          const py = r * Math.sin(p.angle) * 0.72;

          if (showTrails) {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.r, p.r * 0.72, 0, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Planet body
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Velocity vector if enabled
          if (showVectors) {
            const vx = -Math.sin(p.angle) * 14;
            const vy = Math.cos(p.angle) * 10;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + vx, py + vy);
            ctx.strokeStyle = "rgba(34, 211, 238, 0.5)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // 4. DOUBLE PENDULUM
      else if (activeSimId === "double_pendulum") {
        const l1 = Number(simParams.length1 ?? 75);
        const l2 = Number(simParams.length2 ?? 65);
        const m1 = Number(simParams.mass1 ?? 12);
        const m2 = Number(simParams.mass2 ?? 10);
        const g = Number(simParams.gravity ?? 9.8);
        const damping = Number(simParams.damping ?? 0.0003);

        const p = s.pendulum;
        const subSteps = Math.max(1, Math.round(6 * speedMult));
        const dtSub = 0.015;

        for (let step = 0; step < subSteps; step++) {
          const delta = p.th1 - p.th2;

          const num1 = -g * (2 * m1 + m2) * Math.sin(p.th1) - m2 * g * Math.sin(p.th1 - 2 * p.th2) - 2 * Math.sin(delta) * m2 * (p.w2 * p.w2 * l2 + p.w1 * p.w1 * l1 * Math.cos(delta));
          const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * p.th1 - 2 * p.th2));
          const alpha1 = num1 / den1;

          const num2 = 2 * Math.sin(delta) * (p.w1 * p.w1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(p.th1) + p.w2 * p.w2 * l2 * m2 * Math.cos(delta));
          const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * p.th1 - 2 * p.th2));
          const alpha2 = num2 / den2;

          p.w1 += alpha1 * dtSub;
          p.w2 += alpha2 * dtSub;
          p.w1 *= 1 - damping;
          p.w2 *= 1 - damping;

          p.th1 += p.w1 * dtSub;
          p.th2 += p.w2 * dtSub;
        }

        const originX = cx;
        const originY = cy - 40;

        const x1 = originX + l1 * Math.sin(p.th1);
        const y1 = originY + l1 * Math.cos(p.th1);

        const x2 = x1 + l2 * Math.sin(p.th2);
        const y2 = y1 + l2 * Math.cos(p.th2);

        p.trace.push({ x: x2, y: y2 });
        if (p.trace.length > 500) p.trace.shift();

        // Trace line
        ctx.beginPath();
        for (let i = 0; i < p.trace.length; i++) {
          const pt = p.trace[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = "rgba(6, 182, 212, 0.55)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Rod 1
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Rod 2
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bob 1
        ctx.beginPath();
        ctx.arc(x1, y1, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();

        // Bob 2
        ctx.beginPath();
        ctx.arc(x2, y2, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#f43f5e";
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. QUANTUM TUNNELING
      else if (activeSimId === "quantum_tunneling") {
        const v0 = Number(simParams.barrierHeight ?? 48);
        const bWidth = Number(simParams.barrierWidth ?? 32);
        const eKin = Number(simParams.packetEnergy ?? 40);
        const pWidth = Number(simParams.packetWidth ?? 28);

        const wp = s.wavePackets;
        wp.x += 1.4 * speedMult;
        if (wp.x > 180) wp.x = -160;

        const barrierLeft = cx - bWidth / 2;
        const barrierRight = cx + bWidth / 2;

        // Draw potential barrier
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.fillRect(barrierLeft, cy - v0, bWidth, v0 * 2);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barrierLeft, cy - v0, bWidth, v0 * 2);

        // Potential barrier label
        ctx.fillStyle = "#f87171";
        ctx.font = "10px monospace";
        ctx.fillText(`POTENTIAL BARRIER V₀ = ${v0} eV`, barrierLeft - 10, cy - v0 - 8);

        // Particle Energy Line
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(cx - 180, cy - eKin);
        ctx.lineTo(cx + 180, cy - eKin);
        ctx.strokeStyle = "rgba(34, 211, 238, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#22d3ee";
        ctx.fillText(`E_kin = ${eKin} eV`, cx - 180, cy - eKin - 4);

        // Wave packet curve
        ctx.beginPath();
        for (let x = cx - 180; x <= cx + 180; x += 3) {
          const dx = x - (cx + wp.x);
          const envelope = Math.exp(-Math.pow(dx / pWidth, 2));

          // If inside barrier and E < V0, exponential decay
          let amp = envelope * 32;
          if (x >= barrierLeft && x <= barrierRight) {
            const decay = Math.exp(-((x - barrierLeft) / (bWidth * 0.7)));
            amp *= decay;
          } else if (x > barrierRight) {
            // Tunneling transmission coefficient
            const transmission = Math.exp(-bWidth * 0.04 * Math.max(0, v0 - eKin) * 0.05);
            amp *= transmission;
          }

          const wave = Math.cos((x - cx) * 0.2 - s.t * 6) * amp;
          const py = cy + wave;
          if (x === cx - 180) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 6. KINETIC GAS
      else if (activeSimId === "kinetic_gas") {
        const boxWidth = (width * Number(simParams.boxWidthPct ?? 80)) / 100;
        const boxHeight = height - 80;
        const left = (width - boxWidth) / 2;
        const top = 40;
        const right = left + boxWidth;
        const bottom = top + boxHeight;

        // Container boundary
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, boxWidth, boxHeight);

        const temp = Number(simParams.temperature ?? 300);
        const gravityOn = Boolean(simParams.gravityOn);

        // Render & update particles
        s.gasParticles.forEach((p: any) => {
          if (gravityOn) p.vy += 0.06;

          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;

          // Wall bounces
          if (p.x - p.radius <= left) {
            p.x = left + p.radius;
            p.vx *= -1;
          } else if (p.x + p.radius >= right) {
            p.x = right - p.radius;
            p.vx *= -1;
          }
          if (p.y - p.radius <= top) {
            p.y = top + p.radius;
            p.vy *= -1;
          } else if (p.y + p.radius >= bottom) {
            p.y = bottom - p.radius;
            p.vy *= -1;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = temp > 600 ? "#f43f5e" : temp > 350 ? "#f59e0b" : "#22d3ee";
          ctx.fill();
        });

        // Diagnostics overlay
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(`PV = N k_B T | T = ${temp} K | Particles = ${s.gasParticles.length}`, left + 8, top - 8);
      }

      // 7. LORENTZ FORCE
      else if (activeSimId === "lorentz_force") {
        const b = Number(simParams.bField ?? 2.8);
        const e = Number(simParams.eField ?? 0.0);
        const q = Number(simParams.charge ?? 1);
        const v0 = Number(simParams.initSpeed ?? 3.2);

        // Inject new charge if empty
        if (s.charges.length === 0 || s.t % 2.5 < dt) {
          if (s.charges.length < 5) {
            s.charges.push({
              x: cx - 180,
              y: cy + 40,
              vx: v0,
              vy: 0,
              trail: [],
            });
          }
        }

        // Magnetic field indicator grid (X for into screen, dots for out)
        ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
        ctx.font = "12px monospace";
        for (let gx = cx - 140; gx <= cx + 140; gx += 40) {
          for (let gy = cy - 90; gy <= cy + 90; gy += 40) {
            ctx.fillText(b >= 0 ? "⊗" : "⊙", gx, gy);
          }
        }

        // Electric field direction arrows if E != 0
        if (Math.abs(e) > 0.2) {
          ctx.strokeStyle = "rgba(234, 179, 8, 0.3)";
          ctx.lineWidth = 1;
          for (let gy = cy - 80; gy <= cy + 80; gy += 50) {
            ctx.beginPath();
            ctx.moveTo(cx - 140, gy);
            ctx.lineTo(cx + 140, gy);
            ctx.stroke();
          }
          ctx.fillStyle = "#eab308";
          ctx.fillText(`ELECTRIC FIELD E = ${e} V/m`, cx - 60, cy - 100);
        }

        // Move charges: dvx/dt = q(Ex + vy * B), dvy/dt = q(Ey - vx * B)
        s.charges.forEach((ch: any, idx: number) => {
          const ax = q * ch.vy * b * 0.03;
          const ay = q * (e * 0.05 - ch.vx * b * 0.03);

          ch.vx += ax * speedMult;
          ch.vy += ay * speedMult;
          ch.x += ch.vx * speedMult * 1.5;
          ch.y += ch.vy * speedMult * 1.5;

          ch.trail.push({ x: ch.x, y: ch.y });
          if (ch.trail.length > 150) ch.trail.shift();

          // Draw trail
          ctx.beginPath();
          for (let i = 0; i < ch.trail.length; i++) {
            const pt = ch.trail[i];
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.strokeStyle = q > 0 ? "rgba(34, 211, 238, 0.7)" : "rgba(244, 63, 94, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw charge particle
          ctx.beginPath();
          ctx.arc(ch.x, ch.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = q > 0 ? "#38bdf8" : "#f43f5e";
          ctx.shadowColor = q > 0 ? "#38bdf8" : "#f43f5e";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Clean out of bounds
        s.charges = s.charges.filter((ch: any) => ch.x > 0 && ch.x < width && ch.y > 0 && ch.y < height);
      }

      // 8. BLACK HOLE GRAVITATIONAL LENSING
      else if (activeSimId === "black_hole") {
        const mass = Number(simParams.mass ?? 2.2);
        const count = Number(simParams.beamCount ?? 9);
        const impact = Number(simParams.impactDistance ?? 38);
        const showAccretion = Boolean(simParams.showAccretion);

        const rs = 16 * mass; // Schwarzschild radius
        const rPhoton = rs * 1.5; // Photon sphere radius

        // Accretion disk glow
        if (showAccretion) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.beginPath();
          ctx.ellipse(0, 0, rs * 3.2, rs * 0.9, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 30;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        }

        // Photon Sphere dashed ring
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.arc(cx, cy, rPhoton, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Event Horizon (Black Void)
        ctx.beginPath();
        ctx.arc(cx, cy, rs, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Light Geodesics
        for (let i = 0; i < count; i++) {
          const bParam = impact + (i - Math.floor(count / 2)) * 14;
          const startY = cy + bParam;

          ctx.beginPath();
          let px = 20;
          let py = startY;
          ctx.moveTo(px, py);

          let vx = 3.5;
          let vy = 0;

          for (let step = 0; step < 80; step++) {
            const rx = px - cx;
            const ry = py - cy;
            const r2 = rx * rx + ry * ry;
            const r = Math.sqrt(r2);

            if (r < rs) {
              // Plunged into black hole
              break;
            }

            // General relativistic bending acceleration
            const fGrav = (mass * 90) / (r2 + 10);
            vx -= (rx / r) * fGrav * 0.08;
            vy -= (ry / r) * fGrav * 0.08;

            px += vx;
            py += vy;
            ctx.lineTo(px, py);

            if (px > width || py < 0 || py > height) break;
          }

          ctx.strokeStyle = bParam > 0 ? "rgba(6, 182, 212, 0.65)" : "rgba(245, 158, 11, 0.65)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      if (running) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeSimId, running, speedMult, simParams, showGrid, showVectors, stepTick]);

  // Search filtering logic
  const filteredSimulations = SIMULATIONS_CATALOG.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const matchName = item.name.toLowerCase().includes(query);
    const matchDesc = item.shortDesc.toLowerCase().includes(query);
    const matchCategory = item.categoryLabel.toLowerCase().includes(query);
    const matchQuestions = item.questionsAnswered.some((q) =>
      q.toLowerCase().includes(query)
    );

    return matchName || matchDesc || matchCategory || matchQuestions;
  });

  const handleApplyPreset = (presetParams: Record<string, number | boolean>) => {
    playQuantumClick();
    setSimParams((prev) => ({ ...prev, ...presetParams }));
  };

  const handleParamChange = (key: string, value: number | boolean) => {
    setSimParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionChipClick = (question: string) => {
    playQuantumClick();
    setSearchQuery(question);

    // Auto-select the best matching simulation
    const match = SIMULATIONS_CATALOG.find((s) =>
      s.questionsAnswered.some(
        (q) =>
          q.toLowerCase().includes(question.toLowerCase()) ||
          question.toLowerCase().includes(s.id)
      )
    );
    if (match) {
      setActiveSimId(match.id);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-200">
      {/* 1. SEARCH BAR & MULTI-SIMULATION EXPLORER */}
      <div className="p-4 rounded-2xl border border-cyan-500/30 bg-[#080d1a]/90 backdrop-blur-md shadow-2xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search simulations by question or topic (e.g. 'How do planets orbit?', 'quantum tunneling', 'chaos', 'pendulum')..."
              className="w-full bg-[#050914] border border-cyan-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono text-cyan-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Simulations" },
              { id: "chaos", label: "Chaos" },
              { id: "quantum", label: "Quantum" },
              { id: "astrophysics", label: "Astrophysics" },
              { id: "mechanics", label: "Mechanics" },
              { id: "thermodynamics", label: "Thermodynamics" },
              { id: "electromagnetism", label: "E&M" },
              { id: "relativity", label: "Relativity" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playQuantumClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Question Chips for Instant Exploration */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs font-mono scrollbar-none">
          <span className="text-[10px] uppercase text-cyan-400/80 font-bold flex items-center gap-1 shrink-0">
            <HelpCircle className="w-3 h-3" />
            <span>Try Questions:</span>
          </span>
          {PRESET_POPULAR_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuestionChipClick(q)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-[10px] whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SIMULATION SELECTION GRID / TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {filteredSimulations.map((sim) => {
          const isSelected = activeSimId === sim.id;
          const isHovered = hoveredTopic?.id === sim.id;
          return (
            <button
              key={sim.id}
              onClick={() => {
                playQuantumClick();
                setActiveSimId(sim.id);
              }}
              onMouseEnter={() => setHoveredTopic(sim)}
              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHoveredTopic(null)}
              title={`${sim.name} — ${sim.shortDesc} (Formula: ${sim.formula})`}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50"
                  : isHovered
                  ? "bg-[#0b1426] border-cyan-500/70 text-slate-100 shadow-[0_0_14px_rgba(6,182,212,0.2)]"
                  : "bg-[#070c17] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                        : "bg-slate-800/90 text-slate-400"
                    }`}
                  >
                    {sim.category}
                  </span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ACTIVE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                      Inspect &rarr;
                    </span>
                  )}
                </div>

                {/* Full topic name - no truncation */}
                <h4 className="text-xs font-mono font-bold leading-snug text-slate-100 group-hover:text-cyan-200 transition-colors">
                  {sim.name}
                </h4>

                {/* Full sentence given in the topic description */}
                <p className="text-[11px] text-slate-400 group-hover:text-slate-200 font-sans mt-1.5 leading-relaxed">
                  {sim.shortDesc}
                </p>
              </div>

              {/* Bottom formula preview */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400/80">
                <span className="truncate max-w-[85%]">{sim.formula.split("|")[0]}</span>
                <span className="text-slate-600 group-hover:text-cyan-400">&bull;</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2.5 FLOATING HIGH-VISIBILITY CURSOR HOVER CARD */}
      {hoveredTopic && (
        <div
          className="fixed z-50 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: Math.min(Math.max(mousePos.x, 220), window.innerWidth - 240),
            top: Math.max(mousePos.y - 14, 70),
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="w-[380px] sm:w-[460px] p-4 rounded-xl border-2 border-cyan-400 bg-[#060c1c]/98 shadow-[0_0_35px_rgba(6,182,212,0.5)] backdrop-blur-xl text-slate-100 space-y-2.5">
            <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  {hoveredTopic.categoryLabel}
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                Click to Run Live
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-0.5">
                Topic Name:
              </span>
              <h3 className="text-sm font-mono font-bold text-white leading-snug">
                {hoveredTopic.name}
              </h3>
            </div>

            <div className="bg-slate-950/90 p-3 rounded-lg border border-cyan-500/40 shadow-inner">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block mb-1">
                Full Topic Description:
              </span>
              <p className="text-xs font-sans text-cyan-100 leading-relaxed font-medium">
                &ldquo;{hoveredTopic.shortDesc}&rdquo;
              </p>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex items-baseline gap-1.5 text-slate-300">
                <span className="text-slate-500 shrink-0">Governing Law:</span>
                <code className="text-cyan-300 font-bold break-all">{hoveredTopic.formula}</code>
              </div>
              <div className="flex items-baseline gap-1.5 text-slate-300">
                <span className="text-slate-500 shrink-0">Key Question:</span>
                <span className="text-amber-300/95 font-sans italic">
                  {hoveredTopic.questionsAnswered[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.6 ACTIVE / HOVERED TOPIC INSPECTION BANNER (ALWAYS VISIBLE & PROMINENT) */}
      {(() => {
        const displayTopic = hoveredTopic || activeSim;
        const isHovering = Boolean(hoveredTopic && hoveredTopic.id !== activeSimId);
        return (
          <div
            className={`p-4 rounded-xl border transition-all duration-200 ${
              isHovering
                ? "bg-gradient-to-r from-[#0e1d3a] via-[#09152b] to-[#060b18] border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40"
                : "bg-gradient-to-r from-cyan-950/60 via-[#070e1c] to-[#040813] border-cyan-500/40 shadow-lg"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                    isHovering
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/60 animate-pulse"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    {isHovering ? "CURSOR HOVER PREVIEW: TOPIC INSPECTOR" : "CURRENTLY ACTIVE SIMULATION"}
                  </span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Domain: <strong className="text-cyan-300">{displayTopic.categoryLabel}</strong>
                </span>
              </div>

              {isHovering ? (
                <button
                  onClick={() => {
                    playQuantumClick();
                    setActiveSimId(displayTopic.id);
                  }}
                  className="text-xs font-mono font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-amber-950/50 px-3 py-1 rounded border border-amber-500/50 hover:bg-amber-900/60 transition-all"
                >
                  <span>Click to Load Live Simulation</span> &rarr;
                </button>
              ) : (
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Interactive Physics Engine Connected</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <h3 className="text-sm sm:text-base font-mono font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <span>{displayTopic.name}</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400/90 shrink-0">
                  {displayTopic.presets.length} Physical Presets Available
                </span>
              </div>

              {/* Full sentence given in the topic */}
              <div className="p-3 rounded-lg bg-black/70 border border-cyan-500/30 text-xs sm:text-sm font-sans text-cyan-100 leading-relaxed shadow-inner">
                <span className="text-cyan-400 font-bold font-mono mr-2 uppercase text-[11px] tracking-wider block sm:inline">
                  Full Topic Statement:
                </span>
                <span className="text-slate-100 font-medium">{displayTopic.shortDesc}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <span className="text-slate-500 font-bold shrink-0">Governing Formula:</span>
                  <code className="text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/20 font-semibold">
                    {displayTopic.formula}
                  </code>
                </div>

                <button
                  onClick={() =>
                    onSendToQuantum(
                      `Quantum, please provide a comprehensive scientific breakdown and physical equations for the simulation: ${displayTopic.name}. Topic Statement: "${displayTopic.shortDesc}". Formula: ${displayTopic.formula}. Explain how each parameter governs the observed dynamics.`
                    )
                  }
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-200 underline flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Topic Physics with QUANTUM</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {filteredSimulations.length === 0 && (
        <div className="p-6 rounded-xl border border-slate-800 bg-[#070b14] text-center space-y-2">
          <p className="text-xs font-mono text-slate-400">
            No simulations matched your query: &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => {
              onSendToQuantum(
                `Quantum, can you provide a computational simulation breakdown and physics derivation for: "${searchQuery}"?`
              );
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-all shadow-lg inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask QUANTUM to Generate Simulation Explanation</span>
          </button>
        </div>
      )}

      {/* 3. ACTIVE SIMULATION WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Canvas Viewport & Top HUD (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#04060b] shadow-2xl flex items-center justify-center min-h-[380px]">
            <canvas
              ref={canvasRef}
              width={720}
              height={400}
              onClick={handleCanvasClick}
              title={`Interactive Physics Canvas (${activeSim.name}) — Click anywhere to perturb or inject kinetic energy`}
              className="w-full max-h-[440px] block cursor-crosshair"
            />

            {/* Canvas Interactive Click Hint */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md pointer-events-none hidden sm:flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Click anywhere on canvas to perturb physics</span>
            </div>

            {/* Top-Left HUD Mathematical Formula Overlay */}
            <div
              className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-lg max-w-[85%] truncate"
              title={`Governing Formula: ${activeSim.formula} — ${activeSim.shortDesc}`}
            >
              {activeSim.formula}
            </div>

            {/* Top-Right Simulation State Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase font-bold flex items-center gap-1 backdrop-blur-md ${
                  running
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    running ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                {running ? "LIVE PHYSICS" : "PAUSED"}
              </span>
            </div>

            {/* Bottom-Right "Explain Simulation Physics" Button */}
            <button
              onClick={() =>
                onSendToQuantum(
                  `Quantum, please provide a comprehensive scientific breakdown and physical equations for the simulation: ${activeSim.name}. Formula: ${activeSim.formula}. Explain how each parameter governs the observed dynamics.`
                )
              }
              className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-xs font-mono hover:bg-cyan-900 transition-all flex items-center gap-1.5 shadow-xl cursor-pointer hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explain Physics</span>
            </button>
          </div>

          {/* Playback Controls & Speed Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-[#080e1a]">
            {/* Play / Pause / Step / Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playQuantumClick();
                  setRunning(!running);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  running
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                    : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                }`}
              >
                {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{running ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={() => {
                  playQuantumClick();
                  setRunning(false);
                  setStepTick((v) => v + 1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                title="Single Frame Step Forward"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>Step</span>
              </button>

              <button
                onClick={handleResetSimulation}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                title="Reset to initial state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Speed Multiplier */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Speed:</span>
              {[0.25, 0.5, 1.0, 2.0, 3.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    playQuantumClick();
                    setSpeedMult(spd);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                    speedMult === spd
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                      : "text-slate-400 hover:text-slate-200 bg-slate-900"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Visual View Toggles */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                  showGrid
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
                title="Toggle Background Coordinate Grid"
              >
                Grid: {showGrid ? "ON" : "OFF"}
              </button>

              <button
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                  showVectors
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
                title="Toggle Vectors & Direction Trails"
              >
                Vectors: {showVectors ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Controls & Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Preset Buttons */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080d19] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Physical Regimes</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Presets</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {activeSim.presets.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(pr.params)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/40 text-left text-xs font-mono text-slate-300 hover:text-cyan-200 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>{pr.name}</span>
                  <span className="text-[10px] text-cyan-400 opacity-60">&rarr;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Dynamic Sliders Panel */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#080d19] space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Parameters</span>
              </span>
              <button
                onClick={() => setSimParams({ ...activeSim.defaultParams })}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Reset Default
              </button>
            </div>

            {/* Render Sliders based on active simulation */}
            <div className="space-y-3 text-xs font-mono">
              {/* Lorenz Controls */}
              {activeSimId === "lorentz" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Prandtl Number (σ):</span>
                      <span className="text-cyan-400 font-bold">{simParams.sigma}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={Number(simParams.sigma ?? 10)}
                      onChange={(e) => handleParamChange("sigma", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Rayleigh Number (ρ):</span>
                      <span className="text-cyan-400 font-bold">{simParams.rho}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="1"
                      value={Number(simParams.rho ?? 28)}
                      onChange={(e) => handleParamChange("rho", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Trail Length:</span>
                      <span className="text-cyan-400 font-bold">{simParams.trailLength}</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1200"
                      step="50"
                      value={Number(simParams.trailLength ?? 750)}
                      onChange={(e) => handleParamChange("trailLength", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Double-Slit Controls */}
              {activeSimId === "wave" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Slit Distance (d):</span>
                      <span className="text-cyan-400 font-bold">{simParams.slitSeparation} px</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="65"
                      step="1"
                      value={Number(simParams.slitSeparation ?? 32)}
                      onChange={(e) => handleParamChange("slitSeparation", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Wave Number (k):</span>
                      <span className="text-cyan-400 font-bold">{simParams.wavelength}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.5"
                      step="0.02"
                      value={Number(simParams.wavelength ?? 0.25)}
                      onChange={(e) => handleParamChange("wavelength", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        playQuantumClick();
                        handleParamChange("detectorActive", !simParams.detectorActive);
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        simParams.detectorActive
                          ? "bg-amber-500/20 border border-amber-500/50 text-amber-300"
                          : "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                      }`}
                    >
                      {simParams.detectorActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Observer Watching (Collapsed)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Unobserved (Quantum Wave)</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Orbit Controls */}
              {activeSimId === "orbit" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Central Mass (M):</span>
                      <span className="text-cyan-400 font-bold">{simParams.centralMass} M☉</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={Number(simParams.centralMass ?? 1.0)}
                      onChange={(e) => handleParamChange("centralMass", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Planet Count:</span>
                      <span className="text-cyan-400 font-bold">{simParams.planetCount}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="1"
                      value={Number(simParams.planetCount ?? 4)}
                      onChange={(e) => handleParamChange("planetCount", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Orbital Eccentricity (e):</span>
                      <span className="text-cyan-400 font-bold">{simParams.eccentricity}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.6"
                      step="0.05"
                      value={Number(simParams.eccentricity ?? 0.2)}
                      onChange={(e) => handleParamChange("eccentricity", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Double Pendulum Controls */}
              {activeSimId === "double_pendulum" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Arm 1 Length (L₁):</span>
                      <span className="text-cyan-400 font-bold">{simParams.length1}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="110"
                      step="5"
                      value={Number(simParams.length1 ?? 75)}
                      onChange={(e) => handleParamChange("length1", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Arm 2 Length (L₂):</span>
                      <span className="text-cyan-400 font-bold">{simParams.length2}</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      step="5"
                      value={Number(simParams.length2 ?? 65)}
                      onChange={(e) => handleParamChange("length2", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Gravity (g):</span>
                      <span className="text-cyan-400 font-bold">{simParams.gravity} m/s²</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      step="0.5"
                      value={Number(simParams.gravity ?? 9.8)}
                      onChange={(e) => handleParamChange("gravity", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Quantum Tunneling Controls */}
              {activeSimId === "quantum_tunneling" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Barrier Height (V₀):</span>
                      <span className="text-cyan-400 font-bold">{simParams.barrierHeight} eV</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      step="2"
                      value={Number(simParams.barrierHeight ?? 48)}
                      onChange={(e) => handleParamChange("barrierHeight", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Barrier Width (w):</span>
                      <span className="text-cyan-400 font-bold">{simParams.barrierWidth} nm</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="70"
                      step="2"
                      value={Number(simParams.barrierWidth ?? 32)}
                      onChange={(e) => handleParamChange("barrierWidth", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Particle Kinetic Energy (E):</span>
                      <span className="text-cyan-400 font-bold">{simParams.packetEnergy} eV</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      step="2"
                      value={Number(simParams.packetEnergy ?? 40)}
                      onChange={(e) => handleParamChange("packetEnergy", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Kinetic Gas Controls */}
              {activeSimId === "kinetic_gas" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Temperature (T):</span>
                      <span className="text-cyan-400 font-bold">{simParams.temperature} K</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="900"
                      step="25"
                      value={Number(simParams.temperature ?? 300)}
                      onChange={(e) => handleParamChange("temperature", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Molecular Count (N):</span>
                      <span className="text-cyan-400 font-bold">{simParams.particleCount}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={Number(simParams.particleCount ?? 50)}
                      onChange={(e) => handleParamChange("particleCount", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Lorentz Force Controls */}
              {activeSimId === "lorentz_force" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Magnetic Field (B):</span>
                      <span className="text-cyan-400 font-bold">{simParams.bField} T</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.2"
                      value={Number(simParams.bField ?? 2.8)}
                      onChange={(e) => handleParamChange("bField", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Electric Field (E):</span>
                      <span className="text-cyan-400 font-bold">{simParams.eField} V/m</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.2"
                      value={Number(simParams.eField ?? 0.0)}
                      onChange={(e) => handleParamChange("eField", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Black Hole Controls */}
              {activeSimId === "black_hole" && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Black Hole Mass:</span>
                      <span className="text-cyan-400 font-bold">{simParams.mass} M_BH</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="4.0"
                      step="0.2"
                      value={Number(simParams.mass ?? 2.2)}
                      onChange={(e) => handleParamChange("mass", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Photon Beam Impact:</span>
                      <span className="text-cyan-400 font-bold">{simParams.impactDistance}</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      step="2"
                      value={Number(simParams.impactDistance ?? 38)}
                      onChange={(e) => handleParamChange("impactDistance", Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Questions Answered By This Simulation */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080d19] space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Questions Answered</span>
            </span>
            <div className="space-y-1.5">
              {activeSim.questionsAnswered.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    onSendToQuantum(
                      `Quantum, in the context of the ${activeSim.name} simulation, please provide a detailed scientific explanation for: "${q}"`
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/30 text-[11px] font-mono text-slate-300 hover:text-cyan-200 transition-all cursor-pointer"
                >
                  <p className="leading-snug">&bull; {q}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
