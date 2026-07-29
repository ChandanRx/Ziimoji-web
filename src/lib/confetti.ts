"use client";

/**
 * Confetti helpers. `canvas-confetti` is lazy-imported the first time a burst
 * fires so it never loads (or touches `window`) during SSR. Every export is a
 * no-op on the server and when the user prefers reduced motion.
 */

import type CanvasConfetti from "canvas-confetti";

type Origin = { x: number; y: number };

const CENTER: Origin = { x: 0.5, y: 0.4 };

// Emoji glyphs are built from code points (not literal pictographic characters)
// so the source stays free of raw Unicode emoji while still handing real emoji
// strings to `confetti.shapeFromText`.
const cp = (...codes: number[]) => String.fromCodePoint(...codes);
export const GLYPH = {
  heart: cp(0x2764, 0xfe0f), // U+2764 red heart
  sparkles: cp(0x2728), // U+2728 sparkles
  star: cp(0x2b50), // U+2B50 star
} as const;

const DEFAULT_GLYPHS = [GLYPH.heart, GLYPH.sparkles, GLYPH.star];

// Themed confetti glyphs per mood label — again built from code points so no
// raw emoji lands in source. Falls back to the default heart/sparkle/star mix.
const MOOD_GLYPHS: Record<string, string[]> = {
  Happy: [cp(0x1f60a), GLYPH.sparkles, GLYPH.star],
  Sad: [cp(0x1f622), cp(0x1f4a7), GLYPH.sparkles],
  Angry: [cp(0x1f525), cp(0x1f4a5), GLYPH.star],
  Love: [GLYPH.heart, cp(0x1f496), cp(0x1f495)],
  Excited: [cp(0x1f929), GLYPH.star, GLYPH.sparkles],
  Cool: [cp(0x1f60e), GLYPH.star, GLYPH.sparkles],
  Funny: [cp(0x1f602), GLYPH.sparkles, GLYPH.star],
  Surprised: [cp(0x1f632), GLYPH.sparkles, GLYPH.star],
  Calm: [cp(0x1f60c), cp(0x1f338), GLYPH.sparkles],
  Tired: [cp(0x1f634), cp(0x1f4a4), GLYPH.star],
};

/** Confetti glyph set themed to a mood label. */
export const moodGlyphs = (label: string): string[] =>
  MOOD_GLYPHS[label] ?? DEFAULT_GLYPHS;

// Cache the dynamic import so we only pull the module in once.
let confettiPromise: Promise<typeof CanvasConfetti> | null = null;

const isBrowser = () => typeof window !== "undefined";

const prefersReducedMotion = () =>
  isBrowser() &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

const canFire = () => isBrowser() && !prefersReducedMotion();

const loadConfetti = () => {
  if (!confettiPromise) {
    confettiPromise = import("canvas-confetti").then((m) => m.default);
  }
  return confettiPromise;
};

/** A standard celebratory burst fired from a normalized screen position. */
export function celebrate(origin: Origin = CENTER) {
  if (!canFire()) return;
  loadConfetti().then((confetti) => {
    confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 42,
      scalar: 0.9,
      ticks: 200,
      origin,
      disableForReducedMotion: true,
    });
  });
}

/**
 * A themed burst that rains emoji-shaped particles (hearts, sparkles, stars by
 * default) from `origin`. Kept lightweight: two tuned `confetti()` calls, not a
 * loop.
 */
export function emojiBurst(
  origin: Origin = CENTER,
  emojis: string[] = DEFAULT_GLYPHS
) {
  if (!canFire()) return;
  loadConfetti().then((confetti) => {
    const shapes = emojis.map((text) =>
      confetti.shapeFromText({ text, scalar: 2 })
    );

    confetti({
      particleCount: 26,
      spread: 60,
      startVelocity: 34,
      scalar: 2,
      ticks: 160,
      shapes,
      origin,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 12,
      spread: 90,
      startVelocity: 22,
      scalar: 1.4,
      ticks: 140,
      shapes,
      origin,
      disableForReducedMotion: true,
    });
  });
}
