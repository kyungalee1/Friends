export const SUBJECTS = [
  { id: "korean", label: "국어", emoji: "📖", color: "bg-pink/40" },
  { id: "math", label: "수학", emoji: "🔢", color: "bg-lavender/40" },
  { id: "english", label: "영어", emoji: "🔤", color: "bg-sky/40" },
  { id: "science", label: "과학", emoji: "🔬", color: "bg-mint/40" },
  { id: "world_history", label: "세계사", emoji: "🌏", color: "bg-peach/40" },
  { id: "ethics", label: "도덕", emoji: "💛", color: "bg-cream" },
] as const;

export const CHEER_MESSAGES = [
  { id: "fighting", emoji: "🔥", text: "화이팅!" },
  { id: "good", emoji: "⭐", text: "오늘도 최고!" },
  { id: "clap", emoji: "👏", text: "수고했어!" },
  { id: "heart", emoji: "💪", text: "힘내!" },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]["id"];
export type EmojiChar = "🐰" | "🐢";

export interface Profile {
  id: string;
  phone: string;
  nickname: string;
  emoji: EmojiChar;
  group_id: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  max_members: number;
  created_by: string | null;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  minutes: number;
  studied_at: string;
  created_at: string;
}

export interface DailyTotal {
  user_id: string;
  nickname: string;
  emoji: EmojiChar;
  total_minutes: number;
}

export interface Cheer {
  id: string;
  from_user: string;
  to_user: string;
  message: string;
  created_at: string;
  from_nickname?: string;
  from_emoji?: EmojiChar;
}

export interface ReceivedCheer {
  id: string;
  message: string;
  created_at: string;
  from_nickname: string;
  from_emoji: EmojiChar;
}
