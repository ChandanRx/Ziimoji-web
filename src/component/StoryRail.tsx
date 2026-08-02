"use client";

import { Plus } from "lucide-react";
import { getGenre } from "@/lib/genres";

interface Story {
  id: string;
  username: string;
  avatar: string;
  genre: string;
  seen?: boolean;
}

const stories: Story[] = [
  { id: "1", username: "grave_whispers", avatar: "https://i.pravatar.cc/120?img=1", genre: "Haunting" },
  { id: "2", username: "hollow_man",     avatar: "https://i.pravatar.cc/120?img=2", genre: "Cursed" },
  { id: "3", username: "the_static",     avatar: "https://i.pravatar.cc/120?img=3", genre: "Paranormal" },
  { id: "4", username: "red_room",       avatar: "https://i.pravatar.cc/120?img=4", genre: "Gore", seen: true },
  { id: "5", username: "night_terrors",  avatar: "https://i.pravatar.cc/120?img=5", genre: "Unsettling" },
  { id: "6", username: "cold_spot",      avatar: "https://i.pravatar.cc/120?img=7", genre: "Haunting", seen: true },
];

const StoryRail = () => (
  <div className="mb-6 pb-6 border-b border-[var(--line)]">
    <div className="flex items-center justify-between mb-4 px-0.5">
      <h2 className="text-[15px] font-bold text-[var(--ink-900)]">Tales unfolding</h2>
      <button className="text-[13px] font-medium text-[var(--ink-500)] hover:text-[var(--ink-900)] transition-colors">
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
            className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full ring-2 ring-[var(--surface)]"
            style={{ background: "var(--brand-500)" }}
          >
            <Plus className="w-3 h-3 text-[var(--brand-ink)]" strokeWidth={3} />
          </span>
        </div>
        <span className="text-[11px] text-[var(--ink-500)] font-medium truncate w-full text-center">
          Your tale
        </span>
      </button>

      {stories.map((story) => {
        const genre = getGenre(story.genre);
        const GenreIcon = genre.Icon;
        return (
          <button key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 w-[64px] group">
            <div className="relative">
              <div className={story.seen ? "story-ring story-ring--seen" : "story-ring"}>
                <div className="rounded-full p-[2px] bg-[var(--surface)]">
                  <img
                    src={story.avatar}
                    alt=""
                    width={50}
                    height={50}
                    className="rounded-full object-cover block transition-transform duration-200 group-hover:scale-[1.06]"
                  />
                </div>
              </div>

              {/* Genre bubble */}
              <span
                className="absolute -bottom-1 -right-1 flex items-center justify-center w-[22px] h-[22px] rounded-full ring-2 ring-[var(--surface)]"
                style={{ background: genre.chip, color: genre.accent }}
              >
                <GenreIcon className="w-[13px] h-[13px]" strokeWidth={2.2} />
              </span>
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
