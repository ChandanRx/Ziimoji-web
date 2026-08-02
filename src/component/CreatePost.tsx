"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Send,
  Loader2,
  X,
  ScanText,
  Mic,
  MicOff,
  CheckCircle,
  AlertCircle,
  PenLine,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface CreatePostProps {
  onPostCreate?: (post: {
    title: string;
    content: string;
  }) => void;
}

/* Web Speech API — not in the default TS DOM lib; we declare just enough. */
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResultEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

/* ─── Constants ─────────────────────────────────────────────────────────── */

const MAX_CHARS = 4000;
const MAX_TITLE = 100;

/* ─── OCR status ────────────────────────────────────────────────────────── */

type OcrStatus =
  | { phase: "idle" }
  | { phase: "loading"; progress: number }
  | { phase: "done"; chars: number }
  | { phase: "error"; message: string };

/* ─── Voice status ──────────────────────────────────────────────────────── */

type VoiceStatus = "idle" | "listening" | "unsupported";

/* ─── Component ─────────────────────────────────────────────────────────── */

const CreatePost = ({ onPostCreate }: CreatePostProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // OCR
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>({ phase: "idle" });
  const [ocrPreview, setOcrPreview] = useState("");
  const ocrInputRef = useRef<HTMLInputElement>(null);

  // Voice
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const interimRef = useRef("");   // running interim transcript

  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = {
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  useEffect(() => {
    if (isOpen) titleRef.current?.focus();
  }, [isOpen]);

  /* ── reset ── */
  const reset = () => {
    setTitle("");
    setContent("");
    setOcrPreview("");
    setOcrStatus({ phase: "idle" });
    setVoiceStatus("idle");
    stopVoice();
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await new Promise((r) => setTimeout(r, 500));
    onPostCreate?.({
      title: title.trim() || "Untitled tale",
      content: content.trim(),
    });
    reset();
    setIsPosting(false);
    setIsOpen(false);
  };

  /* ════════════════════════════════════════════════════════════════════════
     OCR — scan handwritten / printed photo and extract text into the body.
     Uses Tesseract.js which runs fully in the browser (WASM worker).
     ════════════════════════════════════════════════════════════════════════ */
  const handleOcrUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Reset so the same file can be chosen again
      e.target.value = "";

      // Show the image as a mini preview
      const dataUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onloadend = () => res(r.result as string);
        r.readAsDataURL(file);
      });
      setOcrPreview(dataUrl);
      setOcrStatus({ phase: "loading", progress: 0 });

      try {
        // Dynamically import Tesseract so it doesn't bloat the initial bundle
        const { createWorker } = await import("tesseract.js");

        const worker = await createWorker("eng", 1, {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === "recognizing text") {
              setOcrStatus({ phase: "loading", progress: Math.round(m.progress * 100) });
            }
          },
        });

        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();

        const cleaned = text.trim();
        if (!cleaned) {
          setOcrStatus({ phase: "error", message: "No text detected. Try a clearer photo." });
          return;
        }

        // Append to whatever is already in the textarea
        setContent((prev) => {
          const joined = prev ? `${prev}\n\n${cleaned}` : cleaned;
          return joined.slice(0, MAX_CHARS);
        });
        setOcrStatus({ phase: "done", chars: cleaned.length });
        // Auto-scroll textarea to bottom
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          }
        }, 50);
      } catch (err) {
        console.error("OCR error", err);
        setOcrStatus({ phase: "error", message: "OCR failed. Please try again." });
      }
    },
    []
  );

  /* ════════════════════════════════════════════════════════════════════════
     Voice to text — streams dictation into the story body via the
     Web Speech API (SpeechRecognition). Works in Chrome / Edge / Safari 17+.
     Gracefully degrades to "unsupported" on Firefox.
     ════════════════════════════════════════════════════════════════════════ */

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    interimRef.current = "";
  }, []);

  const toggleVoice = useCallback(() => {
    if (voiceStatus === "unsupported") return;

    if (voiceStatus === "listening") {
      stopVoice();
      setVoiceStatus("idle");
      return;
    }

    const SR: SpeechRecognitionConstructor | undefined =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceStatus("unsupported");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Baseline content at the moment recording starts — we append on top
    const baseContent = content;

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // Accumulate finals in a ref so each onresult doesn't need prev state
      if (final) {
        interimRef.current = (interimRef.current + final).trim();
      }

      // Show base + confirmed finals + live interim — never exceed MAX_CHARS
      const live = [baseContent, interimRef.current, interim]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, MAX_CHARS);

      setContent(live);
    };

    recognition.onerror = () => {
      setVoiceStatus("idle");
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      // Commit: drop interim, keep only finals appended to base
      const committed = [baseContent, interimRef.current]
        .filter(Boolean)
        .join("\n\n")
        .trim()
        .slice(0, MAX_CHARS);
      setContent(committed);
      interimRef.current = "";
      setVoiceStatus("idle");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setVoiceStatus("listening");
  }, [voiceStatus, content, stopVoice]);

  // Clean up on unmount
  useEffect(() => () => stopVoice(), [stopVoice]);

  /* ── derived ── */
  const charsLeft = MAX_CHARS - content.length;
  const ratio = content.length / MAX_CHARS;
  const C = 2 * Math.PI * 9;
  const canSubmit = content.trim().length > 0 && !isPosting;

  /* ════════════════════════════════════════════════════════════════════════
     Render
     ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="mb-5 pb-5 border-b border-[var(--line)]">

      {/* ── Collapsed trigger ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 py-1.5 text-left transition-colors"
        >
          <img
            src={currentUser.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full object-cover shrink-0"
          />
          <span className="flex-1 px-4 py-3 rounded-full bg-[var(--canvas)] text-[15px] text-[var(--ink-500)] border border-[var(--line)] truncate">
            Tell your story…
          </span>
          <span
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: "var(--brand-50)", color: "var(--brand-500)" }}
          >
            <PenLine className="w-[22px] h-[22px]" strokeWidth={2} />
          </span>
        </button>
      )}

      {/* ── Expanded composer ── */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className="flex items-center justify-between rounded-xl px-4 py-2.5"
            style={{ background: "var(--brand-50)" }}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="flex leading-none"
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                style={{ color: "var(--brand-500)" }}
              >
                <PenLine className="w-5 h-5" strokeWidth={2.2} />
              </motion.span>
              <span className="text-[12px] font-semibold" style={{ color: "var(--brand-500)" }}>
                Text story
              </span>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close composer"
              className="flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:bg-black/10"
              style={{ color: "var(--brand-500)" }}
            >
              <X className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>

          <div className="pt-4">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt=""
                width={42}
                height={42}
                className="rounded-full object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                {/* Story title */}
                <input
                  ref={titleRef}
                  value={title}
                  onChange={(e) =>
                    e.target.value.length <= MAX_TITLE && setTitle(e.target.value)
                  }
                  placeholder="Title your story…"
                  className="w-full text-[18px] font-bold leading-snug text-[var(--ink-900)] placeholder-[var(--ink-400)] outline-none bg-transparent"
                />

                <div className="h-px my-2.5 bg-[var(--line-soft)]" />

                {/* Story body */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) =>
                      e.target.value.length <= MAX_CHARS && setContent(e.target.value)
                    }
                    placeholder={
                      voiceStatus === "listening"
                        ? "Listening… speak your story"
                        : "Tell your story…"
                    }
                    rows={5}
                    className="w-full text-[16px] leading-relaxed text-[var(--ink-900)] placeholder-[var(--ink-400)] outline-none resize-none bg-transparent"
                  />
                  {/* Listening pulse ring */}
                  {voiceStatus === "listening" && (
                    <span className="absolute top-1 right-0 flex h-2.5 w-2.5">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: "var(--brand-500)" }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2.5 w-2.5"
                        style={{ background: "var(--brand-500)" }}
                      />
                    </span>
                  )}
                </div>

                {/* OCR scan preview */}
                <AnimatePresence>
                  {ocrPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 rounded-[14px] overflow-hidden border border-[var(--line)]"
                    >
                      <div className="relative">
                        <img
                          src={ocrPreview}
                          alt="Scanned handwriting"
                          className="w-full object-cover"
                          style={{ maxHeight: 180 }}
                        />
                        {/* Progress overlay */}
                        {ocrStatus.phase === "loading" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
                            <Loader2
                              className="w-6 h-6 animate-spin text-white"
                              strokeWidth={2.2}
                            />
                            <span className="text-[12px] font-semibold text-white">
                              Reading text… {ocrStatus.progress}%
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setOcrPreview("");
                            setOcrStatus({ phase: "idle" });
                          }}
                          aria-label="Dismiss scan preview"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2.4} />
                        </button>
                      </div>

                      {/* Status row */}
                      <div
                        className="px-3 py-2 flex items-center gap-2"
                        style={{ background: "var(--canvas)" }}
                      >
                        {ocrStatus.phase === "loading" && (
                          <>
                            <Loader2
                              className="w-3.5 h-3.5 animate-spin shrink-0"
                              style={{ color: "var(--brand-500)" }}
                            />
                            <span className="text-[12px] text-[var(--ink-500)]">
                              Extracting text from your handwriting…
                            </span>
                          </>
                        )}
                        {ocrStatus.phase === "done" && (
                          <>
                            <CheckCircle
                              className="w-3.5 h-3.5 shrink-0 text-emerald-500"
                              strokeWidth={2.2}
                            />
                            <span className="text-[12px] text-[var(--ink-500)]">
                              {ocrStatus.chars} characters added to your story
                            </span>
                          </>
                        )}
                        {ocrStatus.phase === "error" && (
                          <>
                            <AlertCircle
                              className="w-3.5 h-3.5 shrink-0 text-[var(--error)]"
                              strokeWidth={2.2}
                            />
                            <span className="text-[12px] text-[var(--error)]">
                              {ocrStatus.message}
                            </span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            <div className="h-px my-4 bg-[var(--line-soft)]" />

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <label
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-colors"
                  title="Upload written text photo"
                  style={
                    ocrStatus.phase === "loading"
                      ? { color: "var(--brand-500)", background: "var(--brand-50)", pointerEvents: "none" }
                      : { color: "var(--ink-500)" }
                  }
                  onClick={ocrStatus.phase === "loading" ? (e) => e.preventDefault() : undefined}
                >
                  {ocrStatus.phase === "loading" ? (
                    <Loader2 className="w-[17px] h-[17px] animate-spin" strokeWidth={2.2} />
                  ) : (
                    <ScanText className="w-[17px] h-[17px]" strokeWidth={2.2} />
                  )}
                  <span className="hidden sm:inline">Photo to text</span>
                  <input
                    ref={ocrInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleOcrUpload}
                    className="hidden"
                    disabled={ocrStatus.phase === "loading"}
                  />
                </label>

                {/* Voice to text */}
                {voiceStatus !== "unsupported" && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    title={voiceStatus === "listening" ? "Stop dictating" : "Dictate your story"}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors"
                    style={
                      voiceStatus === "listening"
                        ? { color: "var(--brand-500)", background: "var(--brand-50)" }
                        : { color: "var(--ink-500)" }
                    }
                  >
                    {voiceStatus === "listening" ? (
                      <MicOff className="w-[17px] h-[17px]" strokeWidth={2.2} />
                    ) : (
                      <Mic className="w-[17px] h-[17px]" strokeWidth={2.2} />
                    )}
                    <span className="hidden sm:inline">
                      {voiceStatus === "listening" ? "Stop" : "Voice"}
                    </span>
                  </button>
                )}
              </div>

              {/* Right side: char ring + cancel + publish */}
              <div className="flex items-center gap-3">
                {/* Char count ring */}
                {content.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
                      <circle
                        cx="11" cy="11" r="9"
                        fill="none"
                        stroke="var(--line)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="11" cy="11" r="9"
                        fill="none"
                        stroke={charsLeft <= 200 ? "#c1121f" : "var(--brand-500)"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C * (1 - Math.min(ratio, 1))}
                        style={{ transition: "stroke-dashoffset 0.2s ease" }}
                      />
                    </svg>
                    {charsLeft <= 400 && (
                      <span
                        className={`text-[11px] font-semibold tabular-nums ${
                          charsLeft <= 200 ? "text-[#c1121f]" : "text-[var(--ink-400)]"
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
                  disabled={!canSubmit}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    !canSubmit
                      ? "bg-[var(--line-soft)] text-[var(--ink-400)] cursor-not-allowed"
                      : "btn-brand"
                  }`}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={2.4} />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Voice hint */}
            <AnimatePresence>
              {voiceStatus === "unsupported" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-[12px] text-[var(--ink-400)]"
                >
                  Voice dictation isn&apos;t supported in this browser. Try Chrome or Edge.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreatePost;
