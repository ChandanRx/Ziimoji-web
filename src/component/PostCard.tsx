"use client";

import { useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  type LucideProps,
} from "lucide-react";
import { getMood, resolveLottie } from "@/lib/moods";
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

// Non-bouncy tween used for subtle tap/hover feedback (no spring overshoot).
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

const pillBase =
  "inline-flex items-center gap-1.5 h-9 rounded-xl px-3 text-[13px] font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent select-none";
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
  emojiSrc,
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
  /** When set, renders the animated mood emoji instead of the line icon. */
  emojiSrc?: string;
}) {
  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      whileTap={{ scale: 0.9 }}
      transition={WOBBLE}
      className={`${pillBase} ${active && !emojiSrc ? "" : pillIdle}`}
      style={
        active
          ? emojiSrc
            ? { color: accent } // like pill: coloured text only, no raised box
            : { color: accent, background: chip, boxShadow: `0 5px 0 0 ${accent}26, inset 0 0 0 1.5px ${accent}3a` }
          : undefined
      }
    >
      <motion.span
        className="flex"
        animate={active ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {emojiSrc ? (
          // Static (paused on first frame) until liked; animates once active.
          <AnimatedEmoji
            key={active ? "on" : "off"}
            src={emojiSrc}
            size={18}
            autoplay={active}
            loop={active}
          />
        ) : (
          <Icon
            className="h-4 w-4"
            strokeWidth={2.4}
            fill={filled && active ? "currentColor" : "none"}
          />
        )}
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

  return (
    <motion.article
      className="group relative overflow-hidden rounded-sm border-2 bg-white dark:bg-[#161719]"
      style={{
        borderColor: mood.border,
        boxShadow: `0 14px 34px -20px ${mood.accent}99, var(--shadow-sm)`,
      }}
    >
      {/* Even mood colour filling the whole card */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `${mood.accent}22` }}
      />

      {/* Decorative emoji in the corner — kept clear, above the colour wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 z-[2] rotate-6"
      >
        <AnimatedEmoji src={lottieSrc} size={72} preset="float" />
      </div>

      {/* Mood emoji that floats up the middle when the post is liked */}
      <AnimatePresence>
        {floatKey > 0 && (
          <motion.div
            key={floatKey}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.15, 1, 0.95], y: [30, -30, -90, -150] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.25, 0.6, 1] }}
          >
            <AnimatedEmoji src={lottieSrc} size={110} preset="none" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative p-4">
        {/* ── Header ── */}
        <header className="flex items-center gap-3">
          <Link
            href={`/profile/${post.userId}`}
            className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161719]"
            style={{ color: mood.accent }}
            aria-label={`${post.username}'s profile`}
          >
            <motion.span
              className="block rounded-full p-[3px]"
              style={{ background: mood.grad, boxShadow: `0 6px 16px -6px ${mood.accent}` }}
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              transition={WOBBLE}
            >
              <img
                src={post.userAvatar}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                className="block h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-[#161719]"
              />
            </motion.span>
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={`/profile/${post.userId}`} className="rounded outline-none focus-visible:underline">
              <h3 className="truncate text-[15px] font-extrabold leading-tight tracking-[-0.01em] text-[var(--ink-900)] dark:text-neutral-100">
                {post.username}
              </h3>
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[var(--ink-400)] dark:text-neutral-500">
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
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--ink-400)] outline-none transition-colors hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-black/15 dark:text-neutral-500 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/20"
          >
            <MoreHorizontal className="h-4 w-4" />
          </motion.button>
        </header>

        {/* ── Content ── */}
        <p className="relative z-10 mt-3 line-clamp-3 max-w-[62ch] whitespace-pre-wrap text-[14.5px] leading-[1.6] text-[var(--ink-700)] dark:text-neutral-300">
          {post.content}
        </p>
      </div>

      {/* ── Image hero — full-bleed, flush to the card edges ── */}
      {post.imageUrl && (
        <div className="relative z-10 mt-1 mb-3">
          <div className="relative aspect-[16/10] overflow-hidden">
            <motion.img
              src={post.imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 px-3 pb-3 pt-1">
        <ActionPill
          icon={Heart}
          count={likesCount}
          ariaLabel={isLiked ? "Unlike post" : "Like post"}
          active={isLiked}
          accent={mood.accent}
          chip={mood.chip}
          onClick={handleLike}
          btnRef={likeBtnRef}
          emojiSrc={lottieSrc}
        />

        <motion.div whileTap={{ scale: 0.85, rotate: -4 }} transition={WOBBLE}>
          <Link
            href={`/post/${post.id}`}
            aria-label={`Comment on post, ${post.comments} comments`}
            className={`${pillBase} ${pillIdle}`}
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
            <span className="tabular-nums">{formatCount(post.comments)}</span>
          </Link>
        </motion.div>

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
