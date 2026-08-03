"use client";

import { Maximize2, Heart, MessageCircle, Eye } from "lucide-react";
import AnimatedEmoji from "@/component/AnimatedEmoji";

interface EmojiCardProps {
  /** Path to a self-hosted `.lottie` emoji, e.g. "/emoji/party.lottie". */
  emoji?: string;
  title?: string;
  author?: string;
  cta?: string;
  likes?: number;
  comments?: number;
  views?: number;
}

/**
 * A springy gradient card with a floating animated emoji — a Zymoji-flavoured
 * take on the classic CodePen hover card. The action pills (likes / comments /
 * views) and the shadow plate reveal on hover.
 */
const EmojiCard = ({
  emoji = "/emoji/party.lottie",
  title = "Zymoji Card",
  author = "@zymoji",
  cta = "Feel the Vibe!",
  likes = 22,
  comments = 12,
  views = 332,
}: EmojiCardProps) => {
  return (
    <div className="ec-main">
      <div className="ec-card">
        {/* Floating emoji drifting above the card corner */}
        <div className="ec-float" aria-hidden>
          <AnimatedEmoji src={emoji} size={72} preset="float" />
        </div>

        <div className="ec-fl">
          <div className="ec-fullscreen">
            <Maximize2 className="ec-fullscreen-svg" strokeWidth={2.6} />
          </div>
        </div>

        <div className="ec-card-content">
          <button type="button">{cta}</button>
        </div>

        <div className="ec-card-back" />
      </div>

      <div className="ec-data">
        <div className="ec-img">
          <AnimatedEmoji src={emoji} size={36} preset="bounce" />
        </div>
        <div className="ec-text">
          <div className="ec-text-m">{title}</div>
          <div className="ec-text-s">{author}</div>
        </div>
      </div>

      <div className="ec-btns">
        <div className="ec-pill ec-likes">
          <Heart className="ec-pill-svg" fill="currentColor" strokeWidth={0} />
          <span className="ec-pill-text">{likes}</span>
        </div>
        <div className="ec-pill ec-comments">
          <MessageCircle className="ec-pill-svg" strokeWidth={2.6} />
          <span className="ec-pill-text">{comments}</span>
        </div>
        <div className="ec-pill ec-views">
          <Eye className="ec-pill-svg" strokeWidth={2.6} />
          <span className="ec-pill-text">{views}</span>
        </div>
      </div>

      <style jsx>{`
        .ec-main {
          width: 15em;
          font-family: var(--font-sans, "Montserrat", system-ui, sans-serif);
        }

        .ec-card {
          position: relative;
          width: 15em;
          height: 10em;
          background: linear-gradient(270deg, #ce68d9, #45c6db, #45db79);
          background-size: 800% 800%;
          animation: ec-gradient 3s ease infinite;
          transition: 0.4s ease-in-out;
          border-radius: 7px;
          cursor: pointer;
        }

        /* ── Floating emoji ── */
        .ec-float {
          position: absolute;
          top: -2.2em;
          left: -1em;
          z-index: 3;
          filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.35));
          animation: ec-drift 4s ease-in-out infinite;
          transition: 0.3s ease-in-out;
        }

        .ec-main:hover .ec-float {
          top: -3.2em;
          transform: scale(1.15) rotate(-6deg);
        }

        /* ── Fullscreen chip ── */
        .ec-fl {
          display: flex;
          justify-content: flex-end;
          opacity: 0;
          transition: 0.2s ease-in-out;
        }

        .ec-fl:hover .ec-fullscreen {
          scale: 1.2;
        }

        .ec-fl:hover :global(.ec-fullscreen-svg) {
          color: #fff;
        }

        .ec-fullscreen {
          width: 1.5em;
          height: 1.5em;
          border-radius: 5px;
          background-color: #727890;
          margin: 1em 0.5em 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease-in-out;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
        }

        .ec-fullscreen :global(.ec-fullscreen-svg) {
          width: 14px;
          height: 14px;
          color: rgb(177, 176, 176);
          transition: 0.2s ease-in-out;
        }

        /* ── Shadow plate behind the card ── */
        .ec-card-back {
          position: absolute;
          width: 15em;
          height: 13em;
          background-color: rgba(30, 31, 38, 0.575);
          border-radius: 7px;
          margin-top: -4.7em;
          margin-left: 0.7em;
          transition: 0.2s ease-in-out;
          z-index: -1;
        }

        .ec-main:hover .ec-card-back {
          margin-top: -5.9em;
          margin-left: 0;
          scale: 1.1;
          height: 15.25em;
        }

        .ec-main:hover .ec-fl {
          opacity: 1;
        }

        /* ── Data row ── */
        .ec-data {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 1em;
        }

        .ec-img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25em;
          height: 2.25em;
          background-color: #252525;
          border-radius: 5px;
          overflow: hidden;
        }

        .ec-text {
          display: flex;
          justify-content: center;
          flex-direction: column;
          margin-left: 0.5em;
          color: white;
        }

        .ec-text-m {
          font-weight: bold;
          font-size: 0.9em;
        }

        .ec-text-s {
          font-size: 0.7em;
          opacity: 0.85;
        }

        /* ── Action pills ── */
        .ec-btns {
          display: flex;
          gap: 0.5em;
          transition: 0.2s ease-in-out;
        }

        .ec-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1.4em;
          border-radius: 4px;
          margin-top: -0.5em;
          opacity: 0;
          background-color: #444857;
          transition: 0.2s ease-in-out;
        }

        .ec-likes {
          width: 2.5em;
        }
        .ec-comments {
          width: 2.5em;
          transition-duration: 0.24s;
        }
        .ec-views {
          width: 3em;
          transition-duration: 0.28s;
        }

        .ec-pill:hover {
          background-color: #5a5f73;
          cursor: pointer;
        }

        .ec-pill :global(.ec-pill-svg) {
          width: 12px;
          height: 12px;
          color: white;
        }

        .ec-pill-text {
          font-size: 0.8em;
          margin-left: 0.25em;
          color: white;
        }

        .ec-main:hover .ec-pill {
          margin-top: 0.5em;
          opacity: 1;
        }

        /* ── CTA button ── */
        .ec-card-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ec-card-content button {
          padding: 0.8em;
          width: 14em;
          margin-top: 0.6em;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.8em;
          font-weight: bold;
          outline: none;
          border: 1px solid white;
          background-color: transparent;
          color: white;
          transition: 0.4s ease-in-out;
          cursor: pointer;
        }

        .ec-card-content button:hover {
          color: black;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .ec-card-content button:active {
          scale: 1.1;
          background: linear-gradient(
            90deg,
            #ce68d9,
            #45c6db,
            #45db79,
            #9f45b0,
            #e54ed0,
            #ffe4f2
          );
          background-size: 800% 800%;
          animation: ec-gradient 1s ease infinite;
        }

        @keyframes ec-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes ec-drift {
          0%,
          100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ec-card,
          .ec-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EmojiCard;
