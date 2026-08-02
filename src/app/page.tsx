"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Moon } from "lucide-react";
import PostCard from "@/component/PostCard";
import RightSidebar from "@/component/RightSidebar";
import CreatePost from "@/component/CreatePost";
import { useTheme } from "@/component/ThemeProvider";

type StoryTone = "normal" | "horror";

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  content: string;
  tone: StoryTone;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const normalDemoPosts: Post[] = [
  {
    id: "day-1",
    userId: "user1",
    username: "morning_pages",
    userAvatar: "https://i.pravatar.cc/120?img=11",
    title: "The Tea Stall Notebook",
    content:
      "Anaya stopped at the same tea stall every morning before class. The owner never asked for her order anymore; he only slid the clay cup across the counter and pointed at the little blue notebook beside the sugar jar.\n\nPeople had started leaving tiny stories there. One page held a goodbye that ended in forgiveness. Another had a recipe written like a memory. Today Anaya added one line: \"I am trying again, but softly this time.\" When she came back in the evening, someone had written below it, \"That still counts.\"",
    tone: "normal",
    likes: 312,
    comments: 48,
    timestamp: "2 hours ago",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "day-2",
    userId: "user2",
    username: "bus_window",
    userAvatar: "https://i.pravatar.cc/120?img=15",
    title: "Seat by the Window",
    content:
      "The bus was late, the rain was early, and Kabir had forgotten his umbrella again. He took the last window seat and watched the city turn silver in the glass.\n\nAt the next stop, an old school friend climbed in with two coffees and the same laugh he remembered from years ago. They talked through traffic, missed their stops, and got down three neighborhoods away from where either of them meant to be. It felt less like getting lost and more like the day had made room for them.",
    tone: "normal",
    likes: 208,
    comments: 33,
    timestamp: "4 hours ago",
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "day-3",
    userId: "user3",
    username: "sunlit_draft",
    userAvatar: "https://i.pravatar.cc/120?img=18",
    title: "A Letter Never Posted",
    content:
      "Meera found the letter while cleaning the top shelf, folded into an old train ticket. It was from her father, written the year she left home and too proud to call.\n\nThe letter did not explain everything. It did not erase the silence. But it asked one simple question: \"Are you eating well?\" She laughed, then cried, then cooked his favorite dal from memory. By night she had written back, even though there was no address anymore. Some replies are meant for the living. Some are meant for the part of us that waited.",
    tone: "normal",
    likes: 512,
    comments: 91,
    timestamp: "6 hours ago",
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "day-4",
    userId: "user4",
    username: "city_bloom",
    userAvatar: "https://i.pravatar.cc/120?img=20",
    title: "Balcony Garden",
    content:
      "Rafi planted coriander in a cracked paint bucket because the balcony was too small for proper pots. Then came mint in a lunchbox, basil in a broken mug, and tomatoes in a plastic tub rescued from the storeroom.\n\nEvery morning, his neighbor leaned over the railing to ask what had grown. Every evening, he sent something across: three leaves, one green chili, half a joke. By summer, the whole floor smelled like soil after watering, and no one on the corridor ate alone.",
    tone: "normal",
    likes: 274,
    comments: 40,
    timestamp: "8 hours ago",
    isLiked: true,
    isBookmarked: false,
  },
];

const horrorDemoPosts: Post[] = [
  {
    id: "night-1",
    userId: "user5",
    username: "cold_spot",
    userAvatar: "https://i.pravatar.cc/120?img=7",
    title: "The Room That Waited",
    content:
      "The guest room door had been painted shut before we moved in. The landlord said the last tenant was eccentric, the kind of person who nailed furniture to the floor and labeled every light switch.\n\nOn the third night, something knocked from inside.\n\nI told myself old houses breathe. Pipes tick. Wood settles. Then the knocking paused, and a careful voice said my name exactly the way my mother used to say it when she was trying not to wake anyone else.",
    tone: "horror",
    likes: 421,
    comments: 66,
    timestamp: "1 hour ago",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "night-2",
    userId: "user6",
    username: "night_terrors",
    userAvatar: "https://i.pravatar.cc/120?img=6",
    title: "Photograph at 3:17",
    content:
      "My phone takes one picture every night at 3:17 a.m. I do not set an alarm. I do not keep it near the bed. Still, each morning there is a new image in the gallery.\n\nAt first they were dark: ceiling fan, curtain, the hallway split by moonlight. Then they got closer. My sleeping face. My hand hanging over the mattress. Last night the photo was taken from under the bed, looking up, and my eyes were open in it.",
    tone: "horror",
    likes: 356,
    comments: 52,
    timestamp: "3 hours ago",
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "night-3",
    userId: "user7",
    username: "dead_air",
    userAvatar: "https://i.pravatar.cc/120?img=9",
    title: "The Last Voicemail",
    content:
      "The voicemail arrived from my own number while my phone was in my hand. No caller ID trick, no blocked contact, just my name staring back at me from the screen.\n\nThe recording was eleven seconds long. My voice whispered, \"When you hear the second knock, do not answer.\" Then, softer, almost crying: \"I answered the first one for you.\"\n\nSomething tapped once against the apartment door. I have been sitting here for forty minutes, waiting to learn what counts as second.",
    tone: "horror",
    likes: 274,
    comments: 40,
    timestamp: "5 hours ago",
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "night-4",
    userId: "user8",
    username: "crawlspace",
    userAvatar: "https://i.pravatar.cc/120?img=8",
    title: "More Room Below",
    content:
      "The inspector measured the crawlspace at three feet. I have the report. I have the diagram. I have watched him tap the floor and mark the edges in pencil.\n\nBut when I crawled in to retrieve the toolbox, the beam of my flashlight stretched farther than the house should allow. There was dust, then brick, then a narrow stairwell descending into a place that smelled like wet paper.\n\nAt the bottom, someone had written my childhood nickname on the wall, over and over, in handwriting I had not used since I was eight.",
    tone: "horror",
    likes: 233,
    comments: 38,
    timestamp: "7 hours ago",
    isLiked: false,
    isBookmarked: false,
  },
];

export default function Home() {
  const { band } = useTheme();
  const isNight = band === "night";
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"For you" | "Following">("For you");

  const handlePostCreate = (newPost: { title: string; content: string }) => {
    const post: Post = {
      id: `post-${Date.now()}`,
      userId: "123",
      username: "chandan_user",
      userAvatar: "https://i.pravatar.cc/120?img=12",
      title: newPost.title,
      content: newPost.content,
      tone: isNight ? "horror" : "normal",
      likes: 0,
      comments: 0,
      timestamp: "just now",
      isLiked: false,
      isBookmarked: false,
    };

    setUserPosts([post, ...userPosts]);
  };

  const tabs = ["For you", "Following"] as const;
  const posts = [...userPosts, ...(isNight ? horrorDemoPosts : normalDemoPosts)];
  const EmptyIcon = isNight ? Moon : BookOpen;

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[280px] lg:pr-[344px]">
        <div className="sticky top-0 z-30 bg-[var(--app-bg)] border-b border-[var(--line)]">
          <div className="max-w-[600px] mx-auto px-5 pt-3 pb-0">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative px-4 py-3 text-[15px] font-semibold transition-colors"
                    style={{ color: active ? "var(--brand-500)" : "var(--ink-400)" }}
                  >
                    {tab}
                    {active && (
                      <motion.span
                        layoutId="feed-tab"
                        className="absolute bottom-0 inset-x-2 h-[3px] rounded-t-full"
                        style={{ background: "var(--brand-500)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto px-5 py-5">
          <CreatePost onPostCreate={handlePostCreate} />

          <div className="space-y-4">
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

          <div className="flex flex-col items-center gap-2 py-10">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full text-[var(--brand-500)]"
              style={{ background: "var(--brand-50)" }}
            >
              <EmptyIcon className="w-6 h-6" strokeWidth={2} />
            </div>
            <p className="text-[13px] font-medium text-[var(--ink-500)]">
              {isNight ? "That's every night story for now" : "That's every day story for now"}
            </p>
            <p className="text-[12px] text-[var(--ink-400)]">
              {isNight ? "Daylight brings the normal feed back" : "After dark, the feed turns horror-only"}
            </p>
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
