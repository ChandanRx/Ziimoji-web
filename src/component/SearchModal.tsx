"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const moodSuggestions = [
    { label: "Happy", emoji: "😊" },
    { label: "Sad", emoji: "😢" },
    { label: "Angry", emoji: "😠" },
    { label: "Love", emoji: "❤️" },
    { label: "Excited", emoji: "🤩" },
    { label: "Cool", emoji: "😎" },
    { label: "Funny", emoji: "😂" },
    { label: "Surprised", emoji: "😲" },
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.getElementById("search-input");
        input?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Search Input Section */}
              <div className="p-6 border-b border-gray-100">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search emojis, moods, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchQuery);
                      }
                    }}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 
                             bg-gray-50 focus:bg-white focus:border-purple-300 
                             focus:outline-none focus:ring-2 focus:ring-purple-200/50
                             text-base text-gray-700 placeholder-gray-400
                             transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Mood Suggestions Section */}
              <div className="p-6 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-600 mb-4">Quick Search</p>
                <div className="flex flex-wrap gap-2">
                  {moodSuggestions.map((mood, index) => (
                    <motion.button
                      key={mood.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestionClick(mood.label)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                               bg-white border border-gray-200
                               hover:bg-purple-50 hover:border-purple-300
                               hover:text-purple-700
                               transition-all duration-300
                               text-sm font-medium text-gray-700
                               shadow-sm hover:shadow-md"
                    >
                      <span className="text-lg">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Close button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

