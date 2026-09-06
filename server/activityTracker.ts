import fs from "fs";
import path from "path";

export interface UserActivityEntry {
  id: string;
  userName: string;
  userEmail: string;
  quantumId?: string;
  role?: string;
  action: string;
  category: "auth" | "stem" | "support" | "review" | "navigation" | "system";
  details?: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

const DATA_DIR = path.join(process.cwd(), "server", "data");
const ACTIVITY_FILE = path.join(DATA_DIR, "user_activity.json");

function ensureActivityStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ACTIVITY_FILE)) {
      // Start with completely clean, honest storage - only real user sessions
      const initialLogs: UserActivityEntry[] = [];
      fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(initialLogs, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not initialize activity storage directory:", err);
  }
}

export function saveUserActivity(entry: Omit<UserActivityEntry, "id" | "timestamp">): UserActivityEntry {
  try {
    ensureActivityStorage();
    let list: UserActivityEntry[] = [];
    if (fs.existsSync(ACTIVITY_FILE)) {
      const raw = fs.readFileSync(ACTIVITY_FILE, "utf-8");
      list = JSON.parse(raw || "[]");
    }

    const newEntry: UserActivityEntry = {
      id: `ACT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userName: entry.userName || "Anonymous User",
      userEmail: entry.userEmail || "anonymous@quantum.app",
      quantumId: entry.quantumId || "QUANTUM-USER",
      role: entry.role || "User",
      action: entry.action || "Active Session",
      category: entry.category || "system",
      details: entry.details || "",
      timestamp: new Date().toISOString(),
      userAgent: entry.userAgent || "Web Browser",
      ip: entry.ip || "127.0.0.1",
    };

    // Add to the front of list (newest first)
    list.unshift(newEntry);

    // Keep last 500 entries to prevent infinite growth
    if (list.length > 500) {
      list = list.slice(0, 500);
    }

    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(list, null, 2), "utf-8");
    return newEntry;
  } catch (err) {
    console.error("Error saving user activity:", err);
    throw err;
  }
}

export function getUserActivities(limit = 100): UserActivityEntry[] {
  try {
    ensureActivityStorage();
    if (fs.existsSync(ACTIVITY_FILE)) {
      const raw = fs.readFileSync(ACTIVITY_FILE, "utf-8");
      const list: UserActivityEntry[] = JSON.parse(raw || "[]");
      return list.slice(0, limit);
    }
  } catch (err) {
    console.error("Error reading user activity:", err);
  }
  return [];
}
