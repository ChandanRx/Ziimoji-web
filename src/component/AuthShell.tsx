"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import Logo from "@/component/Logo";

/**
 * Centered minimalist auth layout.
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
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
      {/* Soft decorative blooms */}
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-purple-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-green-100/40 blur-[100px]" />

      <main className="relative z-10 w-full max-w-[420px] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {/* Large Centered Logo */}
          <div className="mb-6 flex flex-col items-center">
            <Logo compact={false} href={null} />
          </div>

          <p className="mb-10 text-[14px] text-neutral-500 text-center font-medium">
            {subtitle}
          </p>

          <div className="w-full">{children}</div>

          <div className="mt-8 text-center text-[13.5px] text-neutral-500 font-medium">
            {footer}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/** A clean rounded input with a leading icon, matching new design. */
export function AuthField({
  id,
  type = "text",
  placeholder,
  icon,
  autoComplete,
  trailing,
  helpText,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  icon: ReactNode;
  autoComplete?: string;
  trailing?: ReactNode;
  helpText?: ReactNode;
}) {
  return (
    <div className="relative mb-3.5">
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 text-neutral-400">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-[44px] pr-12 text-[14px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 hover:border-neutral-300"
        />
        {trailing && (
          <span className="absolute right-3 text-neutral-400">{trailing}</span>
        )}
      </div>
      {helpText && (
        <div className="mt-2 pl-3">
          <span className="text-[11px] text-neutral-400">{helpText}</span>
        </div>
      )}
    </div>
  );
}
