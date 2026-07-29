"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import { FaArrowLeft, FaHeart, FaReply } from "react-icons/fa";
import { celebrate } from "@/lib/confetti";

interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

// Mock data - in production, fetch from API
const mockPosts: Record<string, any> = {
  "1": {
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
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop",
    isLiked: false,
    isBookmarked: false,
  },
};

const mockComments: Comment[] = [
  {
    id: "c1",
    userId: "user2",
    username: "emoji_lover",
    userAvatar: "https://i.pravatar.cc/120?img=1",
    content: "This is amazing! Love the concept!",
    timestamp: "1 hour ago",
    likes: 5,
    isLiked: false,
  },
  {
    id: "c2",
    userId: "user3",
    username: "mood_master",
    userAvatar: "https://i.pravatar.cc/120?img=2",
    content: "Great work! Can't wait to see more updates!",
    timestamp: "45 minutes ago",
    likes: 3,
    isLiked: true,
  },
  {
    id: "c3",
    userId: "user4",
    username: "happy_vibes",
    userAvatar: "https://i.pravatar.cc/120?img=3",
    content: "So inspiring! Keep it up!",
    timestamp: "30 minutes ago",
    likes: 2,
    isLiked: false,
  },
];

export default function PostDiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [post, setPost] = useState(mockPosts[postId] || null);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [currentUser] = useState({
    id: "123",
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      content: newComment.trim(),
      timestamp: "just now",
      likes: 0,
      isLiked: false,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  if (!post) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-center py-12">
              <p className="text-slate-400">Post not found</p>
              <Link href="/" className="text-violet-600 hover:underline mt-4 inline-block">
                Go back home
              </Link>
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[264px] lg:pr-80">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span className="font-medium">Back</span>
          </motion.button>

          {/* Post Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <PostCard
              post={post}
              onLike={(liked) => {
                // A bigger, page-level celebration when liking from the post's
                // own detail page.
                if (liked) celebrate({ x: 0.5, y: 0.35 });
              }}
            />
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Discussion ({comments.length})
            </h2>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex items-start gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-slate-200 object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 rounded-xl border border-slate-200 
                             focus:border-violet-400 focus:outline-none
                             resize-none text-slate-900 placeholder-slate-400
                             transition-all duration-300"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!newComment.trim()}
                      className={`px-4 py-2 rounded-lg font-semibold text-white
                               transition-all duration-300
                               ${newComment.trim()
                                 ? "bg-violet-600 hover:bg-violet-700"
                                 : "bg-slate-200 cursor-not-allowed"
                               }`}
                    >
                      Comment
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  className="flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Link href={`/profile/${comment.userId}`}>
                    <img
                      src={comment.userAvatar}
                      alt={comment.username}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-slate-200 object-cover hover:border-violet-300 transition-colors cursor-pointer"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/profile/${comment.userId}`}>
                        <span className="font-semibold text-slate-900 hover:text-violet-600 transition-colors cursor-pointer">
                          {comment.username}
                        </span>
                      </Link>
                      <span className="text-xs text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          comment.isLiked
                            ? "text-red-500"
                            : "text-slate-500 hover:text-red-500"
                        }`}
                      >
                        <FaHeart className={comment.isLiked ? "fill-current" : ""} />
                        <span>{comment.likes}</span>
                      </motion.button>
                      <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition-colors">
                        <FaReply />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}

