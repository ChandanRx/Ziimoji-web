import Link from "next/link";

/**
 * Grimoire brand mark — a single staring eye drawn in one rounded stroke,
 * the pupil a solid dot. The outline uses `currentColor`, so it takes the
 * surrounding ink (charcoal by day, bone-white at night); the pupil is always
 * the band accent, which means it bleeds blood-red once night falls.
 */
export const GrimoireMark = ({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 96 96"
    fill="none"
    role="img"
    aria-label="Grimoire"
    className={className}
  >
    <g
      stroke="currentColor"
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* eye */}
      <path d="M10 48q38 -30 76 0q-38 30 -76 0Z" />
      {/* iris */}
      <circle cx="48" cy="48" r="15" />
    </g>
    {/* pupil — always the band accent */}
    <circle cx="48" cy="48" r="6.5" fill="var(--brand-500)" />
  </svg>
);

/**
 * Full horizontal lockup: mark + "Grimoire" wordmark in solid ink. The eye's
 * pupil carries the band accent. At night, hovering the wordmark triggers a
 * brief glitch desync (CSS pseudo-element, respects prefers-reduced-motion).
 */
export const GrimoireLogo = ({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string;
}) => (
  <Link href={href} className="flex items-center gap-2.5 group">
    <GrimoireMark
      size={compact ? 30 : 38}
      className="shrink-0 text-[var(--ink-900)] transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-6"
    />
    <span
      data-text="Grimoire"
      className={`glitch-hover font-extrabold tracking-tight text-[var(--ink-900)] ${
        compact ? "text-lg" : "text-[22px]"
      }`}
    >
      Grimoire
    </span>
  </Link>
);

export default GrimoireLogo;
