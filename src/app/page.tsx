"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import CreatePost from "@/component/CreatePost";
import StoryRail from "@/component/StoryRail";
import AnimatedEmoji from "@/component/AnimatedEmoji";

// Mock posts data
const initialPosts = [
  {
    id: "1",
    userId: "user1",
    username: "chandan_user",
    userAvatar: "https://i.pravatar.cc/120?img=12",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Happy",
    moodEmoji: "/emoji/happy.lottie",
    likes: 12,
    comments: 5,
    timestamp: "2 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1534471770828-9bde524ee634?w=900&h=700&fit=crop&auto=format&q=80", // bright friends / happy
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    userId: "user2",
    username: "emoji_lover",
    userAvatar: "https://i.pravatar.cc/120?img=1",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Angry",
    moodEmoji: "/emoji/angry.lottie",
    likes: 12,
    comments: 3,
    timestamp: "4 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=900&h=700&fit=crop&auto=format&q=80", // expressive face / intense
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    userId: "user3",
    username: "mood_master",
    userAvatar: "https://i.pravatar.cc/120?img=2",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Excited",
    moodEmoji: "/emoji/excited.lottie",
    likes: 12,
    comments: 5,
    timestamp: "6 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=900&h=700&fit=crop&auto=format&q=80", // concert / crowd / excitement
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "4",
    userId: "user4",
    username: "happy_vibes",
    userAvatar: "https://i.pravatar.cc/120?img=3",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Love",
    moodEmoji: "/emoji/love.lottie",
    likes: 12,
    comments: 5,
    timestamp: "8 hours ago",
    imageUrl:
      "https://imgs.search.brave.com/krclVAus88WkhDF191HMFsFestQoxH6hmDoaSQNaH4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIx/NjE4MDcwNS9waG90/by95b3VuZy1ndXkt/ZW5qb3lpbmctdHJh/dmVsaW5nLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz01VC1R/T2VENlczNzM2SGhZ/NWZ0UlBfOHlERlcx/X2QtZXJKOEZ3QWRW/YjJnPQ", // couple / love
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "5",
    userId: "user5",
    username: "cool_emojis",
    userAvatar: "https://i.pravatar.cc/120?img=4",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Cool",
    moodEmoji: "/emoji/cool.lottie",
    likes: 12,
    comments: 5,
    timestamp: "10 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=700&fit=crop&auto=format&q=80", // stylish portrait / sunglasses
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "6",
    userId: "user6",
    username: "trending_now",
    userAvatar: "https://i.pravatar.cc/120?img=5",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Tired",
    moodEmoji: "/emoji/tired.lottie",
    likes: 12,
    comments: 5,
    timestamp: "12 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=900&h=700&fit=crop&auto=format&q=80", // person sleeping / tired
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "7",
    userId: "user7",
    username: "funny_moments",
    userAvatar: "https://i.pravatar.cc/120?img=6",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Funny",
    moodEmoji: "/emoji/funny.lottie",
    likes: 12,
    comments: 5,
    timestamp: "14 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=900&h=700&fit=crop&auto=format&q=80", // people laughing
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "8",
    userId: "user8",
    username: "calm_soul",
    userAvatar: "https://i.pravatar.cc/120?img=7",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Calm",
    moodEmoji: "/emoji/calm.lottie",
    likes: 12,
    comments: 5,
    timestamp: "16 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&h=700&fit=crop&auto=format&q=80", // calm landscape / nature
    isLiked: false,
    isBookmarked: false,
  },
];

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  mood: string;
  moodEmoji: string;
  likes: number;
  comments: number;
  timestamp: string;
  imageUrl?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<"For you" | "Following">("For you");

  const handlePostCreate = (newPost: {
    content: string;
    mood: string;
    moodEmoji: string;
    imageUrl?: string;
  }) => {
    const post = {
      id: `post-${Date.now()}`,
      userId: "123",
      username: "chandan_user",
      userAvatar: "https://i.pravatar.cc/120?img=12",
      content: newPost.content,
      mood: newPost.mood,
      moodEmoji: newPost.moodEmoji,
      likes: 0,
      comments: 0,
      timestamp: "just now",
      ...(newPost.imageUrl && { imageUrl: newPost.imageUrl }),
      isLiked: false,
      isBookmarked: false,
    };

    // Add new post to the beginning of the array
    setPosts([post, ...posts]);
  };

  const tabs = ["For you", "Following"] as const;

  return (
    <div className="flex h-screen">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        {/* Sticky glass header with segmented tabs */}
        {/* top-0 is relative to the scrollport, whose pt-14 already clears the fixed mobile bar */}
        <div className="sticky top-0 z-30 glass border-b border-[var(--line)]">
          <div className="max-w-2xl mx-auto px-4 pt-4 pb-0">
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--ink-900)]">Home</h1>
            <div className="flex gap-1 mt-2">
              {tabs.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
                    style={{ color: active ? "var(--brand-600)" : "var(--ink-400)" }}
                  >
                    {tab}
                    {active && (
                      <motion.span
                        layoutId="feed-tab"
                        className="absolute bottom-0 inset-x-2 h-[3px] rounded-t-full"
                        style={{ background: "var(--brand-grad)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5">
          <StoryRail />

          <CreatePost onPostCreate={handlePostCreate} />

          {/* Posts Feed */}
          <div className="space-y-5">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.35, ease: "easeOut" }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* End of feed */}
          <div className="flex flex-col items-center gap-2 py-10">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{ background: "var(--brand-50)" }}
            >
              <AnimatedEmoji src="/emoji/party.lottie" size={24} label="Celebration" />
            </div>
            <p className="text-[13px] font-medium text-[var(--ink-500)]">
              You&apos;re all caught up
            </p>
            <p className="text-[12px] text-[var(--ink-400)]">
              Check back later for more moods
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
