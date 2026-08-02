"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Flame, TrendingUp, Hash } from "lucide-react";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import { genres } from "@/lib/genres";
import { feed } from "@/lib/mockData";

const hashtags = [
  { tag: "#HauntedHouses",  posts: "12.5K", change: "+24%", hot: true  },
  { tag: "#CursedObjects",  posts: "8.9K",  change: "+11%", hot: false },
  { tag: "#TrueParanormal", posts: "6.2K",  change: "+38%", hot: true  },
  { tag: "#3AMStories",     posts: "3.1K",  change: "+52%", hot: true  },
  { tag: "#DeepWoods",      posts: "2.7K",  change: "+9%",  hot: false },
  { tag: "#SlenderSightings", posts: "4.7K", change: "+6%", hot: false },
];

const genrePulse = genres.map((g, i) => ({
  ...g,
  posts: `${(28 - i * 2).toFixed(1)}K`,
  pct: 92 - i * 8,
}));

const filters = ["Top", "Latest", "Genres", "Tags"] as const;

export default function TrendingPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Top");

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        {/* Header */}
        <div className="sticky top-0 z-30 glass border-b border-[var(--line)]">
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-[10px]" style={{ background: "var(--brand-grad)" }}>
                <Flame className="w-[18px] h-[18px] text-[var(--brand-ink)]" />
              </div>
              <h1 className="text-[22px] font-bold tracking-tight text-[var(--ink-900)]">Trending</h1>
            </div>
            <div className="flex gap-1 mt-2">
              {filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="relative px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
                    style={{ color: active ? "var(--brand-600)" : "var(--ink-400)" }}
                  >
                    {f}
                    {active && (
                      <motion.span
                        layoutId="trending-tab"
                        className="absolute bottom-0 inset-x-2 h-[3px] rounded-t-full"
                        style={{ background: "var(--brand-grad)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">
          {/* Trending hashtags */}
          {(filter === "Top" || filter === "Tags") && (
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <Hash className="w-4 h-4 text-[var(--brand-600)]" />
                <h2 className="text-[14px] font-bold text-[var(--ink-900)]">Trending tags</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hashtags.map((h, i) => (
                  <Link
                    key={h.tag}
                    href={`/search?q=${encodeURIComponent(h.tag)}`}
                    className="flex items-center justify-between px-4 py-3 rounded-[16px] bg-[var(--surface)] border border-[var(--line)] hover:shadow-[var(--shadow-md)] transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-[var(--ink-400)] w-4">{i + 1}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-semibold text-[var(--ink-900)]">{h.tag}</span>
                          {h.hot && (
                            <span className="flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600">
                              <Flame className="w-2.5 h-2.5" /> HOT
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-[var(--ink-400)]">{h.posts} tales</span>
                      </div>
                    </div>
                    <span className="text-[12.5px] font-semibold text-emerald-600">{h.change}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Genre pulse bars */}
          {(filter === "Top" || filter === "Genres") && (
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4 text-[var(--brand-600)]" />
                <h2 className="text-[14px] font-bold text-[var(--ink-900)]">Genre pulse</h2>
              </div>
              <div className="p-4 rounded-[18px] bg-[var(--surface)] border border-[var(--line)] space-y-3">
                {genrePulse.map((g, i) => {
                  const Icon = g.Icon;
                  return (
                    <Link key={g.label} href={`/search?q=${encodeURIComponent(g.label)}`} className="flex items-center gap-3 group">
                      <div className="flex items-center gap-2 w-32 shrink-0">
                        <span
                          className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                          style={{ background: g.chip, color: g.accent }}
                        >
                          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </span>
                        <span className="text-[13px] font-semibold text-[var(--ink-700)]">{g.label}</span>
                      </div>
                      <div className="flex-1 h-2.5 rounded-full bg-[var(--canvas)] overflow-hidden">
                        <motion.span
                          className="block h-full rounded-full"
                          style={{ background: g.grad }}
                          initial={{ width: 0 }}
                          animate={{ width: `${g.pct}%` }}
                          transition={{ delay: i * 0.06, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[12px] text-[var(--ink-400)] w-12 text-right tabular-nums">{g.posts}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hot tales */}
          {filter !== "Tags" && filter !== "Genres" && (
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <Flame className="w-4 h-4 text-orange-500" />
                <h2 className="text-[14px] font-bold text-[var(--ink-900)]">
                  {filter === "Latest" ? "Freshly told" : "Burning right now"}
                </h2>
              </div>
              <div className="space-y-5">
                {feed.map((post, index) => (
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
            </section>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
