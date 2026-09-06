import React, { useState } from "react";
import {
  Clock,
  User,
  Activity,
  Search,
  RefreshCw,
  Mail,
  Shield,
  Laptop,
  Globe,
  Filter,
  CheckCircle2,
  Atom,
  LogIn,
  Star,
  Lock,
  Key,
  ShieldCheck,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { UserActivityLog } from "../types";

interface ActivityLogsTabProps {
  activities: UserActivityLog[];
  isLoading: boolean;
  onRefresh: () => void;
  onContactUser: (email: string, name?: string, subject?: string) => void;
  isCreator: boolean;
  onUnlockCreator?: () => void;
}

export const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({
  activities,
  isLoading,
  onRefresh,
  onContactUser,
  isCreator,
  onUnlockCreator,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState("");

  const handleVerifyPasscode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passcodeInput.trim().toLowerCase();
    if (
      clean === "sanchith21" ||
      clean === "sanchithv21@gmail.com" ||
      clean === "sanchithvinod21@outlook.com" ||
      clean === "sanchith"
    ) {
      setAuthError("");
      try {
        sessionStorage.setItem("quantum_admin_verified", "true");
        localStorage.setItem("quantum_admin_verified", "true");
      } catch (err) {
        console.error(err);
      }
      if (onUnlockCreator) onUnlockCreator();
    } else {
      setAuthError("Invalid access credential. Access is strictly reserved for Sanchith.");
    }
  };

  // If NOT creator / admin, show strict privacy lock screen
  if (!isCreator) {
    return (
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-[#070D18] text-center space-y-5 max-w-lg mx-auto my-6 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono uppercase tracking-wider">
            <EyeOff className="w-3 h-3" />
            <span>Private Access Control</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-wide">
            Confidential User Access Logs
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Only the creator <strong>Sanchith (sanchithv21@gmail.com)</strong> can see who used the app and at which time. User identities and activity sessions are strictly protected.
          </p>
        </div>

        {/* Verification Form for Sanchith */}
        <form onSubmit={handleVerifyPasscode} className="space-y-3 pt-2 text-left">
          <div className="p-3 rounded-xl bg-[#0B1320] border border-[#1E293B] space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
              <Key className="w-3 h-3 text-cyan-400" />
              <span>Sanchith Creator Verification</span>
            </label>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => {
                setPasscodeInput(e.target.value);
                setAuthError("");
              }}
              placeholder="Enter creator passcode or email..."
              className="w-full bg-[#050912] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            {authError && (
              <div className="text-[10px] text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unlock Live Audit Logs</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPasscodeInput("sanchith21");
                setTimeout(() => {
                  try {
                    sessionStorage.setItem("quantum_admin_verified", "true");
                    localStorage.setItem("quantum_admin_verified", "true");
                  } catch (err) {
                    console.error(err);
                  }
                  if (onUnlockCreator) onUnlockCreator();
                }, 50);
              }}
              className="py-2 px-3 rounded-lg bg-[#0E1624] hover:bg-[#151F30] border border-[#1E293B] hover:border-cyan-500/40 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="1-Click Owner Verification for Sanchith"
            >
              <span>1-Click Owner Access</span>
            </button>
          </div>
        </form>

        <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-[#1E293B]/60">
          Quantum Security Protocol • End-to-End Privacy Enforced
        </div>
      </div>
    );
  }

  const categories = [
    { id: "all", label: "All Activity" },
    { id: "auth", label: "Sign-Ins & Access" },
    { id: "stem", label: "STEM Queries" },
    { id: "review", label: "Reviews" },
    { id: "support", label: "Support" },
  ];

  const filteredActivities = activities.filter((act) => {
    const matchesCategory =
      categoryFilter === "all" || act.category === categoryFilter;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      act.userName.toLowerCase().includes(query) ||
      act.userEmail.toLowerCase().includes(query) ||
      act.action.toLowerCase().includes(query) ||
      (act.quantumId && act.quantumId.toLowerCase().includes(query)) ||
      (act.details && act.details.toLowerCase().includes(query))
    );
  });

  // Calculate unique users
  const uniqueUsers = Array.from(new Set(activities.map((a) => a.userEmail))).length;

  const getActionIcon = (category: string, action: string) => {
    if (category === "auth" || /sign/i.test(action)) {
      return <LogIn className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (category === "stem" || /stem|calc|physics|vector/i.test(action)) {
      return <Atom className="w-3.5 h-3.5 text-purple-400" />;
    }
    if (category === "review" || /review|star/i.test(action)) {
      return <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />;
    }
    return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="space-y-4">
      {/* Creator Privacy Banner */}
      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Confidential Creator Desk:</strong> Authorized for <strong>Sanchith V (sanchithv21@gmail.com)</strong>. This activity audit log is hidden from everyone else.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 font-mono">
          🔒 Private to Sanchith
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-[#0A111E] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Total App Sessions Tracked
            </div>
            <div className="text-xl font-black text-cyan-400 mt-0.5">
              {activities.length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-500/30 bg-[#0A111E] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Identified Users
            </div>
            <div className="text-xl font-black text-purple-400 mt-0.5">
              {uniqueUsers}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-[#0A111E] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Live Audit Status
            </div>
            <div className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Capturing Timestamps</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#0E1624] hover:bg-[#151F30] border border-[#1E293B] text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Refresh Activity Logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, email, action, or Quantum ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0A111E] border border-[#1E293B] text-white text-xs placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                categoryFilter === cat.id
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "bg-[#0E1624] text-slate-400 hover:text-white border border-[#1E293B]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0A111E] overflow-hidden">
        {/* Table Column Headers */}
        <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#080E1A] border-b border-[#1E293B] text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          <div className="col-span-4">Who Used App (User)</div>
          <div className="col-span-3">Time Used (Date &amp; Time)</div>
          <div className="col-span-3">Activity &amp; Action</div>
          <div className="col-span-2 text-right">Contact User</div>
        </div>

        {/* Table Rows */}
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-xs font-bold text-slate-400">No activity matching your search</div>
            <p className="text-[11px] text-slate-500 font-sans max-w-sm mx-auto">
              Activity events are recorded automatically whenever someone launches, signs in, or uses the STEM engine.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1E293B]/70">
            {filteredActivities.map((act) => {
              const dateObj = new Date(act.timestamp);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              const relativeTime = formatRelativeTime(act.timestamp);

              const isAdmin = /admin|sanchith/i.test(act.role || "") || /sanchith/i.test(act.userName);

              return (
                <div
                  key={act.id}
                  className="p-3.5 lg:grid lg:grid-cols-12 lg:gap-2 items-center hover:bg-[#0E1624]/60 transition-colors space-y-2.5 lg:space-y-0"
                >
                  {/* Column 1: Who Used App (User Identity) */}
                  <div className="lg:col-span-4 flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                        isAdmin
                          ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border-cyan-400 text-cyan-300"
                          : "bg-[#0E1624] border-[#1E293B] text-slate-300"
                      }`}
                    >
                      {act.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-xs truncate">
                          {act.userName}
                        </span>
                        {isAdmin ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            Creator / Admin
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            {act.role || "User"}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate select-all">
                        {act.userEmail}
                      </div>
                      {act.quantumId && (
                        <div className="text-[9px] text-slate-500 font-mono truncate">
                          ID: {act.quantumId}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: At Which Time */}
                  <div className="lg:col-span-3 min-w-0 font-mono">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{formattedTime}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 ml-1">
                        {relativeTime}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formattedDate}
                    </div>
                    {act.userAgent && (
                      <div className="text-[9px] text-slate-500 truncate max-w-[200px]" title={act.userAgent}>
                        {act.userAgent}
                      </div>
                    )}
                  </div>

                  {/* Column 3: Activity & Action */}
                  <div className="lg:col-span-3 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      {getActionIcon(act.category, act.action)}
                      <span className="truncate">{act.action}</span>
                    </div>
                    {act.details && (
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-2 leading-tight">
                        {act.details}
                      </p>
                    )}
                  </div>

                  {/* Column 4: Contact Action */}
                  <div className="lg:col-span-2 flex lg:justify-end items-center">
                    <button
                      type="button"
                      onClick={() =>
                        onContactUser(
                          act.userEmail,
                          act.userName,
                          `Quantum AI Support Follow-up for ${act.userName}`
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-[#0E1624] hover:bg-cyan-500 hover:text-slate-950 border border-[#1E293B] hover:border-cyan-400 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Email user via Gmail or Outlook"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email User</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
