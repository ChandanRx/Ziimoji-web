import Link from "next/link";

/** The Zimoji glyph — a smiley emoji face on a rounded brand-gradient tile. */
export const LogoMark = ({
  size = 38,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <span
    aria-hidden
    className={`relative inline-flex items-center justify-center rounded-[28%] shrink-0 ${className}`}
    style={{
      width: size,
      height: size,
      background: "var(--brand-grad)",
      boxShadow: "0 6px 16px -6px rgba(124,92,255,0.55)",
    }}
  >
    <svg viewBox="0 0 24 24" width={size * 0.64} height={size * 0.64} fill="none">
      <circle cx="8.6" cy="9.8" r="1.55" fill="#fff" />
      <circle cx="15.4" cy="9.8" r="1.55" fill="#fff" />
      <path
        d="M6.8 14c1.3 2.1 3.1 3.2 5.2 3.2S15.9 16.1 17.2 14"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

/**
 * Full Zimoji logo — mark + wordmark. Renders as a link to `href` (default "/"),
 * or as a plain span when `href` is null (e.g. on auth screens).
 */
const Logo = ({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string | null;
}) => {
  const inner = (
    <>
      <LogoMark
        size={compact ? 32 : 38}
        className="transition-transform duration-200 group-hover:scale-105"
      />
      <span
        className={`font-extrabold tracking-tight grad-text ${compact ? "text-lg" : "text-[21px]"}`}
      >
        Zimoji
      </span>
    </>
  );

  if (href === null) {
    return <span className="flex items-center gap-2.5 group">{inner}</span>;
  }
  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      {inner}
    </Link>
  );
};

export default Logo;
