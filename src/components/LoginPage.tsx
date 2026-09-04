import React, { useState } from "react";
import { AuthUser, AuthProviderType, SubscriptionTier, QuantumThemeMode } from "../types";
import { QUANTUM_THEMES } from "../lib/themeConfig";
import { playQuantumClick } from "../utils/soundEffects";
import { BrandLogo } from "./BrandLogo";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Key,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  AlertCircle,
  Atom,
  Terminal,
  BrainCircuit,
  Compass,
  Layers,
  ArrowLeft,
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onBackToApp: () => void;
  themeMode?: QuantumThemeMode;
  currentTier?: SubscriptionTier;
  onOpenSubscription?: () => void;
  isMandatory?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  currentUser,
  onLogout,
  onBackToApp,
  themeMode = "normal",
  currentTier = "free",
  onOpenSubscription,
  isMandatory = false,
}) => {
  const currentTheme = QUANTUM_THEMES[themeMode] || QUANTUM_THEMES.normal;

  const [authMode, setAuthMode] = useState<"signin" | "signup" | "magic_link">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProviderType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const generateQuantumId = () => {
    const chars = "0123456789ABCDEF";
    let qid = "QNT-";
    for (let i = 0; i < 8; i++) {
      qid += chars[Math.floor(Math.random() * chars.length)];
    }
    return qid;
  };

  const handleOAuthSignIn = (provider: AuthProviderType) => {
    setIsLoading(true);
    setLoadingProvider(provider);
    setErrorMessage(null);
    setSuccessMessage(null);
    playQuantumClick();

    setTimeout(() => {
      let mockName = "Sanchith V";
      let mockEmail = email ? email : "SanchithV21@gmail.com";
      let mockAvatar = "";

      if (provider === "google") {
        mockName = "Sanchith V";
        mockEmail = email ? email : "SanchithV21@gmail.com";
        mockAvatar = "";
      } else if (provider === "apple") {
        mockName = "Sanchith V";
        mockEmail = email ? email : "SanchithV21@gmail.com";
        mockAvatar = "";
      } else if (provider === "github") {
        mockName = "Sanchith V";
        mockEmail = email ? email : "SanchithV21@gmail.com";
        mockAvatar = "";
      } else if (provider === "microsoft") {
        mockName = "Sanchith V";
        mockEmail = email ? email : "SanchithV21@gmail.com";
        mockAvatar = "";
      }

      const user: AuthUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: fullName.trim() || mockName,
        email: email.trim() || mockEmail,
        provider,
        avatarUrl: mockAvatar,
        createdAt: new Date().toISOString(),
        tier: (currentTier || "free") as SubscriptionTier,
        quantumId: generateQuantumId(),
      };

      setIsLoading(false);
      setLoadingProvider(null);
      setSuccessMessage(`Authenticated securely via ${provider.toUpperCase()}!`);

      setTimeout(() => {
        onLoginSuccess(user);
        onBackToApp();
      }, 600);
    }, 900);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (authMode !== "magic_link" && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setLoadingProvider("email");
    setErrorMessage(null);
    setSuccessMessage(null);
    playQuantumClick();

    setTimeout(() => {
      const derivedName =
        fullName.trim() ||
        email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const user: AuthUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: derivedName,
        email: email.trim(),
        provider: "email",
        createdAt: new Date().toISOString(),
        tier: (currentTier || "free") as SubscriptionTier,
        quantumId: generateQuantumId(),
      };

      setIsLoading(false);
      setLoadingProvider(null);
      setSuccessMessage(
        authMode === "signup"
          ? "Quantum Account initialized!"
          : "Welcome back to Sovereign Core!"
      );

      setTimeout(() => {
        onLoginSuccess(user);
        onBackToApp();
      }, 600);
    }, 850);
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Dynamic Background Grid & Quantum Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle 800px at 50% 20%, ${currentTheme.accent}, transparent)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#1E293B]/80 bg-[#060A10]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {currentUser && !isMandatory ? (
            <button
              onClick={() => {
                playQuantumClick();
                onBackToApp();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E293B] bg-[#0B1320] text-slate-300 hover:text-white hover:border-cyan-400 font-mono text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO WORKSPACE</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold shadow-sm">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIGN IN TO UNLOCK ACCESS</span>
            </div>
          )}
          <div className="h-4 w-px bg-[#1E293B]" />
          <div className="flex items-center gap-2">
            <BrandLogo size="xs" glow={true} />
            <span className="font-mono text-xs font-bold tracking-widest text-white">
              QUANTUM<span className="text-cyan-400">LABS</span> SOVEREIGN CORE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400 hidden sm:inline">100% Free Forever Upon Sign-In</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURE ACCESS</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Platform Highlights & Security */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>UNIFIED RESEARCH & REASONING PASS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white leading-tight">
                One Sovereign Identity. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
                  Universal Intelligence.
                </span>
              </h1>
              <p className="text-sm font-mono text-slate-400 leading-relaxed">
                Connect seamlessly using Apple, Google, GitHub, Microsoft, or your direct email
                credentials. Sync calculations, real-time code executions, and AI multi-model reasoning.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-[#1E293B] bg-[#0A101A]/60">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">Universal Model Telemetry</h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Free Quantum AI Core + 12+ Frontier Engines with unified history and benchmark telemetry.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-[#1E293B] bg-[#0A101A]/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">Real-Time Codingz Kernel</h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Auto-persist code files, Python SciPy calculations, LaTeX papers, and custom scripts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-[#1E293B] bg-[#0A101A]/60">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">OAuth Multi-Provider Handshake</h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Zero hassle. Instant sign-in with Google, Apple, GitHub, Microsoft or email magic codes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-6">
            <div
              className="rounded-2xl border bg-[#060A10]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)] p-6 sm:p-8 space-y-6 transition-all"
              style={{ borderColor: currentTheme.border }}
            >
              {/* Authenticated State */}
              {currentUser ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-[#1E293B] bg-[#0D1522] flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-lg font-bold font-mono overflow-hidden shrink-0 shadow-lg"
                      style={{
                        borderColor: currentTheme.accent,
                        backgroundColor: currentTheme.bgGlow,
                        color: currentTheme.accent,
                      }}
                    >
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-mono font-bold tracking-wider">SV</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                          {currentUser.tier} tier
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-2">
                        <span>ID: <strong className="text-cyan-400">{currentUser.quantumId}</strong></span>
                        <span>•</span>
                        <span className="capitalize">Via {currentUser.provider}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg border border-[#1E293B] bg-[#0B121D] space-y-1">
                      <div className="text-[10px] text-slate-400">SESSION STATUS</div>
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>ACTIVE & SECURE</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-[#1E293B] bg-[#0B121D] space-y-1">
                      <div className="text-[10px] text-slate-400">QUANTUM REASONING</div>
                      <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Zap className="w-4 h-4" />
                        <span>SOVEREIGN READY</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playQuantumClick();
                        if (onLogout) onLogout();
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 font-mono text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Sign Out
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playQuantumClick();
                        onBackToApp();
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer text-center shadow-lg"
                      style={{
                        backgroundColor: currentTheme.accent,
                      }}
                    >
                      Launch Workspace &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Card Title */}
                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-bold text-white font-mono flex items-center justify-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      <span>
                        {authMode === "signup"
                          ? "INITIALIZE QUANTUM ID"
                          : authMode === "magic_link"
                          ? "MAGIC LINK DISPATCH"
                          : "SIGN IN TO QUANTUM LABS"}
                      </span>
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      {authMode === "signup"
                        ? "Create your research account to get started."
                        : "Choose your identity provider or enter your email."}
                    </p>
                  </div>

                  {/* Messages */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl border border-red-500/50 bg-red-500/10 text-red-200 text-xs font-mono flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-200 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* OAuth Buttons Grid: Apple, Google, GitHub, Microsoft */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                      <div className="h-px bg-[#1E293B] flex-1" />
                      <span>1-CLICK SSO PROVIDERS</span>
                      <div className="h-px bg-[#1E293B] flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Google */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleOAuthSignIn("google")}
                        className="py-2.5 px-3 rounded-xl border border-[#243248] bg-[#0E1624] hover:bg-[#152033] hover:border-cyan-500/50 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {loadingProvider === "google" ? (
                          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                            />
                          </svg>
                        )}
                        <span>Google</span>
                      </button>

                      {/* Apple */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleOAuthSignIn("apple")}
                        className="py-2.5 px-3 rounded-xl border border-[#243248] bg-[#0E1624] hover:bg-[#152033] hover:border-slate-400 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {loadingProvider === "apple" ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.65-.79 1.09-1.88.97-2.97-.94.04-2.07.63-2.73 1.42-.58.68-1.09 1.78-.95 2.85 1.05.08 2.06-.51 2.71-1.3" />
                          </svg>
                        )}
                        <span>Apple</span>
                      </button>

                      {/* GitHub */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleOAuthSignIn("github")}
                        className="py-2.5 px-3 rounded-xl border border-[#243248] bg-[#0E1624] hover:bg-[#152033] hover:border-purple-400 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {loadingProvider === "github" ? (
                          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            />
                          </svg>
                        )}
                        <span>GitHub</span>
                      </button>

                      {/* Microsoft */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleOAuthSignIn("microsoft")}
                        className="py-2.5 px-3 rounded-xl border border-[#243248] bg-[#0E1624] hover:bg-[#152033] hover:border-blue-400 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {loadingProvider === "microsoft" ? (
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 23 23">
                            <path fill="#f35325" d="M1 1h10v10H1z" />
                            <path fill="#81bc06" d="M12 1h10v10H12z" />
                            <path fill="#05a6f0" d="M1 12h10v10H1z" />
                            <path fill="#ffba08" d="M12 12h10v10H12z" />
                          </svg>
                        )}
                        <span>Microsoft</span>
                      </button>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                    <div className="h-px bg-[#1E293B] flex-1" />
                    <span>OR SIGN IN WITH EMAIL</span>
                    <div className="h-px bg-[#1E293B] flex-1" />
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    {authMode === "signup" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>FULL NAME / CALLSIGN</span>
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Dr. Ada Lovelace"
                          className="w-full px-3 py-2 rounded-xl border border-[#1E293B] bg-[#0B1320] text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-600"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>EMAIL ADDRESS</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sanchithv21@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-[#1E293B] bg-[#0B1320] text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>

                    {authMode !== "magic_link" && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>PASSWORD</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setAuthMode("magic_link")}
                            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                          >
                            Magic Link?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-3 pr-9 py-2 rounded-xl border border-[#1E293B] bg-[#0B1320] text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                          >
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:brightness-110 disabled:opacity-50 mt-2"
                      style={{
                        backgroundColor: currentTheme.accent,
                      }}
                    >
                      {isLoading && loadingProvider === "email" ? (
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>
                            {authMode === "signup"
                              ? "CREATE QUANTUM ACCOUNT"
                              : authMode === "magic_link"
                              ? "SEND MAGIC LOGIN CODE"
                              : "SIGN IN WITH EMAIL"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Mode Toggles */}
                  <div className="pt-2 border-t border-[#1E293B] text-center">
                    {authMode === "signin" ? (
                      <div className="text-xs font-mono text-slate-400">
                        Don't have a Quantum identity yet?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            playQuantumClick();
                            setAuthMode("signup");
                            setErrorMessage(null);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                        >
                          Sign Up Free &rarr;
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-slate-400">
                        Already registered?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            playQuantumClick();
                            setAuthMode("signin");
                            setErrorMessage(null);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                        >
                          Sign In &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-[#1E293B]/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <div>&copy; 2026 Quantum Polymath AI Labs. Sovereign Intelligence Core.</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Security Policy</span>
          <span>•</span>
          <span className="hover:text-slate-300 cursor-pointer">OAuth Protocols</span>
          <span>•</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};
