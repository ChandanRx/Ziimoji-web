"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search, X, Smile, Frown, Angry, Heart,
  Sparkles, SunMedium, Laugh, Zap,
  TrendingUp, Clock,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const moodSuggestions = [
  { label: "Happy",     Icon: Smile,     accent: "#d97706", bg: "#fef9c3" },
  { label: "Sad",       Icon: Frown,     accent: "#4f46e5", bg: "#e0e7ff" },
  { label: "Angry",     Icon: Angry,     accent: "#dc2626", bg: "#fee2e2" },
  { label: "Love",      Icon: Heart,     accent: "#db2777", bg: "#fce7f3" },
  { label: "Excited",   Icon: Sparkles,  accent: "#ea580c", bg: "#fed7aa" },
  { label: "Cool",      Icon: SunMedium, accent: "#0891b2", bg: "#bae6fd" },
  { label: "Funny",     Icon: Laugh,     accent: "#9333ea", bg: "#e9d5ff" },
  { label: "Surprised", Icon: Zap,       accent: "#059669", bg: "#a7f3d0" },
];

const trendingTags = ["#MorningVibes", "#LateNight", "#GoodDay", "#Overthinking", "#Grateful"];

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-slate-900/40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[8vh] left-1/2 -translate-x-1/2 w-full max-w-xl mx-4 z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
              {/* Search input */}
              <div className="p-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Search Zi!moji
                  </span>
                  <div className="flex-1" />
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search moods, stories, people…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-[14px] font-medium outline-none bg-slate-50 border border-slate-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 text-slate-800 placeholder-slate-400 transition-shadow"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mx-5 h-px bg-slate-100" />

              {/* Mood suggestions */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Browse by Mood
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {moodSuggestions.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleSearch(mood.label)}
                      className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg"
                        style={{ background: mood.bg }}
                      >
                        <mood.Icon className="w-4 h-4" style={{ color: mood.accent }} />
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mx-5 h-px bg-slate-100" />

              {/* Trending */}
              <div className="px-5 pt-3.5 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Trending
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-400">
                    ESC
                  </kbd>
                  <span className="text-[11px] text-slate-400">to close</span>
                  <span className="mx-1 text-slate-300">·</span>
                  <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-400">
                    ↵
                  </kbd>
                  <span className="text-[11px] text-slate-400">to search</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
