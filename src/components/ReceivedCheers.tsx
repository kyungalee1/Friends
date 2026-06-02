"use client";

import type { ReceivedCheer } from "@/types";
import { formatCheerTime } from "@/lib/utils";

interface ReceivedCheersProps {
  cheers: ReceivedCheer[];
  onDelete: (id: string) => void;
  onDeleteAll?: () => void;
}

export function ReceivedCheers({ cheers, onDelete, onDeleteAll }: ReceivedCheersProps) {
  if (cheers.length === 0) {
    return (
      <p className="text-caption py-2 text-center">아직 받은 응원이 없어요</p>
    );
  }

  return (
    <div>
      {onDeleteAll && cheers.length > 1 && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onDeleteAll}
            className="text-caption text-soft-muted underline"
          >
            전체 삭제
          </button>
        </div>
      )}
      <div className="max-h-40 space-y-0.5 overflow-y-auto">
        {cheers.map((cheer) => (
          <div
            key={cheer.id}
            className="flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1"
          >
            <span className="shrink-0 text-sm leading-none">{cheer.from_emoji}</span>
            <p className="min-w-0 flex-1 truncate text-xs text-soft-text">
              <span className="font-medium">{cheer.from_nickname}</span>
              <span className="text-soft-muted"> · {formatCheerTime(cheer.created_at)} · </span>
              <span>{cheer.message}</span>
            </p>
            <button
              type="button"
              onClick={() => onDelete(cheer.id)}
              className="shrink-0 px-1 text-xs text-soft-muted hover:text-coral"
              aria-label="삭제"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
