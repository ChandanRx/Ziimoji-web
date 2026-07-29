"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

/** Playful idle motions layered on top of the lottie's own animation. */
export type EmojiPreset = "none" | "float" | "bounce" | "wiggle" | "pop";

interface AnimatedEmojiProps {
  /** Path to a self-hosted `.lottie` file, e.g. "/emoji/happy.lottie". */
  src: string;
  /** Rendered square size in pixels. */
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  /** Accessible label. When omitted the emoji is treated as decorative. */
  label?: string;
  /** Adds a springy idle wrapper motion for extra funk. Defaults to "none". */
  preset?: EmojiPreset;
}

const idle: Record<Exclude<EmojiPreset, "none">, { animate: Record<string, number[]>; duration: number }> = {
  float:  { animate: { y: [0, -4, 0] },                        duration: 3.2 },
  bounce: { animate: { y: [0, -5, 0], scale: [1, 1.12, 1] },   duration: 1.7 },
  wiggle: { animate: { rotate: [-8, 8, -8] },                  duration: 2.2 },
  pop:    { animate: { scale: [1, 1.18, 0.96, 1] },            duration: 2.4 },
};

/**
 * Renders a Google Noto animated emoji from a self-hosted dotLottie file.
 * Degrades gracefully to an empty, correctly-sized box if the asset fails
 * to load, so layout never shifts and nothing throws. An optional `preset`
 * adds a springy idle wrapper motion for a funkier, sticker-like feel.
 */
const AnimatedEmoji = ({
  src,
  size = 24,
  loop = true,
  autoplay = true,
  className,
  label,
  preset = "none",
}: AnimatedEmojiProps) => {
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const dimension = { width: size, height: size };

  const handleRef = useCallback((dot: DotLottie | null) => {
    if (!dot) return;
    dot.addEventListener("loadError", () => setFailed(true));
  }, []);

  const a11y = {
    role: label ? ("img" as const) : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
  };

  if (failed) {
    return <span {...a11y} className={className} style={{ display: "inline-block", ...dimension }} />;
  }

  const inner = (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      style={dimension}
      dotLottieRefCallback={handleRef}
    />
  );

  const base = { display: "inline-block", lineHeight: 0, ...dimension } as const;

  if (preset === "none" || reduceMotion) {
    return (
      <span {...a11y} className={className} style={base}>
        {inner}
      </span>
    );
  }

  const cfg = idle[preset];
  const variants: Variants = {
    rest: { y: 0, scale: 1, rotate: 0 },
    go: {
      ...cfg.animate,
      transition: { duration: cfg.duration, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.span
      {...a11y}
      className={className}
      style={base}
      variants={variants}
      initial="rest"
      animate="go"
      whileHover={preset === "float" ? { scale: 1.25, rotate: -8 } : { scale: 1.2 }}
    >
      {inner}
    </motion.span>
  );
};

export default AnimatedEmoji;
