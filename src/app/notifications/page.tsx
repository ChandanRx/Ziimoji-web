"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, MessageCircle, UserPlus, AtSign, Repeat2, Bell, type LucideIcon } from "lucide-react";
import RightSidebar from "@/component/RightSidebar";
import { getGenre } from "@/lib/genres";
import { people } from "@/lib/mockData";

type NotifType = "like" | "comment" | "follow" | "mention" | "repost";

interface Notif {
  id: string;
  type: NotifType;
  personId: string;
  text: string;
  time: string;
  genre?: string;
  postId?: string;
  unread: boolean;
}

const meta: Record<NotifType, { Icon: LucideIcon; color: string; bg: string }> = {
  like:    { Icon: Heart,         color: "#ec4899", bg: "#fce7f3" },
  comment: { Icon: MessageCircle, color: "#7c5cff", bg: "#f2eeff" },
  follow:  { Icon: UserPlus,      color: "#10b981", bg: "#d1fae5" },
  mention: { Icon: AtSign,        color: "#0ea5e9", bg: "#e0f2fe" },
  repost:  { Icon: Repeat2,       color: "#f59e0b", bg: "#fef3c7" },
};

const notifs: Notif[] = [
  { id: "n1", type: "like",    personId: "user1", text: "liked your tale", time: "2m",  genre: "Haunting",   postId: "1", unread: true },
  { id: "n2", type: "follow",  personId: "user2", text: "started following you", time: "14m", unread: true },
  { id: "n3", type: "comment", personId: "user6", text: "commented: \"this gave me chills 🕯️\"", time: "38m", genre: "Haunting", postId: "1", unread: true },
  { id: "n4", type: "mention", personId: "user3", text: "mentioned you in a tale", time: "1h", genre: "Paranormal", postId: "2", unread: false },
  { id: "n5", type: "repost",  personId: "user7", text: "reblogged your story", time: "2h", genre: "Gore", postId: "2", unread: false },
  { id: "n6", type: "like",    personId: "user4", text: "and 24 others liked your tale", time: "3h", genre: "Cursed", postId: "1", unread: false },
  { id: "n7", type: "follow",  personId: "user9", text: "started following you", time: "5h", unread: false },
  { id: "n8", type: "comment", personId: "user5", text: "commented: \"I had to read this with the lights on 💀\"", time: "8h", genre: "Unsettling", postId: "2", unread: false },
];

const filters = ["All", "Mentions", "Follows"] as const;

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>(notifs);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const personOf = (id: string) => people.find((p) => p.id === id) ?? people[1];

  const filtered = items.filter((n) =>
    filter === "All" ? true : filter === "Mentions" ? n.type === "mention" : n.type === "follow"
  );
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        {/* Header */}
        <div className="sticky top-0 z-30 glass border-b border-[var(--line)]">
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-[10px]" style={{ background: "var(--brand-grad)" }}>
                  <Bell className="w-[17px] h-[17px] text-[var(--brand-ink)]" />
                </div>
                <h1 className="text-[22px] font-bold tracking-tight text-[var(--ink-900)]">Notifications</h1>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[12.5px] font-semibold text-[var(--brand-600)] hover:underline"
                >
                  Mark all read
                </button>
              )}
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
                        layoutId="notif-tab"
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

        <div className="max-w-2xl mx-auto px-4 py-4">
          {filtered.length ? (
            <div className="space-y-1.5">
              {filtered.map((n, index) => {
                const person = personOf(n.personId);
                const { Icon, color, bg } = meta[n.type];
                const genre = n.genre ? getGenre(n.genre) : null;
                const GenreIcon = genre?.Icon ?? null;
                const href = n.type === "follow" ? `/profile/${person.id}` : `/post/${n.postId ?? "1"}`;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 px-3 py-3 rounded-[16px] transition-colors hover:bg-[var(--canvas)]"
                      style={{ background: n.unread ? "var(--brand-50)" : undefined }}
                    >
                      {/* Avatar with type badge */}
                      <div className="relative shrink-0">
                        <img src={person.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <span
                          className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white"
                          style={{ background: bg }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color }} fill={n.type === "like" ? color : "none"} />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] leading-snug text-[var(--ink-700)]">
                          <span className="font-semibold text-[var(--ink-900)]">{person.name}</span>{" "}
                          {n.text}
                        </p>
                        <span className="text-[12px] text-[var(--ink-400)]">{n.time} ago</span>
                      </div>

                      {genre && GenreIcon ? (
                        <span
                          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
                          style={{ background: genre.chip, color: genre.accent }}
                          title={genre.label}
                        >
                          <GenreIcon className="w-4 h-4" strokeWidth={2.2} />
                        </span>
                      ) : n.type === "follow" ? (
                        <span className="shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold btn-brand">
                          Follow
                        </span>
                      ) : null}

                      {n.unread && <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--brand-600)]" />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-24 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-50)]">
                <Bell className="w-6 h-6 text-[var(--brand-600)]" />
              </div>
              <p className="text-[15px] font-semibold text-[var(--ink-700)]">You&apos;re all caught up</p>
              <p className="text-[13px] text-[var(--ink-400)]">No {filter.toLowerCase()} notifications right now.</p>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
