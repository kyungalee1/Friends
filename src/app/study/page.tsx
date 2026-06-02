"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
import { PageHeader } from "@/components/PageHeader";
import { StudyTimer } from "@/components/StudyTimer";
import { SUBJECTS } from "@/types";
import { getTodayDateKey } from "@/lib/utils";

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
          studied_at: getTodayDateKey(),
        }),
      });
      setMessage(`${subject?.label} ${minutes}분 기록 완료!`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "저장에 실패했어요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader title="공부 타이머 ⏱️" subtitle="과목을 고르고 집중해봐요" />

      <CuteCard>
        <StudyTimer onComplete={handleComplete} />
      </CuteCard>

      {message && (
        <p className={message.includes("완료") ? "toast-success" : "toast-error"}>
          {saving ? "저장 중..." : message}
        </p>
      )}
    </div>
  );
}
