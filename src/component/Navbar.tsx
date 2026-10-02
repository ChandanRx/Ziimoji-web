"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  HomeOutlined as Home,
  SearchOutlined as Search,
  TeamOutlined as Users,
  MessageOutlined as MessageCircle,
  FireOutlined as Flame,
  BookOutlined as Bookmark,
  BellOutlined as Bell,
  UserOutlined as User,
  PlusOutlined as Plus,
} from "@ant-design/icons";
import Logo from "@/component/Logo";

const user = { id: "123", name: "Chandan", handle: "@chandan_user" };

const links = [
  { href: "/", Icon: Home, label: "Home" },
  { href: "/search", Icon: Search, label: "Search" },
  { href: "/followers", Icon: Users, label: "Followers" },
  { href: "/chats", Icon: MessageCircle, label: "Chats" },
  { href: "/trending", Icon: Flame, label: "Trending" },
  { href: "/bookmarks", Icon: Bookmark, label: "Bookmarks" },
  { href: "/notifications", Icon: Bell, label: "Notifications" },
  { href: `/profile/${user.id}`, Icon: User, label: "Profile", hideDesktop: true },
];

/* The five that earn a slot on a phone */
const mobileLinks = [links[0], links[1], links[4], links[6], links[7]];

const notificationCount = 3;

const Navbar = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Auth screens are chrome-free — no app nav.
  if (pathname === "/signin" || pathname === "/signup") return null;

  return (
    <>
      {/* ─────────── Desktop sidebar ─────────── */}
      <aside className="hidden md:flex flex-col w-[80px] hover:w-[264px] transition-[width] duration-300 ease-in-out overflow-hidden h-screen fixed top-0 z-50 bg-white border-r border-neutral-200 px-3 pt-6 pb-5 group/sidebar hover:shadow-2xl hover:shadow-black/5">
        <div className="px-2 mb-7 overflow-hidden shrink-0">
          <Link href="/" className="flex items-center gap-2 h-[46px]">
            <img src="/logo_zm.png" alt="Zimoji" className="h-9 w-9 object-contain shrink-0 group-hover/sidebar:hidden block" />
            <img src="/logo.png" alt="Zimoji" className="h-[46px] object-contain shrink-0 hidden group-hover/sidebar:block" />
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.filter((l) => !l.hideDesktop).map(({ href, Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-4 px-3 py-3 rounded-xl text-[14px] transition-colors group"
                style={{ color: active ? "var(--brand-600)" : "var(--ink-500)" }}
              >
                <span className="relative flex items-center justify-center w-6 h-6 shrink-0">
                  <Icon
                    className={`text-[22px] transition-colors ${
                      active ? "" : "text-[var(--ink-400)] group-hover:text-[var(--ink-700)]"
                    }`}
                  />
                  {href === "/notifications" && notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold ring-2 ring-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </span>

                <span
                  className={`relative whitespace-nowrap opacity-0 w-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 pb-1 ${
                    active ? "font-bold" : "font-medium"
                  }`}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute bottom-0 inset-x-0 h-[3px] rounded-full"
                      style={{ background: "var(--brand-grad)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {!active && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] rounded-full bg-[var(--line)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </span>
              </Link>
            );
          })}

          {/* Primary CTA */}
          <Link
            href="/?compose=1"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-create-post"));
              }
            }}
            className="btn-brand mt-4 flex items-center justify-center group-hover/sidebar:justify-start gap-0 group-hover/sidebar:gap-3 h-[44px] w-[44px] group-hover/sidebar:w-full group-hover/sidebar:px-4 rounded-xl text-[14.5px] font-bold overflow-hidden transition-all duration-300 mx-auto group-hover/sidebar:mx-0 shadow-lg shadow-[#5c3aff]/25 hover:shadow-[#5c3aff]/40 active:scale-[0.96]"
          >
            <span className="shrink-0 flex items-center justify-center">
              <Plus className="text-[20px]" />
            </span>
            <span className="whitespace-nowrap opacity-0 w-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300">
              Create post
            </span>
          </Link>
        </nav>

        {/* User card */}
        <Link
          href={`/profile/${user.id}`}
          className="flex items-center gap-3 p-1.5 mt-4 rounded-xl border border-transparent hover:border-[var(--line)] hover:bg-[var(--canvas)] transition-all overflow-hidden w-[54px] group-hover/sidebar:w-full mx-auto group-hover/sidebar:mx-0"
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src="https://i.pravatar.cc/120?img=12"
              alt=""
              width={42}
              height={42}
              className="rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight opacity-0 w-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300">
            <span className="text-[13px] font-semibold text-[var(--ink-900)] whitespace-nowrap hover:underline underline-offset-2">
              {user.name}
            </span>
            <span className="text-[11.5px] text-[var(--ink-400)] whitespace-nowrap">{user.handle}</span>
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
            <Bell className="text-[20px]" />
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
                <Icon className="text-[21px]" />
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
