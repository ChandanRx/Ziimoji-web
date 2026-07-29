import { moods } from "@/lib/moods";

/** A person on Zi!moji — shared across profile, followers, chats and search. */
export interface Person {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  mood: string;
  followers: number;
  following: number;
  posts: number;
  isVerified?: boolean;
  isFollowing?: boolean;
  followsYou?: boolean;
}

/** A feed post — mirrors the shape the Home feed and PostCard expect. */
export interface FeedPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  mood: string;
  moodEmoji: string;
  likes: number;
  comments: number;
  timestamp: string;
  imageUrl?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const avatar = (n: number) => `https://i.pravatar.cc/160?img=${n}`;

export const currentUser: Person = {
  id: "123",
  username: "chandan_user",
  name: "Chandan",
  avatar: avatar(12),
  bio: "Building Zi!moji ✨ · turning feelings into pixels · mood: perpetually curious",
  mood: "Excited",
  followers: 4820,
  following: 312,
  posts: 148,
  isVerified: true,
};

export const people: Person[] = [
  currentUser,
  { id: "user1", username: "emoji_lover",   name: "Aria Emoji",    avatar: avatar(1),  bio: "collecting little joys, one emoji at a time 🌸", mood: "Happy",     followers: 12500, following: 480, posts: 320, isFollowing: true,  followsYou: true },
  { id: "user2", username: "mood_master",   name: "Kai Moods",     avatar: avatar(2),  bio: "curating the internet's feelings · DM for collabs",  mood: "Cool",      followers: 88200, following: 210, posts: 910, isVerified: true, isFollowing: true },
  { id: "user3", username: "happy_vibes",   name: "Sol Vibes",     avatar: avatar(3),  bio: "sunshine in text form ☀️",                          mood: "Love",      followers: 6200,  following: 640, posts: 210, followsYou: true },
  { id: "user4", username: "cool_emojis",   name: "Rin Cool",      avatar: avatar(4),  bio: "keeping it 😎 since forever",                        mood: "Cool",      followers: 9800,  following: 150, posts: 145 },
  { id: "user5", username: "calm_soul",     name: "Noor Calm",     avatar: avatar(7),  bio: "deep breaths & softer days 🫧",                      mood: "Calm",      followers: 3100,  following: 290, posts: 88,  isFollowing: true },
  { id: "user6", username: "funny_moments", name: "Beto Laughs",   avatar: avatar(6),  bio: "here for the punchlines 😂",                         mood: "Funny",     followers: 18400, following: 730, posts: 402, followsYou: true },
  { id: "user7", username: "trending_now",  name: "Zed Trends",    avatar: avatar(5),  bio: "if it's rising, i already reposted it 🔥",           mood: "Excited",   followers: 15700, following: 55,  posts: 660, isVerified: true },
  { id: "user8", username: "night_owl",     name: "Mira Night",    avatar: avatar(8),  bio: "3am thoughts, tastefully arranged 🌙",               mood: "Tired",     followers: 4700,  following: 380, posts: 176 },
  { id: "user9", username: "surprise_me",   name: "Ivo Wonder",    avatar: avatar(9),  bio: "wide-eyed at everything 😲",                         mood: "Surprised", followers: 2100,  following: 210, posts: 63,  followsYou: true },
];

export const peopleById: Record<string, Person> = Object.fromEntries(
  people.map((p) => [p.id, p])
);

export const getPerson = (id: string): Person => peopleById[id] ?? currentUser;

const sampleContent = [
  "A few weeks ago a client flew down to work with our team. We were building something set to change how people feel online.",
  "Some days the mood picks you. Today it's all soft light and quiet wins.",
  "Reminder that your feelings are data, not verdicts. Log them, don't fight them.",
  "Shipped a tiny feature nobody asked for and I've never been happier about it.",
  "The best conversations start with 'how are you, actually?'",
  "Turning a rough afternoon around with good music and worse jokes.",
];

const images = [
  "https://images.unsplash.com/photo-1534471770828-9bde524ee634?w=900&h=700&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=900&h=700&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&h=700&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=900&h=700&fit=crop&auto=format&q=80",
];

/** Deterministically builds a feed for any author so pages render consistently. */
export const buildPosts = (author: Person, count = 6): FeedPost[] =>
  Array.from({ length: count }, (_, i) => {
    const mood = moods[(i + author.id.length) % moods.length];
    const withImage = i % 2 === 0;
    return {
      id: `${author.id}-p${i}`,
      userId: author.id,
      username: author.username,
      userAvatar: author.avatar,
      content: sampleContent[(i + author.name.length) % sampleContent.length],
      mood: mood.label,
      moodEmoji: mood.lottie,
      likes: 40 + ((i * 137 + author.id.length * 29) % 900),
      comments: 3 + ((i * 17) % 40),
      timestamp: `${i + 1}h`,
      ...(withImage && { imageUrl: images[(i + author.name.length) % images.length] }),
      isLiked: i % 3 === 0,
      isBookmarked: i % 4 === 0,
    };
  });

/** A mixed public feed drawn from several authors — used by trending & bookmarks. */
export const feed: FeedPost[] = people
  .slice(1, 7)
  .flatMap((p) => buildPosts(p, 2))
  .map((post, i) => ({ ...post, id: `feed-${i}`, timestamp: `${i + 1}h` }));
