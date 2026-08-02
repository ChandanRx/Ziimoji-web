"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, BadgeCheck, CalendarDays, LinkIcon, MapPin,
  MessageCircle, Settings, Grid3x3, Heart, Image as ImageIcon,
} from "lucide-react";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import { getGenre } from "@/lib/genres";
import { getPerson, currentUser, buildPosts } from "@/lib/mockData";

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k` : `${n}`;

const tabs = [
  { key: "posts", label: "Posts", Icon: Grid3x3 },
  { key: "media", label: "Media", Icon: ImageIcon },
  { key: "likes", label: "Likes", Icon: Heart },
] as const;

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const person = getPerson(params.id);
  const genre = getGenre(person.genre);
  const GenreIcon = genre.Icon;
  const isSelf = person.id === currentUser.id;

  const [following, setFollowing] = useState(person.isFollowing ?? false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("posts");

  const posts = buildPosts(person, 6);
  const mediaPosts = posts.filter((p) => p.imageUrl);
  const shown = activeTab === "media" ? mediaPosts : posts;

  const stats = [
    { label: "Posts", value: person.posts, href: "#" },
    { label: "Followers", value: person.followers, href: "/followers" },
    { label: "Following", value: person.following, href: "/followers?tab=following" },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        {/* Sticky header */}
        <div className="sticky top-0 z-30 glass border-b border-[var(--line)]">
          <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-3">
            <Link
              href="/"
              aria-label="Back"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.045] transition-colors"
            >
              <ArrowLeft className="w-[18px] h-[18px] text-[var(--ink-700)]" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[17px] font-bold text-[var(--ink-900)] truncate">
                  {person.name}
                </h1>
                {person.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-sky-500 shrink-0" fill="currentColor" stroke="white" />
                )}
              </div>
              <p className="text-[12px] text-[var(--ink-400)]">{formatCount(person.posts)} posts</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Cover */}
          <div className="relative h-40 sm:h-52" style={{ background: genre.grad }}>
            <span
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(circle at 30% 120%, rgba(255,255,255,.6), transparent 60%)" }}
            />
          </div>

          <div className="px-4 sm:px-6">
            {/* Avatar + actions row */}
            <div className="flex items-end justify-between -mt-14 sm:-mt-16">
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="block rounded-full p-[4px] ring-4 ring-white"
                style={{ background: genre.grad }}
              >
                <img
                  src={person.avatar}
                  alt=""
                  className="block w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                />
              </motion.span>

              <div className="flex items-center gap-2 mb-2">
                {isSelf ? (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border border-[var(--line)] text-[var(--ink-700)] hover:bg-[var(--canvas)] transition-colors">
                    <Settings className="w-4 h-4" /> Edit profile
                  </button>
                ) : (
                  <>
                    <Link
                      href="/chats"
                      aria-label="Message"
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--line)] text-[var(--ink-700)] hover:bg-[var(--canvas)] transition-colors"
                    >
                      <MessageCircle className="w-[18px] h-[18px]" />
                    </Link>
                    <button
                      onClick={() => setFollowing((f) => !f)}
                      className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                        following
                          ? "border border-[var(--line)] text-[var(--ink-700)] hover:border-rose-300 hover:text-rose-600"
                          : "btn-brand"
                      }`}
                    >
                      {following ? "Following" : "Follow"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[20px] font-bold text-[var(--ink-900)]">{person.name}</h2>
                {person.isVerified && (
                  <BadgeCheck className="w-[18px] h-[18px] text-sky-500" fill="currentColor" stroke="white" />
                )}
                <span
                  className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: genre.chip, color: genre.accent }}
                >
                  <GenreIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
                  {genre.label}
                </span>
              </div>
              <p className="text-[13.5px] text-[var(--ink-400)]">@{person.username}</p>
              {person.followsYou && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--canvas)] text-[var(--ink-500)]">
                  Follows you
                </span>
              )}
            </div>

            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--ink-700)]">{person.bio}</p>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[var(--ink-400)]">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Bengaluru, India</span>
              <a href="#" className="flex items-center gap-1.5 text-[var(--brand-600)] hover:underline">
                <LinkIcon className="w-3.5 h-3.5" /> grimoire.app
              </a>
              <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Joined Mar 2024</span>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-6">
              {stats.map((s) => (
                <Link key={s.label} href={s.href} className="group flex items-baseline gap-1.5">
                  <span className="text-[16px] font-bold text-[var(--ink-900)] tabular-nums">
                    {formatCount(s.value)}
                  </span>
                  <span className="text-[13px] text-[var(--ink-400)] group-hover:text-[var(--ink-700)] transition-colors">
                    {s.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 border-b border-[var(--line)] px-2 sm:px-4">
            <div className="flex">
              {tabs.map(({ key, label, Icon }) => {
                const active = key === activeTab;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className="relative flex-1 flex items-center justify-center gap-2 py-3 text-[13.5px] font-semibold transition-colors"
                    style={{ color: active ? "var(--brand-600)" : "var(--ink-400)" }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={active ? 2.4 : 2} />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="profile-tab"
                        className="absolute bottom-0 inset-x-6 h-[3px] rounded-t-full"
                        style={{ background: "var(--brand-grad)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5">
            {activeTab === "likes" ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: genre.chip }}>
                  <Heart className="w-5 h-5" style={{ color: genre.accent }} />
                </div>
                <p className="text-[14px] font-semibold text-[var(--ink-700)]">Likes are private</p>
                <p className="text-[12.5px] text-[var(--ink-400)]">Only {isSelf ? "you" : person.name} can see this.</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <RightSidebar currentUser={{ id: person.id, name: person.name, username: person.username, avatar: person.avatar }} />
    </div>
  );
}
