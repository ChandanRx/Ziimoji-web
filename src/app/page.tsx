"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import CreatePost from "@/component/CreatePost";

// Mock posts data
const initialPosts = [
  {
    id: "1",
    userId: "user1",
    username: "chandan_user",
    userAvatar: "https://i.pravatar.cc/120?img=12",
    content: "A few weeks ago, one of our clients flew down to India to work closely with our team. We were building a platform that's set to change how people book hotel experiences.",
    mood: "Happy",
    moodEmoji: "😊",
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
    moodEmoji: "😠",
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
    moodEmoji: "🤩",
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
    moodEmoji: "❤️",
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
    moodEmoji: "😎",
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
    moodEmoji: "😴",
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
    moodEmoji: "😂",
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
    moodEmoji: "😌",
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

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-50 via-purple-50/40 to-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto ml-72 pr-80">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Feed Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Home</h1>
            <p className="text-sm text-gray-500">See what's happening in your feed</p>
          </motion.div>

          {/* Create Post Component */}
          <CreatePost onPostCreate={handlePostCreate} />

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Load More Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center py-8"
          >
            <p className="text-sm text-gray-400">You're all caught up! 🎉</p>
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
