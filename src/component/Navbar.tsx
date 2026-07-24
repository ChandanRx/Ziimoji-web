"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Home, Search, Users, MessageCircle, Flame,
  Bookmark, Bell, User, Plus, Sparkles,
} from "lucide-react";

const user = { id: "123", name: "Chandan", handle: "@chandan_user" };

const links = [
  { href: "/", Icon: Home, label: "Home" },
  { href: "/search", Icon: Search, label: "Search" },
  { href: "/followers", Icon: Users, label: "Followers" },
  { href: "/chats", Icon: MessageCircle, label: "Chats" },
  { href: "/trending", Icon: Flame, label: "Trending" },
  { href: "/bookmarks", Icon: Bookmark, label: "Bookmarks" },
  { href: "/notifications", Icon: Bell, label: "Notifications" },
  { href: `/profile/${user.id}`, Icon: User, label: "Profile" },
];

/* The five that earn a slot on a phone */
const mobileLinks = [links[0], links[1], links[4], links[6], links[7]];

const notificationCount = 3;

const Logo = ({ compact = false }: { compact?: boolean }) => (
  <Link href="/" className="flex items-center gap-2.5 group">
    <div
      className="relative flex items-center justify-center rounded-[14px] shrink-0 transition-transform duration-200 group-hover:scale-105"
      style={{
        width: compact ? 32 : 38,
        height: compact ? 32 : 38,
        background: "var(--brand-grad)",
        boxShadow: "0 6px 16px -6px rgba(124,92,255,0.7)",
      }}
    >
      <Sparkles className={compact ? "w-4 h-4 text-white" : "w-[18px] h-[18px] text-white"} />
    </div>
    <span
      className={`font-bold tracking-tight grad-text ${compact ? "text-lg" : "text-[21px]"}`}
    >
      Zi!moji
    </span>
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─────────── Desktop sidebar ─────────── */}
      <aside className="hidden md:flex flex-col w-[264px] h-screen fixed z-50 bg-white border-r border-[var(--line)] px-4 pt-6 pb-5">
        <div className="px-2 mb-7">
          <Logo />
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {links.map(({ href, Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-[14px] text-[14px] font-medium transition-colors group"
                style={{ color: active ? "var(--brand-600)" : "var(--ink-500)" }}
              >
                {/* Animated active pill — slides between items */}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-[14px]"
                    style={{ background: "var(--brand-50)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}

                <span className="relative flex items-center justify-center w-5 h-5 shrink-0">
                  <Icon
                    className={`w-[19px] h-[19px] transition-colors ${
                      active ? "" : "text-[var(--ink-400)] group-hover:text-[var(--ink-700)]"
                    }`}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  {href === "/notifications" && notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold ring-2 ring-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </span>

                <span
                  className={`relative transition-colors ${
                    active ? "font-semibold" : "group-hover:text-[var(--ink-700)]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Primary CTA */}
          <Link
            href="/?compose=1"
            className="btn-brand mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-[14px] text-[14px] font-semibold"
          >
            <Plus className="w-4 h-4" strokeWidth={2.6} />
            Create post
          </Link>
        </nav>

        {/* User card */}
        <Link
          href={`/profile/${user.id}`}
          className="flex items-center gap-3 p-2.5 rounded-[16px] border border-[var(--line)] hover:bg-[var(--canvas)] transition-colors"
        >
          <div className="relative shrink-0">
            <img
              src="https://i.pravatar.cc/120?img=12"
              alt=""
              width={38}
              height={38}
              className="rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[13px] font-semibold text-[var(--ink-900)] truncate">
              {user.name}
            </span>
            <span className="text-[11.5px] text-[var(--ink-400)] truncate">{user.handle}</span>
          </div>
        </Link>
      </aside>

      {/* ─────────── Mobile top bar ─────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-4 glass border-b border-[var(--line)]">
        <Logo compact />
        <div className="flex items-center gap-1">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-500)]"
          >
            <Bell className="w-[19px] h-[19px]" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold ring-2 ring-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
          <Link href={`/profile/${user.id}`} className="relative ml-1">
            <img
              src="https://i.pravatar.cc/120?img=12"
              alt=""
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
          </Link>
        </div>
      </header>

      {/* ─────────── Mobile bottom tabs ─────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch glass border-t border-[var(--line)] pb-[env(safe-area-inset-bottom)]">
        {mobileLinks.map(({ href, Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
              style={{ color: active ? "var(--brand-600)" : "var(--ink-400)" }}
            >
              {active && (
                <motion.span
                  layoutId="tab-active"
                  className="absolute top-0 h-[3px] w-9 rounded-b-full"
                  style={{ background: "var(--brand-grad)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative flex items-center justify-center">
                <Icon className="w-[21px] h-[21px]" strokeWidth={active ? 2.5 : 2} />
                {href === "/notifications" && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold ring-2 ring-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
