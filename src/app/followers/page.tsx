"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, BadgeCheck, Search, UserPlus } from "lucide-react";
import RightSidebar from "@/component/RightSidebar";
import { getGenre } from "@/lib/genres";
import { people, currentUser, type Person } from "@/lib/mockData";

const tabs = ["followers", "following"] as const;
type Tab = (typeof tabs)[number];

function PersonRow({ person }: { person: Person }) {
  const genre = getGenre(person.genre);
  const GenreIcon = genre.Icon;
  const [following, setFollowing] = useState(person.isFollowing ?? false);
  const isSelf = person.id === currentUser.id;

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-[var(--canvas)] transition-colors">
      <Link href={`/profile/${person.id}`} className="shrink-0">
        <span className="block rounded-full p-[2px]" style={{ background: genre.grad }}>
          <img src={person.avatar} alt="" className="block w-12 h-12 rounded-full object-cover ring-2 ring-white" />
        </span>
      </Link>

      <Link href={`/profile/${person.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-semibold text-[var(--ink-900)] truncate">{person.name}</span>
          {person.isVerified && (
            <BadgeCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="currentColor" stroke="white" />
          )}
          <span
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold shrink-0"
            style={{ background: genre.chip, color: genre.accent }}
          >
            <GenreIcon className="w-3 h-3" strokeWidth={2.2} />
            {genre.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--ink-400)]">
          <span className="truncate">@{person.username}</span>
          {person.followsYou && (
            <span className="px-1.5 py-0.5 rounded bg-[var(--canvas)] text-[10.5px] font-medium">Follows you</span>
          )}
        </div>
        <p className="mt-0.5 text-[12.5px] text-[var(--ink-500)] truncate max-w-[38ch]">{person.bio}</p>
      </Link>

      {!isSelf && (
        <button
          onClick={() => setFollowing((f) => !f)}
          className={`shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold transition-colors ${
            following
              ? "border border-[var(--line)] text-[var(--ink-700)] hover:border-rose-300 hover:text-rose-600"
              : "btn-brand"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

function FollowersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("followers");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = params.get("tab");
    if (t === "following") setTab("following");
  }, [params]);

  const setActive = (t: Tab) => {
    setTab(t);
    router.replace(`/followers?tab=${t}`);
  };

  // Followers ≈ people who follow you; Following ≈ people you follow.
  const followers = people.filter((p) => p.id !== currentUser.id && (p.followsYou || Number(p.id.length) % 2 === 0));
  const following = people.filter((p) => p.id !== currentUser.id && p.isFollowing);
  const list = (tab === "followers" ? followers : following).filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        {/* Header */}
        <div className="sticky top-0 z-30 glass border-b border-[var(--line)]">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center gap-4 py-3">
              <Link
                href={`/profile/${currentUser.id}`}
                aria-label="Back"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.045] transition-colors"
              >
                <ArrowLeft className="w-[18px] h-[18px] text-[var(--ink-700)]" />
              </Link>
              <div>
                <h1 className="text-[17px] font-bold text-[var(--ink-900)]">{currentUser.name}</h1>
                <p className="text-[12px] text-[var(--ink-400)]">@{currentUser.username}</p>
              </div>
            </div>
            <div className="flex">
              {tabs.map((t) => {
                const active = t === tab;
                const count = t === "followers" ? followers.length : following.length;
                return (
                  <button
                    key={t}
                    onClick={() => setActive(t)}
                    className="relative flex-1 py-3 text-[13.5px] font-semibold capitalize transition-colors"
                    style={{ color: active ? "var(--brand-600)" : "var(--ink-400)" }}
                  >
                    {t} <span className="text-[var(--ink-400)] font-medium">· {count}</span>
                    {active && (
                      <motion.span
                        layoutId="followers-tab"
                        className="absolute bottom-0 inset-x-10 h-[3px] rounded-t-full"
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

        <div className="max-w-2xl mx-auto px-4 py-5">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white rounded-[16px] px-4 py-3 border border-[var(--line)] mb-4">
            <Search className="shrink-0 w-4 h-4 text-[var(--ink-400)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tab}…`}
              className="flex-1 bg-transparent text-[14px] text-[var(--ink-900)] placeholder-[var(--ink-400)] focus:outline-none"
            />
          </div>

          {list.length ? (
            <div className="space-y-1">
              {list.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-50)]">
                <UserPlus className="w-5 h-5 text-[var(--brand-600)]" />
              </div>
              <p className="text-[14px] font-semibold text-[var(--ink-700)]">Nothing here yet</p>
              <p className="text-[12.5px] text-[var(--ink-400)]">
                {query ? "No people match your search." : `No ${tab} to show.`}
              </p>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}

export default function FollowersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-[var(--ink-400)] text-sm">Loading…</div>
        </div>
      }
    >
      <FollowersContent />
    </Suspense>
  );
}
