"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Image as ImageIcon, Send, Loader2, X } from "lucide-react";
import { moods } from "@/lib/moods";

interface CreatePostProps {
  onPostCreate?: (post: {
    content: string;
    mood: string;
    moodEmoji: string;
    imageUrl?: string;
  }) => void;
}

const MAX_CHARS = 280;

const CreatePost = ({ onPostCreate }: CreatePostProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = {
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  const reset = () => {
    setContent("");
    setImageUrl("");
    setImagePreview("");
    setSelectedMood(moods[0]);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await new Promise((r) => setTimeout(r, 500));
    onPostCreate?.({
      content: content.trim(),
      mood: selectedMood.label,
      moodEmoji: selectedMood.emoji,
      imageUrl: imageUrl || undefined,
    });
    reset();
    setIsPosting(false);
    setIsOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const charsLeft = MAX_CHARS - content.length;
  const ratio = content.length / MAX_CHARS;
  const C = 2 * Math.PI * 9;

  return (
    <div
      className="card mb-5 overflow-hidden transition-shadow"
      style={{
        boxShadow: isOpen ? "var(--shadow-md)" : "var(--shadow-sm)",
        borderColor: isOpen ? `${selectedMood.accent}33` : "var(--line)",
      }}
    >
      {/* ── Collapsed trigger ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-[var(--canvas)] transition-colors"
        >
          <img
            src={currentUser.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full object-cover shrink-0"
          />
          <span className="flex-1 px-4 py-2.5 rounded-full bg-[var(--canvas)] text-[14px] text-[var(--ink-400)] border border-[var(--line)] truncate">
            What&apos;s making you feel {selectedMood.label.toLowerCase()} today?
          </span>
          <motion.span
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-[19px]"
            style={{ background: selectedMood.chip }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {selectedMood.emoji}
          </motion.span>
        </button>
      )}

      {/* ── Expanded composer ── */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Mood banner */}
          <div
            className="flex items-center justify-between px-5 py-2.5"
            style={{ background: selectedMood.chip }}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="text-[16px] leading-none"
                key={selectedMood.label}
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
              >
                {selectedMood.emoji}
              </motion.span>
              <span
                className="text-[12px] font-semibold"
                style={{ color: selectedMood.accent }}
              >
                Feeling {selectedMood.label.toLowerCase()}
              </span>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close composer"
              className="flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:bg-black/10"
              style={{ color: selectedMood.accent }}
            >
              <X className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>

          <div className="p-5">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt=""
                width={42}
                height={42}
                className="rounded-full object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) =>
                    e.target.value.length <= MAX_CHARS && setContent(e.target.value)
                  }
                  placeholder={`What's making you feel ${selectedMood.label.toLowerCase()} today?`}
                  rows={3}
                  className="w-full text-[15px] leading-relaxed text-[var(--ink-900)] placeholder-[var(--ink-400)] outline-none resize-none bg-transparent"
                />

                {/* Image preview */}
                <AnimatePresence>
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative mt-2 rounded-[16px] overflow-hidden ring-1 ring-black/[0.06]"
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full object-cover"
                        style={{ maxHeight: 240 }}
                      />
                      <button
                        onClick={() => {
                          setImageUrl("");
                          setImagePreview("");
                        }}
                        aria-label="Remove image"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/50 hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" strokeWidth={2.4} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mood picker */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-400)] mb-2.5">
                Pick your mood
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {moods.map((mood) => {
                  const active = selectedMood.label === mood.label;
                  return (
                    <motion.button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood)}
                      title={mood.label}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex items-center justify-center w-10 h-10 rounded-full text-[18px] transition-colors"
                      style={{
                        background: active ? mood.chip : "var(--canvas)",
                        boxShadow: active ? `0 0 0 2px ${mood.accent}` : "none",
                      }}
                    >
                      <span className={active ? "" : "grayscale opacity-55"}>{mood.emoji}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="h-px my-4 bg-[var(--line-soft)]" />

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-[var(--ink-500)] hover:bg-[var(--canvas)] cursor-pointer transition-colors">
                <ImageIcon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-3">
                {/* Char ring */}
                {content.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
                      <circle cx="11" cy="11" r="9" fill="none" stroke="var(--line)" strokeWidth="2.5" />
                      <circle
                        cx="11"
                        cy="11"
                        r="9"
                        fill="none"
                        stroke={charsLeft <= 20 ? "#ef4444" : selectedMood.accent}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C * (1 - Math.min(ratio, 1))}
                        style={{ transition: "stroke-dashoffset 0.2s ease" }}
                      />
                    </svg>
                    {charsLeft <= 40 && (
                      <span
                        className={`text-[11px] font-semibold tabular-nums ${
                          charsLeft <= 20 ? "text-rose-500" : "text-[var(--ink-400)]"
                        }`}
                      >
                        {charsLeft}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[var(--ink-500)] hover:bg-[var(--canvas)] transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isPosting}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    !content.trim() || isPosting
                      ? "bg-[var(--line-soft)] text-[var(--ink-400)] cursor-not-allowed"
                      : "btn-brand"
                  }`}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={2.4} />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreatePost;
