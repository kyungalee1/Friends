"use client";

import { useEffect, useState } from "react";
import { SUBJECTS, type SubjectId } from "@/types";
import { formatMinutes } from "@/lib/utils";

interface StudyTimerProps {
  onComplete: (subject: string, minutes: number) => void;
}

export function StudyTimer({ onComplete }: StudyTimerProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(SUBJECTS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleFinish = () => {
    const totalMinutes = Math.max(Math.ceil(seconds / 60), 1);
    onComplete(selectedSubject, totalMinutes);
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-center text-sm text-soft-muted">과목을 선택해요</p>
        <div className="grid grid-cols-3 gap-2">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => !isRunning && setSelectedSubject(subject.id)}
              disabled={isRunning}
              className={`rounded-2xl p-3 text-center transition-all ${
                selectedSubject === subject.id
                  ? `${subject.color} ring-2 ring-pink scale-105`
                  : "bg-white/60 hover:bg-white"
              } ${isRunning ? "opacity-60" : ""}`}
            >
              <div className="text-2xl">{subject.emoji}</div>
              <div className="text-xs font-bold">{subject.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card-cute text-center">
        <div className="mb-2 text-6xl animate-float">📚</div>
        <div className="font-mono text-5xl font-bold text-soft-text">
          {String(minutes).padStart(2, "0")}:{String(displaySeconds).padStart(2, "0")}
        </div>
        <p className="mt-2 text-sm text-soft-muted">
          {isRunning ? "열심히 공부 중... 💪" : "시작 버튼을 눌러요!"}
        </p>
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <button type="button" onClick={handleStart} className="btn-primary flex-1">
            {seconds > 0 ? "▶️ 계속하기" : "🚀 시작!"}
          </button>
        ) : (
          <button type="button" onClick={handlePause} className="btn-secondary flex-1">
            ⏸️ 잠깐 쉬기
          </button>
        )}
        {seconds > 0 && (
          <button type="button" onClick={handleFinish} className="btn-primary flex-1">
            ✅ 완료 ({formatMinutes(Math.max(Math.ceil(seconds / 60), 1))})
          </button>
        )}
      </div>
    </div>
  );
}
