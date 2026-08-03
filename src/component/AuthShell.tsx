"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import Logo, { LogoMark } from "@/component/Logo";
import AnimatedEmoji from "@/component/AnimatedEmoji";
import { moods } from "@/lib/moods";

/**
 * Split-screen auth layout: a brand panel on the left (desktop only) and the
 * form on the right. Shared by the sign-in and sign-up screens.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--canvas)]">
      {/* ── Brand panel ── */}
      <aside
        className="relative hidden w-[46%] max-w-[560px] flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ background: "var(--brand-grad)" }}
      >
        {/* soft decorative blobs */}
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <LogoMark size={40} className="ring-2 ring-white/40" />
          <span className="text-[22px] font-extrabold tracking-tight text-white">Zimoji</span>
        </div>

        <div className="relative">
          <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-tight">
            Express every
            <br />
            mood you feel.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/85">
            Turn feelings into pixels — share your vibe with animated emojis,
            visuals, and the people who get you.
          </p>

          {/* floating mood emojis */}
          <div className="mt-8 flex items-center gap-3">
            {moods.map((m, i) => (
              <motion.span
                key={m.label}
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25"
                title={m.label}
              >
                <AnimatedEmoji src={m.lottie} size={26} label={m.label} />
              </motion.span>
            ))}
          </div>
        </div>

        <p className="relative text-[12.5px] text-white/70">
          &copy; 2025 Zimoji · Made with mood.
        </p>
      </aside>

      {/* ── Form side ── */}
      <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="text-[27px] font-extrabold tracking-tight text-[var(--ink-900)]">
            {title}
          </h1>
          <p className="mt-1.5 text-[14px] text-[var(--ink-400)]">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <div className="mt-7 text-center text-[13.5px] text-[var(--ink-500)]">{footer}</div>
        </motion.div>
      </main>
    </div>
  );
}

/** A labelled input with a leading icon, used across the auth forms. */
export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: ReactNode;
  autoComplete?: string;
  trailing?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[var(--ink-700)]">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-400)]">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-sm border border-[var(--line)] bg-white py-3 pl-11 pr-11 text-[14.5px] text-[var(--ink-900)] outline-none transition-shadow placeholder:text-[var(--ink-400)] focus:border-[var(--brand-500)] focus:shadow-[0_0_0_3px_var(--brand-50)]"
        />
        {trailing && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>
    </div>
  );
}
