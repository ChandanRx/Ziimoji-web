"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/** What the user picked. `auto` lets the clock decide the band. */
export type ThemeMode = "auto" | "day" | "dusk" | "night";
/** The band actually applied to <html> — the resolved look. */
export type ThemeBand = "day" | "dusk" | "night";

/**
 * Map a local time to a band. Kept in sync with the no-flash inline script in
 * layout.tsx (which can't import from here — it runs before hydration).
 * Day 07:00–17:00 · Dusk 17:00–19:30 · Night 19:30–07:00.
 */
export function bandForTime(hours: number, minutes: number): ThemeBand {
  const t = hours * 60 + minutes;
  if (t >= 7 * 60 && t < 17 * 60) return "day";
  if (t >= 17 * 60 && t < 19 * 60 + 30) return "dusk";
  return "night";
}

/** Resolve a mode to a concrete band — auto reads the clock, the rest are literal. */
function resolveBand(mode: ThemeMode): ThemeBand {
  if (mode !== "auto") return mode;
  const now = new Date();
  return bandForTime(now.getHours(), now.getMinutes());
}

function readStoredMode(): ThemeMode {
  try {
    const s = localStorage.getItem("themeMode");
    if (s === "auto" || s === "day" || s === "dusk" || s === "night") return s;
  } catch {
    /* storage may be unavailable (private mode) — fall back to auto */
  }
  return "auto";
}

type ThemeContextValue = {
  mode: ThemeMode;
  band: ThemeBand;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/**
 * Resolves the clock-driven band and mirrors it onto <html data-theme>. The
 * inline head script has already applied the correct band before paint; this
 * keeps React's view in sync and — in auto mode only — re-checks on an interval
 * and on visibilitychange so the app transitions live across a band boundary.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR and the first client render agree on "auto"/"day"; the stored choice is
  // read in an effect below, avoiding a hydration mismatch.
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [band, setBand] = useState<ThemeBand>("day");

  const apply = useCallback((next: ThemeMode) => {
    const resolved = resolveBand(next);
    document.documentElement.setAttribute("data-theme", resolved);
    setBand(resolved);
  }, []);

  // Hydrate from storage on mount and sync React to whatever the script applied.
  useEffect(() => {
    const stored = readStoredMode();
    setModeState(stored);
    apply(stored);
  }, [apply]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      try {
        localStorage.setItem("themeMode", next);
      } catch {
        /* storage may be unavailable — the choice just won't persist */
      }
      apply(next);
    },
    [apply],
  );

  // Auto mode only: keep re-deriving so an open tab crosses band boundaries.
  useEffect(() => {
    if (mode !== "auto") return;
    const recheck = () => apply("auto");
    const id = window.setInterval(recheck, 60_000);
    const onVisible = () => {
      if (!document.hidden) recheck();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [mode, apply]);

  return (
    <ThemeContext.Provider value={{ mode, band, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
