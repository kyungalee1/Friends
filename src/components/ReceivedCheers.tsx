import type { ReceivedCheer } from "@/types";
import { formatCheerTime } from "@/lib/utils";

interface ReceivedCheersProps {
  cheers: ReceivedCheer[];
  compact?: boolean;
}

export function ReceivedCheers({ cheers, compact = false }: ReceivedCheersProps) {
  if (cheers.length === 0) {
    return (
      <p className={`text-center text-soft-muted ${compact ? "py-2 text-xs" : "py-4 text-sm"}`}>
        아직 받은 응원이 없어요
      </p>
    );
  }

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      {cheers.map((cheer) => (
        <div
          key={cheer.id}
          className={`flex items-center gap-2 rounded-lg bg-white/60 ${
            compact ? "px-2 py-1" : "px-2.5 py-1.5"
          }`}
        >
          <span className="shrink-0 text-base leading-none">{cheer.from_emoji}</span>
          <div className="min-w-0 flex-1">
            <p className={`truncate font-bold text-soft-text ${compact ? "text-xs" : "text-sm"}`}>
              {cheer.from_nickname}
              <span className="ml-1 font-normal text-soft-muted">
                {formatCheerTime(cheer.created_at)}
              </span>
            </p>
            <p className={`text-soft-text ${compact ? "text-xs" : "text-sm"}`}>
              {cheer.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
