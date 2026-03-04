"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { gsap } from "gsap";
import { FaHeart, FaRegHeart, FaRegComment, FaBookmark, FaRegBookmark } from "react-icons/fa";

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

interface PostCardProps {
  post: Post;
}

const moodConfig: Record<string, { bgColor: string; emoji: string; textColor: string }> = {
  Happy: { bgColor: "bg-yellow-100", emoji: "😊", textColor: "text-slate-900" },
  Sad: { bgColor: "bg-blue-100", emoji: "😢", textColor: "text-slate-900" },
  Angry: { bgColor: "bg-red-100", emoji: "😠", textColor: "text-slate-900" },
  Love: { bgColor: "bg-pink-100", emoji: "❤️", textColor: "text-slate-900" },
  Excited: { bgColor: "bg-orange-100", emoji: "🤩", textColor: "text-slate-900" },
  Cool: { bgColor: "bg-cyan-100", emoji: "😎", textColor: "text-slate-900" },
  Funny: { bgColor: "bg-purple-100", emoji: "😂", textColor: "text-slate-900" },
  Surprised: { bgColor: "bg-green-100", emoji: "😲", textColor: "text-slate-900" },
  Calm: { bgColor: "bg-indigo-100", emoji: "😌", textColor: "text-slate-900" },
  Tired: { bgColor: "bg-gray-100", emoji: "😴", textColor: "text-slate-900" },
};

const getEmojiPosition = (postId: string, index: number, layer: "header" | "footer") => {
  const baseSeed = postId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const layerOffset = layer === "header" ? 17 : 73;
  const seed = baseSeed + index * 37 + layerOffset;

  const norm1 = (Math.sin(seed) + 1) / 2; // 0–1
  const norm2 = (Math.sin(seed * 1.3) + 1) / 2;

  const top = 10 + norm1 * 80; // 10–90%
  const left = 10 + norm2 * 80;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const PostCard = ({ post }: PostCardProps) => {
  const moodStyle = moodConfig[post.mood] || moodConfig.Happy;
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const cardRef = useRef<HTMLElement | null>(null);
  const headerBgRef = useRef<HTMLDivElement | null>(null);
  const footerBgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  useEffect(() => {
    const animateLayer = (container: HTMLDivElement | null) => {
      if (!container) return;

      const elements = container.querySelectorAll<HTMLElement>(".bg-emoji");

      elements.forEach((el, index) => {
        gsap.to(el, {
          y: "-=8",
          duration: 2.4 + index * 0.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.05,
        });
      });
    };

    animateLayer(headerBgRef.current);
    animateLayer(footerBgRef.current);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handleCardHoverIn = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      scale: 1.02,
      y: -4,
      boxShadow: "0 22px 60px rgba(15,23,42,0.45)",
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleCardHoverOut = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0 16px 40px rgba(15,23,42,0.30)",
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const primaryEmoji = post.moodEmoji || moodStyle.emoji;
  const backgroundEmojiCount = 26;

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleCardHoverIn}
      onMouseLeave={handleCardHoverOut}
      className="relative bg-white text-slate-900 shadow-[0_18px_40px_rgba(148,163,184,0.35)] overflow-hidden rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-transform"
    >
      {/* Top Header Section with Background Color */}
      <div className={`${moodStyle.bgColor} ${moodStyle.textColor} px-5 pt-5 pb-4 relative z-10 overflow-hidden border-b border-white/60`}>
        {/* Mood background emojis for header */}
        <div
          ref={headerBgRef}
          className="pointer-events-none absolute inset-0 z-0"
        >
          {Array.from({ length: backgroundEmojiCount }).map((_, index) => (
            <div
              key={index}
              className="bg-emoji absolute text-2xl opacity-15"
              style={getEmojiPosition(post.id, index, "header")}
            >
              {primaryEmoji}
            </div>
          ))}
        </div>

        {/* Post Header */}
        <div className="flex items-center gap-3 relative z-10">
          <Link href={`/profile/${post.userId}`}>
            <img
              src={post.userAvatar}
              alt={post.username}
              width={44}
              height={44}
              className="rounded-full border-2 border-white/90 object-cover hover:border-white transition-colors cursor-pointer"
            />
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.userId}`}>
              <h3 className="font-bold text-base hover:underline transition-colors cursor-pointer">
                {post.username}
              </h3>
            </Link>
            <p className="text-xs opacity-90">{post.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Post Image/Content Area */}
      {post.imageUrl && (
        <div className="relative bg-white z-10">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Bottom Footer Section with Background Color */}
      <div className={`${moodStyle.bgColor} ${moodStyle.textColor} px-5 pt-3 pb-4 rounded-b-2xl relative z-10 overflow-hidden border-t border-white/60`}>
        {/* Mood background emojis for footer */}
        <div
          ref={footerBgRef}
          className="pointer-events-none absolute inset-0 z-0"
        >
          {Array.from({ length: backgroundEmojiCount }).map((_, index) => (
            <div
              key={index}
              className="bg-emoji absolute text-xl opacity-25"
              style={getEmojiPosition(post.id, index, "footer")}
            >
              {primaryEmoji}
            </div>
          ))}
        </div>

        {/* Action bar + counts */}
        <div className="space-y-3 relative z-10">
          {/* Action bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Like */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="flex items-center gap-2 rounded-full bg-white/90 hover:bg-fuchsia-50 px-3 py-1.5 border border-slate-200/70 transition-colors"
              >
                <span className="relative flex items-center justify-center">
                  {isLiked ? (
                    <FaHeart className="text-lg text-pink-500" />
                  ) : (
                    <FaRegHeart className="text-lg text-slate-400" />
                  )}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  {isLiked ? "Liked" : "Like"}
                </span>
              </motion.button>

              {/* Comment */}
              <Link
                href={`/post/${post.id}`}
                className="flex items-center gap-2 rounded-full bg-white/80 hover:bg-sky-50 px-3 py-1.5 border border-slate-200/70 transition-colors"
              >
                <FaRegComment className="text-base text-slate-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Thoughts
                </span>
              </Link>
            </div>

            {/* Bookmark */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleBookmark}
                className="rounded-full bg-white/80 hover:bg-amber-50 p-2.5 border border-slate-200/70 transition-colors"
            >
              {isBookmarked ? (
                  <FaBookmark className="text-lg text-amber-400" />
              ) : (
                  <FaRegBookmark className="text-lg text-slate-500" />
              )}
            </motion.button>
          </div>

          {/* Counts + text */}
          <div className="flex items-center justify-between text-xs text-slate-700/90">
            <span className="font-semibold">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
            <Link
              href={`/post/${post.id}`}
              className="underline-offset-2 hover:underline text-slate-600"
            >
              View discussion
            </Link>
          </div>

          {/* Post Description */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
