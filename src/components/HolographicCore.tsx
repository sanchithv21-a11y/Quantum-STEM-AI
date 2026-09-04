import React, { useEffect, useRef, useState } from "react";
import { VoiceState, QuantumThemeMode, AIModelId } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import {
  getModelCoreConfig,
  MODEL_CORE_CONFIGS,
  ModelCoreConfig,
} from "../data/modelCoresConfig";
import { AI_MODELS_ROSTER } from "../data/aiModelsData";
import { ChevronLeft, ChevronRight, Cpu } from "lucide-react";

interface HolographicCoreProps {
  voiceState: VoiceState;
  themeMode?: QuantumThemeMode;
  modelId?: AIModelId;
  onSelectModel?: (modelId: AIModelId) => void;
  onCoreClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return "0, 242, 255";
}

interface Particle {
  x: number;
  y: number;
  baseRadius: number;
  angle: number;
  angularSpeed: number;
  radialAmp: number;
  radialFreq: number;
  radialPhase: number;
  size: number;
  color: string;
  baseOpacity: number;
  shimmerSpeed: number;
  shimmerPhase: number;
  life?: number;
  vx?: number;
  vy?: number;
}

export const HolographicCore: React.FC<HolographicCoreProps> = ({
  voiceState,
  themeMode = "normal",
  modelId = "gemini-3.7-flash",
  onSelectModel,
  onCoreClick,
  className = "",
  size = "lg",
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;
  const coreConfig = getModelCoreConfig(modelId);
  const particlesRef = useRef<Particle[]>([]);
  const [showModelPicker, setShowModelPicker] = useState(false);

  // Initialize unique particle constellation whenever model or themeMode changes
  useEffect(() => {
    const count = coreConfig.particleCount || 60;
    const particles: Particle[] = [];
    const colors =
      themeMode !== "normal" && theme.particleColors && theme.particleColors.length > 0
        ? theme.particleColors
        : coreConfig.particleColors;

    for (let i = 0; i < count; i++) {
      const baseRadius = 24 + Math.pow(Math.random(), 0.75) * 110;
      const angle = Math.random() * Math.PI * 2;
      const speedMagnitude = Math.random() * 0.006 + 0.002;
      const angularSpeed =
        speedMagnitude * (Math.random() > 0.45 ? 1 : -1) * (coreConfig.particleDynamics === "photons" ? 1.6 : 1);
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x: 0,
        y: 0,
        baseRadius,
        angle,
        angularSpeed,
        radialAmp: Math.random() * 5 + 1.5,
        radialFreq: Math.random() * 0.02 + 0.008,
        radialPhase: Math.random() * Math.PI * 2,
        size: Math.random() * 2.2 + 1.2,
        color,
        baseOpacity: Math.random() * 0.4 + 0.55,
        shimmerSpeed: Math.random() * 0.03 + 0.01,
        shimmerPhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
    particlesRef.current = particles;
  }, [modelId, coreConfig, themeMode, theme]);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pulseTime = 0;

    const baseDim = size === "lg" ? 380 : size === "md" ? 280 : 160;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = baseDim * dpr;
    canvas.height = baseDim * dpr;
    canvas.style.width = `${baseDim}px`;
    canvas.style.height = `${baseDim}px`;

    const render = () => {
      const width = baseDim;
      const height = baseDim;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Audio & voice status metrics
      const audioMultiplier = 1 + voiceState.audioLevel * 2.4;
      const isListening = voiceState.mode === "LISTENING";
      const isSpeaking = voiceState.mode === "SPEAKING";
      const isProcessing = voiceState.mode === "PROCESSING";

      const speedMultiplier = isProcessing ? 2.2 : isSpeaking ? 1.8 : isListening ? 1.4 : 1.0;
      angle += 0.012 * speedMultiplier;
      pulseTime += 0.035 * speedMultiplier;

      // Active mode / theme color mapping (Green for Build mode, Red for Fast mode, Purple for Ultra Instinct, etc.)
      const isModeColored = themeMode !== "normal";

      const primaryHex = isSpeaking
        ? "#FF007A"
        : isProcessing
        ? "#A855F7"
        : isModeColored
        ? theme.primary
        : coreConfig.primaryColor;

      const primaryRgb = hexToRgb(primaryHex);

      const secondaryHex = isSpeaking
        ? "#FF70A6"
        : isProcessing
        ? "#C084FC"
        : isModeColored
        ? theme.primaryDark
        : coreConfig.secondaryColor;

      const secondaryRgb = hexToRgb(secondaryHex);

      const scaleRatio = size === "lg" ? 0.96 : size === "md" ? 0.72 : 0.42;

      ctx.translate(centerX, centerY);

      // =======================================================================
      // DISTINCT PROCEDURAL CORE GEOMETRY PER MODEL ARCHETYPE
      // =======================================================================
      switch (coreConfig.geometryType) {
        // ---------------------------------------------------------------------
        // 0. QUANTUM PRIME: OMNIPOTENT QUANTUM SINGULARITY (12-Point Sovereign Astrolabe)
        // ---------------------------------------------------------------------
        case "quantum-singularity-omni": {
          const outerR = 146 * scaleRatio;
          const midR = 108 * scaleRatio;
          const innerR = 72 * scaleRatio;

          // 1. Dual Counter-Rotating Relativistic Outer Astrolabe Rings
          ctx.save();
          ctx.rotate(angle * 0.16);
          ctx.beginPath();
          ctx.arc(0, 0, outerR, 0, Math.PI * 2);
          ctx.setLineDash([18 * scaleRatio, 14 * scaleRatio, 4 * scaleRatio, 14 * scaleRatio]);
          ctx.lineWidth = 2.2 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.85)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 12 * audioMultiplier;
          ctx.stroke();

          // 12 Sovereign Astrolabe Cardinal Vernier Caliper Nodes
          for (let k = 0; k < 12; k++) {
            const rad = (k * Math.PI) / 6;
            const nx = Math.cos(rad) * outerR;
            const ny = Math.sin(rad) * outerR;
            ctx.beginPath();
            ctx.arc(nx, ny, k % 3 === 0 ? 3.4 * scaleRatio : 2.0 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = k % 3 === 0 ? "#FFFFFF" : primaryHex;
            ctx.fill();

            // Caliper tick marks extending outward
            const tx1 = Math.cos(rad) * (outerR * 1.04);
            const ty1 = Math.sin(rad) * (outerR * 1.04);
            const tx2 = Math.cos(rad) * (outerR * (k % 3 === 0 ? 1.15 : 1.09));
            const ty2 = Math.sin(rad) * (outerR * (k % 3 === 0 ? 1.15 : 1.09));
            ctx.beginPath();
            ctx.moveTo(tx1, ty1);
            ctx.lineTo(tx2, ty2);
            ctx.lineWidth = k % 3 === 0 ? 1.8 * scaleRatio : 1.0 * scaleRatio;
            ctx.strokeStyle = `rgba(${primaryRgb}, ${k % 3 === 0 ? 0.9 : 0.5})`;
            ctx.stroke();
          }
          ctx.restore();

          // 2. Middle Counter-Rotating Dodecagram Harmonic Lattice
          ctx.save();
          ctx.rotate(-angle * 0.22);
          ctx.beginPath();
          ctx.arc(0, 0, midR, 0, Math.PI * 2);
          ctx.setLineDash([10 * scaleRatio, 10 * scaleRatio]);
          ctx.lineWidth = 1.4 * scaleRatio;
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.7)`;
          ctx.stroke();

          // 12 Intersecting Waveguide Beams to Center Singularity
          for (let w = 0; w < 12; w++) {
            const wAngle = (w * Math.PI) / 6;
            const x1 = Math.cos(wAngle) * (innerR * 0.45);
            const y1 = Math.sin(wAngle) * (innerR * 0.45);
            const x2 = Math.cos(wAngle) * (midR * 0.98);
            const y2 = Math.sin(wAngle) * (midR * 0.98);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = w % 2 === 0 ? 1.5 * scaleRatio : 0.8 * scaleRatio;
            ctx.strokeStyle = `rgba(${w % 2 === 0 ? primaryRgb : secondaryRgb}, ${w % 2 === 0 ? 0.7 : 0.35})`;
            ctx.stroke();

            // Quantum Photon Beads sliding on waveguides
            const beadPhase = (pulseTime * 0.6 + w * 0.3) % 1;
            const bx = x1 + (x2 - x1) * beadPhase;
            const by = y1 + (y2 - y1) * beadPhase;
            ctx.beginPath();
            ctx.arc(bx, by, 2.0 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 6;
            ctx.fill();
          }
          ctx.restore();

          // 3. Inner Hyper-Dimensional Resonance Core Ring
          ctx.save();
          ctx.rotate(angle * 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, innerR, 0, Math.PI * 2);
          ctx.setLineDash([6 * scaleRatio, 6 * scaleRatio]);
          ctx.lineWidth = 1.8 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.9)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 10 * audioMultiplier;
          ctx.stroke();

          // 6 Orbital Quantum Nodes on Inner Ring
          for (let n = 0; n < 6; n++) {
            const nAngle = (n * Math.PI) / 3;
            const nx = Math.cos(nAngle) * innerR;
            const ny = Math.sin(nAngle) * innerR;
            ctx.beginPath();
            ctx.arc(nx, ny, 3.0 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 8;
            ctx.fill();
          }
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 1. GEMINI 3.7 FLASH: PHOTONIC HYPER-DYNAMO (8-Spoke Laser Waveguide)
        // ---------------------------------------------------------------------
        case "photonic-hyperdrive": {
          const outerR = 138 * scaleRatio;
          const innerR = 104 * scaleRatio;

          // 8 Optical Laser Waveguide Radial Spokes
          ctx.save();
          ctx.rotate(angle * 0.15);
          for (let s = 0; s < 8; s++) {
            const spokeAngle = (s * Math.PI) / 4;
            const x1 = Math.cos(spokeAngle) * (innerR * 0.55);
            const y1 = Math.sin(spokeAngle) * (innerR * 0.55);
            const x2 = Math.cos(spokeAngle) * (outerR * 1.08);
            const y2 = Math.sin(spokeAngle) * (outerR * 1.08);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = s % 2 === 0 ? 1.8 * scaleRatio : 1.0 * scaleRatio;
            ctx.strokeStyle = `rgba(${primaryRgb}, ${s % 2 === 0 ? 0.75 : 0.35})`;
            ctx.stroke();

            // Spoke Caliper Ticks
            const cx = Math.cos(spokeAngle) * (outerR * 1.12);
            const cy = Math.sin(spokeAngle) * (outerR * 1.12);
            ctx.beginPath();
            ctx.arc(cx, cy, 2.2 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = primaryHex;
            ctx.fill();
          }
          ctx.restore();

          // Outer Concentric Dashed Photonic Ring
          ctx.save();
          ctx.rotate(angle * 0.1);
          ctx.beginPath();
          ctx.arc(0, 0, outerR, 0, Math.PI * 2);
          ctx.setLineDash([14 * scaleRatio, 16 * scaleRatio]);
          ctx.lineWidth = 1.6 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.8)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 8 * audioMultiplier;
          ctx.stroke();
          ctx.restore();

          // Counter-rotating Inner Ring
          ctx.save();
          ctx.rotate(-angle * 0.12);
          ctx.beginPath();
          ctx.arc(0, 0, innerR, 0, Math.PI * 2);
          ctx.setLineDash([8 * scaleRatio, 12 * scaleRatio]);
          ctx.lineWidth = 1.2 * scaleRatio;
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.6)`;
          ctx.stroke();
          ctx.restore();

          // 4 Orbiting High-Energy Photon Packets
          ctx.save();
          ctx.rotate(angle * 0.35);
          for (let p = 0; p < 4; p++) {
            const pAngle = (p * Math.PI) / 2;
            const px = Math.cos(pAngle) * outerR;
            const py = Math.sin(pAngle) * outerR;
            ctx.beginPath();
            ctx.arc(px, py, 3.5 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 12;
            ctx.fill();
          }
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 2. GEMINI 3.5 FLASH: TACHYON CYCLOTRON ACCELERATOR (4 Cardinal Nodes)
        // ---------------------------------------------------------------------
        case "tachyon-cyclotron": {
          const trackR = 124 * scaleRatio;

          // Cardinal Crosshair Lines
          ctx.save();
          ctx.rotate(angle * 0.05);
          ctx.beginPath();
          ctx.moveTo(-trackR * 1.2, 0);
          ctx.lineTo(trackR * 1.2, 0);
          ctx.moveTo(0, -trackR * 1.2);
          ctx.lineTo(0, trackR * 1.2);
          ctx.setLineDash([4 * scaleRatio, 8 * scaleRatio]);
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.3)`;
          ctx.lineWidth = 1 * scaleRatio;
          ctx.stroke();
          ctx.restore();

          // Fast Cyclotron Particle Track
          ctx.save();
          ctx.rotate(angle * 0.4);
          ctx.beginPath();
          ctx.arc(0, 0, trackR, 0, Math.PI * 2);
          ctx.setLineDash([24 * scaleRatio, 10 * scaleRatio, 6 * scaleRatio, 10 * scaleRatio]);
          ctx.lineWidth = 2 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.85)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 10 * audioMultiplier;
          ctx.stroke();
          ctx.restore();

          // 4 Cardinal Orbital Focus Spheres
          ctx.save();
          ctx.rotate(angle * 0.08);
          for (let c = 0; c < 4; c++) {
            const cAngle = (c * Math.PI) / 2;
            const cx = Math.cos(cAngle) * trackR;
            const cy = Math.sin(cAngle) * trackR;

            ctx.beginPath();
            ctx.arc(cx, cy, 6 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${primaryRgb}, 0.25)`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, 3 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 8;
            ctx.fill();

            // Reticle bracket around cardinal node
            ctx.beginPath();
            ctx.arc(cx, cy, 10 * scaleRatio, cAngle - 0.4, cAngle + 0.4);
            ctx.strokeStyle = `rgba(${secondaryRgb}, 0.7)`;
            ctx.lineWidth = 1.2 * scaleRatio;
            ctx.stroke();
          }
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 3. GPT 5.6 LUNA: LUNAR AURORA DODECAGRAM (12-Pointed Sacred Geometry)
        // ---------------------------------------------------------------------
        case "lunar-dodecagram": {
          const starR = 130 * scaleRatio;

          // 12-Pointed Dodecagram Sacred Geometry Wireframe
          ctx.save();
          ctx.rotate(angle * 0.06);
          ctx.beginPath();
          for (let i = 0; i < 12; i++) {
            const a1 = (i * Math.PI) / 6;
            const a2 = ((i + 5) * Math.PI) / 6;
            const x1 = Math.cos(a1) * starR;
            const y1 = Math.sin(a1) * starR;
            const x2 = Math.cos(a2) * starR;
            const y2 = Math.sin(a2) * starR;

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.35)`;
          ctx.lineWidth = 1 * scaleRatio;
          ctx.stroke();

          // 12 Outer Celestial Degree Ticks
          for (let t = 0; t < 12; t++) {
            const tAngle = (t * Math.PI) / 6;
            const tx1 = Math.cos(tAngle) * (starR * 1.05);
            const ty1 = Math.sin(tAngle) * (starR * 1.05);
            const tx2 = Math.cos(tAngle) * (starR * 1.15);
            const ty2 = Math.sin(tAngle) * (starR * 1.15);

            ctx.beginPath();
            ctx.moveTo(tx1, ty1);
            ctx.lineTo(tx2, ty2);
            ctx.strokeStyle = `rgba(${secondaryRgb}, 0.65)`;
            ctx.lineWidth = 1.5 * scaleRatio;
            ctx.stroke();
          }
          ctx.restore();

          // Crescent Lunar Orbit Arc
          ctx.save();
          ctx.rotate(-angle * 0.09);
          ctx.beginPath();
          ctx.arc(0, 0, starR * 0.75, 0.4, Math.PI * 1.6);
          ctx.lineWidth = 2 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.75)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 10 * audioMultiplier;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 4. GPT 5.5: CRYSTALLINE SYNAPTIC LATTICE (Rotating Polyhedron & Neurons)
        // ---------------------------------------------------------------------
        case "synaptic-lattice": {
          const polyR = 115 * scaleRatio;

          // 3D Isometric Polyhedral Vertices
          const vertices: { x: number; y: number }[] = [];
          const numNodes = 8;
          ctx.save();
          ctx.rotate(angle * 0.08);

          for (let v = 0; v < numNodes; v++) {
            const vAngle = (v * Math.PI * 2) / numNodes;
            const wobble = Math.sin(pulseTime * 1.5 + v) * 8 * scaleRatio;
            const vx = Math.cos(vAngle) * (polyR + wobble);
            const vy = Math.sin(vAngle) * (polyR + wobble) * 0.75; // Isometric tilt
            vertices.push({ x: vx, y: vy });
          }

          // Neural Synaptic Firing Connections
          for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
              if ((i + j) % 2 === 0 || isProcessing) {
                ctx.beginPath();
                ctx.moveTo(vertices[i].x, vertices[i].y);
                ctx.lineTo(vertices[j].x, vertices[j].y);
                ctx.strokeStyle = `rgba(${primaryRgb}, ${0.18 + Math.sin(pulseTime * 2 + i) * 0.1})`;
                ctx.lineWidth = 0.85 * scaleRatio;
                ctx.stroke();
              }
            }
          }

          // Laser lines converging from vertices to central core
          for (let i = 0; i < vertices.length; i++) {
            const p = vertices[i];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(0, 0);
            ctx.strokeStyle = `rgba(${secondaryRgb}, 0.22)`;
            ctx.lineWidth = 0.75 * scaleRatio;
            ctx.stroke();

            // Synaptic Node Pearl
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = coreConfig.tertiaryColor;
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 6;
            ctx.fill();
          }
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 5. CLAUDE SONNET 5: SOLAR ASTROLABE DIAL (Interlocking Gear Dial)
        // ---------------------------------------------------------------------
        case "solar-astrolabe": {
          const dialR = 132 * scaleRatio;

          // 24 Gear-Tooth Perimeter Notches
          ctx.save();
          ctx.rotate(angle * 0.05);
          for (let g = 0; g < 24; g++) {
            const gAngle = (g * Math.PI * 2) / 24;
            const gx1 = Math.cos(gAngle) * (dialR * 0.95);
            const gy1 = Math.sin(gAngle) * (dialR * 0.95);
            const gx2 = Math.cos(gAngle) * (dialR * 1.08);
            const gy2 = Math.sin(gAngle) * (dialR * 1.08);

            ctx.beginPath();
            ctx.moveTo(gx1, gy1);
            ctx.lineTo(gx2, gy2);
            ctx.strokeStyle = `rgba(${primaryRgb}, 0.6)`;
            ctx.lineWidth = 2 * scaleRatio;
            ctx.stroke();
          }
          ctx.restore();

          // 3 Interlocking Celestial Astrolabe Rings
          const astrolabeRadii = [dialR, dialR * 0.78, dialR * 0.52];
          const astrolabeSpeeds = [0.08, -0.12, 0.18];

          astrolabeRadii.forEach((r, idx) => {
            ctx.save();
            ctx.rotate(angle * astrolabeSpeeds[idx]);
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.setLineDash(idx === 0 ? [16 * scaleRatio, 12 * scaleRatio] : [6 * scaleRatio, 10 * scaleRatio]);
            ctx.strokeStyle = `rgba(${idx % 2 === 0 ? primaryRgb : secondaryRgb}, 0.75)`;
            ctx.lineWidth = 1.4 * scaleRatio;
            ctx.stroke();
            ctx.restore();
          });

          // Quadrant Crosshair Arcs
          ctx.save();
          ctx.rotate(-angle * 0.04);
          ctx.beginPath();
          ctx.arc(0, 0, dialR * 0.35, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.4)`;
          ctx.lineWidth = 1 * scaleRatio;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 6. CLAUDE OPUS 4.8: SOVEREIGN MONOLITH CORONA (Hexagonal Fortress)
        // ---------------------------------------------------------------------
        case "monolith-corona": {
          const hexR = 126 * scaleRatio;

          // Triple Nested Sovereign Hexagonal Shields
          [hexR, hexR * 0.75, hexR * 0.5].forEach((r, hIdx) => {
            ctx.save();
            ctx.rotate(angle * (hIdx % 2 === 0 ? 0.06 : -0.05));
            ctx.beginPath();
            for (let v = 0; v < 6; v++) {
              const hAngle = (v * Math.PI) / 3;
              const hx = Math.cos(hAngle) * r;
              const hy = Math.sin(hAngle) * r;
              if (v === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.lineWidth = 1.8 * scaleRatio;
            ctx.strokeStyle = `rgba(${hIdx === 0 ? primaryRgb : secondaryRgb}, 0.8)`;
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = hIdx === 0 ? 10 * audioMultiplier : 4;
            ctx.stroke();

            // Coronal Spikes shooting from outer hexagon vertices
            if (hIdx === 0) {
              for (let v = 0; v < 6; v++) {
                const hAngle = (v * Math.PI) / 3;
                const sx1 = Math.cos(hAngle) * r;
                const sy1 = Math.sin(hAngle) * r;
                const sx2 = Math.cos(hAngle) * (r * 1.25);
                const sy2 = Math.sin(hAngle) * (r * 1.25);

                ctx.beginPath();
                ctx.moveTo(sx1, sy1);
                ctx.lineTo(sx2, sy2);
                ctx.strokeStyle = `rgba(${secondaryRgb}, 0.9)`;
                ctx.lineWidth = 2.5 * scaleRatio;
                ctx.stroke();
              }
            }
            ctx.restore();
          });
          break;
        }

        // ---------------------------------------------------------------------
        // 6b. CLAUDE FABLE 5: EPISTEMIC PRISM & TRIQUETRA
        // ---------------------------------------------------------------------
        case "claude-fable-prism": {
          const triR = 124 * scaleRatio;

          // 1. Triple Interlocking Trefoil / Triquetra Loops
          ctx.save();
          ctx.rotate(angle * 0.04);

          for (let petal = 0; petal < 3; petal++) {
            const baseRot = (petal * 2 * Math.PI) / 3;
            ctx.save();
            ctx.rotate(baseRot);

            // Radiant Epistemic Petal / Loop
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
              triR * 0.6,
              -triR * 0.4,
              triR * 0.9,
              triR * 0.4,
              triR,
              0
            );
            ctx.bezierCurveTo(
              triR * 0.9,
              -triR * 0.4,
              triR * 0.6,
              triR * 0.4,
              0,
              0
            );
            ctx.closePath();

            const petalGrad = ctx.createLinearGradient(0, 0, triR, 0);
            petalGrad.addColorStop(0, `rgba(${secondaryRgb}, 0.2)`);
            petalGrad.addColorStop(0.7, `rgba(${primaryRgb}, 0.65)`);
            petalGrad.addColorStop(1, `rgba(255, 255, 255, 0.9)`);

            ctx.fillStyle = petalGrad;
            ctx.fill();
            ctx.lineWidth = 1.8 * scaleRatio;
            ctx.strokeStyle = `rgba(${primaryRgb}, 0.9)`;
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 12 * audioMultiplier;
            ctx.stroke();

            // Inner harmonic node orb on each loop apex
            ctx.beginPath();
            ctx.arc(triR * 0.85, 0, 4 * scaleRatio, 0, Math.PI * 2);
            ctx.fillStyle = "#FFF1F2";
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 10;
            ctx.fill();

            ctx.restore();
          }

          // 2. Refractive Prism Triangle linking the three apexes
          ctx.beginPath();
          for (let p = 0; p < 3; p++) {
            const pAngle = (p * 2 * Math.PI) / 3;
            const px = Math.cos(pAngle) * (triR * 0.72);
            const py = Math.sin(pAngle) * (triR * 0.72);
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.lineWidth = 1.4 * scaleRatio;
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.85)`;
          ctx.shadowColor = secondaryHex;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // 3. Counter-rotating inner prism star
          ctx.rotate(-angle * 0.08);
          ctx.beginPath();
          for (let p = 0; p < 3; p++) {
            const pAngle = (p * 2 * Math.PI) / 3 + Math.PI / 3;
            const px = Math.cos(pAngle) * (triR * 0.45);
            const py = Math.sin(pAngle) * (triR * 0.45);
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.lineWidth = 1.2 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.7)`;
          ctx.stroke();

          // 4. Constitutional Alignment Ring with 6 Diamond Reticles
          ctx.beginPath();
          ctx.arc(0, 0, triR * 1.15, 0, Math.PI * 2);
          ctx.setLineDash([4, 10]);
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.6)`;
          ctx.lineWidth = 1.2 * scaleRatio;
          ctx.stroke();
          ctx.setLineDash([]);

          for (let d = 0; d < 6; d++) {
            const dAngle = (d * Math.PI) / 3;
            const dx = Math.cos(dAngle) * (triR * 1.15);
            const dy = Math.sin(dAngle) * (triR * 1.15);
            ctx.save();
            ctx.translate(dx, dy);
            ctx.rotate(Math.PI / 4);
            ctx.strokeStyle = `rgba(${primaryRgb}, 0.9)`;
            ctx.lineWidth = 1.5 * scaleRatio;
            ctx.strokeRect(-3 * scaleRatio, -3 * scaleRatio, 6 * scaleRatio, 6 * scaleRatio);
            ctx.restore();
          }

          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 7. DEEPSEEK V4: MATRIX CUBOCTAHEDRON (Hypercube Data Lattice)
        // ---------------------------------------------------------------------
        case "matrix-cuboctahedron": {
          const cubeR = 118 * scaleRatio;

          // 3D Isometric Hypercube Wireframe
          ctx.save();
          ctx.rotate(angle * 0.08);

          // Outer Square
          const s = cubeR * 0.85;
          ctx.beginPath();
          ctx.rect(-s / 2, -s / 2, s, s);
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.8)`;
          ctx.lineWidth = 1.6 * scaleRatio;
          ctx.stroke();

          // Inner Rotated Diamond Square
          ctx.save();
          ctx.rotate(Math.PI / 4 + angle * 0.1);
          const d = s * 0.72;
          ctx.beginPath();
          ctx.rect(-d / 2, -d / 2, d, d);
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.7)`;
          ctx.lineWidth = 1.2 * scaleRatio;
          ctx.stroke();
          ctx.restore();

          // Targeting Crosshairs & Scanlines
          ctx.beginPath();
          ctx.moveTo(-cubeR * 1.1, 0);
          ctx.lineTo(cubeR * 1.1, 0);
          ctx.moveTo(0, -cubeR * 1.1);
          ctx.lineTo(0, cubeR * 1.1);
          ctx.setLineDash([2 * scaleRatio, 6 * scaleRatio]);
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.4)`;
          ctx.lineWidth = 1 * scaleRatio;
          ctx.stroke();

          // Binary Track Circle
          ctx.beginPath();
          ctx.arc(0, 0, cubeR * 1.1, 0, Math.PI * 2);
          ctx.setLineDash([4 * scaleRatio, 4 * scaleRatio]);
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.55)`;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 8. QWEN 3.7: CELESTIAL TAIJI SINGULARITY (Logarithmic Yin-Yang Vortex)
        // ---------------------------------------------------------------------
        case "taiji-vortex": {
          const taijiR = 125 * scaleRatio;

          // Yin-Yang Dual Spiral Galactic Arms
          ctx.save();
          ctx.rotate(angle * 0.2);

          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI;
            ctx.beginPath();
            for (let t = 0; t <= Math.PI * 1.8; t += 0.1) {
              const r = (taijiR * (t / (Math.PI * 1.8))) * 0.95;
              const curAngle = t + armOffset;
              const x = Math.cos(curAngle) * r;
              const y = Math.sin(curAngle) * r * 0.85; // 3D Galactic tilt
              if (t === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `rgba(${arm === 0 ? primaryRgb : secondaryRgb}, 0.85)`;
            ctx.lineWidth = (2.4 - arm * 0.4) * scaleRatio;
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 8 * audioMultiplier;
            ctx.stroke();
          }

          // Precession Orbits
          ctx.beginPath();
          ctx.ellipse(0, 0, taijiR * 1.08, taijiR * 0.65, Math.PI / 6, 0, Math.PI * 2);
          ctx.setLineDash([8 * scaleRatio, 12 * scaleRatio]);
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.5)`;
          ctx.lineWidth = 1.2 * scaleRatio;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 9. GROK 4.6: SUPERCLUSTER TOKAMAK FUSION (Tri-Blade Tachyon Injectors)
        // ---------------------------------------------------------------------
        case "tokamak-fusion": {
          const tokamakR = 130 * scaleRatio;

          // Heavy Tokamak Magnetic Containment Ring
          ctx.save();
          ctx.rotate(angle * 0.12);
          ctx.beginPath();
          ctx.arc(0, 0, tokamakR, 0, Math.PI * 2);
          ctx.lineWidth = 3 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.85)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 12 * audioMultiplier;
          ctx.stroke();

          // Tri-Blade Tachyon Plasma Injectors (120 degrees apart)
          for (let b = 0; b < 3; b++) {
            const bAngle = (b * Math.PI * 2) / 3;
            ctx.save();
            ctx.rotate(bAngle);
            ctx.beginPath();
            ctx.moveTo(tokamakR * 0.3, -6 * scaleRatio);
            ctx.lineTo(tokamakR * 1.15, -14 * scaleRatio);
            ctx.lineTo(tokamakR * 1.25, 0);
            ctx.lineTo(tokamakR * 1.15, 14 * scaleRatio);
            ctx.lineTo(tokamakR * 0.3, 6 * scaleRatio);
            ctx.closePath();
            ctx.fillStyle = `rgba(${primaryRgb}, 0.25)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${secondaryRgb}, 0.9)`;
            ctx.lineWidth = 1.8 * scaleRatio;
            ctx.stroke();
            ctx.restore();
          }
          ctx.restore();

          // Rapid Inner Flux Ring
          ctx.save();
          ctx.rotate(-angle * 0.25);
          ctx.beginPath();
          ctx.arc(0, 0, tokamakR * 0.55, 0, Math.PI * 2);
          ctx.setLineDash([12 * scaleRatio, 8 * scaleRatio]);
          ctx.lineWidth = 2 * scaleRatio;
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.8)`;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 10. GROK 4.5: PLASMA TORUS DYNAMO (Orthogonal Gyro-Torus Loops)
        // ---------------------------------------------------------------------
        case "torus-dynamo": {
          const torusR = 122 * scaleRatio;

          // Loop A: Horizontal Plasma Ellipse
          ctx.save();
          ctx.rotate(angle * 0.15);
          ctx.beginPath();
          ctx.ellipse(0, 0, torusR, torusR * 0.45, 0, 0, Math.PI * 2);
          ctx.lineWidth = 2.2 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.85)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 10 * audioMultiplier;
          ctx.stroke();
          ctx.restore();

          // Loop B: Vertical/Orthogonal Plasma Ellipse
          ctx.save();
          ctx.rotate(-angle * 0.18);
          ctx.beginPath();
          ctx.ellipse(0, 0, torusR * 0.45, torusR, 0, 0, Math.PI * 2);
          ctx.lineWidth = 2.2 * scaleRatio;
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.85)`;
          ctx.shadowColor = secondaryHex;
          ctx.shadowBlur = 10 * audioMultiplier;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 11. FABLE 5: MÖBIUS HARMONIC RESONATOR (Infinite Lemniscate Ribbon)
        // ---------------------------------------------------------------------
        case "mobius-resonator": {
          const mobiusA = 115 * scaleRatio;

          // Twisting Lemniscate (Figure-8 Infinity Ribbon)
          ctx.save();
          ctx.rotate(angle * 0.1);
          ctx.beginPath();
          for (let t = 0; t <= Math.PI * 2; t += 0.05) {
            const scale = mobiusA / (1 + Math.sin(t) * Math.sin(t));
            const x = scale * Math.cos(t);
            const y = scale * Math.sin(t) * Math.cos(t);
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.lineWidth = 2.4 * scaleRatio;
          ctx.strokeStyle = `rgba(${primaryRgb}, 0.9)`;
          ctx.shadowColor = primaryHex;
          ctx.shadowBlur = 10 * audioMultiplier;
          ctx.stroke();

          // Harmonic Wave Rings
          ctx.beginPath();
          ctx.arc(0, 0, mobiusA * 0.9, 0, Math.PI * 2);
          ctx.setLineDash([8 * scaleRatio, 16 * scaleRatio]);
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.45)`;
          ctx.lineWidth = 1 * scaleRatio;
          ctx.stroke();
          ctx.restore();
          break;
        }

        // ---------------------------------------------------------------------
        // 12. LLAMA 4: FRONTIER WARP SHIELD OCTAGON (Dual Octagonal Forcefield)
        // ---------------------------------------------------------------------
        case "warp-shield": {
          const octR = 125 * scaleRatio;

          // Outer and Inner Counter-rotating Octagons
          [octR, octR * 0.68].forEach((r, oIdx) => {
            ctx.save();
            ctx.rotate(angle * (oIdx === 0 ? 0.08 : -0.1));
            ctx.beginPath();
            for (let v = 0; v < 8; v++) {
              const oAngle = (v * Math.PI) / 4;
              const ox = Math.cos(oAngle) * r;
              const oy = Math.sin(oAngle) * r;
              if (v === 0) ctx.moveTo(ox, oy);
              else ctx.lineTo(ox, oy);
            }
            ctx.closePath();
            ctx.lineWidth = 1.8 * scaleRatio;
            ctx.strokeStyle = `rgba(${oIdx === 0 ? primaryRgb : secondaryRgb}, 0.8)`;
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 8 * audioMultiplier;
            ctx.stroke();

            // 8 Directional Warp Vector Arrows on Outer Octagon
            if (oIdx === 0) {
              for (let v = 0; v < 8; v++) {
                const oAngle = (v * Math.PI) / 4;
                const ax = Math.cos(oAngle) * (r * 1.16);
                const ay = Math.sin(oAngle) * (r * 1.16);
                ctx.beginPath();
                ctx.arc(ax, ay, 2.5 * scaleRatio, 0, Math.PI * 2);
                ctx.fillStyle = primaryHex;
                ctx.fill();
              }
            }
            ctx.restore();
          });
          break;
        }

        // ---------------------------------------------------------------------
        // 13. MISTRAL LARGE 3: MISTRAL CYCLONE TURBINE (6-Vane Cyclone Blades)
        // ---------------------------------------------------------------------
        case "cyclone-turbine": {
          const cycloneR = 126 * scaleRatio;

          // 6 Curved Aerodynamic Cyclone Turbine Blades
          ctx.save();
          ctx.rotate(angle * 0.22);
          for (let b = 0; b < 6; b++) {
            const bAngle = (b * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const cpX = Math.cos(bAngle + 0.4) * (cycloneR * 0.6);
            const cpY = Math.sin(bAngle + 0.4) * (cycloneR * 0.6);
            const epX = Math.cos(bAngle) * cycloneR;
            const epY = Math.sin(bAngle) * cycloneR;

            ctx.quadraticCurveTo(cpX, cpY, epX, epY);
            ctx.lineWidth = 2.2 * scaleRatio;
            ctx.strokeStyle = `rgba(${b % 2 === 0 ? primaryRgb : secondaryRgb}, 0.85)`;
            ctx.shadowColor = primaryHex;
            ctx.shadowBlur = 8 * audioMultiplier;
            ctx.stroke();
          }

          // Outer Air-vent Ring
          ctx.beginPath();
          ctx.arc(0, 0, cycloneR * 1.05, 0, Math.PI * 2);
          ctx.setLineDash([12 * scaleRatio, 8 * scaleRatio]);
          ctx.strokeStyle = `rgba(${secondaryRgb}, 0.55)`;
          ctx.lineWidth = 1.4 * scaleRatio;
          ctx.stroke();
          ctx.restore();
          break;
        }

        default:
          break;
      }

      // =======================================================================
      // PARTICLES RENDERER
      // =======================================================================
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.angularSpeed * (1 + voiceState.audioLevel * 1.6);

        const currentR =
          (p.baseRadius + Math.sin(pulseTime * p.radialFreq + p.radialPhase) * p.radialAmp) *
          scaleRatio *
          (1 + voiceState.audioLevel * 0.15);

        const px = Math.cos(p.angle) * currentR;
        const py = Math.sin(p.angle) * currentR;

        const shimmer = Math.sin(pulseTime * p.shimmerSpeed + p.shimmerPhase) * 0.22;
        const alpha = Math.max(0.2, Math.min(1.0, p.baseOpacity + shimmer));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scaleRatio, 0, Math.PI * 2);

        let drawColor = p.color;
        if (isSpeaking || isProcessing) {
          drawColor = primaryHex;
        }

        ctx.fillStyle = drawColor;
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 5 * audioMultiplier;
        ctx.fill();
        ctx.restore();
      }

      // =======================================================================
      // CENTRAL AURA & RADIANT SINGULARITY ORB
      // =======================================================================
      const glowR = 72 * scaleRatio * (1 + voiceState.audioLevel * 0.28);
      const aura = ctx.createRadialGradient(0, 0, 8 * scaleRatio, 0, 0, glowR);
      aura.addColorStop(0, `rgba(${primaryRgb}, ${0.88 * audioMultiplier})`);
      aura.addColorStop(0.3, `rgba(${primaryRgb}, ${0.52 * audioMultiplier})`);
      aura.addColorStop(0.65, `rgba(${secondaryRgb}, 0.25)`);
      aura.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // Solid Luminous Singularity Core
      const orbR = 18 * scaleRatio * (1 + voiceState.audioLevel * 0.18);

      // Model/Mode-Specific Outer Halo
      ctx.save();
      ctx.shadowColor = primaryHex;
      ctx.shadowBlur = 22 * audioMultiplier;
      ctx.beginPath();
      ctx.arc(0, 0, orbR + 2.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${primaryRgb}, 0.95)`;
      ctx.fill();

      // Radiant Core Center
      ctx.shadowColor = isModeColored ? primaryHex : "#FFFFFF";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, orbR, 0, Math.PI * 2);
      ctx.fillStyle = isModeColored ? "#FFFFFF" : (coreConfig.coreOrbColor || "#FFFFFF");
      ctx.fill();
      ctx.restore();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [voiceState, size, themeMode, theme, modelId, coreConfig]);

  // Model cycling handler for next/prev
  const handleCycleModel = (direction: "next" | "prev", e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectModel) return;
    const currentIndex = AI_MODELS_ROSTER.findIndex((m) => m.id === modelId);
    if (currentIndex === -1) return;

    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % AI_MODELS_ROSTER.length
        : (currentIndex - 1 + AI_MODELS_ROSTER.length) % AI_MODELS_ROSTER.length;

    onSelectModel(AI_MODELS_ROSTER[nextIndex].id);
  };

  const activeGlow = themeMode !== "normal" ? theme.glowColor : coreConfig.glowColor;

  return (
    <div
      onClick={onCoreClick}
      className={`relative flex flex-col items-center justify-center cursor-pointer group select-none ${className}`}
      title="Touch Core to activate Quantum Voice Recognition. Use arrows to switch active AI Core."
    >
      {/* Background Volumetric Mode / Model-specific Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: activeGlow,
          opacity: 0.42,
        }}
      />

      {/* HTML5 Canvas Quantum Arc Reactor Core */}
      <canvas
        ref={canvasRef}
        className="relative z-10 transition-transform duration-500 group-hover:scale-105"
        style={{
          filter: `drop-shadow(0 0 24px ${activeGlow})`,
        }}
      />

      {/* Interactive Core Cycling Controls (Left / Right Arrows) */}
      {showControls && onSelectModel && size !== "sm" && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2 pointer-events-none z-30">
          <button
            type="button"
            onClick={(e) => handleCycleModel("prev", e)}
            className="w-7 h-7 rounded-full bg-[#060B14]/80 border border-white/20 text-white/70 hover:text-white hover:border-cyan-400 hover:bg-[#0A1220] flex items-center justify-center pointer-events-auto transition-all shadow-lg hover:scale-110 cursor-pointer"
            title="Previous AI Model Core"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => handleCycleModel("next", e)}
            className="w-7 h-7 rounded-full bg-[#060B14]/80 border border-white/20 text-white/70 hover:text-white hover:border-cyan-400 hover:bg-[#0A1220] flex items-center justify-center pointer-events-auto transition-all shadow-lg hover:scale-110 cursor-pointer"
            title="Next AI Model Core"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* High-Tech Model Reactor Telemetry Pill */}
      <div
        className="relative z-20 -mt-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest flex items-center gap-2 shadow-2xl backdrop-blur-md border transition-all duration-300 group-hover:scale-105"
        style={{
          backgroundColor: "#060B14EE",
          borderColor: `${themeMode !== "normal" ? theme.primary : coreConfig.primaryColor}66`,
          boxShadow: `0 0 16px ${activeGlow}`,
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor:
              voiceState.mode === "LISTENING"
                ? "#22C55E"
                : voiceState.mode === "SPEAKING"
                ? "#FF007A"
                : voiceState.mode === "PROCESSING"
                ? "#A855F7"
                : themeMode !== "normal"
                ? theme.primary
                : coreConfig.primaryColor,
            boxShadow: `0 0 10px ${
              voiceState.mode === "LISTENING"
                ? "#22C55E"
                : voiceState.mode === "SPEAKING"
                ? "#FF007A"
                : voiceState.mode === "PROCESSING"
                ? "#A855F7"
                : themeMode !== "normal"
                ? theme.primary
                : coreConfig.primaryColor
            }`,
          }}
        />

        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span style={{ color: themeMode !== "normal" ? theme.primary : coreConfig.primaryColor }}>
            {coreConfig.modelName}
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/60 hidden sm:inline">
            {coreConfig.archetype}
          </span>
          <span className="text-white/30 hidden md:inline">•</span>
          <span
            className="text-[9px] px-1.5 py-0.2 rounded font-mono hidden md:inline"
            style={{
              backgroundColor: `${themeMode !== "normal" ? theme.primary : coreConfig.primaryColor}22`,
              color: themeMode !== "normal" ? theme.primary : coreConfig.primaryColor,
            }}
          >
            {voiceState.mode === "LISTENING"
              ? "VOICE ACTIVE"
              : voiceState.mode === "SPEAKING"
              ? "VOCALIZING"
              : voiceState.mode === "PROCESSING"
              ? "COMPUTING"
              : "ONLINE"}
          </span>
        </div>

        {onSelectModel && size !== "sm" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModelPicker(!showModelPicker);
            }}
            className="ml-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-[9px] font-mono cursor-pointer transition-colors"
            title="Choose Model Core"
          >
            SWITCH
          </button>
        )}
      </div>

      {/* Quick Model Selector Dropdown Popover */}
      {showModelPicker && onSelectModel && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full mb-3 z-50 w-72 bg-[#080D16]/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-2 space-y-1 max-h-72 overflow-y-auto custom-scrollbar animate-fade-in text-left"
        >
          <div className="text-[10px] font-mono text-slate-400 px-2 py-1 border-b border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>SELECT AI CORE ARCHITECTURE</span>
            </span>
            <span className="text-cyan-400 font-bold">{AI_MODELS_ROSTER.length} CORES</span>
          </div>

          {AI_MODELS_ROSTER.map((m) => {
            const mConfig = getModelCoreConfig(m.id);
            const isCurrent = m.id === modelId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelectModel(m.id);
                  setShowModelPicker(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-white/15 text-white font-bold"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: mConfig.primaryColor,
                      boxShadow: isCurrent ? `0 0 8px ${mConfig.primaryColor}` : "none",
                    }}
                  />
                  <div>
                    <div className="leading-tight">{m.name}</div>
                    <div className="text-[9px] text-slate-400">{mConfig.archetype}</div>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0 font-mono">
                  {m.provider.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
