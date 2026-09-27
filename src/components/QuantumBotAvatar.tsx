import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { playQuantumBotHappy, playQuantumBotChirp } from "../utils/soundEffects";

export interface QuantumBotAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  state?: "idle" | "thinking" | "automating" | "celebrating";
  showAura?: boolean;
  interactive?: boolean;
  trackCursor?: boolean;
  isHappy?: boolean;
  onClick?: () => void;
  className?: string;
}

export const QuantumBotAvatar: React.FC<QuantumBotAvatarProps> = ({
  size = "md",
  state = "idle",
  showAura = true,
  interactive = false,
  trackCursor = true,
  isHappy: externalHappy = false,
  onClick,
  className = "",
}) => {
  // Dimension configurations
  const sizeConfig = {
    sm: { size: 40, shadowW: 28, shadowH: 4 },
    md: { size: 64, shadowW: 44, shadowH: 6 },
    lg: { size: 96, shadowW: 68, shadowH: 8 },
    xl: { size: 130, shadowW: 92, shadowH: 10 },
  };

  const current = sizeConfig[size] || sizeConfig.md;
  const isAutomating = state === "automating" || state === "thinking";

  const containerRef = useRef<HTMLDivElement>(null);
  const [internalHappy, setInternalHappy] = useState(false);
  const [quickSquint, setQuickSquint] = useState(false);
  const happyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const squintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Smooth Eye Tracking Motion Values (Spring Physics for realistic eye gaze)
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothEyeX = useSpring(eyeX, { damping: 22, stiffness: 280, mass: 0.5 });
  const smoothEyeY = useSpring(eyeY, { damping: 22, stiffness: 280, mass: 0.5 });

  // Subtle 3D Sphere Tilt towards cursor
  const tiltRotate = useMotionValue(0);
  const smoothTiltRotate = useSpring(tiltRotate, { damping: 26, stiffness: 180 });

  // Cursor tracking listener: eyes move wherever the cursor moves
  useEffect(() => {
    if (!trackCursor) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      const dist = Math.hypot(dx, dy);

      if (dist < 5) {
        eyeX.set(0);
        eyeY.set(0);
        tiltRotate.set(0);
        return;
      }

      const angle = Math.atan2(dy, dx);
      // In 100x100 SVG, eyes can safely glance up to 8.5 units towards the cursor
      const maxOffset = 8.5;
      const distanceFactor = Math.min(1, Math.max(0.12, dist / 320));
      const targetEyeX = Math.cos(angle) * maxOffset * distanceFactor;
      const targetEyeY = Math.sin(angle) * maxOffset * distanceFactor;

      eyeX.set(targetEyeX);
      eyeY.set(targetEyeY);

      // Subtle body rotation tilt (-4° to +4°)
      const windowW = window.innerWidth || 1000;
      tiltRotate.set((dx / windowW) * 4);
    };

    // When clicking anywhere on the screen, bot's eyes playfully squint/wink at the click point
    const handleGlobalPointerDown = (e: PointerEvent) => {
      // If clicking directly on this avatar, full happy celebration is triggered by handleClick
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        return;
      }
      setQuickSquint(true);
      if (squintTimerRef.current) clearTimeout(squintTimerRef.current);
      squintTimerRef.current = setTimeout(() => {
        setQuickSquint(false);
      }, 420);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handleGlobalPointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handleGlobalPointerDown);
      if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
      if (squintTimerRef.current) clearTimeout(squintTimerRef.current);
    };
  }, [trackCursor, eyeX, eyeY, tiltRotate]);

  // Trigger full happy celebration when clicked
  const triggerHappyReaction = () => {
    setInternalHappy(true);
    playQuantumBotHappy();
    if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
    happyTimerRef.current = setTimeout(() => {
      setInternalHappy(false);
    }, 1500);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHappyReaction();
    if (onClick) {
      onClick();
    }
  };

  const isHappyActive = externalHappy || internalHappy || state === "celebrating";
  const isSquinting = isHappyActive || quickSquint;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative select-none flex flex-col items-center justify-center ${
        interactive ? "cursor-pointer group" : ""
      } ${className}`}
      style={{ width: current.size, height: current.size + current.shadowH + 8 }}
      title={interactive ? "Click me! I will be happy, and my eyes follow your cursor!" : undefined}
    >
      {/* Floating Happy Sparkles / Hearts when Clicked & Happy */}
      <AnimatePresence>
        {isHappyActive && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -20, scale: 1.1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none z-30"
          >
            <span className="text-amber-400 text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✨</span>
            <span className="text-rose-400 text-xs drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">💖</span>
            <span className="text-cyan-300 text-xs drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]">✨</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy Ambient Aura (Glow behind the white sphere) */}
      {showAura && (
        <motion.div
          animate={{
            scale: isHappyActive ? [1, 1.35, 1] : isAutomating ? [1, 1.25, 1] : [1, 1.08, 1],
            opacity: isHappyActive ? [0.6, 0.9, 0.6] : isAutomating ? [0.45, 0.8, 0.45] : [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: isHappyActive ? 0.8 : isAutomating ? 1.2 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full pointer-events-none filter blur-lg"
          style={{
            width: current.size * 1.15,
            height: current.size * 1.15,
            background: isHappyActive
              ? "radial-gradient(circle, rgba(244, 63, 94, 0.4) 0%, rgba(0, 242, 255, 0.35) 50%, transparent 75%)"
              : isAutomating
              ? "radial-gradient(circle, rgba(0, 242, 255, 0.5) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(0, 242, 255, 0.25) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 75%)",
          }}
        />
      )}

      {/* Main White Spherical Body with Smooth Floating Movement & Happy Bounce */}
      <motion.div
        animate={
          isHappyActive
            ? {
                y: [0, -14, 2, -6, 0],
                scale: [1, 1.14, 0.96, 1.05, 1],
                rotate: [-1, -4, 4, -2, 0],
              }
            : isAutomating
            ? {
                y: [0, -8, 0, 4, 0],
                rotate: [-2, 2, -2],
                scale: [1, 1.04, 1],
              }
            : {
                y: [0, -5, 0, 3, 0],
                rotate: [-1.2, 1.2, -1.2],
              }
        }
        transition={{
          duration: isHappyActive ? 0.65 : isAutomating ? 1.4 : 3.2,
          repeat: isHappyActive ? 0 : Infinity,
          ease: isHappyActive ? "easeOut" : "easeInOut",
        }}
        whileHover={interactive ? { scale: 1.08, y: -7 } : undefined}
        whileTap={interactive ? { scale: 0.92 } : undefined}
        style={{
          width: current.size,
          height: current.size,
          rotate: smoothTiltRotate,
        }}
        className="relative z-10"
      >
        {/* Exact Grok Bot Vector: Solid White Sphere + Dynamic Eyes that Track Cursor and Shrink when Happy */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <defs>
            {/* 3D Pearl-White Spherical Lighting Shading */}
            <radialGradient id="whiteSphereShade" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F8FAFC" />
              <stop offset="85%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>

            {/* Subtle Rim Specular Curve */}
            <linearGradient id="whiteSphereRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.5" />
            </linearGradient>

            {/* Crisp Black Eye Contrast Filter */}
            <filter id="blackEyeFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 1. The Pure Crisp White Sphere */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="url(#whiteSphereShade)"
            stroke="url(#whiteSphereRim)"
            strokeWidth="0.8"
          />

          {/* 2. Rosy Cheeks when Happy */}
          <AnimatePresence>
            {isHappyActive && (
              <g>
                <motion.ellipse
                  cx="46"
                  cy="50"
                  rx="6"
                  ry="3.5"
                  fill="#FF3366"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 0.45, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.ellipse
                  cx="80"
                  cy="39"
                  rx="5.5"
                  ry="3"
                  fill="#FF3366"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 0.45, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.25 }}
                />
              </g>
            )}
          </AnimatePresence>

          {/* 3. Eyes Group: Tracks Cursor Smoothly in Real-Time */}
          <motion.g
            style={{
              x: smoothEyeX,
              y: smoothEyeY,
            }}
          >
            {isSquinting ? (
              /* Happy Shrunk Eyes: Cute Curved Arcs (^ ^) when Clicked */
              <g filter="url(#blackEyeFilter)">
                {/* Left Eye: Happy smiling arc */}
                <motion.path
                  d="M 53 40 Q 59 30 65 36"
                  stroke="#000000"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ scaleY: 0.15, opacity: 0.5 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0.15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                />
                {/* Right Eye: Happy smiling arc */}
                <motion.path
                  d="M 66 33 Q 72 23 78 29"
                  stroke="#000000"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ scaleY: 0.15, opacity: 0.5 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0.15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                />
              </g>
            ) : (
              /* Normal Eyes: Slanted Pure Black Pill Capsules that Blink */
              <g filter="url(#blackEyeFilter)">
                {/* Left Eye: Black Rounded Pill at (55.5, 28) */}
                <motion.rect
                  x="55.5"
                  y="28"
                  width="7"
                  height="16"
                  rx="3.5"
                  ry="3.5"
                  fill="#000000"
                  transform="rotate(-23 59 36)"
                  animate={
                    isAutomating
                      ? { scaleY: [1, 0.75, 1.15, 1] }
                      : { scaleY: [1, 1, 0.12, 1, 1] } // Natural occasional blink
                  }
                  transition={{
                    duration: isAutomating ? 0.9 : 4.0,
                    repeat: Infinity,
                    times: isAutomating ? undefined : [0, 0.45, 0.5, 0.55, 1],
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "59px 36px" }}
                />

                {/* Right Eye: Black Rounded Pill at (68.5, 21) */}
                <motion.rect
                  x="68.5"
                  y="21"
                  width="6.5"
                  height="15"
                  rx="3.25"
                  ry="3.25"
                  fill="#000000"
                  transform="rotate(-23 71.7 28.5)"
                  animate={
                    isAutomating
                      ? { scaleY: [1, 0.75, 1.15, 1] }
                      : { scaleY: [1, 1, 0.12, 1, 1] }
                  }
                  transition={{
                    duration: isAutomating ? 0.9 : 4.0,
                    repeat: Infinity,
                    times: isAutomating ? undefined : [0, 0.45, 0.5, 0.55, 1],
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "71.7px 28.5px" }}
                />
              </g>
            )}

            {/* Micro Energy Spark in Eyes when Automating Tasks */}
            {isAutomating && !isSquinting && (
              <motion.circle
                cx="65.5"
                cy="31"
                r="1.2"
                fill="#00F2FF"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.4, 0.8] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.g>
        </svg>
      </motion.div>

      {/* Dynamic Floating Ground Projection Shadow */}
      <motion.div
        animate={{
          scaleX: isHappyActive ? [0.65, 1.15, 0.85] : isAutomating ? [0.75, 1.05, 0.75] : [0.85, 1, 0.85],
          scaleY: isHappyActive ? [0.65, 1.15, 0.85] : isAutomating ? [0.75, 1.05, 0.75] : [0.85, 1, 0.85],
          opacity: isHappyActive ? [0.15, 0.5, 0.25] : isAutomating ? [0.25, 0.5, 0.25] : [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: isHappyActive ? 0.65 : isAutomating ? 1.4 : 3.2,
          repeat: isHappyActive ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="rounded-full bg-black/60 filter blur-[2px] pointer-events-none mt-1"
        style={{
          width: current.shadowW,
          height: current.shadowH,
        }}
      />
    </div>
  );
};
