"use client";

import { useState } from "react";
import Link from "next/link";
import { UserOutlined as User, MailOutlined as Mail, LockOutlined as Lock, EyeOutlined as Eye, EyeInvisibleOutlined as EyeOff } from "@ant-design/icons";
import AuthShell, { AuthField } from "@/component/AuthShell";

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-3.5 text-[14px] font-bold text-neutral-900 transition-colors hover:bg-neutral-50"
    >
      {icon}
      {label}
    </button>
  );
}

const GoogleG = (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 35.9 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

export default function SignUpPage() {
  const [showPw, setShowPw] = useState(false);

  return (
    <AuthShell
      title=""
      subtitle="Create your account to join Zimoji"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-bold text-[#5c3aff] hover:underline">
            Log In
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
        <AuthField
          id="name"
          placeholder="Full name"
          autoComplete="name"
          icon={<User className="text-[20px]" />}
        />

        <AuthField
          id="email"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          icon={<Mail className="text-[20px]" />}
        />

        <AuthField
          id="password"
          type={showPw ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          icon={<Lock className="text-[20px]" />}
          helpText="Use at least 8 characters"
          trailing={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors outline-none"
            >
              {showPw ? <EyeOff className="text-[20px] text-neutral-500" /> : <Eye className="text-[20px] text-neutral-500" />}
            </button>
          }
        />

        <button
          type="submit"
          className="mt-3 w-full rounded-xl bg-[#5c3aff] hover:bg-[#5233e5] active:scale-[0.98] py-3.5 text-[14.5px] font-bold text-white transition-all outline-none"
        >
          Create Account
        </button>

        <div className="my-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">or</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <div className="flex flex-col gap-3.5">
          <SocialButton label="Continue with Google" icon={GoogleG} />
          <SocialButton
            label="Continue with Apple"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.7zM14.2 5.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-1 2.7 1 .1 2-.4 2.7-1.1z" />
              </svg>
            }
          />
        </div>
      </form>
    </AuthShell>
  );
}
