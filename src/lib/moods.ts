import {
  Smile, Frown, Angry, Sparkles, Moon,
  type LucideIcon,
} from "lucide-react";

export interface Mood {
  label: string;
  /** Unicode glyph — kept only as a text fallback, never rendered directly. */
  emoji: string;
  /** Self-hosted Noto animated emoji, served from /public/emoji. */
  lottie: string;
  /** Solid accent — text, icons, rings */
  accent: string;
  /** Soft fill — chips and icon tiles */
  chip: string;
  /** Barely-there card wash */
  tint: string;
  /** Card border in this mood */
  border: string;
  /** Two-stop gradient for accent strips */
  grad: string;
  Icon: LucideIcon;
}

export const moods: Mood[] = [
  { label: "Happy",   emoji: "\u{1F60A}", lottie: "/emoji/happy.lottie",   accent: "#c2740a", chip: "#fef3c7", tint: "#fffdf6", border: "#fde9ac", grad: "linear-gradient(90deg,#fbbf24,#f59e0b)", Icon: Smile },
  { label: "Sad",     emoji: "\u{1F622}", lottie: "/emoji/sad.lottie",     accent: "#4f46e5", chip: "#e0e7ff", tint: "#f9faff", border: "#cbd5ff", grad: "linear-gradient(90deg,#818cf8,#6366f1)", Icon: Frown },
  { label: "Excited", emoji: "\u{1F929}", lottie: "/emoji/excited.lottie", accent: "#ea580c", chip: "#ffedd5", tint: "#fffbf7", border: "#fed7aa", grad: "linear-gradient(90deg,#fb923c,#f97316)", Icon: Sparkles },
  { label: "Angry",   emoji: "\u{1F620}", lottie: "/emoji/angry.lottie",   accent: "#dc2626", chip: "#fee2e2", tint: "#fffafa", border: "#fecdd3", grad: "linear-gradient(90deg,#f87171,#ef4444)", Icon: Angry },
  { label: "Bored",   emoji: "\u{1F971}", lottie: "/emoji/tired.lottie",   accent: "#475569", chip: "#e2e8f0", tint: "#fbfcfd", border: "#dbe2ea", grad: "linear-gradient(90deg,#94a3b8,#64748b)", Icon: Moon },
];

export const moodByLabel: Record<string, Mood> = Object.fromEntries(
  moods.map((m) => [m.label, m])
);

/** Falls back to Happy for unknown labels so the UI never renders bare. */
export const getMood = (label: string): Mood => moodByLabel[label] ?? moods[0];

/**
 * Resolves the animated emoji source for a post.
 * Prefers an explicit self-hosted `.lottie` path stored on the post, and
 * otherwise falls back to the mood's mapped animation. Never returns a
 * Unicode glyph — rendering goes through <AnimatedEmoji>.
 */
export const resolveLottie = (raw: string | undefined, mood: Mood): string =>
  raw && raw.endsWith(".lottie") ? raw : mood.lottie;
