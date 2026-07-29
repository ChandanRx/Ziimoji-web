"use client";

import { useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  type LucideProps,
} from "lucide-react";
import { getMood, resolveLottie } from "@/lib/moods";
import AnimatedEmoji from "@/component/AnimatedEmoji";
import { celebrate, emojiBurst, moodGlyphs } from "@/lib/confetti";

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

const SPRING = { type: "spring", stiffness: 420, damping: 30 } as const;

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

const pillBase =
  "inline-flex items-center gap-2 h-11 min-h-[44px] rounded-full px-4 text-[14px] font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent select-none";
const pillIdle =
  "text-[var(--ink-500)] hover:bg-black/[0.045] focus-visible:ring-black/15 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/20";

type IconType = ComponentType<LucideProps>;

/** A modern, springy action pill — the core interaction primitive of the card. */
function ActionPill({
  icon: Icon,
  count,
  ariaLabel,
  active = false,
  filled = false,
  accent,
  chip,
  onClick,
  btnRef,
}: {
  icon: IconType;
  count?: number;
  ariaLabel: string;
  active?: boolean;
  filled?: boolean;
  accent: string;
  chip: string;
  onClick?: () => void;
  btnRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      whileTap={{ scale: 0.9 }}
      transition={SPRING}
      className={`${pillBase} ${active ? "" : pillIdle}`}
      style={
        active
          ? { color: accent, background: chip, boxShadow: `0 0 0 1px ${accent}22` }
          : undefined
      }
    >
      <motion.span
        className="flex"
        animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Icon
          className="h-[18px] w-[18px]"
          strokeWidth={2.2}
          fill={filled && active ? "currentColor" : "none"}
        />
      </motion.span>
      {count != null && (
        <span className="tabular-nums">{formatCount(count)}</span>
      )}
    </motion.button>
  );
}

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

  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const likeBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);

  const handleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : c - 1));
    if (next) {
      // Confetti — the primary reaction effect — themed to the post's mood and
      // fired from the like pill's position.
      emojiBurst(originOf(likeBtnRef.current), moodGlyphs(mood.label));
    }
    onLike?.(next);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      if (next) celebrate(originOf(bookmarkBtnRef.current));
      return next;
    });
  };

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={SPRING}
      className="group relative overflow-hidden rounded-[20px] border border-[var(--line)] bg-white transition-shadow duration-200 hover:shadow-[var(--shadow-md)] dark:border-white/[0.08] dark:bg-[#161719]"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Left accent line — the quietest mood cue */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: mood.grad }}
      />
      {/* Soft mood glow that blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-12 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: mood.accent }}
      />
      {/* Barely-there gradient highlight in the top-left corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: `linear-gradient(180deg, ${mood.accent}0d, transparent)`,
        }}
      />

      <div className="relative p-6 sm:p-7">
        {/* ── Header ── */}
        <header className="flex items-center gap-3.5">
          <Link
            href={`/profile/${post.userId}`}
            className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161719]"
            style={{ color: mood.accent }}
            aria-label={`${post.username}'s profile`}
          >
            <motion.span
              className="block rounded-full p-[2.5px]"
              style={{ background: mood.grad }}
              whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: 3 }}
              transition={SPRING}
            >
              <img
                src={post.userAvatar}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="block h-14 w-14 rounded-full object-cover ring-2 ring-white dark:ring-[#161719]"
              />
            </motion.span>
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={`/profile/${post.userId}`}
              className="rounded outline-none focus-visible:underline"
            >
              <h3 className="truncate text-[18px] font-bold leading-tight tracking-[-0.01em] text-[var(--ink-900)] dark:text-neutral-100">
                {post.username}
              </h3>
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5 text-[14px] text-[var(--ink-400)] dark:text-neutral-500">
              <span className="truncate">@{post.username}</span>
              <span aria-hidden>·</span>
              <time className="whitespace-nowrap">{post.timestamp}</time>
            </div>
          </div>

          {/* Mood pill — glass, floating, gently pulsing halo */}
          <motion.div
            className="hidden shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-2 pr-3 backdrop-blur-sm sm:flex"
            style={{
              background: `${mood.chip}cc`,
              boxShadow: `inset 0 0 0 1px ${mood.accent}1f`,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    boxShadow: [
                      `inset 0 0 0 1px ${mood.accent}1f, 0 0 0 0 ${mood.accent}00`,
                      `inset 0 0 0 1px ${mood.accent}1f, 0 0 0 5px ${mood.accent}14`,
                      `inset 0 0 0 1px ${mood.accent}1f, 0 0 0 0 ${mood.accent}00`,
                    ],
                  }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AnimatedEmoji src={lottieSrc} size={18} label={`Mood: ${mood.label}`} />
            <span
              className="text-[12.5px] font-bold tracking-[-0.01em]"
              style={{ color: mood.accent }}
            >
              {mood.label}
            </span>
          </motion.div>

          <motion.button
            type="button"
            aria-label="More options"
            whileTap={{ scale: 0.9 }}
            transition={SPRING}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--ink-400)] outline-none transition-colors hover:bg-black/[0.045] focus-visible:ring-2 focus-visible:ring-black/15 dark:text-neutral-500 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/20"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </motion.button>
        </header>

        {/* ── Content ── */}
        <p className="mt-4 max-w-[62ch] whitespace-pre-wrap text-[17px] leading-[1.7] text-[var(--ink-700)] dark:text-neutral-300">
          {post.content}
        </p>
      </div>

      {/* ── Image hero ── */}
      {post.imageUrl && (
        <div className="px-3 pb-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] ring-1 ring-black/[0.05] dark:ring-white/[0.06]">
            <motion.img
              src={post.imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Very soft mood-tinted overlay */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${mood.accent}1f, transparent 55%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="relative flex flex-wrap items-center gap-1.5 px-4 pb-4 sm:px-5">
        <ActionPill
          icon={Heart}
          count={likesCount}
          ariaLabel={isLiked ? "Unlike post" : "Like post"}
          active={isLiked}
          filled
          accent={mood.accent}
          chip={mood.chip}
          onClick={handleLike}
          btnRef={likeBtnRef}
        />

        <motion.div whileTap={{ scale: 0.9 }} transition={SPRING}>
          <Link
            href={`/post/${post.id}`}
            aria-label={`Comment on post, ${post.comments} comments`}
            className={`${pillBase} ${pillIdle}`}
          >
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="tabular-nums">{formatCount(post.comments)}</span>
          </Link>
        </motion.div>

        <ActionPill
          icon={Repeat2}
          ariaLabel="Share post"
          accent={mood.accent}
          chip={mood.chip}
        />

        <div className="flex-1" />

        <ActionPill
          icon={Bookmark}
          ariaLabel={isBookmarked ? "Remove bookmark" : "Save post"}
          active={isBookmarked}
          filled
          accent={mood.accent}
          chip={mood.chip}
          onClick={handleBookmark}
          btnRef={bookmarkBtnRef}
        />
      </div>
    </motion.article>
  );
};

export default PostCard;
