"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FaUserCircle } from "react-icons/fa";

interface RightSidebarProps {
  currentUser?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

const RightSidebar = ({ currentUser }: RightSidebarProps) => {
  const user = currentUser || {
    id: "123",
    name: "Chandan",
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  const suggestions = [
    {
      id: "1",
      username: "emoji_lover",
      name: "Emoji Lover",
      avatar: "https://i.pravatar.cc/120?img=1",
      isVerified: false,
    },
    {
      id: "2",
      username: "mood_master",
      name: "Mood Master",
      avatar: "https://i.pravatar.cc/120?img=2",
      isVerified: true,
    },
    {
      id: "3",
      username: "happy_vibes",
      name: "Happy Vibes",
      avatar: "https://i.pravatar.cc/120?img=3",
      isVerified: false,
    },
    {
      id: "4",
      username: "cool_emojis",
      name: "Cool Emojis",
      avatar: "https://i.pravatar.cc/120?img=4",
      isVerified: false,
    },
    {
      id: "5",
      username: "trending_now",
      name: "Trending Now",
      avatar: "https://i.pravatar.cc/120?img=5",
      isVerified: true,
    },
  ];

  return (
    <aside className="hidden lg:block w-80 h-screen fixed right-0 top-0 overflow-y-auto bg-gradient-to-b from-white via-slate-50 to-purple-50/40 border-l border-slate-200/70 shadow-[0_18px_45px_rgba(148,163,184,0.35)]">
      <div className="p-6 space-y-6">
        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 py-2"
        >
          <Link href={`/profile/${user.id}`} className="flex items-center gap-3 flex-1 group">
            <div className="relative">
              <img
                src={user.avatar || `https://i.pravatar.cc/120?img=12`}
                alt={user.name}
                width={56}
                height={56}
                className="rounded-full border-2 border-slate-200 object-cover group-hover:border-fuchsia-300 transition-colors shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-[0_0_10px_rgba(52,211,153,0.75)]"></div>
            </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm group-hover:text-fuchsia-600 transition-colors truncate">
                {user.username}
              </div>
                <div className="text-sm text-slate-500 truncate">{user.name}</div>
            </div>
          </Link>
          <button className="text-fuchsia-500 hover:text-fuchsia-600 text-sm font-semibold transition-colors">
            Switch
          </button>
        </motion.div>

        {/* Suggestions Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500">Suggestions for you</h3>
            <button className="text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors">
              See All
            </button>
          </div>

          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                className="flex items-center gap-3 group"
              >
                <Link
                  href={`/profile/${suggestion.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={suggestion.avatar}
                      alt={suggestion.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-slate-200 object-cover group-hover:border-fuchsia-300 transition-colors"
                    />
                    {suggestion.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.8)]">
                        <span className="text-white text-[8px]">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 group-hover:text-fuchsia-600 transition-colors truncate">
                      {suggestion.username}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {suggestion.isVerified ? "Verified" : "Suggested for you"}
                    </div>
                  </div>
                </Link>
                <button className="text-fuchsia-500 hover:text-fuchsia-600 text-xs font-semibold transition-colors flex-shrink-0">
                  Follow
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="pt-4 border-t border-slate-200/80"
        >
          <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">
            <a href="#" className="hover:underline">
              About
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Help
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Press
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              API
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Jobs
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Location
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Language
            </a>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 Zi!moji
          </div>
        </motion.div>
      </div>
    </aside>
  );
};

export default RightSidebar;

