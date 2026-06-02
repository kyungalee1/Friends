"use client";

import { useEffect, useRef, useState } from "react";
import { SUBJECTS, type SubjectId } from "@/types";
import { formatMinutes } from "@/lib/utils";

interface StudyTimerProps {
  onComplete: (
    subject: string,
    minutes: number,
    meta?: { reason?: "manual" | "max" }
  ) => void;
}

export function StudyTimer({ onComplete }: StudyTimerProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(SUBJECTS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [endNotice, setEndNotice] = useState<string>("");
  const autoFinishRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;
    const MAX_SECONDS = 60 * 60;
    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (next >= MAX_SECONDS) {
          if (!autoFinishRef.current) {
            autoFinishRef.current = true;
            onComplete(selectedSubject, 60, { reason: "max" });
            setEndNotice("60분이 되었어요! 쉬는 시간을 가지세요 😊");
          }
          setEndNotice("60분이 되었어요! 쉬는 시간을 가지세요 😊");
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onComplete, selectedSubject]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const handleStart = () => {
    setEndNotice("");
    autoFinishRef.current = false;
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);

  const handleFinish = () => {
    const totalMinutes = Math.min(60, Math.max(Math.ceil(seconds / 60), 1));
    onComplete(
      selectedSubject,
      totalMinutes,
      { reason: "manual" }
    );
    setIsRunning(false);
    setSeconds(0);
    setEndNotice("");
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-label mb-2 text-center">과목 선택</p>
        <div className="grid grid-cols-3 gap-2">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => !isRunning && setSelectedSubject(subject.id)}
              disabled={isRunning}
              className={`rounded-xl p-2.5 text-center transition-all ${
                selectedSubject === subject.id
                  ? `${subject.color} ring-2 ring-pink/50`
                  : "bg-white/60"
              } ${isRunning ? "opacity-60" : ""}`}
            >
              <div className="text-xl leading-none">{subject.emoji}</div>
              <div className="text-caption mt-1 font-medium">{subject.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white/60 py-5 text-center">
        <p className="text-stat font-mono tracking-wider">
          {String(minutes).padStart(2, "0")}:{String(displaySeconds).padStart(2, "0")}
        </p>
        <p className="text-caption mt-2">
          {endNotice
            ? endNotice
            : isRunning
              ? "열심히 공부 중 💪"
              : "시작 버튼을 눌러주세요"}
        </p>
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button type="button" onClick={handleStart} className="btn-primary-auto">
            {seconds > 0 ? "계속하기" : "공부하기"}
          </button>
        ) : (
          <button type="button" onClick={handlePause} className="btn-secondary-auto">
            잠깐 쉬기
          </button>
        )}
        {seconds > 0 && (
          <button type="button" onClick={handleFinish} className="btn-primary-auto">
            완료 ({formatMinutes(Math.max(Math.ceil(seconds / 60), 1))})
          </button>
        )}
      </div>
    </div>
  );
}
