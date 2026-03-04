"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { FaSearch, FaTimes, FaFire, FaHashtag } from "react-icons/fa";
import RightSidebar from "@/component/RightSidebar";

const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const moodSuggestions = [
    { label: "Happy", emoji: "😊", count: "12.5k" },
    { label: "Sad", emoji: "😢", count: "8.2k" },
    { label: "Angry", emoji: "😠", count: "5.1k" },
    { label: "Love", emoji: "❤️", count: "25.3k" },
    { label: "Excited", emoji: "🤩", count: "15.7k" },
    { label: "Cool", emoji: "😎", count: "9.8k" },
    { label: "Funny", emoji: "😂", count: "18.4k" },
    { label: "Surprised", emoji: "😲", count: "6.9k" },
  ];

  const trendingTopics = [
    { topic: "#HappyMood", posts: "12.5K posts", trending: true },
    { topic: "#LoveToday", posts: "8.9K posts", trending: false },
    { topic: "#Excited", posts: "6.2K posts", trending: true },
    { topic: "#CoolVibes", posts: "4.7K posts", trending: false },
  ];

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto ml-72 pr-80">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Search Bar - Fixed at top */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-10 bg-white pb-4 pt-2"
          >
            <div className="relative">
              <FaSearch
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors ${
                  isFocused ? "text-purple-600" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search emojis, moods, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
                className="w-full pl-12 pr-12 py-2 rounded-md border-1 transition-all duration-300
                         bg-gray-50 focus:bg-white focus:border-purple-500 
                         focus:outline-none focus:ring-4 focus:ring-purple-200/50
                         text-lg text-gray-900 placeholder-gray-500
                         shadow-sm focus:shadow-lg"
                autoFocus
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => {
                    setSearchQuery("");
                    router.push("/search");
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
                           text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                           transition-all duration-200"
                >
                  <FaTimes />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Content based on search state */}
          {searchQuery ? (
            // Search Results
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="text-sm text-gray-500 mb-4">
                Results for "{searchQuery}"
              </div>
              {/* Search results would go here */}
              <div className="text-center py-12 text-gray-400">
                <FaSearch className="text-4xl mx-auto mb-3 opacity-50" />
                <p>No results found. Try a different search term.</p>
              </div>
            </motion.div>
          ) : (
            // Default View - Suggestions and Trends
            <div className="mt-6 space-y-8">
              {/* Quick Search Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Search</h2>
                <div className="grid grid-cols-2 gap-3">
                  {moodSuggestions.map((mood, index) => (
                    <motion.button
                      key={mood.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(mood.label)}
                      className="flex items-center justify-between p-4 rounded-xl
                               bg-gray-50 hover:bg-purple-50 border border-gray-200
                               hover:border-purple-300 transition-all duration-300
                               group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{mood.emoji}</span>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-purple-700">
                            {mood.label}
                          </div>
                          <div className="text-xs text-gray-500">{mood.count} posts</div>
                        </div>
                      </div>
                      <FaSearch className="text-gray-400 group-hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFire className="text-orange-500" />
                  Trending Now
                </h2>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <motion.button
                      key={topic.topic}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                      onClick={() => handleSuggestionClick(topic.topic)}
                      className="w-full flex items-center justify-between p-4 rounded-xl
                               bg-gray-50 hover:bg-gray-100 border border-gray-200
                               transition-all duration-300 group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FaHashtag className="text-gray-400 text-lg" />
                        <div>
                          <div className="font-semibold text-gray-900">{topic.topic}</div>
                          <div className="text-sm text-gray-500">{topic.posts}</div>
                        </div>
                      </div>
                      {topic.trending && (
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                          Trending
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;

