import React, { useState } from "react";
import {
  Mail,
  ExternalLink,
  Copy,
  Check,
  X,
  Send,
  Globe,
  Laptop,
} from "lucide-react";
import { EmailDraft, EmailClientType, launchEmailClient } from "../utils/emailClientUtils";

interface EmailClientChooserModalProps {
  draft: EmailDraft | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailClientChooserModal: React.FC<EmailClientChooserModalProps> = ({
  draft,
  isOpen,
  onClose,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !draft) return null;

  const handleSelectClient = (client: EmailClientType) => {
    launchEmailClient(client, draft);
    onClose();
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#070D18] text-slate-100 shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-[#1E293B] bg-gradient-to-r from-cyan-950/40 via-[#070D18] to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Choose Email Service
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Select whether you want to open in Gmail or Outlook
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#1E293B] bg-[#0E1624] text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Target Recipient Card */}
          <div className="p-3 rounded-xl border border-[#1E293B] bg-[#0A111E] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Recipient:
              </span>
              <button
                onClick={() => handleCopyText(draft.to, "to")}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                title="Copy Email"
              >
                {copiedField === "to" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap font-bold text-white">
              <span className="text-cyan-300">{draft.to}</span>
              {draft.recipientName && (
                <span className="text-slate-400 font-normal text-[11px]">
                  ({draft.recipientName})
                </span>
              )}
            </div>

            {draft.subject && (
              <div className="text-[11px] text-slate-400 font-sans truncate pt-1 border-t border-[#1E293B]">
                <strong className="text-slate-300 font-mono">Subject:</strong> {draft.subject}
              </div>
            )}
          </div>

          {/* Options: Gmail vs Outlook */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Choose where to compose:</span>
            </div>

            {/* Option 1: Gmail */}
            <button
              onClick={() => handleSelectClient("gmail")}
              className="w-full p-3.5 rounded-xl border border-red-500/30 hover:border-red-400 bg-red-950/15 hover:bg-red-950/30 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5 text-red-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                      Gmail (Web Browser)
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold uppercase">
                      Google
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight mt-0.5">
                    Opens mail.google.com in a new tab with recipient &amp; message pre-filled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-red-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                <span className="text-xs font-bold hidden sm:inline">Open</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>

            {/* Option 2: Outlook Web */}
            <button
              onClick={() => handleSelectClient("outlook-web")}
              className="w-full p-3.5 rounded-xl border border-blue-500/30 hover:border-blue-400 bg-blue-950/15 hover:bg-blue-950/30 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      Outlook (Web Browser)
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold uppercase">
                      Hotmail / Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight mt-0.5">
                    Opens outlook.live.com in a new tab ready to compose and send
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                <span className="text-xs font-bold hidden sm:inline">Open</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>

            {/* Option 3: Default Desktop Mail Client */}
            <button
              onClick={() => handleSelectClient("default-client")}
              className="w-full p-3 rounded-xl border border-[#1E293B] hover:border-slate-500 bg-[#0A111E] hover:bg-[#111A29] text-left transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                  <Laptop className="w-4 h-4 text-slate-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                      Default Mail App (Windows / Mac / PC)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans leading-tight mt-0.5">
                    Launches your installed system mail client via standard mailto:
                  </p>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-white shrink-0">
                <Send className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#1E293B] bg-[#060A10] flex items-center justify-between text-[11px] text-slate-400">
          <span>Need to copy message text?</span>
          <button
            onClick={() => handleCopyText(`${draft.subject}\n\n${draft.body}`, "full")}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            {copiedField === "full" ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied Message</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Entire Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
