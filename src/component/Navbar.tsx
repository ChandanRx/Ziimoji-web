"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Home, Search, Users, MessageCircle, Flame,
  Bookmark, Bell, User,
} from "lucide-react";
import { GrimoireLogo } from "./GrimoireLogo";
import ThemeToggle from "./ThemeToggle";

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

const Navbar = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─────────── Desktop rail (flat, no container) ─────────── */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen fixed left-0 top-0 z-50 px-4 pt-7 pb-4 border-r border-[var(--line)]">
        <div className="px-2.5 mb-8">
          <GrimoireLogo />
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ href, Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-3.5 px-2.5 h-[52px] text-[15px] transition-colors group"
                style={{ color: active ? "var(--ink-900)" : "var(--ink-500)" }}
              >
                <span className="relative flex items-center justify-center w-6 h-6 shrink-0">
                  <Icon
                    className="w-[23px] h-[23px] transition-colors"
                    style={{ color: active ? "var(--brand-500)" : "inherit" }}
                    strokeWidth={active ? 2.3 : 2}
                  />
                  {href === "/notifications" && notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[var(--brand-500)] text-[var(--brand-ink)] text-[9px] font-bold ring-2 ring-[var(--app-bg)]">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </span>

                {/* Label with an animated active underline */}
                <span
                  className={`relative transition-colors ${
                    active ? "font-semibold" : "font-medium group-hover:text-[var(--ink-900)]"
                  }`}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full"
                      style={{ background: "var(--brand-500)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* User row + theme toggle */}
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/profile/${user.id}`}
            className="flex flex-1 min-w-0 items-center gap-3 p-2.5 rounded-[18px] hover:bg-[var(--canvas)] transition-colors"
          >
            <div className="relative shrink-0">
              <img
                src="https://i.pravatar.cc/120?img=12"
                alt=""
                width={42}
                height={42}
                className="rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--success)] ring-2 ring-[var(--app-bg)]" />
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[14px] font-semibold text-[var(--ink-900)] truncate">
                {user.name}
              </span>
              <span className="text-[12px] text-[var(--ink-500)] truncate">{user.handle}</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </aside>

      {/* ─────────── Mobile top bar ─────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-4 glass border-b border-[var(--line)]">
        <GrimoireLogo compact />
        <div className="flex items-center gap-1">
          <ThemeToggle compact />
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-500)]"
          >
            <Bell className="w-[20px] h-[20px]" strokeWidth={2} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-[var(--brand-500)] text-[var(--brand-ink)] text-[9px] font-bold ring-2 ring-[var(--app-bg)]">
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
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[var(--success)] ring-2 ring-[var(--app-bg)]" />
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
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[54px]"
              style={{ color: active ? "var(--brand-500)" : "var(--ink-400)" }}
            >
              {active && (
                <motion.span
                  layoutId="tab-active"
                  className="absolute top-0 h-[3px] w-9 rounded-b-full"
                  style={{ background: "var(--brand-500)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative flex items-center justify-center">
                <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 2} />
                {href === "/notifications" && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-[var(--brand-500)] text-[var(--brand-ink)] text-[9px] font-bold ring-2 ring-[var(--app-bg)]">
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
