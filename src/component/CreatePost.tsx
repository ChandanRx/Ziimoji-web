"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PictureOutlined as ImageIcon, SendOutlined as Send, LoadingOutlined as Loader2, CloseOutlined as X, SmileOutlined as Smile, BarChartOutlined as BarChart2, EnvironmentOutlined as MapPin, ScissorOutlined as Crop, ExpandOutlined as Maximize2 } from "@ant-design/icons";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { moods, moodColors } from "@/lib/moods";
import AnimatedEmoji from "@/component/AnimatedEmoji";

interface CreatePostProps {
  onPostCreate?: (post: {
    content: string;
    mood: string;
    moodEmoji: string;
    imageUrl?: string;
  }) => void;
  autoOpen?: boolean;
}

const MAX_CHARS = 280;

const CreatePost = ({ onPostCreate, autoOpen = false }: CreatePostProps) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFit, setImageFit] = useState<"contain" | "cover">("contain");
  const [isPosting, setIsPosting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentUser = {
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  // Handle open event from sidebar / navbar CTA or URL search query "?compose=1"
  useEffect(() => {
    const shouldOpen = searchParams?.get("compose") === "1" || autoOpen;
    if (shouldOpen) {
      setIsOpen(true);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [searchParams, autoOpen]);

  useEffect(() => {
    const handleCustomOpen = () => {
      setIsOpen(true);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    };

    window.addEventListener("open-create-post", handleCustomOpen);
    return () => window.removeEventListener("open-create-post", handleCustomOpen);
  }, []);

  const reset = () => {
    setContent("");
    setImageUrl("");
    setImagePreview("");
    setSelectedMood(moods[0]);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    if (searchParams?.get("compose") === "1") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("compose");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await new Promise((r) => setTimeout(r, 500));
    onPostCreate?.({
      content: content.trim(),
      mood: selectedMood.label,
      moodEmoji: selectedMood.lottie,
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

  const selectedColor = moodColors[selectedMood.label.toLowerCase()] ?? {
    hex: selectedMood.hex || "#FACC15",
    rgb: selectedMood.rgb || "250, 204, 21",
  };

  return (
    <div className="card mb-5 overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5] dark:bg-[#1C1B1A] rounded-sm shadow-sm transition-all duration-300">
      {/* ── Collapsed trigger bar on feed ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 p-3.5 sm:p-4 text-left outline-none group hover:bg-black/[0.02] transition-colors cursor-pointer"
        >
          <img
            src={currentUser.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full object-cover shrink-0 ring-2 ring-amber-300/40"
          />
          <span className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 truncate group-hover:border-amber-400/40 transition-colors">
            What&apos;s making you feel {selectedMood.label.toLowerCase()} today?
          </span>
          <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-100/70 dark:bg-amber-950/40">
            <AnimatedEmoji
              src={selectedMood.lottie}
              size={24}
              autoplay={false}
              loop={false}
              label={`Feeling ${selectedMood.label.toLowerCase()}`}
            />
          </span>
        </button>
      )}

      {/* ── Expanded view - INLINE in feed ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative p-5 sm:p-7 overflow-hidden"
          >
            {/* Subtle ambient warm yellow background glow */}
            <div
              aria-hidden
                className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-20 dark:opacity-10 blur-3xl"
                style={{
                  background: `radial-gradient(circle, rgba(${selectedColor.rgb}, 0.8) 0%, transparent 70%)`,
                }}
              />

              {/* Minimal Top-Right X Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close composer"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-20 outline-none"
              >
                <X className="text-[20px]" />
              </button>

              {/* User Avatar + Input Area */}
              <div className="relative z-10 flex gap-3.5 sm:gap-4 pt-1">
                <img
                  src={currentUser.avatar}
                  alt=""
                  width={44}
                  height={44}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shrink-0 ring-2 ring-amber-300/30"
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
                    className="w-full text-base sm:text-lg font-normal leading-relaxed text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none resize-none bg-transparent min-h-[90px] sm:min-h-[110px]"
                  />

                  {/* Compact Image Preview Thumbnail with Resize & Remove Controls */}
                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative mt-2.5 inline-block rounded-2xl overflow-hidden bg-neutral-950 border-2 border-amber-300/40 shadow-lg group"
                      >
                        <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center overflow-hidden bg-neutral-900/90">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className={`w-full h-full transition-all duration-300 ${
                              imageFit === "contain" ? "object-contain p-1" : "object-cover"
                            }`}
                          />
                        </div>

                        {/* Glass Action Controls Overlay */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                          {/* Resize / Fit Mode Toggle Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setImageFit((prev) => (prev === "contain" ? "cover" : "contain"))
                            }
                            title={
                              imageFit === "contain"
                                ? "Switch to Fill Frame"
                                : "Switch to Fit Entire Photo"
                            }
                            aria-label="Toggle photo resize mode"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/75 hover:bg-black/90 backdrop-blur-md transition-all shadow-sm outline-none cursor-pointer"
                          >
                            {imageFit === "contain" ? (
                              <>
                                <Crop className="text-[14px] text-amber-300" />
                                <span>Fit</span>
                              </>
                            ) : (
                              <>
                                <Maximize2 className="text-[14px] text-amber-300" />
                                <span>Fill</span>
                              </>
                            )}
                          </button>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl("");
                              setImagePreview("");
                            }}
                            aria-label="Remove image"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-black/75 hover:bg-black/90 backdrop-blur-md transition-colors outline-none cursor-pointer"
                          >
                            <X className="text-[16px]" />
                          </button>
                        </div>

                        {/* Bottom Mode Badge Indicator */}
                        <div className="absolute bottom-2 left-2.5 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white/90 bg-black/60 backdrop-blur-sm">
                            {imageFit === "contain" ? "Full Photo" : "Cropped Fill"}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Pick Your Mood Section */}
              <div className="relative z-10 mt-5 sm:mt-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3 sm:mb-4">
                  PICK YOUR MOOD
                </p>

                <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                  {moods.map((mood) => {
                    const active = selectedMood.label === mood.label;
                    const mInfo = moodColors[mood.label.toLowerCase()] ?? {
                      hex: mood.hex || "#FACC15",
                      rgb: mood.rgb || "250, 204, 21",
                    };

                    return (
                      <button
                        key={mood.label}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className="flex flex-col items-center gap-1.5 outline-none group cursor-pointer"
                      >
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                            active
                              ? "bg-amber-50 dark:bg-amber-950/40 ring-2 ring-offset-2 ring-offset-[#FAF8F5] dark:ring-offset-[#1A1918]"
                              : "bg-neutral-100/90 dark:bg-neutral-800/80 hover:bg-neutral-200/60"
                          }`}
                          style={
                            active
                              ? {
                                  borderColor: mInfo.hex,
                                  boxShadow: `0 0 16px rgba(${mInfo.rgb}, 0.35)`,
                                }
                              : undefined
                          }
                        >
                          <AnimatedEmoji
                            src={mood.lottie}
                            size={active ? 28 : 24}
                            label={mood.label}
                            autoplay={false}
                            loop={false}
                            className={active ? "flex" : "flex opacity-70 grayscale-[0.2]"}
                          />
                        </div>
                        <span
                          className={`text-xs sm:text-[13px] font-semibold transition-colors ${
                            active
                              ? "font-bold"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                          style={active ? { color: mInfo.hex } : undefined}
                        >
                          {mood.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Low-opacity Divider */}
              <div className="relative z-10 h-px my-5 sm:my-6 bg-neutral-200/70 dark:bg-neutral-800" />

              {/* Action Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                {/* Left Controls */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Add Photo / Video Button */}
                  <label className="flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900 cursor-pointer transition-all shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-200">
                      <ImageIcon className="text-[16px]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-[13px] font-bold text-neutral-800 dark:text-neutral-200 leading-tight">
                        Add Photo / Video
                      </span>
                      <span className="text-[10.5px] text-neutral-400 leading-tight">
                        Share a moment
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Supporting utility actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      aria-label="Add Emoji"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors outline-none"
                    >
                      <Smile className="text-[16px] sm:text-[20px]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Add GIF"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-600 dark:text-neutral-300 transition-colors outline-none"
                    >
                      GIF
                    </button>
                    <button
                      type="button"
                      aria-label="Add Poll"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors outline-none"
                    >
                      <BarChart2 className="text-[16px] sm:text-[20px]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Add Location"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors outline-none"
                    >
                      <MapPin className="text-[16px] sm:text-[20px]" />
                    </button>
                  </div>
                </div>

                {/* Right: Share Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!content.trim() || isPosting}
                  className={`flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md ${
                    !content.trim() || isPosting
                      ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed shadow-none"
                      : "bg-amber-400 hover:bg-amber-390 text-neutral-950 shadow-amber-400/25 active:scale-95 cursor-pointer"
                  }`}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="text-[16px] animate-spin" />
                      <span>Posting…</span>
                    </>
                  ) : (
                    <>
                      <Send className="text-[16px]" />
                      <span>Share Post</span>
                    </>
                  )}
                </button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePost;
