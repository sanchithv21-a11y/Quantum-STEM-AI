export interface EmailDraft {
  to: string;
  cc?: string;
  subject: string;
  body: string;
  recipientName?: string;
}

export type EmailClientType = "gmail" | "outlook-web" | "outlook-office" | "default-client";

/**
 * Builds the official web compose link for Gmail
 */
export function buildGmailComposeUrl(draft: EmailDraft): string {
  const params = new URLSearchParams();
  params.set("view", "cm");
  params.set("fs", "1");
  params.set("to", draft.to);
  if (draft.cc) params.set("cc", draft.cc);
  if (draft.subject) params.set("su", draft.subject);
  if (draft.body) params.set("body", draft.body);

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Builds the official web compose link for Outlook Live / Personal (Hotmail/Outlook.com)
 */
export function buildOutlookLiveComposeUrl(draft: EmailDraft): string {
  const params = new URLSearchParams();
  params.set("to", draft.to);
  if (draft.cc) params.set("cc", draft.cc);
  if (draft.subject) params.set("subject", draft.subject);
  if (draft.body) params.set("body", draft.body);

  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString()}`;
}

/**
 * Builds the official web compose link for Microsoft 365 / Office
 */
export function buildOutlookOfficeComposeUrl(draft: EmailDraft): string {
  const params = new URLSearchParams();
  params.set("to", draft.to);
  if (draft.cc) params.set("cc", draft.cc);
  if (draft.subject) params.set("subject", draft.subject);
  if (draft.body) params.set("body", draft.body);

  return `https://outlook.office.com/mail/deeplink/compose?${params.toString()}`;
}

/**
 * Builds standard RFC 6068 mailto: URI for system default mail client (Outlook Desktop, Apple Mail, Thunderbird, etc.)
 */
export function buildMailtoUrl(draft: EmailDraft): string {
  const params = new URLSearchParams();
  if (draft.cc) params.set("cc", draft.cc);
  if (draft.subject) params.set("subject", draft.subject);
  if (draft.body) params.set("body", draft.body);

  const query = params.toString();
  return `mailto:${draft.to}${query ? `?${query}` : ""}`;
}

/**
 * Dispatches the email draft to the requested client
 */
export function launchEmailClient(client: EmailClientType, draft: EmailDraft): void {
  if (client === "gmail") {
    const url = buildGmailComposeUrl(draft);
    window.open(url, "_blank", "noopener,noreferrer");
  } else if (client === "outlook-web") {
    const url = buildOutlookLiveComposeUrl(draft);
    window.open(url, "_blank", "noopener,noreferrer");
  } else if (client === "outlook-office") {
    const url = buildOutlookOfficeComposeUrl(draft);
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // default mailto: app
    const url = buildMailtoUrl(draft);
    window.location.href = url;
  }
}
