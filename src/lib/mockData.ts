import { genres } from "@/lib/genres";

/** A teller on Grimoire — shared across profile, followers, chats and search. */
export interface Person {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  genre: string;
  followers: number;
  following: number;
  posts: number;
  isVerified?: boolean;
  isFollowing?: boolean;
  followsYou?: boolean;
}

/** A feed story — mirrors the shape the Home feed and PostCard expect. */
export interface FeedPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  content: string;
  genre: string;
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
  bio: "Keeper of the Grimoire · collecting tales that shouldn't be told · always something behind me",
  genre: "Haunting",
  followers: 4820,
  following: 312,
  posts: 148,
  isVerified: true,
};

export const people: Person[] = [
  currentUser,
  { id: "user1", username: "grave_whispers", name: "Ada Mourne",    avatar: avatar(1),  bio: "I write down what the house tells me at night 🕯️", genre: "Haunting",   followers: 12500, following: 480, posts: 320, isFollowing: true,  followsYou: true },
  { id: "user2", username: "hollow_man",     name: "Kai Vesper",    avatar: avatar(2),  bio: "curator of cursed objects · DM at your own risk",   genre: "Cursed",     followers: 88200, following: 210, posts: 910, isVerified: true, isFollowing: true },
  { id: "user3", username: "the_static",     name: "Sol Vane",      avatar: avatar(3),  bio: "recording the sounds no one else can hear 📻",      genre: "Paranormal", followers: 6200,  following: 640, posts: 210, followsYou: true },
  { id: "user4", username: "red_room",       name: "Rin Marrow",    avatar: avatar(4),  bio: "it's only paint. mostly.",                          genre: "Gore",       followers: 9800,  following: 150, posts: 145 },
  { id: "user5", username: "cold_spot",      name: "Noor Sable",    avatar: avatar(7),  bio: "the temperature drops when I start typing 🧊",      genre: "Unsettling", followers: 3100,  following: 290, posts: 88,  isFollowing: true },
  { id: "user6", username: "night_terrors",  name: "Beto Crane",    avatar: avatar(6),  bio: "here for the 3am reads · sleep is optional 😴",      genre: "Haunting",   followers: 18400, following: 730, posts: 402, followsYou: true },
  { id: "user7", username: "the_wailing",    name: "Zed Holloway",  avatar: avatar(5),  bio: "if it screams, I already reblogged it",             genre: "Gore",       followers: 15700, following: 55,  posts: 660, isVerified: true },
  { id: "user8", username: "crawlspace",     name: "Mira Ashe",     avatar: avatar(8),  bio: "there is always more room beneath the floor 🕷️",    genre: "Unsettling", followers: 4700,  following: 380, posts: 176 },
  { id: "user9", username: "dead_air",       name: "Ivo Bell",      avatar: avatar(9),  bio: "the last voicemail you'll ever get 📞",             genre: "Paranormal", followers: 2100,  following: 210, posts: 63,  followsYou: true },
];

export const peopleById: Record<string, Person> = Object.fromEntries(
  people.map((p) => [p.id, p])
);

export const getPerson = (id: string): Person => peopleById[id] ?? currentUser;

/** Title + opening line pairs — six little tales the feeds draw from. */
const sampleStories: { title: string; content: string }[] = [
  { title: "The Walls Remember", content: "The scratching in the walls stopped the night my brother moved out. It started again the night I found his old room still locked — from the inside." },
  { title: "The Woman in the Frame", content: "Every photo I develop now has the same woman in the background. Last month she was across the street. This morning she was standing in my kitchen." },
  { title: "Floor Thirteen", content: "The elevator only ever showed twelve floors. I've worked this building six years. Tonight the panel lit up one more, and it was already pressed." },
  { title: "Under the Stairs", content: "My daughter keeps drawing a man with too many joints. She says he lives under the stairs, that he's very patient, and that he likes it when I work late." },
  { title: "A Call From Myself", content: "The voicemail came from my own number, left at 3:07 a.m. In it, I'm begging myself — calm, certain — not to open the door no matter what it sounds like." },
  { title: "What Came Back", content: "We buried the dog on Sunday. Monday the back door hung open, and there were muddy paw prints on the tile — leading in, never out." },
];

// Grayscale photos load reliably and read as bleak old-manga plates in every band.
const images = [
  "https://picsum.photos/seed/grimoire-a/900/700?grayscale",
  "https://picsum.photos/seed/grimoire-b/900/700?grayscale",
  "https://picsum.photos/seed/grimoire-c/900/700?grayscale",
  "https://picsum.photos/seed/grimoire-d/900/700?grayscale",
];

/** Deterministically builds a feed for any author so pages render consistently. */
export const buildPosts = (author: Person, count = 6): FeedPost[] =>
  Array.from({ length: count }, (_, i) => {
    const genre = genres[(i + author.id.length) % genres.length];
    const story = sampleStories[(i + author.name.length) % sampleStories.length];
    const withImage = i % 2 === 0;
    return {
      id: `${author.id}-p${i}`,
      userId: author.id,
      username: author.username,
      userAvatar: author.avatar,
      title: story.title,
      content: story.content,
      genre: genre.label,
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
