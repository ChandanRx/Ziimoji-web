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
const WOBBLE = { type: "spring", stiffness: 500, damping: 16 } as const;

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
  "inline-flex items-center gap-2 h-11 min-h-[44px] rounded-2xl px-4 text-[14px] font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent select-none";
const pillIdle =
  "text-[var(--ink-500)] hover:bg-black/[0.05] hover:-translate-y-0.5 focus-visible:ring-black/15 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/20";

type IconType = ComponentType<LucideProps>;

/** A chunky, springy action pill — the core interaction primitive of the card. */
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
      whileTap={{ scale: 0.85, rotate: active ? 0 : -4 }}
      transition={WOBBLE}
      className={`${pillBase} ${active ? "" : pillIdle}`}
      style={
        active
          ? { color: accent, background: chip, boxShadow: `0 5px 0 0 ${accent}26, inset 0 0 0 1.5px ${accent}3a` }
          : undefined
      }
    >
      <motion.span
        className="flex"
        animate={active ? { scale: [1, 1.5, 1], rotate: [0, -12, 0] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Icon
          className="h-[19px] w-[19px]"
          strokeWidth={2.4}
          fill={filled && active ? "currentColor" : "none"}
        />
      </motion.span>
      {count != null && <span className="tabular-nums">{formatCount(count)}</span>}
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
      whileHover={reduceMotion ? undefined : { y: -5, rotate: -0.6 }}
      transition={SPRING}
      className="group relative overflow-hidden rounded-[28px] border-2 bg-white dark:bg-[#161719]"
      style={{
        borderColor: mood.border,
        boxShadow: `0 18px 44px -22px ${mood.accent}99, var(--shadow-sm)`,
      }}
    >
      {/* Giant decorative emoji peeking from the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-5 -top-3 opacity-[0.14] rotate-12 transition-opacity duration-300 group-hover:opacity-25"
      >
        <AnimatedEmoji src={lottieSrc} size={132} preset="float" />
      </div>

      {/* Soft mood glow that blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-14 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: mood.accent }}
      />
      {/* Barely-there tint wash */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${mood.accent}0f, transparent 45%)` }}
      />

      <div className="relative p-5 pt-6 sm:p-6 sm:pt-7">
        {/* ── Header ── */}
        <header className="flex items-center gap-3.5">
          <Link
            href={`/profile/${post.userId}`}
            className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161719]"
            style={{ color: mood.accent }}
            aria-label={`${post.username}'s profile`}
          >
            <motion.span
              className="block rounded-full p-[3px]"
              style={{ background: mood.grad, boxShadow: `0 6px 16px -6px ${mood.accent}` }}
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -6 }}
              transition={WOBBLE}
            >
              <img
                src={post.userAvatar}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="block h-14 w-14 rounded-full object-cover ring-[3px] ring-white dark:ring-[#161719]"
              />
            </motion.span>
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={`/profile/${post.userId}`} className="rounded outline-none focus-visible:underline">
              <h3 className="truncate text-[18px] font-extrabold leading-tight tracking-[-0.01em] text-[var(--ink-900)] dark:text-neutral-100">
                {post.username}
              </h3>
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-[var(--ink-400)] dark:text-neutral-500">
              <span className="truncate">@{post.username}</span>
              <span aria-hidden>·</span>
              <time className="whitespace-nowrap">{post.timestamp}</time>
            </div>
          </div>

          <motion.button
            type="button"
            aria-label="More options"
            whileTap={{ scale: 0.85, rotate: 90 }}
            transition={WOBBLE}
            className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--ink-400)] outline-none transition-colors hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-black/15 dark:text-neutral-500 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/20"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </motion.button>
        </header>

        {/* ── Content ── */}
        <p className="relative z-10 mt-4 max-w-[62ch] whitespace-pre-wrap text-[17px] leading-[1.7] text-[var(--ink-700)] dark:text-neutral-300">
          {post.content}
        </p>
      </div>

      {/* ── Image hero ── */}
      {post.imageUrl && (
        <div className="relative z-10 px-3 pb-3">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[22px]"
            style={{ boxShadow: `0 10px 30px -14px ${mood.accent}80` }}
          >
            <motion.img
              src={post.imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={reduceMotion ? undefined : { scale: 1.04, rotate: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 ring-2 ring-inset rounded-[22px]"
              style={{ boxShadow: `inset 0 0 0 2px ${mood.accent}22` }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: `linear-gradient(to top, ${mood.accent}26, transparent 55%)` }}
            />
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 px-4 pb-4 sm:px-5">
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

        <motion.div whileTap={{ scale: 0.85, rotate: -4 }} transition={WOBBLE}>
          <Link
            href={`/post/${post.id}`}
            aria-label={`Comment on post, ${post.comments} comments`}
            className={`${pillBase} ${pillIdle}`}
          >
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />
            <span className="tabular-nums">{formatCount(post.comments)}</span>
          </Link>
        </motion.div>

        <ActionPill icon={Repeat2} ariaLabel="Share post" accent={mood.accent} chip={mood.chip} />

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
