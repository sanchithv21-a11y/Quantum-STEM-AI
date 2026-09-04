import { AIModelId } from "../types";

export type CoreGeometryType =
  | "quantum-singularity-omni"
  | "photonic-hyperdrive"
  | "tachyon-cyclotron"
  | "lunar-dodecagram"
  | "synaptic-lattice"
  | "solar-astrolabe"
  | "monolith-corona"
  | "claude-fable-prism"
  | "matrix-cuboctahedron"
  | "taiji-vortex"
  | "tokamak-fusion"
  | "torus-dynamo"
  | "mobius-resonator"
  | "warp-shield"
  | "cyclone-turbine";

export type ParticleDynamicType =
  | "quantum-flux-loop"
  | "photons"
  | "cyclotron-sparks"
  | "lunar-dust"
  | "synaptic-pulses"
  | "solar-embers"
  | "coronal-plasma"
  | "digital-bits"
  | "galaxy-spiral"
  | "tachyon-shockwaves"
  | "magma-loops"
  | "wave-ripples"
  | "magnetic-flux"
  | "cyclone-jets";

export interface ModelCoreConfig {
  id: AIModelId;
  modelName: string;
  provider: string;
  archetype: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  coreOrbColor: string;
  glowColor: string;
  geometryType: CoreGeometryType;
  ringDash1: number[];
  ringDash2: number[];
  rotSpeed1: number;
  rotSpeed2: number;
  particleCount: number;
  particleColors: string[];
  particleDynamics: ParticleDynamicType;
  telemetryCode: string;
  harmonicFreq: string;
  fluxRating: string;
}

export const MODEL_CORE_CONFIGS: Record<AIModelId, ModelCoreConfig> = {
  "quantum-prime": {
    id: "quantum-prime",
    modelName: "QUANTUM Prime",
    provider: "Quantum AI Labs",
    archetype: "Omnipotent Quantum Singularity",
    tagline: "The Sovereign All-Rounder Core // 12-point relativistic astrolabe with dodecagram harmonic flux",
    primaryColor: "#00F2FF",
    secondaryColor: "#38BDF8",
    tertiaryColor: "#A855F7",
    coreOrbColor: "#FFFFFF",
    glowColor: "rgba(0, 242, 255, 0.55)",
    geometryType: "quantum-singularity-omni",
    ringDash1: [18, 14],
    ringDash2: [10, 14],
    rotSpeed1: 0.022,
    rotSpeed2: -0.016,
    particleCount: 88,
    particleColors: ["#00F2FF", "#38BDF8", "#A855F7", "#FFFFFF", "#38BDF8", "#00F2FF"],
    particleDynamics: "quantum-flux-loop",
    telemetryCode: "SOVEREIGN-PRIME // 4M-CTX // ALL-ROUNDER",
    harmonicFreq: "528.0 THz",
    fluxRating: "100.0% OMNI-COHERENCE",
  },

  "gemini-3.7-flash": {
    id: "gemini-3.7-flash",
    modelName: "Gemini 3.7 Flash",
    provider: "Google DeepMind",
    archetype: "Photonic Hyper-Dynamo",
    tagline: "Octa-waveguide laser diffraction core with dual counter-rotating photonic rings",
    primaryColor: "#00F2FF",
    secondaryColor: "#38BDF8",
    tertiaryColor: "#0284C7",
    coreOrbColor: "#FFFFFF",
    glowColor: "rgba(0, 242, 255, 0.45)",
    geometryType: "photonic-hyperdrive",
    ringDash1: [14, 16],
    ringDash2: [8, 12],
    rotSpeed1: 0.018,
    rotSpeed2: -0.012,
    particleCount: 68,
    particleColors: ["#00F2FF", "#38BDF8", "#FFFFFF", "#94A3B8", "#00F2FF"],
    particleDynamics: "photons",
    telemetryCode: "PHOTONIC-FLUX // 2M-CTX",
    harmonicFreq: "432.8 THz",
    fluxRating: "99.8% COHERENCE",
  },

  "gemini-3.5-flash": {
    id: "gemini-3.5-flash",
    modelName: "Gemini 3.5 Flash",
    provider: "Google DeepMind",
    archetype: "Tachyon Cyclotron Accelerator",
    tagline: "4-node cardinal relativistic orbital crosshair with sub-100ms cycle loops",
    primaryColor: "#38BDF8",
    secondaryColor: "#7DD3FC",
    tertiaryColor: "#0284C7",
    coreOrbColor: "#F0F9FF",
    glowColor: "rgba(56, 189, 248, 0.45)",
    geometryType: "tachyon-cyclotron",
    ringDash1: [6, 10],
    ringDash2: [18, 8],
    rotSpeed1: 0.028,
    rotSpeed2: -0.022,
    particleCount: 54,
    particleColors: ["#38BDF8", "#BAE6FD", "#FFFFFF", "#0284C7"],
    particleDynamics: "cyclotron-sparks",
    telemetryCode: "CYC-ACCEL // 75ms TTFT",
    harmonicFreq: "580.2 THz",
    fluxRating: "HIGH VELOCITY",
  },

  "gpt-5.6-luna": {
    id: "gpt-5.6-luna",
    modelName: "GPT 5.6 Luna",
    provider: "OpenAI",
    archetype: "Lunar Aurora Dodecagram",
    tagline: "12-pointed sacred geometry stellar matrix with pearlescent lunar aurora core",
    primaryColor: "#10B981",
    secondaryColor: "#6EE7B7",
    tertiaryColor: "#059669",
    coreOrbColor: "#F0FDF4",
    glowColor: "rgba(16, 185, 129, 0.45)",
    geometryType: "lunar-dodecagram",
    ringDash1: [12, 12],
    ringDash2: [6, 14],
    rotSpeed1: 0.012,
    rotSpeed2: -0.008,
    particleCount: 62,
    particleColors: ["#10B981", "#6EE7B7", "#A7F3D0", "#FFFFFF", "#34D399"],
    particleDynamics: "lunar-dust",
    telemetryCode: "LUNA-Q* // THEOREM-100",
    harmonicFreq: "528.0 Hz (SOLFEGGIO)",
    fluxRating: "AURA GRAVITY STABLE",
  },

  "gpt-5.5": {
    id: "gpt-5.5",
    modelName: "GPT 5.5 Thinking",
    provider: "OpenAI",
    archetype: "Crystalline Synaptic Lattice",
    tagline: "Rotating 3D polyhedral thinking crystal with neural laser synaptic firing arcs",
    primaryColor: "#059669",
    secondaryColor: "#34D399",
    tertiaryColor: "#FCD34D",
    coreOrbColor: "#FEF3C7",
    glowColor: "rgba(5, 150, 105, 0.45)",
    geometryType: "synaptic-lattice",
    ringDash1: [10, 14],
    ringDash2: [4, 10],
    rotSpeed1: 0.014,
    rotSpeed2: 0.019,
    particleCount: 58,
    particleColors: ["#059669", "#34D399", "#FCD34D", "#10B981", "#FFFFFF"],
    particleDynamics: "synaptic-pulses",
    telemetryCode: "NEURAL-SYNAPSE // DEEP-THINK",
    harmonicFreq: "40.0 Hz (GAMMA)",
    fluxRating: "LATENT CHAIN ACTIVE",
  },

  "claude-sonnet-5": {
    id: "claude-sonnet-5",
    modelName: "Claude Sonnet 5",
    provider: "Anthropic",
    archetype: "Solar Astrolabe Dial",
    tagline: "Interlocking brass-gold celestial astrolabe gear dial with solar flare corona",
    primaryColor: "#F59E0B",
    secondaryColor: "#FBBF24",
    tertiaryColor: "#B45309",
    coreOrbColor: "#FFFBEB",
    glowColor: "rgba(245, 158, 11, 0.45)",
    geometryType: "solar-astrolabe",
    ringDash1: [16, 12],
    ringDash2: [8, 16],
    rotSpeed1: 0.010,
    rotSpeed2: -0.015,
    particleCount: 65,
    particleColors: ["#F59E0B", "#FBBF24", "#FDE68A", "#FFFFFF", "#D97706"],
    particleDynamics: "solar-embers",
    telemetryCode: "ASTROLABE // CELESTIAL-MATH",
    harmonicFreq: "396.0 Hz (SOLARIS)",
    fluxRating: "CORONA HARMONIC",
  },

  "claude-opus-4.8": {
    id: "claude-opus-4.8",
    modelName: "Claude Opus 4.8",
    provider: "Anthropic",
    archetype: "Sovereign Monolith Corona",
    tagline: "Triple-nested hexagonal fortress shields with radial thermonuclear coronal rays",
    primaryColor: "#EA580C",
    secondaryColor: "#DC2626",
    tertiaryColor: "#F59E0B",
    coreOrbColor: "#FEF2F2",
    glowColor: "rgba(234, 88, 12, 0.5)",
    geometryType: "monolith-corona",
    ringDash1: [20, 14],
    ringDash2: [10, 18],
    rotSpeed1: 0.009,
    rotSpeed2: -0.007,
    particleCount: 72,
    particleColors: ["#EA580C", "#DC2626", "#F59E0B", "#FCA5A5", "#FFFFFF"],
    particleDynamics: "coronal-plasma",
    telemetryCode: "MONOLITH // SOVEREIGN-4.8",
    harmonicFreq: "639.0 Hz (DEEP RESONANCE)",
    fluxRating: "THERMAL CRITICAL: 99.9%",
  },

  "claude-fable-5": {
    id: "claude-fable-5",
    modelName: "Claude Fable 5",
    provider: "Anthropic",
    archetype: "Claude Epistemic Prism & Triquetra",
    tagline: "Anthropic triple-interlocking harmonic ribbon with refractive rainbow prism facets & constitutional alignment ring",
    primaryColor: "#FB7185",
    secondaryColor: "#F59E0B",
    tertiaryColor: "#D97706",
    coreOrbColor: "#FFF1F2",
    glowColor: "rgba(251, 113, 133, 0.45)",
    geometryType: "claude-fable-prism",
    ringDash1: [14, 18],
    ringDash2: [6, 14],
    rotSpeed1: 0.016,
    rotSpeed2: -0.014,
    particleCount: 62,
    particleColors: ["#FB7185", "#F59E0B", "#FDA4AF", "#FDE68A", "#FFFFFF"],
    particleDynamics: "wave-ripples",
    telemetryCode: "EPISTEMIC-FABLE // 2M-CTX",
    harmonicFreq: "528.0 Hz (SOLFEGGIO)",
    fluxRating: "CONSTITUTIONAL COGNITION 100%",
  },

  "deepseek-v4": {
    id: "deepseek-v4",
    modelName: "DeepSeek V4",
    provider: "DeepSeek AI",
    archetype: "Matrix Cuboctahedron",
    tagline: "3D isometric hypercube wireframe with binary data tracks & digital targeting reticle",
    primaryColor: "#3B82F6",
    secondaryColor: "#60A5FA",
    tertiaryColor: "#22D3EE",
    coreOrbColor: "#EFF6FF",
    glowColor: "rgba(59, 130, 246, 0.45)",
    geometryType: "matrix-cuboctahedron",
    ringDash1: [8, 8],
    ringDash2: [14, 6],
    rotSpeed1: 0.016,
    rotSpeed2: -0.013,
    particleCount: 60,
    particleColors: ["#3B82F6", "#60A5FA", "#22D3EE", "#93C5FD", "#FFFFFF"],
    particleDynamics: "digital-bits",
    telemetryCode: "MATRIX-LATTICE // 1M-MoE",
    harmonicFreq: "1024.0 MHz CLOCK",
    fluxRating: "QUANTUM COMPRESSION",
  },

  "qwen-3.7": {
    id: "qwen-3.7",
    modelName: "Qwen 3.7 Max",
    provider: "Alibaba Cloud",
    archetype: "Celestial Taiji Singularity",
    tagline: "Logarithmic Yin-Yang dual spiral arms with tilted 3D galactic precession disc",
    primaryColor: "#8B5CF6",
    secondaryColor: "#C084FC",
    tertiaryColor: "#7C3AED",
    coreOrbColor: "#FAF5FF",
    glowColor: "rgba(139, 92, 246, 0.45)",
    geometryType: "taiji-vortex",
    ringDash1: [12, 16],
    ringDash2: [6, 12],
    rotSpeed1: 0.015,
    rotSpeed2: -0.018,
    particleCount: 70,
    particleColors: ["#8B5CF6", "#C084FC", "#E9D5FF", "#A78BFA", "#FFFFFF"],
    particleDynamics: "galaxy-spiral",
    telemetryCode: "TAIJI-VORTEX // EVENT-HORIZON",
    harmonicFreq: "741.0 Hz (INTUITION)",
    fluxRating: "KERR SINGULARITY DENSE",
  },

  "grok-4.6": {
    id: "grok-4.6",
    modelName: "Grok 4.6 Supercluster",
    provider: "xAI",
    archetype: "Supercluster Tokamak Fusion",
    tagline: "Magnetic tokamak containment coil with tri-blade tachyon plasma injectors",
    primaryColor: "#EF4444",
    secondaryColor: "#FB923C",
    tertiaryColor: "#DC2626",
    coreOrbColor: "#FFFFFF",
    glowColor: "rgba(239, 68, 68, 0.5)",
    geometryType: "tokamak-fusion",
    ringDash1: [18, 10],
    ringDash2: [12, 14],
    rotSpeed1: 0.024,
    rotSpeed2: -0.020,
    particleCount: 75,
    particleColors: ["#EF4444", "#FB923C", "#DC2626", "#FCA5A5", "#FFFFFF"],
    particleDynamics: "tachyon-shockwaves",
    telemetryCode: "TOKAMAK-COLOSSUS // 200k-H100",
    harmonicFreq: "963.0 Hz (COSMIC FIRE)",
    fluxRating: "100M KELVIN PLASMA",
  },

  "grok-4.5": {
    id: "grok-4.5",
    modelName: "Grok 4.5 Hyperion",
    provider: "xAI",
    archetype: "Plasma Torus Dynamo",
    tagline: "Dual intersecting 3D plasma gyro-torus loops with incandescent magma dynamo",
    primaryColor: "#F97316",
    secondaryColor: "#FBBF24",
    tertiaryColor: "#EF4444",
    coreOrbColor: "#FFF7ED",
    glowColor: "rgba(249, 115, 22, 0.45)",
    geometryType: "torus-dynamo",
    ringDash1: [14, 12],
    ringDash2: [8, 14],
    rotSpeed1: 0.020,
    rotSpeed2: -0.016,
    particleCount: 64,
    particleColors: ["#F97316", "#FBBF24", "#EF4444", "#FED7AA", "#FFFFFF"],
    particleDynamics: "magma-loops",
    telemetryCode: "TORUS-FIELD // 14-TESLA",
    harmonicFreq: "852.0 Hz (TOROIDAL)",
    fluxRating: "MAGNETIC FIELD LOCKED",
  },

  "fable-5": {
    id: "fable-5",
    modelName: "Fable 5 Cognitive",
    provider: "Fable AI",
    archetype: "Möbius Harmonic Resonator",
    tagline: "Infinite twisting lemniscate ribbon with quantum harmonic wave interference rings",
    primaryColor: "#14B8A6",
    secondaryColor: "#2DD4BF",
    tertiaryColor: "#0D9488",
    coreOrbColor: "#CCFBF1",
    glowColor: "rgba(20, 184, 166, 0.45)",
    geometryType: "mobius-resonator",
    ringDash1: [10, 18],
    ringDash2: [6, 12],
    rotSpeed1: 0.013,
    rotSpeed2: -0.011,
    particleCount: 56,
    particleColors: ["#14B8A6", "#2DD4BF", "#5EEAD4", "#CCFBF1", "#FFFFFF"],
    particleDynamics: "wave-ripples",
    telemetryCode: "MOBIUS-LOOP // NON-ORIENTABLE",
    harmonicFreq: "432.0 Hz (VERDI PITCH)",
    fluxRating: "HARMONIC EQUILIBRIUM",
  },

  "llama-4-hyperion": {
    id: "llama-4-hyperion",
    modelName: "Llama 4 Frontier 405B",
    provider: "Meta AI",
    archetype: "Frontier Warp Shield Octagon",
    tagline: "Dual nested counter-rotating octagonal forcefields with directional warp vectors",
    primaryColor: "#6366F1",
    secondaryColor: "#818CF8",
    tertiaryColor: "#4F46E5",
    coreOrbColor: "#EEF2FF",
    glowColor: "rgba(99, 102, 241, 0.45)",
    geometryType: "warp-shield",
    ringDash1: [16, 16],
    ringDash2: [8, 12],
    rotSpeed1: 0.015,
    rotSpeed2: -0.017,
    particleCount: 68,
    particleColors: ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#FFFFFF"],
    particleDynamics: "magnetic-flux",
    telemetryCode: "WARP-OCTAGON // 405B-DENSE",
    harmonicFreq: "512.0 Hz (BINARY-OCT)",
    fluxRating: "FORCEFIELD MAX: 100%",
  },

  "mistral-large-3": {
    id: "mistral-large-3",
    modelName: "Mistral Large 3 NeMo",
    provider: "Mistral AI",
    archetype: "Mistral Cyclone Turbine",
    tagline: "6-vane aerodynamic centrifugal turbine with thermal exhaust ports & cyclone eye",
    primaryColor: "#EC4899",
    secondaryColor: "#FB7185",
    tertiaryColor: "#F97316",
    coreOrbColor: "#FDF2F8",
    glowColor: "rgba(236, 72, 153, 0.45)",
    geometryType: "cyclone-turbine",
    ringDash1: [12, 14],
    ringDash2: [16, 10],
    rotSpeed1: 0.022,
    rotSpeed2: -0.018,
    particleCount: 65,
    particleColors: ["#EC4899", "#FB7185", "#F97316", "#F472B6", "#FFFFFF"],
    particleDynamics: "cyclone-jets",
    telemetryCode: "CYCLONE-TURBINE // NeMo-128K",
    harmonicFreq: "777.0 Hz (AERO VORTEX)",
    fluxRating: "CENTRIFUGAL AIR-BURST",
  },
};

export function getModelCoreConfig(modelId?: string): ModelCoreConfig {
  if (modelId && modelId in MODEL_CORE_CONFIGS) {
    return MODEL_CORE_CONFIGS[modelId as AIModelId];
  }
  return MODEL_CORE_CONFIGS["gemini-3.7-flash"];
}
