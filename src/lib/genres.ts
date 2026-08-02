import {
  Ghost, Skull, Eye, Droplet, Bug,
  type LucideIcon,
} from "lucide-react";

export interface Genre {
  label: string;
  /** Unicode glyph — kept only as a text fallback (e.g. the chat composer). */
  emoji: string;
  /**
   * Lottie path — intentionally empty for horror genres; the AnimatedEmoji
   * component degrades gracefully. Exists so the moods shim re-export compiles
   * without changes in pages still typed against the old mood interface.
   */
  lottie: string;
  /** Solid accent — text, icons, rings. A CSS var so it shifts per band. */
  accent: string;
  /** Soft fill — chips and icon tiles. Derived from the accent. */
  chip: string;
  /** Barely-there card wash */
  tint: string;
  /** Card border in this genre */
  border: string;
  /** Two-stop gradient for accent strips and avatar rings */
  grad: string;
  /** The genre glyph — Junji-Ito reads in line art, never cutesy emoji. */
  Icon: LucideIcon;
}

/* Horror genre palette. Every colour is a per-band CSS variable (see the
   `--g-*` blocks in globals.css): muted, desaturated hues in day/dusk that
   settle into the bleak greys, sliding into a blood-red family at night.
   chip/tint/border are mixed straight off the accent so a single variable
   drives the whole genre, band by band.
   Haunting → spectral slate · Cursed → bruised violet · Paranormal → uncanny
   teal · Gore → dried blood · Unsettling → bile ochre. */
const genre = (
  label: string,
  emoji: string,
  v: string,
  Icon: LucideIcon,
): Genre => ({
  label,
  emoji,
  lottie: "", // horror genres use Icon glyphs, not Lottie files
  Icon,
  accent: `var(${v})`,
  chip: `color-mix(in srgb, var(${v}) 16%, transparent)`,
  tint: `color-mix(in srgb, var(${v}) 8%, transparent)`,
  border: `color-mix(in srgb, var(${v}) 42%, transparent)`,
  grad: `linear-gradient(135deg, var(${v}), color-mix(in srgb, var(${v}) 55%, #000))`,
});

export const genres: Genre[] = [
  genre("Haunting",   "\u{1F47B}",          "--g-haunting",   Ghost),
  genre("Cursed",     "\u{1F480}",          "--g-cursed",     Skull),
  genre("Paranormal", "\u{1F441}\u{FE0F}",  "--g-paranormal", Eye),
  genre("Gore",       "\u{1FA78}",          "--g-gore",       Droplet),
  genre("Unsettling", "\u{1F577}\u{FE0F}",  "--g-unsettling", Bug),
];

export const genreByLabel: Record<string, Genre> = Object.fromEntries(
  genres.map((g) => [g.label, g])
);

/** Falls back to Haunting for unknown labels so the UI never renders bare. */
export const getGenre = (label: string): Genre => genreByLabel[label] ?? genres[0];
