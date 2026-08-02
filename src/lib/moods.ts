/**
 * Backward-compat shim — the app was originally mood-based; these re-exports
 * let any page that still imports from "moods" compile without changes.
 * New code should import directly from "@/lib/genres".
 */
export {
  genres as moods,
  genreByLabel as moodByLabel,
  getGenre as getMood,
} from "@/lib/genres";
export type { Genre as Mood } from "@/lib/genres";
