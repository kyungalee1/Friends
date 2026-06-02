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

  return (
    <div
      className={`rounded-2xl p-3 transition-all ${
        isMe ? "bg-pink/15 ring-2 ring-pink/40" : "bg-white/60"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{rankEmoji}</span>
          <span className="font-bold text-soft-text">
            {nickname}
            {isMe && <span className="ml-1 text-sm text-pink">(나)</span>}
          </span>
        </div>
        <span className="text-sm font-bold text-soft-muted">{minutes}분</span>
      </div>

      <div className="relative h-10 overflow-hidden rounded-full bg-gradient-to-r from-mint/30 via-sky/30 to-lavender/30">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mint/50 to-sky/50 transition-all duration-700 ease-out"
          style={{ width: `${Math.max(progress, 5)}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ left: `calc(${Math.max(progress, 3)}% - 16px)` }}
        >
          <span
            className={`inline-block text-2xl ${
              progress > 0 ? "animate-race-run" : ""
            }`}
          >
            {emoji}
          </span>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg">🏁</div>
      </div>
    </div>
  );
}
