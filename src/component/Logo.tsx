import Link from "next/link";

export const LogoMark = ({
  size = 38,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <span
      aria-hidden
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src="/logo.png"
        alt="Zimoji"
        width={size}
        height={size}
        className="w-full h-full object-contain rounded-xl"
      />
    </span>
  );
};

/**
 * Full Zimoji logo — renders the ChatGPT logo image from utils.
 */
const Logo = ({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string | null;
}) => {
  const height = compact ? 34 : 42;
  const inner = (
    <img
      src="/logo.png"
      alt="Zimoji"
      height={height}
      className={`object-contain ${compact ? "h-8" : "h-10"} max-w-[170px]`}
    />
  );

  if (href === null) {
    return <span className="flex items-center gap-2 group cursor-pointer">{inner}</span>;
  }
  return (
    <Link href={href} className="flex items-center gap-2 group">
      {inner}
    </Link>
  );
};

export default Logo;
