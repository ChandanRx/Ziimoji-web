"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Search, Phone, Video, MoreHorizontal, Smile } from "lucide-react";
import { getMood, moods } from "@/lib/moods";
import { people, currentUser } from "@/lib/mockData";

interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  mood?: string;
}

interface Conversation {
  person: (typeof people)[number];
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const seedMessages = (name: string, mood: string): Message[] => [
  { id: "m1", fromMe: false, text: `Hey! how's your ${mood.toLowerCase()} mood today? 👀`, time: "9:41" },
  { id: "m2", fromMe: true, text: "honestly a whole vibe. just posted about it", time: "9:42" },
  { id: "m3", fromMe: false, text: "sawww it, the emoji burst got me 😂", time: "9:42", mood },
  { id: "m4", fromMe: true, text: "hahah that's the best part of Zimoji tbh", time: "9:43" },
  { id: "m5", fromMe: false, text: `okay ${name.split(" ")[0]} out, catch you later ✨`, time: "9:45" },
];

const buildConversations = (): Conversation[] =>
  people
    .filter((p) => p.id !== currentUser.id)
    .slice(0, 7)
    .map((person, i) => ({
      person,
      preview: seedMessages(person.name, person.mood).at(-1)!.text,
      time: ["now", "2m", "18m", "1h", "3h", "1d", "2d"][i] ?? "1d",
      unread: i === 0 ? 2 : i === 2 ? 1 : 0,
      online: i % 2 === 0,
      messages: seedMessages(person.name, person.mood),
    }));

export default function ChatsPage() {
  const conversations = useMemo(buildConversations, []);
  const [activeId, setActiveId] = useState<string>(conversations[0].person.id);
  const [showThreadMobile, setShowThreadMobile] = useState(false);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState<Record<string, Message[]>>(
    Object.fromEntries(conversations.map((c) => [c.person.id, c.messages]))
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.person.id === activeId)!;
  const mood = getMood(active.person.mood);
  const messages = threads[activeId];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads((t) => ({
      ...t,
      [activeId]: [
        ...t[activeId],
        { id: `s-${Date.now()}`, fromMe: true, text, time: "now" },
      ],
    }));
    setDraft("");
  };

  const openConversation = (id: string) => {
    setActiveId(id);
    setShowThreadMobile(true);
  };

  return (
    <div className="flex h-screen md:ml-[264px]">
      {/* ── Conversation list ── */}
      <aside
        className={`${
          showThreadMobile ? "hidden" : "flex"
        } md:flex flex-col w-full md:w-[340px] md:border-r border-[var(--line)] h-screen pt-14 md:pt-0`}
      >
        <div className="px-5 pt-5 pb-3 border-b border-[var(--line)]">
          <h1 className="text-[22px] font-bold text-[var(--ink-900)]">Messages</h1>
          <div className="mt-3 flex items-center gap-2.5 bg-[var(--canvas)] rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-[var(--ink-400)]" />
            <input
              placeholder="Search messages…"
              className="flex-1 bg-transparent text-[13.5px] text-[var(--ink-900)] placeholder-[var(--ink-400)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.map((c) => {
            const cm = getMood(c.person.mood);
            const isActive = c.person.id === activeId;
            return (
              <button
                key={c.person.id}
                onClick={() => openConversation(c.person.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[var(--line-soft)] transition-colors"
                style={{ background: isActive ? "var(--brand-50)" : undefined }}
              >
                <div className="relative shrink-0">
                  <span className="block rounded-full p-[2px]" style={{ background: cm.grad }}>
                    <img src={c.person.avatar} alt="" className="block w-12 h-12 rounded-full object-cover ring-2 ring-white" />
                  </span>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold text-[var(--ink-900)] truncate">{c.person.name}</span>
                    <span className="text-[11px] text-[var(--ink-400)] shrink-0">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[12.5px] truncate ${c.unread ? "text-[var(--ink-900)] font-medium" : "text-[var(--ink-400)]"}`}>
                      {c.preview}
                    </span>
                    {c.unread > 0 && (
                      <span className="shrink-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--brand-600)] text-white text-[10px] font-bold">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Thread ── */}
      <section
        className={`${
          showThreadMobile ? "flex" : "hidden"
        } md:flex flex-col flex-1 h-screen pt-14 md:pt-0`}
      >
        {/* Thread header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-[var(--line)] glass">
          <button
            onClick={() => setShowThreadMobile(false)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.045] transition-colors"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-[var(--ink-700)]" />
          </button>
          <Link href={`/profile/${active.person.id}`} className="flex items-center gap-3 flex-1 min-w-0">
            <span className="block rounded-full p-[2px]" style={{ background: mood.grad }}>
              <img src={active.person.avatar} alt="" className="block w-10 h-10 rounded-full object-cover ring-2 ring-white" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[var(--ink-900)] truncate">{active.person.name}</p>
              <p className="text-[11.5px] text-emerald-500 font-medium">{active.online ? "Active now" : "Offline"}</p>
            </div>
          </Link>
          <div className="flex items-center gap-1 text-[var(--ink-400)]">
            {[Phone, Video, MoreHorizontal].map((Icon, i) => (
              <button key={i} className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/[0.045] transition-colors">
                <Icon className="w-[18px] h-[18px]" />
              </button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 space-y-2" style={{ background: "var(--canvas)" }}>
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-snug ${
                      m.fromMe
                        ? "text-white rounded-[18px] rounded-br-[6px]"
                        : "bg-white text-[var(--ink-900)] rounded-[18px] rounded-bl-[6px] border border-[var(--line)]"
                    }`}
                    style={m.fromMe ? { background: "var(--brand-grad)" } : undefined}
                  >
                    {m.text}
                    <span className={`block text-[10px] mt-1 ${m.fromMe ? "text-white/70" : "text-[var(--ink-400)]"}`}>
                      {m.time}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Composer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--line)] bg-white">
          <button
            onClick={() => setDraft((d) => d + moods[Math.floor(Math.random() * moods.length)].emoji)}
            className="flex items-center justify-center w-10 h-10 rounded-full text-[var(--ink-400)] hover:bg-black/[0.045] transition-colors shrink-0"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${active.person.name.split(" ")[0]}…`}
            className="flex-1 bg-[var(--canvas)] rounded-full px-4 py-2.5 text-[14px] text-[var(--ink-900)] placeholder-[var(--ink-400)] focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={send}
            disabled={!draft.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white shrink-0 disabled:opacity-40 transition-opacity"
            style={{ background: "var(--brand-grad)" }}
            aria-label="Send"
          >
            <Send className="w-[18px] h-[18px]" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
