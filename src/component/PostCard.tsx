"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { getMood, resolveEmoji } from "@/lib/moods";

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

const PostCard = ({ post }: { post: Post }) => {
  const mood = getMood(post.mood);
  const emoji = resolveEmoji(post.moodEmoji, mood);

  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [bursts, setBursts] = useState<number[]>([]);

  const handleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : c - 1));
    if (next) {
      const id = Date.now();
      setBursts((b) => [...b, id]);
      setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 900);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: mood.tint,
        border: `1px solid ${mood.border}`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Mood gradient hairline */}
      <div className="h-[3px] w-full" style={{ background: mood.grad }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <Link href={`/profile/${post.userId}`} className="relative shrink-0">
          <span
            className="block rounded-full p-[2px]"
            style={{ background: mood.grad }}
          >
            <img
              src={post.userAvatar}
              alt=""
              width={42}
              height={42}
              className="rounded-full object-cover block ring-2 ring-white"
            />
          </span>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${post.userId}`}>
            <h3 className="font-semibold text-[var(--ink-900)] text-[14.5px] leading-tight hover:underline truncate">
              {post.username}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
            <span className="font-medium" style={{ color: mood.accent }}>
              Feeling {mood.label.toLowerCase()}
            </span>
            <span className="text-[var(--ink-400)]">·</span>
            <span className="text-[var(--ink-400)]">{post.timestamp}</span>
          </div>
        </div>

        {/* Mood chip with a living emoji */}
        <div
          className="hidden sm:flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1 shrink-0"
          style={{ background: mood.chip }}
        >
          <motion.span
            className="text-[15px] leading-none"
            animate={{ y: [0, -3, 0], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.span>
          <span className="text-[11.5px] font-semibold" style={{ color: mood.accent }}>
            {mood.label}
          </span>
        </div>

        <button
          aria-label="More options"
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-[var(--ink-400)] hover:bg-black/5 transition-colors"
        >
          <MoreHorizontal className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-[14.5px] leading-[1.6] text-[var(--ink-700)] whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="px-3 pb-3">
          <div className="relative rounded-[16px] overflow-hidden ring-1 ring-black/[0.06]">
            <img
              src={post.imageUrl}
              alt=""
              className="w-full h-auto object-cover"
              style={{ maxHeight: 380 }}
            />
            {/* Mobile mood badge sits on the image */}
            <span
              className="sm:hidden absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full text-[17px] ring-2 ring-white/80"
              style={{ background: mood.chip }}
            >
              {emoji}
            </span>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-1 rounded-[16px] px-2 py-1.5"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          <button
            onClick={handleLike}
            className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors ${
              isLiked ? "text-rose-600 bg-rose-50" : "text-[var(--ink-500)] hover:bg-black/[0.04]"
            }`}
          >
            <motion.span
              animate={isLiked ? { scale: [1, 1.35, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="flex"
            >
              <Heart
                className="w-[18px] h-[18px]"
                fill={isLiked ? "currentColor" : "none"}
                strokeWidth={2.2}
              />
            </motion.span>
            <span className="tabular-nums">{likesCount}</span>

            {bursts.map((id) => (
              <span key={id} className="pointer-events-none absolute inset-0">
                {["❤️", "✨", "💖"].map((e, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-0 text-sm"
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{ opacity: 0, x: (i - 1) * 28, y: -46, scale: 0.5 }}
                    transition={{ duration: 0.85, ease: "easeOut" }}
                  >
                    {e}
                  </motion.span>
                ))}
              </span>
            ))}
          </button>

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-[var(--ink-500)] hover:bg-black/[0.04] transition-colors"
          >
            <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2.2} />
            <span className="tabular-nums">{post.comments}</span>
          </Link>

          <button
            aria-label="Share post"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--ink-500)] hover:bg-black/[0.04] transition-colors"
          >
            <Share2 className="w-[17px] h-[17px]" strokeWidth={2.2} />
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setIsBookmarked((p) => !p)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors ${
              isBookmarked
                ? "text-amber-500 bg-amber-50"
                : "text-[var(--ink-500)] hover:bg-black/[0.04]"
            }`}
          >
            <Bookmark
              className="w-[17px] h-[17px]"
              fill={isBookmarked ? "currentColor" : "none"}
              strokeWidth={2.2}
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
