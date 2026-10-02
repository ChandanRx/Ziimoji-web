"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageOutlined as MessageCircle, BookOutlined as Bookmark, MoreOutlined as MoreHorizontal, ShareAltOutlined as Share2, CheckOutlined as Check } from "@ant-design/icons";
import { getMood, resolveLottie, moodColors } from "@/lib/moods";
import AnimatedEmoji from "@/component/AnimatedEmoji";
import { celebrate } from "@/lib/confetti";

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  mood: string;
  moodEmoji: string;
  likes: number;
  comments: number;
  timestamp: string;
  imageUrl?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const WOBBLE = { duration: 0.15, ease: "easeOut" } as const;

/** Compact count formatting: 1200 -> "1.2k". */
const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k` : `${n}`;

/** Normalized viewport origin of an element, for confetti. */
const originOf = (el: HTMLElement | null) => {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return {
    x: (r.left + r.width / 2) / window.innerWidth,
    y: (r.top + r.height / 2) / window.innerHeight,
  };
};

const PostCard = ({
  post,
  onLike,
}: {
  post: Post;
  /** Fires when the like state changes; used e.g. for extra detail-page confetti. */
  onLike?: (liked: boolean) => void;
}) => {
  const mood = getMood(post.mood);
  const lottieSrc = resolveLottie(post.moodEmoji, mood);
  const reduceMotion = useReducedMotion();

  const moodInfo = moodColors[post.mood.toLowerCase()] ?? {
    hex: mood.hex || "#FACC15",
    rgb: mood.rgb || "250, 204, 21",
    emoji: mood.emoji || "😊",
  };

  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [copied, setCopied] = useState(false);
  // Bumps a key each like so the centre float re-mounts and re-plays.
  const [floatKey, setFloatKey] = useState(0);
  const likeBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);

  const handleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : c - 1));
    if (next) setFloatKey((k) => k + 1);
    onLike?.(next);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      if (next) celebrate(originOf(bookmarkBtnRef.current));
      return next;
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/post/${post.id}` : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Ziimoji Post by ${post.username}`,
          text: post.content,
          url,
        });
      } catch {
        // User cancelled or share failed fallback
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const glassPillBase =
    "inline-flex items-center gap-1.5 h-9 rounded-full px-3.5 text-xs sm:text-[13px] font-semibold text-white/95 bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/20 hover:bg-white/25 active:scale-95 transition-all duration-200 outline-none select-none shadow-md cursor-pointer";

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-sm bg-neutral-900 text-white shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 w-full"
    >
      {/* Mood emoji that floats up the middle when the post is liked */}
      <AnimatePresence>
        {floatKey > 0 && (
          <motion.div
            key={floatKey}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.9], y: [40, -40, -100, -170] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: "easeOut", times: [0, 0.25, 0.6, 1] }}
          >
            <AnimatedEmoji src={lottieSrc} size={120} preset="none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Media Showcase Container ── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[1.1/1] overflow-hidden bg-neutral-950 flex flex-col justify-between">
        {/* Post Image */}
        {post.imageUrl ? (
          <motion.img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.025] transition-transform duration-700 ease-out"
          />
        ) : (
          /* Ambient Gradient Canvas for text-only post fallback */
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-slate-900 to-neutral-950"
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 60%, rgba(${moodInfo.rgb}, 0.5) 0%, transparent 70%)`,
              }}
            />
          </div>
        )}

        {/* Top Dark Scrim Gradient for Header Contrast */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10"
        />

        {/* ── Floating Header Over Image ── */}
        <header className="relative z-20 flex items-center justify-between gap-3 p-3.5 sm:p-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href={`/profile/${post.userId}`}
              className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={`${post.username}'s profile`}
            >
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                transition={WOBBLE}
                className="relative rounded-full p-[2px]"
                style={{ background: mood.grad }}
              >
                <img
                  src={post.userAvatar}
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-white/40"
                />
              </motion.div>
            </Link>

            <div className="min-w-0">
              <Link href={`/profile/${post.userId}`} className="rounded outline-none hover:underline">
                <h3 className="truncate text-xs sm:text-sm font-bold leading-tight text-white tracking-tight drop-shadow-sm">
                  {post.username}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/75 drop-shadow-sm">
                <span className="truncate">@{post.username}</span>
                <span aria-hidden>·</span>
                <time className="whitespace-nowrap">{post.timestamp}</time>
              </div>
            </div>
          </div>

          <motion.button
            type="button"
            aria-label="More options"
            whileTap={{ scale: 0.85, rotate: 90 }}
            transition={WOBBLE}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-white/90 bg-black/20 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors outline-none"
          >
            <MoreHorizontal className="text-[16px]" />
          </motion.button>
        </header>

        {/* ── Lower Section: Atmosphere, Caption & Actions ── */}
        <div className="relative z-20 mt-auto flex flex-col justify-end">
          {/* Subtle Mood-Based Gradient Wash over lower ~35% of media */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[220px] sm:h-[260px] z-10"
            style={{
              background: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(${moodInfo.rgb}, 0.2) 45%, rgba(0, 0, 0, 0.25) 75%, transparent 100%)`,
            }}
          />

          {/* Caption over the atmospheric gradient */}
          {post.content && (
            <div className="relative z-20 px-4 sm:px-5 pb-3">
              <p className="line-clamp-4 max-w-[65ch] text-[14px] sm:text-[15px] font-medium leading-relaxed text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          )}

          {/* ── Bottom Action Bar ── */}
          <div className="relative z-20 flex items-center justify-between gap-1.5 sm:gap-2 px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* 1. Mood Reaction Pill (Replaces traditional heart) */}
              <motion.button
                ref={likeBtnRef}
                type="button"
                onClick={handleLike}
                aria-label={isLiked ? "Remove reaction" : `React ${post.mood}`}
                aria-pressed={isLiked}
                whileTap={{ scale: 0.92 }}
                transition={WOBBLE}
                className={`${glassPillBase} ${
                  isLiked
                    ? "bg-white/30 dark:bg-white/25 border-white/40 ring-1 ring-white/50 text-white"
                    : ""
                }`}
                style={
                  isLiked
                    ? {
                        boxShadow: `0 0 16px rgba(${moodInfo.rgb}, 0.45)`,
                      }
                    : undefined
                }
              >
                <motion.span
                  className="flex items-center"
                  animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <AnimatedEmoji
                    src={lottieSrc}
                    size={20}
                    autoplay={isLiked}
                    loop={isLiked}
                  />
                </motion.span>
                <span className="tabular-nums font-bold drop-shadow-sm">
                  {formatCount(likesCount)}
                </span>
              </motion.button>

              {/* 2. Comments Pill */}
              <motion.div whileTap={{ scale: 0.92 }} transition={WOBBLE}>
                <Link
                  href={`/post/${post.id}`}
                  aria-label={`Comment on post, ${post.comments} comments`}
                  className={glassPillBase}
                >
                  <MessageCircle className="text-[16px] stroke-[2.2] text-white/90" />
                  <span className="tabular-nums font-medium drop-shadow-sm">
                    {formatCount(post.comments)}
                  </span>
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* 3. Share Pill */}
              <motion.button
                type="button"
                onClick={handleShare}
                aria-label="Share post"
                whileTap={{ scale: 0.92 }}
                transition={WOBBLE}
                className={glassPillBase}
              >
                {copied ? (
                  <>
                    <Check className="text-[16px] text-emerald-400 stroke-[2.5]" />
                    <span className="text-emerald-300 font-medium">Copied!</span>
                  </>
                ) : (
                  <Share2 className="text-[16px] stroke-[2.2] text-white/90" />
                )}
              </motion.button>

              {/* 4. Bookmark Pill */}
              <motion.button
                ref={bookmarkBtnRef}
                type="button"
                onClick={handleBookmark}
                aria-label={isBookmarked ? "Remove bookmark" : "Save post"}
                aria-pressed={isBookmarked}
                whileTap={{ scale: 0.92 }}
                transition={WOBBLE}
                className={`${glassPillBase} ${
                  isBookmarked
                    ? "bg-white/30 dark:bg-white/25 border-white/40 text-amber-300"
                    : ""
                }`}
              >
                <Bookmark
                  className="text-[16px] stroke-[2.2]"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
