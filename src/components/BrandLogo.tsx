import React from "react";
import logoImg from "../assets/images/quantum_ai_logo_1788516116721.jpg";
import { Atom } from "lucide-react";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  className?: string;
  showText?: boolean;
  edition?: "basic" | "ultra" | "codingz" | "matrix";
}

const sizeMap = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  glow = true,
  className = "",
  showText = false,
  edition = "ultra",
}) => {
  const [imageError, setImageError] = React.useState(false);
  const sizeClasses = sizeMap[size] || sizeMap.md;

  const glowColor =
    edition === "basic"
      ? "rgba(16, 185, 129, 0.45)"
      : edition === "codingz"
      ? "rgba(6, 182, 212, 0.45)"
      : "rgba(6, 182, 212, 0.55)";

  const borderColor =
    edition === "basic"
      ? "border-emerald-500/50"
      : edition === "codingz"
      ? "border-cyan-500/50"
      : "border-cyan-400/60";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative ${sizeClasses} rounded-xl overflow-hidden border ${borderColor} bg-[#040811] shrink-0 transition-all duration-300 group`}
        style={
          glow
            ? {
                boxShadow: `0 0 16px ${glowColor}`,
              }
            : undefined
        }
      >
        {!imageError ? (
          <img
            src={logoImg}
            alt="Quantum STEM AI Logo"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cyan-950/40 text-cyan-400">
            <Atom className="w-1/2 h-1/2 animate-spin-slow" />
          </div>
        )}

        {/* Subtle corner badge for edition */}
        {edition === "basic" && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
        )}
        {edition === "codingz" && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-cyan-400" />
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-black tracking-wider text-white text-sm">
              QUANTUM<span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              STEM OS
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 -mt-0.5">
            Sovereign Matrix
          </span>
        </div>
      )}
    </div>
  );
};
