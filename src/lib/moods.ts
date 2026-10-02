import { SmileOutlined as Smile, FrownOutlined as Frown, FireOutlined as Angry, StarOutlined as Sparkles, BulbOutlined as Moon } from "@ant-design/icons";

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
  Icon: any;
  /** Direct RGB channels (r, g, b) for atmospheric gradients */
  rgb: string;
  /** Primary hex color */
  hex: string;
}

export const moods: Mood[] = [
  { label: "Happy",   emoji: "\u{1F60A}", lottie: "/emoji/happy.lottie",   accent: "var(--mood-happy-accent)",   chip: "var(--mood-happy-chip)",   tint: "var(--mood-happy-tint)",   border: "var(--mood-happy-border)",   grad: "var(--mood-happy-grad)",   Icon: Smile,    rgb: "250, 204, 21",  hex: "#FACC15" },
  { label: "Sad",     emoji: "\u{1F622}", lottie: "/emoji/sad.lottie",     accent: "var(--mood-sad-accent)",     chip: "var(--mood-sad-chip)",     tint: "var(--mood-sad-tint)",     border: "var(--mood-sad-border)",     grad: "var(--mood-sad-grad)",     Icon: Frown,    rgb: "96, 165, 250",  hex: "#60A5FA" },
  { label: "Excited", emoji: "\u{1F929}", lottie: "/emoji/excited.lottie", accent: "var(--mood-excited-accent)", chip: "var(--mood-excited-chip)", tint: "var(--mood-excited-tint)", border: "var(--mood-excited-border)", grad: "var(--mood-excited-grad)", Icon: Sparkles, rgb: "251, 146, 60",  hex: "#FB923C" },
  { label: "Angry",   emoji: "\u{1F620}", lottie: "/emoji/angry.lottie",   accent: "var(--mood-angry-accent)",   chip: "var(--mood-angry-chip)",   tint: "var(--mood-angry-tint)",   border: "var(--mood-angry-border)",   grad: "var(--mood-angry-grad)",   Icon: Angry,    rgb: "248, 113, 113", hex: "#F87171" },
  { label: "Calm",    emoji: "\u{1F60C}", lottie: "/emoji/happy.lottie",   accent: "var(--mood-excited-accent)", chip: "var(--mood-excited-chip)", tint: "var(--mood-excited-tint)", border: "var(--mood-excited-border)", grad: "var(--mood-excited-grad)", Icon: Smile,    rgb: "74, 222, 128", hex: "#4ADE80" },
  { label: "Tired",   emoji: "\u{1F971}", lottie: "/emoji/tired.lottie",   accent: "var(--mood-bored-accent)",   chip: "var(--mood-bored-chip)",   tint: "var(--mood-bored-tint)",   border: "var(--mood-bored-border)",   grad: "var(--mood-bored-grad)",   Icon: Moon,     rgb: "148, 163, 184", hex: "#94A3B8" },
];

export const moodColors: Record<string, { hex: string; rgb: string; emoji: string }> = {
  happy: { hex: "#FACC15", rgb: "250, 204, 21", emoji: "😊" },
  sad: { hex: "#60A5FA", rgb: "96, 165, 250", emoji: "😢" },
  angry: { hex: "#F87171", rgb: "248, 113, 113", emoji: "😡" },
  excited: { hex: "#FB923C", rgb: "251, 146, 60", emoji: "🤩" },
  love: { hex: "#FB7185", rgb: "251, 113, 133", emoji: "🥰" },
  calm: { hex: "#4ADE80", rgb: "74, 222, 128", emoji: "😌" },
  confused: { hex: "#A78BFA", rgb: "167, 139, 250", emoji: "😕" },
  bored: { hex: "#94A3B8", rgb: "148, 163, 184", emoji: "😴" },
  tired: { hex: "#94A3B8", rgb: "148, 163, 184", emoji: "😴" },
  neutral: { hex: "#94A3B8", rgb: "148, 163, 184", emoji: "😐" },
};

export const moodByLabel: Record<string, Mood> = Object.fromEntries(
  moods.map((m) => [m.label.toLowerCase(), m])
);

/** Falls back to Happy for unknown labels so the UI never renders bare. */
export const getMood = (label: string): Mood => moodByLabel[label?.toLowerCase()] ?? moods[0];

/**
 * Resolves the animated emoji source for a post.
 * Prefers an explicit self-hosted `.lottie` path stored on the post, and
 * otherwise falls back to the mood's mapped animation. Never returns a
 * Unicode glyph — rendering goes through <AnimatedEmoji>.
 */
export const resolveLottie = (raw: string | undefined, mood: Mood): string =>
  raw && raw.endsWith(".lottie") ? raw : mood.lottie;

