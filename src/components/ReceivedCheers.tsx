import type { ReceivedCheer } from "@/types";
import { formatCheerTime } from "@/lib/utils";

interface ReceivedCheersProps {
  cheers: ReceivedCheer[];
}

export function ReceivedCheers({ cheers }: ReceivedCheersProps) {
  if (cheers.length === 0) {
    return (
      <p className="text-caption py-2 text-center">아직 받은 응원이 없어요</p>
    );
  }

  return (
    <div className="space-y-1">
      {cheers.map((cheer) => (
        <div key={cheer.id} className="list-row !py-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 text-base leading-none">{cheer.from_emoji}</span>
            <div className="min-w-0">
              <p className="text-body truncate">
                <span className="font-medium">{cheer.from_nickname}</span>
                <span className="text-caption ml-1.5">
                  {formatCheerTime(cheer.created_at)}
                </span>
              </p>
              <p className="text-caption truncate">{cheer.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
