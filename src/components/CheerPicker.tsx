"use client";

import { useState } from "react";
import { CHEER_MESSAGES } from "@/types";

interface CheerPickerProps {
  memberName: string;
  memberEmoji: string;
  onSend: (message: string) => void;
}

export function CheerPicker({ memberName, memberEmoji, onSend }: CheerPickerProps) {
  const [open, setOpen] = useState(false);

  const handlePick = (emoji: string, text: string) => {
    onSend(`${emoji} ${text}`);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-inline-primary shrink-0 !px-3 !py-1.5 text-xs"
      >
        💌 응원
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white px-4 pb-8 pt-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="응원 메시지 선택"
          >
            <div className="mb-4 text-center">
              <p className="text-card-title">
                {memberEmoji} {memberName}
              </p>
              <p className="text-caption mt-0.5">어떤 응원을 보낼까요?</p>
            </div>

            <div className="grid max-h-[50vh] grid-cols-4 gap-2 overflow-y-auto">
              {CHEER_MESSAGES.map((cheer) => (
                <button
                  key={cheer.id}
                  type="button"
                  onClick={() => handlePick(cheer.emoji, cheer.text)}
                  className="flex flex-col items-center rounded-xl bg-cream px-1 py-2 transition-colors active:bg-pink/25"
                >
                  <span className="text-xl leading-none">{cheer.emoji}</span>
                  <span className="text-caption mt-1 text-center leading-tight">
                    {cheer.text}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
