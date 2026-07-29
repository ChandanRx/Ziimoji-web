"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Bookmark } from "lucide-react";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import AnimatedEmoji from "@/component/AnimatedEmoji";
import { moods } from "@/lib/moods";
import { feed } from "@/lib/mockData";

export default function BookmarksPage() {
  // Treat every post the seed marked bookmarked, plus a few, as "saved".
  const saved = useMemo(
    () => feed.map((p, i) => ({ ...p, isBookmarked: true, id: `saved-${i}` })).slice(0, 8),
    []
  );
  const [activeMood, setActiveMood] = useState<string>("All");

  const usedMoods = Array.from(new Set(saved.map((p) => p.mood)));
  const filterMoods = moods.filter((m) => usedMoods.includes(m.label));

  const shown = activeMood === "All" ? saved : saved.filter((p) => p.mood === activeMood);

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        {/* Header */}
        <div className="sticky top-0 z-30 glass border-b border-[var(--line)]">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-[10px]" style={{ background: "var(--brand-grad)" }}>
                <Bookmark className="w-[17px] h-[17px] text-white" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold tracking-tight text-[var(--ink-900)] leading-none">Bookmarks</h1>
                <p className="text-[12.5px] text-[var(--ink-400)] mt-1">{saved.length} saved moods</p>
              </div>
            </div>

            {/* Mood filter chips */}
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setActiveMood("All")}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors"
                style={
                  activeMood === "All"
                    ? { background: "var(--brand-grad)", color: "#fff" }
                    : { background: "var(--canvas)", color: "var(--ink-500)" }
                }
              >
                All
              </button>
              {filterMoods.map((m) => {
                const active = activeMood === m.label;
                return (
                  <button
                    key={m.label}
                    onClick={() => setActiveMood(m.label)}
                    className="shrink-0 flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-transform hover:scale-105"
                    style={{
                      background: active ? m.accent : m.chip,
                      color: active ? "#fff" : m.accent,
                    }}
                  >
                    <AnimatedEmoji src={m.lottie} size={16} label={m.label} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5">
          {shown.length ? (
            <div className="space-y-5">
              {shown.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.35, ease: "easeOut" }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-50)]">
                <Bookmark className="w-6 h-6 text-[var(--brand-600)]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[var(--ink-700)]">No saved moods yet</p>
                <p className="text-[13px] text-[var(--ink-400)] mt-1 max-w-[34ch]">
                  Tap the bookmark on any post to keep it here for later.
                </p>
              </div>
              <Link
                href="/"
                className="mt-1 btn-brand px-5 py-2.5 rounded-full text-[13px] font-semibold text-white"
              >
                Explore the feed
              </Link>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
