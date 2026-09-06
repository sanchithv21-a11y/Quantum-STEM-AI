import fs from "fs";
import path from "path";

export interface UserReview {
  id: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  category: string;
  timestamp: string;
  verified: boolean;
  status: "approved" | "pending";
}

const DATA_DIR = path.join(process.cwd(), "server", "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

function ensureReviewsStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(REVIEWS_FILE)) {
      // Start with completely clean, honest storage - only real user submitted reviews
      const initialReviews: UserReview[] = [];
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(initialReviews, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not initialize reviews storage directory:", err);
  }
}

export function getReviews(): UserReview[] {
  try {
    ensureReviewsStorage();
    if (fs.existsSync(REVIEWS_FILE)) {
      const raw = fs.readFileSync(REVIEWS_FILE, "utf-8");
      return JSON.parse(raw || "[]");
    }
  } catch (err) {
    console.error("Error reading reviews:", err);
  }
  return [];
}

export function saveReview(review: Omit<UserReview, "id" | "timestamp" | "verified" | "status">): UserReview {
  try {
    ensureReviewsStorage();
    let list: UserReview[] = [];
    if (fs.existsSync(REVIEWS_FILE)) {
      const raw = fs.readFileSync(REVIEWS_FILE, "utf-8");
      list = JSON.parse(raw || "[]");
    }

    const newReview: UserReview = {
      id: `REV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userName: review.userName || "Verified User",
      userEmail: review.userEmail || "user@quantum.app",
      rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
      title: review.title || "User Review",
      comment: review.comment || "",
      category: review.category || "General",
      timestamp: new Date().toISOString(),
      verified: true,
      status: "approved",
    };

    list.unshift(newReview);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(list, null, 2), "utf-8");
    return newReview;
  } catch (err) {
    console.error("Error saving review:", err);
    throw err;
  }
}

export function getReviewStats() {
  const reviews = getReviews();
  const total = reviews.length;
  if (total === 0) {
    return {
      total: 0,
      average: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
  const average = Number((sum / total).toFixed(1));

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
  });

  return { total, average, distribution };
}
