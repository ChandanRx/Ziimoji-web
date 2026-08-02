"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share as ShareIcon,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import { celebrate } from "@/lib/confetti";

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  content: string;
  tone?: "normal" | "horror";
  likes: number;
  comments: number;
  timestamp: string;
  imageUrl?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

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
  "inline-flex items-center gap-1.5 h-9 min-h-[36px] rounded-full px-2.5 text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent select-none";
const pillIdle =
  "text-[var(--ink-500)] hover:bg-[var(--canvas)] hover:-translate-y-0.5 hover:text-[var(--ink-900)] focus-visible:ring-black/10";

type IconType = ComponentType<LucideProps>;

const storyStyle = (tone?: "normal" | "horror") =>
  tone === "horror"
    ? {
        accent: "var(--brand-500)",
        chip: "var(--brand-50)",
        tint: "color-mix(in srgb, var(--brand-500) 7%, transparent)",
        border: "color-mix(in srgb, var(--brand-500) 32%, transparent)",
        grad: "linear-gradient(135deg, var(--brand-500), color-mix(in srgb, var(--brand-500) 55%, #000))",
      }
    : {
        accent: "var(--brand-500)",
        chip: "var(--brand-50)",
        tint: "color-mix(in srgb, var(--brand-500) 5%, transparent)",
        border: "var(--line)",
        grad: "linear-gradient(135deg, var(--brand-500), color-mix(in srgb, var(--brand-500) 55%, #fff))",
      };

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
  const reduceMotion = useReducedMotion();
  // Bumped each time the pill flips inactive -> active, to (re)fire the burst.
  const [burst, setBurst] = useState(0);
  const wasActive = useRef(active);
  useEffect(() => {
    if (active && !wasActive.current && !reduceMotion) setBurst((b) => b + 1);
    wasActive.current = active;
  }, [active, reduceMotion]);

  const RAYS = 6;

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={{ scale: 0.85, rotate: active ? 0 : -4 }}
      transition={WOBBLE}
      className={`${pillBase} ${active ? "" : pillIdle}`}
      style={
        active
          ? { color: accent, background: chip, boxShadow: `inset 0 0 0 1.5px ${accent}` }
          : undefined
      }
    >
      <span className="relative flex items-center justify-center">
        {/* Click burst — an expanding ring plus radiating particles */}
        {burst > 0 && (
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              className="absolute h-6 w-6 rounded-full"
              style={{ border: `2px solid ${accent}` }}
              initial={{ scale: 0.3, opacity: 0.85 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
            {Array.from({ length: RAYS }).map((_, i) => {
              const a = (i / RAYS) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full"
                  style={{ background: accent }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: Math.cos(a) * 18, y: Math.sin(a) * 18, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              );
            })}
          </span>
        )}

        <motion.span
          className="flex"
          animate={active ? { scale: [1, 1.55, 0.9, 1], rotate: [0, -16, 10, 0] } : { scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Icon
            className="h-[19px] w-[19px]"
            strokeWidth={2.2}
            fill={filled && active ? "currentColor" : "none"}
          />
        </motion.span>
      </span>
      {count != null && (
        <span className="relative tabular-nums" style={active ? { color: accent } : undefined}>
          {formatCount(count)}
        </span>
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
  const style = storyStyle(post.tone);
  const reduceMotion = useReducedMotion();

  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  // Bumped on each "like" to fire the big centre-of-card glyph animation.
  const [likePop, setLikePop] = useState<number | null>(null);
  const likeBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);

  const handleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : c - 1));
    if (next && !reduceMotion) setLikePop(Date.now());
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
    <article
      className="group/card ink-bleed relative overflow-hidden rounded-sm border shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-md)] bg-[var(--surface)]"
      style={{ borderColor: style.border }}
    >
      {/* Faint genre tint over the surface — subtle in every band */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: style.tint }}
      />

      {/* Soft genre glow bleeding from the top-right corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-25 blur-3xl"
        style={{ background: style.accent }}
      />

      {/* Giant decorative genre glyph peeking from the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-3 opacity-[0.08] transition-opacity duration-300 group-hover/card:opacity-[0.16]"
        style={{ transform: "rotate(12deg)", color: style.accent }}
      >
        <Sparkles className="h-32 w-32" strokeWidth={1.4} />
      </div>

      {/* Big centre-of-card genre glyph that pops on like */}
      {likePop && (
        <motion.div
          key={likePop}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          style={{ color: style.accent }}
          initial={{ scale: 0.2, opacity: 0, y: 20, rotate: -18 }}
          animate={{ scale: [0.2, 1.35, 1.2], opacity: [0, 1, 0], y: [20, -10, -70], rotate: [-18, 0, 8] }}
          transition={{ duration: 0.95, ease: "easeOut", times: [0, 0.35, 1] }}
          onAnimationComplete={() => setLikePop(null)}
        >
          <Sparkles className="h-28 w-28" strokeWidth={1.6} />
        </motion.div>
      )}

      <div className="relative px-4 pt-3.5 pb-3">
        {/* ── Header ── */}
        <header className="flex items-center gap-2.5">
          <Link
            href={`/profile/${post.userId}`}
            className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ color: style.accent }}
            aria-label={`${post.username}'s profile`}
          >
            <motion.span
              className="block rounded-full p-[2px]"
              style={{ background: style.grad, boxShadow: `0 5px 12px -8px ${style.accent}` }}
              whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -5 }}
              transition={WOBBLE}
            >
              <img
                src={post.userAvatar}
                alt=""
                width={38}
                height={38}
                loading="lazy"
                className="block h-[38px] w-[38px] rounded-full object-cover ring-2 ring-[var(--surface)]"
              />
            </motion.span>
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={`/profile/${post.userId}`} className="rounded outline-none focus-visible:underline">
              <h3 className="truncate text-[14.5px] font-bold leading-tight tracking-[-0.01em] text-[var(--ink-900)]">
                {post.username}
              </h3>
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[var(--ink-500)]">
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
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-400)] outline-none transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink-700)] focus-visible:ring-2 focus-visible:ring-black/10"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </motion.button>
        </header>

        {/* ── Title ── */}
        <h2
          data-text={post.title}
          className="glitch-hover relative z-10 mt-3 text-[17px] font-bold leading-snug tracking-[-0.01em] text-[var(--ink-900)]"
        >
          {post.title}
        </h2>

        {/* ── Content ── */}
        <p className="relative z-10 mt-1.5 max-w-[62ch] whitespace-pre-wrap text-[14px] leading-[1.6] text-[var(--ink-700)]">
          {post.content}
        </p>

        {/* ── Media — full-bleed to the card edges, no side margin ── */}
        {post.imageUrl && (
          <div className="relative z-10 mt-3 -mx-4 overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={post.imageUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover/card:scale-[1.04]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="relative z-10 flex flex-wrap items-center gap-0.5 border-t border-[var(--line-soft)] px-2.5 py-1.5">
        <ActionPill
          icon={Heart}
          count={likesCount}
          ariaLabel={isLiked ? "Unlike story" : "Like story"}
          active={isLiked}
          filled
          accent={style.accent}
          chip={style.chip}
          onClick={handleLike}
          btnRef={likeBtnRef}
        />

        <motion.div
          whileHover={reduceMotion ? undefined : { y: -2 }}
          whileTap={{ scale: 0.85, rotate: -4 }}
          transition={WOBBLE}
        >
          <Link
            href={`/post/${post.id}`}
            aria-label={`Read ${post.comments} comments`}
            className={`${pillBase} ${pillIdle}`}
          >
            <motion.span
              className="flex"
              whileHover={reduceMotion ? undefined : { rotate: [0, -14, 12, -6, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MessageCircle className="h-[19px] w-[19px]" strokeWidth={2.2} />
            </motion.span>
            <span className="tabular-nums">{formatCount(post.comments)}</span>
          </Link>
        </motion.div>

        <ActionPill icon={Repeat2} ariaLabel="Reblog" accent={style.accent} chip={style.chip} />
        <ActionPill icon={ShareIcon} ariaLabel="Share story" accent={style.accent} chip={style.chip} />

        <div className="flex-1" />

        <ActionPill
          icon={Bookmark}
          ariaLabel={isBookmarked ? "Remove from grimoire" : "Save to grimoire"}
          active={isBookmarked}
          filled
          accent={style.accent}
          chip={style.chip}
          onClick={handleBookmark}
          btnRef={bookmarkBtnRef}
        />
      </div>
    </article>
  );
};

export default PostCard;
