"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
import { StudyTimer } from "@/components/StudyTimer";
import { SUBJECTS } from "@/types";

export default function StudyPage() {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleComplete = async (subjectId: string, minutes: number) => {
    setSaving(true);
    setMessage("");
    try {
      const subject = SUBJECTS.find((s) => s.id === subjectId);
      await api("/api/study/sessions", {
        method: "POST",
        body: JSON.stringify({
          subject: subject?.label || subjectId,
          minutes,
          studied_at: new Date().toISOString().split("T")[0],
        }),
      });
      setMessage(`🎉 ${subject?.emoji} ${subject?.label} ${minutes}분 기록 완료!`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "저장에 실패했어요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 px-4 pt-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-soft-text">공부 타이머 ⏱️</h1>
        <p className="text-sm text-soft-muted">과목을 고르고 집중해봐요!</p>
      </header>

      <CuteCard>
        <StudyTimer onComplete={handleComplete} />
      </CuteCard>

      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-center text-sm font-bold ${
            message.startsWith("🎉")
              ? "bg-mint/40 text-soft-text"
              : "bg-coral/20 text-coral"
          }`}
        >
          {saving ? "저장 중..." : message}
        </div>
      )}
    </div>
  );
}
