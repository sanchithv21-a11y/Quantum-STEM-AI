import React, { useState, useRef } from "react";
import { AuthUser } from "../types";
import {
  X,
  User,
  Mail,
  Shield,
  Key,
  Copy,
  Check,
  Edit2,
  Save,
  Sparkles,
  LogOut,
  Calendar,
  CheckCircle2,
  Camera,
  Trash2,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUpdateUser: (updated: AuthUser) => void;
  onSignOut: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSignOut,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || "");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !currentUser) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = {
      ...currentUser,
      name: nameInput.trim(),
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert("Image size should be under 2.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdateUser({
          ...currentUser,
          avatarUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onUpdateUser({
      ...currentUser,
      avatarUrl: "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#070D18] text-slate-100 shadow-2xl shadow-cyan-950/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-[#1E293B] bg-gradient-to-r from-cyan-950/40 via-[#070D18] to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">User Profile &amp; Identity</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Sovereign Quantum Matrix Session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#1E293B] bg-[#0A111E] text-slate-400 hover:text-white hover:border-cyan-500/40 flex items-center justify-center transition-colors cursor-pointer"
            title="Close Profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto font-mono text-xs">
          {/* User Hero Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-[#1E293B] bg-[#0A111E]/80">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center text-xl font-bold font-mono tracking-widest overflow-hidden shrink-0 shadow-lg cursor-pointer hover:border-cyan-300 transition-colors"
                  title="Click to upload custom profile photo"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>SV</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-xl bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 transition-opacity cursor-pointer text-[10px] font-mono"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4 text-cyan-300 mb-0.5" />
                  <span>{currentUser.avatarUrl ? "CHANGE" : "ADD PIC"}</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Action controls for photo */}
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Camera className="w-3 h-3" />
                  <span>{currentUser.avatarUrl ? "Change Photo" : "Add Photo"}</span>
                </button>
                {currentUser.avatarUrl ? (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove (Use SV)</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Profile Pic: <strong className="text-cyan-300">SV</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 tracking-wider font-bold uppercase">
                  SOVEREIGN IDENTITY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% FREE
                </span>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 bg-[#151F30] border border-cyan-400/60 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setNameInput(currentUser.name);
                      setIsEditing(false);
                    }}
                    className="px-2 py-1 rounded-lg border border-[#1E293B] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
                  <button
                    onClick={() => {
                      setNameInput(currentUser.name);
                      setIsEditing(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-slate-400 text-xs truncate">
                <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider px-1">
              Account Specifications
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#070D18] divide-y divide-[#1E293B]">
              {/* Full Name */}
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Name</span>
                </span>
                <span className="text-white font-bold">{currentUser.name}</span>
              </div>

              {/* Email Address */}
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email ID</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200">{currentUser.email}</span>
                  <button
                    onClick={() => handleCopy(currentUser.email, "email")}
                    className="p-1 rounded hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quantum ID */}
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Quantum ID</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{currentUser.quantumId}</span>
                  <button
                    onClick={() => handleCopy(currentUser.quantumId, "quantumId")}
                    className="p-1 rounded hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
                    title="Copy Quantum ID"
                  >
                    {copiedField === "quantumId" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Access Tier */}
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Access Tier</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Free Lifetime Access</span>
                </span>
              </div>

              {/* Security & Cryptography */}
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Security Protocol</span>
                </span>
                <span className="text-slate-300">Local AES-256 Vault</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Member Since</span>
                </span>
                <span className="text-slate-400">
                  {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "Present"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center gap-2 font-bold cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
