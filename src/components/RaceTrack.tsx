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
      className={`flex items-center gap-1.5 rounded-xl px-1.5 py-1 transition-all ${
        isMe ? "bg-pink/15 ring-1 ring-pink/40" : "bg-white/50"
      }`}
    >
      <span className="w-4 shrink-0 text-center text-xs leading-none">{rankEmoji}</span>

      <div className="w-[52px] shrink-0 leading-tight">
        <p className="truncate text-[11px] font-bold text-soft-text">
          {nickname}
          {isMe && <span className="text-pink">*</span>}
        </p>
        <p className="text-[10px] text-soft-muted">{minutes}분</p>
      </div>

      <div className="relative min-w-0 flex-1 py-0.5">
        <div className="relative h-6 overflow-visible rounded-full bg-gradient-to-r from-mint/30 via-sky/30 to-lavender/30">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mint/50 to-sky/50 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{ left: emojiLeft }}
          >
            <span
              className={`inline-block text-lg leading-none ${
                progress > 0 ? "animate-race-run" : ""
              }`}
            >
              {emoji}
            </span>
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs leading-none">
            🏁
          </div>
        </div>
      </div>
    </div>
  );
}
