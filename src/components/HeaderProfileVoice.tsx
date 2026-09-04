import React from "react";
import {
  Key,
  ChevronDown,
  ChevronRight,
  User,
  Info,
  HelpCircle,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { AuthUser, VoiceState } from "../types";
import { QuantumTheme } from "../lib/themeConfig";

interface HeaderProfileVoiceProps {
  currentUser: AuthUser | null;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  voiceState: VoiceState;
  handleToggleListen: () => void;
  currentTheme: QuantumTheme;
  setShowAuthModal: (show: boolean) => void;
  setActiveView: (view: any) => void;
  setShowProfileModal: (show: boolean) => void;
  setShowAboutModal: (show: boolean) => void;
  setShowManualModal: (show: boolean) => void;
  setShowSupportModal: (show: boolean) => void;
  handleLogout: () => void;
  playQuantumClick: () => void;
}

export const HeaderProfileVoice: React.FC<HeaderProfileVoiceProps> = ({
  currentUser,
  showUserDropdown,
  setShowUserDropdown,
  voiceState,
  handleToggleListen,
  currentTheme,
  setShowAuthModal,
  setActiveView,
  setShowProfileModal,
  setShowAboutModal,
  setShowManualModal,
  setShowSupportModal,
  handleLogout,
  playQuantumClick,
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono shrink-0 ml-auto">
      {/* Sovereign User Profile Dropdown or Sign In */}
      {currentUser ? (
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="h-8 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 rounded-lg border border-[#243248] bg-[#0E1624] hover:border-cyan-400 text-xs font-mono transition-all cursor-pointer shadow-sm group shrink-0 whitespace-nowrap"
            title="Quantum Sovereign Profile & Identity"
          >
            <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold font-mono tracking-wider overflow-hidden shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                "SV"
              )}
            </div>
            <span className="font-bold text-white max-w-[90px] truncate hidden sm:inline">
              {currentUser.name}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {currentUser.tier}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" />
          </button>

          {showUserDropdown && (
            <>
              {/* Backdrop to close dropdown on click outside */}
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setShowUserDropdown(false)}
              />

              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#1E293B] bg-[#070D18]/98 backdrop-blur-xl shadow-2xl shadow-cyan-950/50 p-3.5 z-50 text-xs font-mono animate-fade-in space-y-3">
                {/* 1. Name and Email ID Display */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#1E293B]">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center text-sm font-bold font-mono tracking-widest overflow-hidden shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      "SV"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-300 truncate select-all">{currentUser.email}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {currentUser.tier}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">
                        100% Free
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantum ID & Security Info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 py-1.5 px-2.5 rounded-lg bg-[#0A111E] border border-[#1E293B]/60">
                  <span className="text-slate-400">QUANTUM ID</span>
                  <span className="text-cyan-400 font-bold">{currentUser.quantumId}</span>
                </div>

                {/* Interactive Options: Profile, About, Help, Support */}
                <div className="space-y-1 pt-1">
                  {/* Option 2: Profile */}
                  <button
                    onClick={() => {
                      playQuantumClick();
                      setShowUserDropdown(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-cyan-300 flex items-center justify-between cursor-pointer text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-300">Profile</div>
                        <div className="text-[10px] text-slate-400">View ID, edit name & credentials</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform" />
                  </button>

                  {/* Option 3: About */}
                  <button
                    onClick={() => {
                      playQuantumClick();
                      setShowUserDropdown(false);
                      setShowAboutModal(true);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-cyan-300 flex items-center justify-between cursor-pointer text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-300">About</div>
                        <div className="text-[10px] text-slate-400">Quantum AI v2.4 sovereign specs</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform" />
                  </button>

                  {/* Option 4: Help */}
                  <button
                    onClick={() => {
                      playQuantumClick();
                      setShowUserDropdown(false);
                      setShowManualModal(true);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 text-slate-200 hover:text-emerald-300 flex items-center justify-between cursor-pointer text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-emerald-300">Help</div>
                        <div className="text-[10px] text-slate-400">User manual & AI doubt clarifier</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform" />
                  </button>

                  {/* Option 5: Support */}
                  <button
                    onClick={() => {
                      playQuantumClick();
                      setShowUserDropdown(false);
                      setShowSupportModal(true);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 text-slate-200 hover:text-purple-300 flex items-center justify-between cursor-pointer text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <LifeBuoy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-purple-300">Support</div>
                        <div className="text-[10px] text-slate-400">24/7 desk & diagnostic self-test</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-transform" />
                  </button>
                </div>

                {/* Option 6: Sign Out */}
                <div className="pt-2 border-t border-[#1E293B]">
                  <button
                    onClick={() => {
                      playQuantumClick();
                      handleLogout();
                    }}
                    className="w-full py-2 px-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 flex items-center justify-between cursor-pointer text-left transition-colors font-bold group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-red-300">Sign Out</div>
                        <div className="text-[10px] text-red-400/80 font-normal">End encrypted session</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              playQuantumClick();
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/60 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:scale-105 shrink-0 whitespace-nowrap"
            title="Sign In with Apple, Google, GitHub, Microsoft, or Email"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>SIGN IN</span>
          </button>
          <button
            onClick={() => {
              playQuantumClick();
              setActiveView("login");
            }}
            className="hidden sm:flex items-center px-2 py-1.5 rounded-lg border border-[#243248] bg-[#0E1624] text-slate-400 hover:text-white text-xs font-mono transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Open Dedicated Fullscreen Login Page"
          >
            <span>PAGE</span>
          </button>
        </div>
      )}

      {/* Voice PTT Button - Always fully visible, non-shrinking, high contrast */}
      <button
        onClick={handleToggleListen}
        className="px-3 sm:px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-sm hover:scale-105"
        style={
          voiceState.isListening
            ? {
                backgroundColor: currentTheme.primary,
                color: "#020508",
                borderColor: currentTheme.primary,
                boxShadow: `0 0 16px ${currentTheme.primary}`,
              }
            : {
                backgroundColor: currentTheme.panelBg,
                borderColor: currentTheme.subtleBorder,
                color: currentTheme.primary,
              }
        }
        title={
          voiceState.isListening
            ? "Voice recognition listening active - Click to stop"
            : "Click to start Push-To-Talk Voice Assistant"
        }
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            voiceState.isListening ? "animate-ping" : ""
          }`}
          style={{
            backgroundColor: voiceState.isListening ? "#020508" : currentTheme.primary,
          }}
        />
        <span className="whitespace-nowrap font-bold">
          {voiceState.isListening ? "RECORDING" : "VOICE PTT"}
        </span>
      </button>
    </div>
  );
};
