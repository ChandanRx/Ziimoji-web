"use client";

import Link from "next/link";
import { TrendingUp, BadgeCheck } from "lucide-react";

interface RightSidebarProps {
  currentUser?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

const suggestions = [
  { id: "1", username: "grave_whispers", name: "Ada Mourne",   avatar: "https://i.pravatar.cc/120?img=1",  isVerified: false },
  { id: "2", username: "hollow_man",     name: "Kai Vesper",   avatar: "https://i.pravatar.cc/120?img=2",  isVerified: true },
  { id: "3", username: "the_static",     name: "Sol Vane",     avatar: "https://i.pravatar.cc/120?img=3",  isVerified: false },
  { id: "4", username: "red_room",       name: "Rin Marrow",   avatar: "https://i.pravatar.cc/120?img=4",  isVerified: false },
];

const trending = [
  { tag: "#LateNightReads", posts: "12.5K" },
  { tag: "#MorningPages", posts: "8.9K" },
  { tag: "#ShortStories", posts: "6.2K" },
  { tag: "#VoiceDrafts", posts: "4.7K" },
];

const RightSidebar = ({ currentUser }: RightSidebarProps) => {
  const user = currentUser ?? {
    id: "123",
    name: "Chandan",
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  return (
    <aside className="hidden lg:block w-[340px] h-screen fixed right-0 top-0 overflow-y-auto no-scrollbar border-l border-[var(--line)]">
      <div className="p-5 divide-y divide-[var(--line)]">
        {/* Profile */}
        <Link
          href={`/profile/${user.id}`}
          className="flex items-center gap-3 pb-5 group"
        >
          <div className="relative shrink-0">
            <span className="block rounded-full p-[2.5px]" style={{ background: "var(--ring-grad)" }}>
              <img
                src={user.avatar}
                alt=""
                width={48}
                height={48}
                className="rounded-full object-cover block ring-2 ring-[var(--surface)]"
              />
            </span>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--success)] ring-2 ring-[var(--surface)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[var(--ink-900)] text-[15px] truncate">
              {user.username}
            </div>
            <div className="text-[13px] text-[var(--ink-500)] truncate">{user.name}</div>
          </div>
          <span className="text-[13px] font-semibold text-[var(--brand-500)] shrink-0">View</span>
        </Link>

        {/* Writing prompts */}
        <section className="py-5">
          <h3 className="text-[15px] font-bold text-[var(--ink-900)] mb-3.5">
            Writing prompts
          </h3>
          <div className="flex flex-wrap gap-2">
            {["A train ride", "A missed call", "An old letter", "A rainy evening"].map((prompt) => (
              <Link
                key={prompt}
                href={`/search?q=${encodeURIComponent(prompt)}`}
                className="flex items-center rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-transform hover:scale-[1.04]"
                style={{ background: "var(--brand-50)", color: "var(--brand-500)" }}
              >
                {prompt}
              </Link>
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <section className="py-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[var(--ink-900)]">Suggested tellers</h3>
            <button className="text-[12.5px] font-medium text-[var(--ink-500)] hover:text-[var(--ink-900)] transition-colors">
              See all
            </button>
          </div>

          <div className="space-y-3.5">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 group">
                <Link href={`/profile/${s.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={s.avatar}
                    alt=""
                    width={38}
                    height={38}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-[14px] text-[var(--ink-900)] truncate group-hover:underline">
                        {s.username}
                      </span>
                      {s.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-[var(--info)] shrink-0" fill="currentColor" stroke="var(--surface)" />
                      )}
                    </div>
                    <div className="text-[12.5px] text-[var(--ink-500)] truncate">{s.name}</div>
                  </div>
                </Link>
                <button className="shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border border-[var(--brand-100)] text-[var(--brand-500)] hover:bg-[var(--brand-50)] transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="py-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-[18px] h-[18px] text-[var(--brand-500)]" strokeWidth={2.2} />
            <h3 className="text-[15px] font-bold text-[var(--ink-900)]">Trending stories</h3>
          </div>

          <div className="space-y-1">
            {trending.map((t, i) => (
              <Link
                key={t.tag}
                href={`/search?q=${encodeURIComponent(t.tag)}`}
                className="flex items-center gap-3 px-2.5 py-2.5 -mx-2.5 rounded-2xl hover:bg-[var(--canvas)] transition-colors"
              >
                <span className="text-[13px] font-bold text-[var(--brand-500)] w-3.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[var(--ink-900)] truncate">
                    {t.tag}
                  </div>
                  <div className="text-[12.5px] text-[var(--ink-500)]">{t.posts} tales</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="pt-5 pb-4">
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[12px] text-[var(--ink-400)] mb-2">
            {["About", "Help", "Privacy", "Terms", "Jobs", "API"].map((l) => (
              <a key={l} href="#" className="hover:text-[var(--ink-700)] transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div className="text-[12px] text-[var(--ink-400)]">&copy; 2025 Grimoire</div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
