"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { getMood } from "@/lib/moods";

interface Story {
  id: string;
  username: string;
  avatar: string;
  mood: string;
  seen?: boolean;
}

const stories: Story[] = [
  { id: "1", username: "emoji_lover",  avatar: "https://i.pravatar.cc/120?img=1", mood: "Excited" },
  { id: "2", username: "mood_master",  avatar: "https://i.pravatar.cc/120?img=2", mood: "Cool" },
  { id: "3", username: "happy_vibes",  avatar: "https://i.pravatar.cc/120?img=3", mood: "Happy" },
  { id: "4", username: "cool_emojis",  avatar: "https://i.pravatar.cc/120?img=4", mood: "Funny", seen: true },
  { id: "5", username: "trending_now", avatar: "https://i.pravatar.cc/120?img=5", mood: "Love" },
  { id: "6", username: "calm_soul",    avatar: "https://i.pravatar.cc/120?img=7", mood: "Calm", seen: true },
];

const StoryRail = () => (
  <div className="card p-4 mb-5">
    <div className="flex items-center justify-between mb-3 px-0.5">
      <h2 className="text-[13px] font-semibold text-[var(--ink-700)]">Moods today</h2>
      <button className="text-[12px] font-medium text-[var(--ink-400)] hover:text-[var(--ink-700)] transition-colors">
        See all
      </button>
    </div>

    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
      {/* Your story */}
      <button className="flex flex-col items-center gap-1.5 shrink-0 w-[64px] group">
        <div className="relative">
          <div className="rounded-full p-[2.5px] border-2 border-dashed border-[var(--line)] group-hover:border-[var(--brand-500)] transition-colors">
            <img
              src="https://i.pravatar.cc/120?img=12"
              alt=""
              width={54}
              height={54}
              className="rounded-full object-cover block"
            />
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full ring-2 ring-white"
            style={{ background: "var(--brand-grad)" }}
          >
            <Plus className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
        </div>
        <span className="text-[11px] text-[var(--ink-500)] font-medium truncate w-full text-center">
          Your story
        </span>
      </button>

      {stories.map((story, i) => {
        const mood = getMood(story.mood);
        return (
          <button key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 w-[64px] group">
            <div className="relative">
              <div className={story.seen ? "story-ring story-ring--seen" : "story-ring"}>
                <div className="rounded-full p-[2px] bg-white">
                  <img
                    src={story.avatar}
                    alt=""
                    width={50}
                    height={50}
                    className="rounded-full object-cover block transition-transform duration-200 group-hover:scale-[1.06]"
                  />
                </div>
              </div>

              {/* Mood bubble — gently floating */}
              <motion.span
                className="absolute -bottom-1 -right-1 flex items-center justify-center w-[22px] h-[22px] rounded-full text-[12px] ring-2 ring-white"
                style={{ background: mood.chip }}
                animate={{ y: [0, -2.5, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }}
              >
                {mood.emoji}
              </motion.span>
            </div>
            <span className="text-[11px] text-[var(--ink-500)] font-medium truncate w-full text-center">
              {story.username}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default StoryRail;
