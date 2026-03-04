"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Heart, Sparkles, Orbit } from "lucide-react";
import {
  FaHome,
  FaUserFriends,
  FaRegCommentDots,
  FaUserCircle,
  FaSearch,
  FaFire,
  FaBookmark,
  FaBell,
} from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const user = { id: "123", name: "Chandan" };

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navItemRefs = useRef<HTMLDivElement[]>([]);
  const userRef = useRef<HTMLDivElement | null>(null);

  const links = [
    { href: "/", icon: <FaHome />, label: "Home" },
    { href: "/search", icon: <FaSearch />, label: "Search" },
    { href: "/followers", icon: <FaUserFriends />, label: "Followers" },
    { href: "/chats", icon: <FaRegCommentDots />, label: "Chats" },
    { href: "/trending", icon: <FaFire />, label: "Trending" },
    { href: "/bookmarks", icon: <FaBookmark />, label: "Bookmarks" },
    { href: "/notifications", icon: <FaBell />, label: "Notifications" },
    { href: `/profile/${user.id}`, icon: <FaUserCircle />, label: "Profile" },
  ];

  const notificationCount = 3; // Example notification count

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (!sidebarRef.current) return;

    gsap.fromTo(
      sidebarRef.current,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.9, opacity: 0, y: -12 },
        { scale: 1, opacity: 1, y: 0, delay: 0.15, duration: 0.5, ease: "back.out(1.8)" }
      );
    }

    if (navItemRefs.current.length) {
      gsap.fromTo(
        navItemRefs.current,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.05,
          delay: 0.25,
        }
      );
    }

    if (userRef.current) {
      gsap.fromTo(
        userRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.45, duration: 0.45, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="hidden md:flex flex-col w-72 h-screen fixed z-50 bg-gradient-to-b from-white via-slate-50 to-purple-50/60 backdrop-blur-xl border-r border-slate-200/70 shadow-[0_18px_45px_rgba(148,163,184,0.45)]"
    >
      {/* Content container */}
      <div className="relative flex flex-col h-full overflow-y-auto p-6 space-y-4">
        {/* Logo Section */}
        <div ref={logoRef}>
          <Link
            href="/"
            className="flex items-center justify-center mb-12 group"
          >
            <div className="relative inline-flex items-center justify-center">
              {/* Outer soft glow ring */}
              <div className="absolute -inset-3 -z-20 rounded-3xl bg-gradient-to-tr from-fuchsia-300 via-amber-200 to-sky-300 opacity-70 blur-2xl group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon badge + wordmark */}
              <div className="relative flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-2 shadow-[0_18px_40px_rgba(148,163,184,0.7)] border border-white/80 backdrop-blur-2xl">
                {/* Icon bubble */}
                <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-400 via-amber-300 to-sky-400 shadow-[0_10px_25px_rgba(251,113,133,0.55)] overflow-hidden">
                  <span className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_0_0,white,transparent_60%)]" />
                  <Heart className="relative w-5 h-5 text-white" />
                </div>

                {/* Wordmark */}
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 via-amber-400 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(251,113,133,0.5)]">
                      Zi
                    </span>
                    <span className="text-[22px] font-semibold tracking-tight text-slate-900">
                      !moji
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Mood · Emoji · Stories
                  </span>
                </div>
              </div>

              {/* Floating accent icons */}
              <motion.span
                className="absolute -top-4 -right-4 text-2xl text-fuchsia-400"
                animate={{ y: [-4, 4, -4], rotate: [-8, 6, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.span>
              <motion.span
                className="absolute -bottom-4 -left-3 text-xl text-sky-400"
                animate={{ y: [3, -3, 3], rotate: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <Orbit className="w-4 h-4" />
              </motion.span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link, index) => {
            const active = isActive(link.href);
            return (
              <div
                key={link.href}
                ref={(el) => {
                  if (el) {
                    navItemRefs.current[index] = el;
                  }
                }}
              >
                <Link
                  href={link.href}
                  className={`
                    relative flex items-center gap-4 px-3 py-2 rounded-xl group
                    transition-all duration-300 ease-out
                    ${active
                      ? "bg-white shadow-[0_14px_35px_rgba(148,163,184,0.5)] ring-1 ring-fuchsia-300/80"
                      : "bg-transparent hover:bg-white/70 hover:shadow-[0_10px_25px_rgba(148,163,184,0.35)] hover:ring hover:ring-fuchsia-200/70"}
                  `}
                >
                  {/* Active gradient bar */}
                  {active && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute inset-y-1 left-1 w-[3px] rounded-full bg-gradient-to-b from-fuchsia-400 via-amber-300 to-sky-400"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon container */}
                  <motion.span
                    className={`
                      relative z-10 text-lg transition-all duration-300
                      ${active
                        ? "text-fuchsia-500 scale-110"
                        : "text-slate-500 group-hover:text-fuchsia-500 group-hover:scale-105"}
                    `}
                    whileHover={{ rotate: active ? 0 : 5 }}
                  >
                    {link.icon}
                  </motion.span>

                  {/* Label */}
                  <span
                    className={`
                      relative z-10 font-medium text-sm tracking-wide transition-all duration-300
                      ${active
                        ? "text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900"}
                    `}
                  >
                    {link.label}
                  </span>

                  {/* Notification badge for notifications */}
                  {link.href === "/notifications" && notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold z-20 shadow-[0_0_14px_rgba(244,63,94,0.8)]"
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </motion.div>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom user info */}
        {user && (
          <div ref={userRef} className="mt-4">
            <Link
              href={`/profile/${user.id}`}
              className="relative flex items-center gap-3 p-3 rounded-2xl
                       bg-white/90 border border-slate-200/80
                       hover:bg-white hover:border-fuchsia-300/70 hover:shadow-[0_14px_30px_rgba(148,163,184,0.5)]
                       transition-all duration-300 group"
            >
              {/* Avatar */}
              <div className="relative">
                <motion.img
                  src="https://i.pravatar.cc/120?img=12"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-slate-200 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
                {/* Online indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-[0_0_10px_rgba(52,211,153,0.7)]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-slate-900 font-semibold text-sm truncate">
                  {user.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-slate-500 text-xs font-medium">Online</span>
                </div>
              </div>

              {/* Hover arrow */}
              <motion.div
                className="text-slate-400 group-hover:text-slate-700 transition-colors text-sm"
                initial={{ x: -3 }}
                whileHover={{ x: 0 }}
              >
                →
              </motion.div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Navbar;
