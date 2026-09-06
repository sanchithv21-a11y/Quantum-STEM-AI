import React, { useState } from "react";
import {
  Star,
  Send,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Mail,
  Filter,
  Sparkles,
  Award,
} from "lucide-react";
import { UserReview, AuthUser } from "../types";

interface ReviewsTabProps {
  reviews: UserReview[];
  stats: {
    total: number;
    average: number;
    distribution: Record<number, number>;
  };
  isLoading: boolean;
  onRefresh: () => void;
  onContactUser: (email: string, name?: string, subject?: string) => void;
  currentUser?: AuthUser | null;
  onReviewSubmitted: () => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  stats,
  isLoading,
  onRefresh,
  onContactUser,
  currentUser,
  onReviewSubmitted,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState(currentUser?.name || "");
  const [userEmail, setUserEmail] = useState(currentUser?.email || "");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("General App Experience");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    "All",
    "General App Experience",
    "STEM Math & Physics",
    "Voice AI & Speed",
    "UI & Design",
  ];

  const ratingLabels: Record<number, string> = {
    5: "5 Stars - Exceptional & Accurate",
    4: "4 Stars - Great STEM Experience",
    3: "3 Stars - Good with minor suggestions",
    2: "2 Stars - Needs Improvement",
    1: "1 Star - Unsatisfactory",
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedCategory === "All") return true;
    return r.category === selectedCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailToUse = (userEmail || currentUser?.email || "").trim();
    if (!emailToUse) {
      setErrorMessage("Please enter your email so we can verify your review.");
      return;
    }

    if (!comment.trim()) {
      setErrorMessage("Please enter your review comments.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: (userName || currentUser?.name || "Quantum User").trim(),
          userEmail: emailToUse,
          rating,
          title: (title || "User Review").trim(),
          comment: comment.trim(),
          category,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess("Thank you sir! Your review has been recorded and published.");
        setTitle("");
        setComment("");
        setShowForm(false);
        onReviewSubmitted();
        setTimeout(() => setSubmitSuccess(null), 5000);
      } else {
        setErrorMessage(data.error || "Failed to submit review.");
      }
    } catch (err: any) {
      setErrorMessage("Network error while submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Notification */}
      {submitSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 flex items-center gap-2 text-xs animate-fade-in font-sans font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Reviews Summary Header */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-[#0A111E] to-[#070D18] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <div className="text-3xl font-black tracking-tight">
              {stats.total > 0 ? stats.average.toFixed(1) : "—"}
            </div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    stats.total > 0 && s <= Math.round(stats.average)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1 uppercase">
              {stats.total > 0 ? "Overall Rating" : "No Reviews Yet"}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Community &amp; STEM Reviews
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {stats.total} Total Reviews
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-1 max-w-md">
              Verified reviews from researchers, students, and practitioners utilizing Quantum AI for mathematics and physics.
            </p>

            {/* Micro star breakdown */}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="text-amber-400 font-bold">5★</span>
                <span>{stats.distribution[5] || 0}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-amber-400 font-bold">4★</span>
                <span>{stats.distribution[4] || 0}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-amber-400 font-bold">3★</span>
                <span>{stats.distribution[3] || 0}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#0E1624] hover:bg-[#151F30] border border-[#1E293B] text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Refresh Reviews"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form Drawer */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl border border-amber-500/40 bg-[#070D18] space-y-3.5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Share Your Review &amp; Experience</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Publicly displayed in Support Desk
            </span>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Star Picker */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">
              Select Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                    title={`${star} Star`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating ?? rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-300">
                {ratingLabels[hoverRating ?? rating]}
              </span>
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Gautham V"
                className="w-full px-3 py-2 rounded-lg bg-[#0A111E] border border-[#1E293B] text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-[#0A111E] border border-[#1E293B] text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A111E] border border-[#1E293B] text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="General App Experience">General App Experience</option>
                <option value="STEM Math & Physics">STEM Math &amp; Physics</option>
                <option value="Voice AI & Speed">Voice AI &amp; Speed</option>
                <option value="UI & Design">UI &amp; Design</option>
                <option value="Calculation Accuracy">Calculation Accuracy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Review Title / Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Good App &amp; Great STEM Experience"
              className="w-full px-3 py-2 rounded-lg bg-[#0A111E] border border-[#1E293B] text-white text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Your Review / Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here... How did Quantum AI help with your STEM calculations?"
              className="w-full px-3 py-2 rounded-lg bg-[#0A111E] border border-[#1E293B] text-white text-xs focus:border-amber-400 focus:outline-none resize-none font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-2 rounded-lg bg-[#0E1624] border border-[#1E293B] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-bold uppercase text-slate-500">Filter Topic:</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-[#0E1624] text-slate-400 hover:text-white border border-[#1E293B]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table / Column Display */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0A111E] overflow-hidden">
        {/* Table Column Headers */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#080E1A] border-b border-[#1E293B] text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          <div className="col-span-3">Reviewer</div>
          <div className="col-span-2">Rating</div>
          <div className="col-span-4">Review &amp; Feedback</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-white">No reviews posted yet</div>
              <p className="text-[11px] text-slate-400 font-sans max-w-sm mx-auto">
                We believe in 100% honesty: all previous sample reviews have been removed. Any feedback shown here will be genuine, real reviews submitted by users.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Write the First Real Review</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1E293B]/70">
            {filteredReviews.map((rev) => {
              const formattedDate = new Date(rev.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedTime = new Date(rev.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={rev.id}
                  className="p-3.5 md:grid md:grid-cols-12 md:gap-2 items-start hover:bg-[#0E1624]/60 transition-colors space-y-2 md:space-y-0"
                >
                  {/* Column 1: Reviewer Info */}
                  <div className="md:col-span-3 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {rev.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                        <span>{rev.userName}</span>
                        {rev.verified && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" title="Verified STEM User" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate select-all">{rev.userEmail}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                        {rev.category}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Rating */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-700"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] font-bold text-amber-400 ml-1">
                        {rev.rating}.0
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                      Verified Review
                    </div>
                  </div>

                  {/* Column 3: The Review (Headline & Comment) */}
                  <div className="md:col-span-4 space-y-1">
                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>{rev.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Column 4: Time */}
                  <div className="md:col-span-2 text-[10px] font-mono text-slate-400">
                    <div className="text-white font-medium">{formattedDate}</div>
                    <div className="text-slate-500">{formattedTime}</div>
                  </div>

                  {/* Column 5: Action (Email Reviewer) */}
                  <div className="md:col-span-1 flex md:justify-end items-center">
                    <button
                      type="button"
                      onClick={() =>
                        onContactUser(
                          rev.userEmail,
                          rev.userName,
                          `Thank you for your review on Quantum AI: "${rev.title}"`
                        )
                      }
                      className="px-2 py-1 rounded bg-[#0E1624] hover:bg-cyan-500 hover:text-slate-950 border border-[#1E293B] hover:border-cyan-400 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Contact Reviewer via Gmail or Outlook"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Reply</span>
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
