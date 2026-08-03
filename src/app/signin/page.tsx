"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthShell, { AuthField } from "@/component/AuthShell";

/** A neutral "continue with provider" button. */
function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-[var(--line)] bg-white py-2.5 text-[13.5px] font-semibold text-[var(--ink-700)] transition-colors hover:bg-[var(--canvas)]"
    >
      {icon}
      {label}
    </button>
  );
}

const GoogleG = (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 35.9 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

export default function SignInPage() {
  const [showPw, setShowPw] = useState(false);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where your mood left off."
      footer={
        <>
          New to Zimoji?{" "}
          <Link href="/signup" className="font-semibold grad-text">
            Create an account
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4"
      >
        <div className="flex gap-3">
          <SocialButton label="Google" icon={GoogleG} />
          <SocialButton
            label="Apple"
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.7zM14.2 5.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-1 2.7 1 .1 2-.4 2.7-1.1z" />
              </svg>
            }
          />
        </div>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-[var(--line)]" />
          <span className="text-[12px] font-medium text-[var(--ink-400)]">or with email</span>
          <span className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="h-[18px] w-[18px]" />}
        />

        <AuthField
          id="password"
          label="Password"
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock className="h-[18px] w-[18px]" />}
          trailing={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-400)] hover:bg-black/[0.05]"
            >
              {showPw ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-[13px]">
          <label className="flex select-none items-center gap-2 text-[var(--ink-500)]">
            <input type="checkbox" className="h-4 w-4 rounded accent-[var(--brand-600)]" />
            Remember me
          </label>
          <Link href="#" className="font-semibold text-[var(--brand-600)] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn-brand flex w-full items-center justify-center gap-2 rounded-sm py-3 text-[14.5px] font-semibold text-white"
        >
          Sign in
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </form>
    </AuthShell>
  );
}
