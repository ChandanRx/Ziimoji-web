"use client";

import { useCallback, useState } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

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
}

/**
 * Renders a Google Noto animated emoji from a self-hosted dotLottie file.
 * Degrades gracefully to an empty, correctly-sized box if the asset fails
 * to load, so layout never shifts and nothing throws.
 */
const AnimatedEmoji = ({
  src,
  size = 24,
  loop = true,
  autoplay = true,
  className,
  label,
}: AnimatedEmojiProps) => {
  const [failed, setFailed] = useState(false);
  const dimension = { width: size, height: size };

  const handleRef = useCallback((dot: DotLottie | null) => {
    if (!dot) return;
    dot.addEventListener("loadError", () => setFailed(true));
  }, []);

  if (failed) {
    return (
      <span
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        aria-label={label}
        className={className}
        style={{ display: "inline-block", ...dimension }}
      />
    );
  }

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{ display: "inline-block", lineHeight: 0, ...dimension }}
    >
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        style={dimension}
        dotLottieRefCallback={handleRef}
      />
    </span>
  );
};

export default AnimatedEmoji;
