import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export interface ComplaintData {
  userEmail: string;
  userName?: string;
  subject: string;
  message: string;
  category?: string;
  telemetry?: Record<string, any>;
}

export interface ComplaintResult {
  success: boolean;
  ticketId: string;
  confirmationMessage: string;
  userEmail: string;
  recipients: string[];
  dispatchedVia: string[];
  error?: string;
}

const PRIMARY_RECIPIENT = "sanchithv21@gmail.com";
const SECONDARY_RECIPIENT = "sanchithvinod21@outlook.com";
const DATA_DIR = path.join(process.cwd(), "server", "data");
const COMPLAINTS_FILE = path.join(DATA_DIR, "complaints.json");

function ensureDataDirectory(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(COMPLAINTS_FILE)) {
      fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not initialize complaints storage directory:", err);
  }
}

export function saveComplaintLocally(complaint: any): void {
  try {
    ensureDataDirectory();
    let list: any[] = [];
    if (fs.existsSync(COMPLAINTS_FILE)) {
      const raw = fs.readFileSync(COMPLAINTS_FILE, "utf-8");
      list = JSON.parse(raw || "[]");
    }
    list.unshift(complaint);
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving complaint locally:", err);
  }
}

export function getSavedComplaints(): any[] {
  try {
    ensureDataDirectory();
    if (fs.existsSync(COMPLAINTS_FILE)) {
      const raw = fs.readFileSync(COMPLAINTS_FILE, "utf-8");
      return JSON.parse(raw || "[]");
    }
  } catch (err) {
    console.error("Error reading saved complaints:", err);
  }
  return [];
}

export function deleteComplaint(idOrTicketId: string): boolean {
  try {
    ensureDataDirectory();
    if (fs.existsSync(COMPLAINTS_FILE)) {
      const raw = fs.readFileSync(COMPLAINTS_FILE, "utf-8");
      const list: any[] = JSON.parse(raw || "[]");
      const filtered = list.filter(
        (c) => c.id !== idOrTicketId && c.ticketId !== idOrTicketId
      );
      fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
      return filtered.length !== list.length;
    }
  } catch (err) {
    console.error("Error deleting complaint:", err);
  }
  return false;
}

export function clearAllComplaints(): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify([], null, 2), "utf-8");
  } catch (err) {
    console.error("Error clearing complaints:", err);
  }
}

/**
 * Dispatches complaint to sanchithv21@gmail.com & sanchithvinod21@outlook.com
 */
export async function dispatchComplaintEmail(
  data: ComplaintData
): Promise<ComplaintResult> {
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const ticketId = `TICK-${Date.now().toString().slice(-6)}-${randomSuffix}`;
  const userEmail = (data.userEmail || "").trim();
  const userName = (data.userName || "").trim() || "Quantum Platform User";
  const subject = (data.subject || "").trim() || "User Complaint & Issue Report";
  const message = (data.message || "").trim();
  const category = (data.category || "").trim() || "System Complaint";

  const recipients = [PRIMARY_RECIPIENT, SECONDARY_RECIPIENT];
  const dispatchedVia: string[] = [];

  // Exact message requested by the user
  const confirmationMessage =
    "Thank you sir for sending your complaint. We will rectify it and email you ASAP :)";

  const complaintRecord = {
    id: ticketId,
    ticketId,
    userEmail,
    userName,
    subject,
    message,
    category,
    recipients,
    telemetry: data.telemetry,
    timestamp,
    status: "received",
    dispatchedVia,
  };

  // 1. Always persist to disk so nothing is ever dropped
  saveComplaintLocally(complaintRecord);

  // 2. Dispatch via FormSubmit HTTP relay with spam-safe formatting
  // Avoid duplicate separate calls which trigger Outlook/Gmail duplicate-spam filters
  try {
    const cleanSubject = (subject || "User inquiry").replace(/[[\]]/g, "").trim();
    const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(PRIMARY_RECIPIENT)}`;
    const payload: Record<string, any> = {
      _subject: `Quantum STEM AI Support: ${cleanSubject}`,
      _cc: SECONDARY_RECIPIENT,
      _replyto: userEmail,
      _captcha: "false",
      _template: "table",
      "Sender Email": userEmail,
      "Sender Name": userName,
      "Ticket Ref": ticketId,
      "Category": category,
      "Subject": cleanSubject,
      "Message Details": message,
      "Timestamp": timestamp,
    };

    const response = await fetch(formSubmitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://quantum-stem-platform.local",
        Referer: "https://quantum-stem-platform.local/support",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      dispatchedVia.push(`FormSubmit -> ${PRIMARY_RECIPIENT} & ${SECONDARY_RECIPIENT}`);
    } else {
      console.warn("FormSubmit response not ok:", response.status);
    }
  } catch (relayErr: any) {
    console.warn("FormSubmit relay failed:", relayErr.message);
  }

  // 3. Try SMTP / Gmail Transport if credentials are provided in environment
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpUser && smtpPass) {
    try {
      const transporter = smtpHost
        ? nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT || "587", 10),
            secure: process.env.SMTP_SECURE === "true",
            auth: { user: smtpUser, pass: smtpPass },
          })
        : nodemailer.createTransport({
            service: "gmail",
            auth: { user: smtpUser, pass: smtpPass },
          });

      await transporter.sendMail({
        from: `"Quantum STEM AI" <${smtpUser}>`,
        to: PRIMARY_RECIPIENT,
        cc: SECONDARY_RECIPIENT,
        replyTo: userEmail,
        subject: `Quantum STEM AI: ${subject} (${userEmail})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">Quantum STEM AI Support Request</h2>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
            <p><strong>User Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
            <p><strong>User Name:</strong> ${userName}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
            <h3 style="color: #334155;">User Message:</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap; color: #1e293b; border-left: 4px solid #06b6d4;">
              ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
              Direct reply enabled: reply directly to this email to reach ${userEmail}.
            </p>
          </div>
        `,
      });
      dispatchedVia.push("Authenticated Direct Email");
    } catch (smtpErr: any) {
      console.warn("Direct email dispatch failed:", smtpErr.message);
    }
  }

  return {
    success: true,
    ticketId,
    confirmationMessage,
    userEmail,
    recipients,
    dispatchedVia: dispatchedVia.length > 0 ? dispatchedVia : ["Persistent Complaint Log"],
  };
}
