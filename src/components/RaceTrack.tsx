interface RaceTrackProps {
  nickname: string;
  emoji: string;
  minutes: number;
  maxMinutes: number;
  isMe?: boolean;
  rank?: number;
}

export function RaceTrack({
  nickname,
  emoji,
  minutes,
  maxMinutes,
  isMe = false,
  rank,
}: RaceTrackProps) {
  const progress = maxMinutes > 0 ? Math.min((minutes / maxMinutes) * 100, 100) : 0;
  const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
  const emojiLeft =
    progress <= 0 ? "4px" : `max(4px, calc(${progress}% - 14px))`;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-xl px-1.5 py-1 ${
        isMe ? "bg-pink/10 ring-1 ring-pink/30" : "bg-white/50"
      }`}
    >
      <span className="w-4 shrink-0 text-center text-xs leading-none">{rankEmoji}</span>

      <div className="w-[48px] shrink-0">
        <p className="truncate text-xs font-medium text-soft-text">
          {nickname}
          {isMe && <span className="text-pink">*</span>}
        </p>
        <p className="text-caption">{minutes}분</p>
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="relative h-6 overflow-visible rounded-full bg-gradient-to-r from-mint/25 via-sky/25 to-lavender/25">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mint/45 to-sky/45 transition-all duration-700"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
          <div
            className="absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-700"
            style={{ left: emojiLeft }}
          >
            <span className={`inline-block text-base leading-none ${progress > 0 ? "animate-race-run" : ""}`}>
              {emoji}
            </span>
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs leading-none">🏁</div>
        </div>
      </div>
    </div>
  );
}
