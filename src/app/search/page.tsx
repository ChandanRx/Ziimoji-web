"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, TrendingUp, ArrowUpRight } from "lucide-react";
import RightSidebar from "@/component/RightSidebar";
import { genres } from "@/lib/genres";

const counts: Record<string, string> = {
  Haunting: "12.5k", Cursed: "8.2k", Paranormal: "15.7k", Gore: "5.1k", Unsettling: "6.9k",
};

const genreSuggestions = genres.map((g) => ({ ...g, count: counts[g.label] ?? "1k" }));

const trendingTopics = [
  { topic: "#HauntedHouses",   posts: "12.5K tales", trending: true,  change: "+24%" },
  { topic: "#CursedObjects",   posts: "8.9K tales",  trending: false, change: "+11%" },
  { topic: "#TrueParanormal",  posts: "6.2K tales",  trending: true,  change: "+38%" },
  { topic: "#ShadowPeople",    posts: "4.7K tales",  trending: false, change: "+6%"  },
  { topic: "#3AMStories",      posts: "3.1K tales",  trending: true,  change: "+52%" },
];

const SectionLabel = ({ label, sub }: { label: string; sub?: string }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-[13px] font-semibold text-[var(--ink-700)]">{label}</h2>
    {sub && <span className="text-xs text-[var(--ink-400)]">{sub}</span>}
  </div>
);

const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearch = (q: string) => {
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  const handleSuggestionClick = (s: string) => {
    setSearchQuery(s);
    handleSearch(s);
  };
  const handleClear = () => {
    setSearchQuery("");
    router.push("/search");
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--ink-900)] leading-tight">Discover Tales</h1>
            <p className="text-sm text-[var(--ink-500)] mt-1">
              Search genres, tellers &amp; trending stories
            </p>
          </div>

          {/* Search bar */}
          <div className="sticky top-2 z-20 mb-8 flex items-center gap-3 bg-[var(--surface)] rounded-[16px] px-4 py-3 border border-[var(--line)] shadow-[var(--shadow-sm)] focus-within:shadow-[var(--shadow-md)] transition-shadow">
            <Search className="shrink-0 w-4 h-4 text-[var(--ink-400)]" />
            <input
              type="text"
              placeholder="Search genres, authors, keywords…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              className="flex-1 bg-transparent text-sm text-[var(--ink-900)] placeholder-[var(--ink-400)] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </div>

          {searchQuery ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--brand-50)]">
                <Search className="w-6 h-6 text-[var(--brand-600)]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--ink-600)]">
                  No tales found for <span className="text-[var(--ink-900)]">&ldquo;{searchQuery}&rdquo;</span>
                </p>
                <p className="text-xs text-[var(--ink-400)] mt-1">Try a different genre or keyword</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Quick search */}
              <section>
                <SectionLabel label="Browse by Genre" sub={`${genreSuggestions.length} genres`} />
                <div className="grid grid-cols-2 gap-3">
                  {genreSuggestions.map((g) => {
                    const Icon = g.Icon;
                    return (
                      <button
                        key={g.label}
                        onClick={() => handleSuggestionClick(g.label)}
                        className="flex items-center gap-3 px-4 py-3 rounded-[16px] text-left w-full group bg-[var(--surface)] border border-[var(--line)] hover:shadow-[var(--shadow-md)] transition-shadow"
                      >
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                          style={{ background: g.chip, color: g.accent }}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-semibold text-[var(--ink-900)] leading-tight truncate">
                            {g.label}
                          </p>
                          <p className="text-[11.5px] text-[var(--ink-400)] mt-0.5 truncate">
                            {g.count} tales
                          </p>
                        </div>
                        <ArrowUpRight
                          className="shrink-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: g.accent }}
                        />
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Trending */}
              <section>
                <SectionLabel label="Trending Now" sub="Updated live" />
                <div className="space-y-2.5">
                  {trendingTopics.map((topic, i) => (
                    <button
                      key={topic.topic}
                      onClick={() => handleSuggestionClick(topic.topic)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand-100)] hover:shadow-[var(--shadow-sm)] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold w-5 text-center text-[var(--ink-400)]">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink-900)]">{topic.topic}</p>
                          <p className="text-xs text-[var(--ink-400)] mt-0.5">{topic.posts}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {topic.trending && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                            <TrendingUp className="w-2.5 h-2.5" /> HOT
                          </span>
                        )}
                        <span className="text-xs font-semibold text-emerald-600">{topic.change}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Live ticker */}
              <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-[var(--ink-500)]">Tellers active now</span>
                </div>
                <span className="text-sm font-semibold text-[var(--ink-900)] tabular-nums">
                  4,821
                  <span className="text-xs font-normal text-[var(--ink-400)] ml-1">tellers</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

const SearchPage = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    }
  >
    <SearchContent />
  </Suspense>
);

export default SearchPage;
