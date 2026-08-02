"use client";

import { useId } from "react";
import { Clock, Sun, Sunset, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme, type ThemeMode } from "./ThemeProvider";

/**
 * Four-state theme control — Auto · Day · Dusk · Night. Auto hands the band to
 * the clock; the other three pin it. The choice persists to localStorage via
 * the ThemeProvider, which applies it immediately. A sliding pill marks the
 * active segment, echoing the nav's animated active markers.
 */
const options: { mode: ThemeMode; Icon: typeof Sun; label: string }[] = [
  { mode: "auto", Icon: Clock, label: "Auto" },
  { mode: "day", Icon: Sun, label: "Day" },
  { mode: "dusk", Icon: Sunset, label: "Dusk" },
  { mode: "night", Icon: Moon, label: "Night" },
];

const ThemeToggle = ({ compact = false }: { compact?: boolean }) => {
  const { mode, setMode } = useTheme();
  // Unique per instance so the desktop and mobile toggles don't share a
  // layoutId (both live in the DOM at once).
  const layoutId = useId();
  const size = compact ? 30 : 34;

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-[var(--line)] bg-[var(--surface-3)] p-1"
    >
      {options.map(({ mode: m, Icon, label }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setMode(m)}
            className="relative flex items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
            style={{
              width: size,
              height: size,
              color: active ? "var(--brand-ink)" : "var(--ink-500)",
            }}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--brand-500)" }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative h-[16px] w-[16px]" strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
