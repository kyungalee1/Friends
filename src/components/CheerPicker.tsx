"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CHEER_MESSAGES } from "@/types";

interface CheerPickerProps {
  memberName: string;
  memberEmoji: string;
  onSend: (message: string) => void;
}

export function CheerPicker({ memberName, memberEmoji, onSend }: CheerPickerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handlePick = (emoji: string, text: string) => {
    onSend(`${emoji} ${text}`);
    setOpen(false);
  };

  const modal =
    open &&
    mounted &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40"
        onClick={() => setOpen(false)}
        role="presentation"
      >
        <div
          className="flex max-h-[min(90dvh,100%)] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl"
          style={{
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            paddingTop: "max(1rem, env(safe-area-inset-top))",
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="응원 메시지 선택"
        >
          <div className="shrink-0 px-4 pb-3 pt-1 text-center">
            <p className="text-card-title">
              <span className="mr-1 inline-block text-xl leading-normal">{memberEmoji}</span>
              {memberName}
            </p>
            <p className="text-caption mt-1">어떤 응원을 보낼까요?</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
            <div className="grid grid-cols-4 gap-2 pb-2">
              {CHEER_MESSAGES.map((cheer) => (
                <button
                  key={cheer.id}
                  type="button"
                  onClick={() => handlePick(cheer.emoji, cheer.text)}
                  className="flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl bg-cream px-1 py-2 transition-colors active:bg-pink/25"
                >
                  <span className="text-2xl leading-normal">{cheer.emoji}</span>
                  <span className="text-caption mt-1 w-full text-center leading-snug">
                    {cheer.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 px-4 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-primary">
              닫기
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-inline-primary shrink-0 !px-3 !py-1.5 text-xs"
      >
        💌 응원
      </button>
      {modal}
    </>
  );
}
