"use client";

import Link from "next/link";
import { TrendingUp, BadgeCheck } from "lucide-react";
import { moods } from "@/lib/moods";
import AnimatedEmoji from "@/component/AnimatedEmoji";

interface RightSidebarProps {
  currentUser?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

const suggestions = [
  { id: "1", username: "emoji_lover",  name: "Emoji Lover",  avatar: "https://i.pravatar.cc/120?img=1", isVerified: false },
  { id: "2", username: "mood_master",  name: "Mood Master",  avatar: "https://i.pravatar.cc/120?img=2", isVerified: true },
  { id: "3", username: "happy_vibes",  name: "Happy Vibes",  avatar: "https://i.pravatar.cc/120?img=3", isVerified: false },
  { id: "4", username: "cool_emojis",  name: "Cool Emojis",  avatar: "https://i.pravatar.cc/120?img=4", isVerified: false },
];

const trending = [
  { tag: "#MorningVibes", posts: "12.5K", mood: "Happy" },
  { tag: "#LateNight",    posts: "8.9K",  mood: "Bored" },
  { tag: "#Grateful",     posts: "6.2K",  mood: "Excited" },
  { tag: "#Overthinking", posts: "4.7K",  mood: "Sad" },
];

const RightSidebar = ({ currentUser }: RightSidebarProps) => {
  const user = currentUser ?? {
    id: "123",
    name: "Chandan",
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  return (
    <aside className="hidden lg:block w-80 h-screen fixed right-0 top-0 overflow-y-auto no-scrollbar border-l border-[var(--line)] bg-white">
      <div className="p-5 space-y-4">
        {/* Profile */}
        <Link
          href={`/profile/${user.id}`}
          className="flex items-center gap-3 p-3 rounded-sm border border-[var(--line)] hover:bg-[var(--canvas)] transition-colors group"
        >
          <div className="relative shrink-0">
            <span className="block rounded-full p-[2px]" style={{ background: "var(--brand-grad)" }}>
              <img
                src={user.avatar}
                alt=""
                width={46}
                height={46}
                className="rounded-full object-cover block ring-2 ring-white"
              />
            </span>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[var(--ink-900)] text-[14px] truncate">
              {user.username}
            </div>
            <div className="text-[12.5px] text-[var(--ink-400)] truncate">{user.name}</div>
          </div>
          <span className="text-[12px] font-semibold grad-text shrink-0">View</span>
        </Link>

        {/* Mood pulse — a small burst of colour */}
        <section className="p-4 rounded-sm border border-[var(--line)]">
          <h3 className="text-[13px] font-semibold text-[var(--ink-700)] mb-3">
            Mood pulse
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {moods.slice(0, 8).map((mood) => (
              <Link
                key={mood.label}
                href={`/search?q=${encodeURIComponent(mood.label)}`}
                title={mood.label}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-transform hover:scale-105"
                style={{ background: mood.chip, color: mood.accent }}
              >
                <AnimatedEmoji src={mood.lottie} size={16} label={mood.label} />
                {mood.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <section className="p-4 rounded-sm border border-[var(--line)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-[var(--ink-700)]">Suggested for you</h3>
            <button className="text-[11.5px] font-medium text-[var(--ink-400)] hover:text-[var(--ink-700)] transition-colors">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-center gap-2.5 group">
                <Link href={`/profile/${s.id}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                  <img
                    src={s.avatar}
                    alt=""
                    width={34}
                    height={34}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-[13px] text-[var(--ink-900)] truncate group-hover:underline">
                        {s.username}
                      </span>
                      {s.isVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="currentColor" stroke="white" />
                      )}
                    </div>
                    <div className="text-[11.5px] text-[var(--ink-400)] truncate">{s.name}</div>
                  </div>
                </Link>
                <button className="shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-semibold border border-[var(--line)] text-[var(--brand-600)] hover:bg-[var(--brand-50)] transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="p-4 rounded-sm border border-[var(--line)]">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <h3 className="text-[13px] font-semibold text-[var(--ink-700)]">Trending moods</h3>
          </div>

          <div className="space-y-1">
            {trending.map((t, i) => (
              <Link
                key={t.tag}
                href={`/search?q=${encodeURIComponent(t.tag)}`}
                className="flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-xl hover:bg-[var(--canvas)] transition-colors"
              >
                <span className="text-[11px] font-bold text-[var(--ink-400)] w-3">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--ink-900)] truncate">
                    {t.tag}
                  </div>
                  <div className="text-[11.5px] text-[var(--ink-400)]">{t.posts} posts</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="px-1 pb-4">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[var(--ink-400)] mb-2">
            {["About", "Help", "Privacy", "Terms", "Jobs", "API"].map((l) => (
              <a key={l} href="#" className="hover:text-[var(--ink-700)] transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div className="text-[11px] text-[var(--ink-400)]">&copy; 2025 Zimoji</div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
