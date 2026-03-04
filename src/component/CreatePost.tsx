"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FaImage, FaSmile, FaTimes } from "react-icons/fa";
import { Smile, Frown, Angry, Heart, Sparkles, SunMedium, Laugh, Zap, Cloud, Moon } from "lucide-react";

interface CreatePostProps {
  onPostCreate?: (post: {
    content: string;
    mood: string;
    moodEmoji: string;
    imageUrl?: string;
  }) => void;
}

const moods = [
  { label: "Happy", emoji: "😊", color: "bg-yellow-100", iconColor: "text-yellow-500", Icon: Smile },
  { label: "Sad", emoji: "😢", color: "bg-blue-100", iconColor: "text-blue-500", Icon: Frown },
  { label: "Angry", emoji: "😠", color: "bg-red-100", iconColor: "text-red-500", Icon: Angry },
  { label: "Love", emoji: "❤️", color: "bg-pink-100", iconColor: "text-pink-500", Icon: Heart },
  { label: "Excited", emoji: "🤩", color: "bg-orange-100", iconColor: "text-orange-500", Icon: Sparkles },
  { label: "Cool", emoji: "😎", color: "bg-cyan-100", iconColor: "text-cyan-500", Icon: SunMedium },
  { label: "Funny", emoji: "😂", color: "bg-purple-100", iconColor: "text-purple-500", Icon: Laugh },
  { label: "Surprised", emoji: "😲", color: "bg-green-100", iconColor: "text-green-500", Icon: Zap },
  { label: "Calm", emoji: "😌", color: "bg-indigo-100", iconColor: "text-indigo-500", Icon: Cloud },
  { label: "Tired", emoji: "😴", color: "bg-gray-100", iconColor: "text-slate-500", Icon: Moon },
];

const CreatePost = ({ onPostCreate }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPosting, setIsPosting] = useState(false);

  const currentUser = {
    id: "123",
    username: "chandan_user",
    avatar: "https://i.pravatar.cc/120?img=12",
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload to a service and get the URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (onPostCreate) {
      onPostCreate({
        content: content.trim(),
        mood: selectedMood.label,
        moodEmoji: selectedMood.emoji,
        imageUrl: imageUrl || undefined,
      });
    }

    // Reset form
    setContent("");
    setImageUrl("");
    setImagePreview("");
    setSelectedMood(moods[0]);
    setIsPosting(false);
  };

  const removeImage = () => {
    setImageUrl("");
    setImagePreview("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/95 rounded-2xl shadow-[0_18px_40px_rgba(148,163,184,0.35)] border border-slate-100/80 p-6 mb-6 backdrop-blur-sm"
    >
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={currentUser.avatar}
          alt={currentUser.username}
          width={48}
          height={48}
          className="rounded-full border-2 border-gray-200 object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">{currentUser.username}</h3>
          <p className="text-xs text-slate-500">What's on your mind?</p>
        </div>
      </div>

      {/* Text Input */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full p-4 rounded-xl border border-slate-200 
                 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-200
                 resize-none text-slate-900 placeholder-slate-400
                 transition-all duration-300 mb-4"
        rows={4}
      />

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full 
                     text-white hover:bg-black/70 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Selected Mood Display */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-600">Mood:</span>
        <button
          onClick={() => setShowMoodPicker(!showMoodPicker)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full 
                   ${selectedMood.color} text-slate-900 font-medium border border-slate-200/80 shadow-sm
                   hover:border-fuchsia-300/70 hover:shadow-[0_6px_18px_rgba(236,72,153,0.25)] transition-all duration-300`}
        >
          <selectedMood.Icon className={`w-4 h-4 ${selectedMood.iconColor}`} />
          <span>{selectedMood.label}</span>
        </button>
      </div>

      {/* Mood Picker */}
      {showMoodPicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
        >
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => {
                  setSelectedMood(mood);
                  setShowMoodPicker(false);
                }}
                className={`p-3 rounded-lg transition-all duration-200
                         ${selectedMood.label === mood.label
                           ? `${mood.color} text-slate-900 scale-105 ring-2 ring-fuchsia-300/70 shadow-[0_10px_24px_rgba(148,163,184,0.4)]`
                           : "bg-white hover:bg-slate-50 text-slate-700"
                         }`}
              >
                <mood.Icon className={`w-4 h-4 mb-1 ${mood.iconColor}`} />
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-top border-t border-slate-100">
        <div className="flex items-center gap-4">
          {/* Image Upload */}
          <label className="flex items-center gap-2 text-slate-500 hover:text-fuchsia-500 
                          cursor-pointer transition-colors">
            <FaImage className="text-lg" />
            <span className="text-sm font-medium">Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Mood Picker Toggle */}
          <button
            onClick={() => setShowMoodPicker(!showMoodPicker)}
            className="flex items-center gap-2 text-slate-500 hover:text-fuchsia-500 
                     transition-colors"
          >
            <FaSmile className="text-lg" />
            <span className="text-sm font-medium">Mood</span>
          </button>
        </div>

        {/* Post Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!content.trim() || isPosting}
          className={`px-6 py-2 rounded-full font-semibold text-white
                   transition-all duration-300
                   ${content.trim() && !isPosting
                     ? "bg-fuchsia-500 hover:bg-fuchsia-600 shadow-[0_10px_25px_rgba(236,72,153,0.5)]"
                     : "bg-slate-200 cursor-not-allowed text-slate-500"
                   }`}
        >
          {isPosting ? "Posting..." : "Post"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreatePost;

