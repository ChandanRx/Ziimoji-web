"use client";

/**
 * NightFX — injects two night-only DOM artefacts when data-theme="night":
 *
 * 1. A hidden SVG that defines the `ink-bleed` displacement filter.
 *    Cards reference it via `filter: url(#ink-bleed)`. The filter uses
 *    feTurbulence + feDisplacementMap to roughen the geometry just enough
 *    to read as hand-inked manga lines; it's too subtle to be dizzying.
 *
 * 2. A fixed, pointer-events-none `.grain-overlay` div that lays a
 *    shifting film-grain texture over the whole viewport.
 *
 * Both are unmounted in day/dusk and when the user prefers reduced motion.
 * No audio, no strobing — the grain animation is a slow steps(1) shift.
 */

import { useEffect, useState } from "react";
import { useTheme } from "@/component/ThemeProvider";

export default function NightFX() {
  const { band } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (band !== "night") return null;

  return (
    <>
      {/* ── SVG filter definitions ── rendered off-screen, 0×0 ── */}
      <svg
        aria-hidden
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          {/*
            ink-bleed: gentle feTurbulence displacement that roughens card
            edges and borders so they read like dried ink rather than CSS
            border-radius. Scale 1.8 is enough to feel hand-inked without
            causing layout jank or motion sickness.
          */}
          <filter
            id="ink-bleed"
            x="-4%"
            y="-4%"
            width="108%"
            height="108%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025 0.04"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Film grain overlay ── */}
      {!reducedMotion && (
        <div
          aria-hidden
          className="grain-overlay"
          /* Extra inline style fallback in case the Tailwind purge drops the class */
          style={{ mixBlendMode: "overlay" }}
        />
      )}
    </>
  );
}
