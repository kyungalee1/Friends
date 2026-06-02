"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
import { PageHeader } from "@/components/PageHeader";
import type { StudySession } from "@/types";
import { formatMinutes } from "@/lib/utils";

export default function RecordsPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [weekTotal, setWeekTotal] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    try {
      const data = await api<{
        sessions: StudySession[];
        todayTotal: number;
        weekTotal: number;
      }>("/api/study/sessions");

      setSessions(data.sessions);
      setTodayTotal(data.todayTotal);
      setWeekTotal(data.weekTotal);
    } catch {
      setSessions([]);
      setTodayTotal(0);
      setWeekTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleDelete = async (id: string) => {
    if (!confirm("이 기록을 삭제할까요?")) return;
    try {
      await api(`/api/study/sessions?id=${id}`, { method: "DELETE" });
      await loadRecords();
    } catch {
      /* ignore */
    }
  };

  const subjectTotals = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.subject] = (acc[s.subject] || 0) + s.minutes;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-3xl animate-bounce">📊</span>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader title="공부 기록 📊" subtitle="얼마나 열심히 했는지 확인해요" />

      <div className="grid grid-cols-2 gap-3">
        <CuteCard>
          <p className="text-label">오늘</p>
          <p className="text-stat mt-1">{formatMinutes(todayTotal)}</p>
        </CuteCard>
        <CuteCard>
          <p className="text-label">이번 주</p>
          <p className="text-stat mt-1">{formatMinutes(weekTotal)}</p>
        </CuteCard>
      </div>

      {Object.keys(subjectTotals).length > 0 && (
        <CuteCard emoji="📖" title="과목별 (이번 주)">
          <div className="space-y-0.5">
            {Object.entries(subjectTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => (
                <div key={subject} className="list-row !py-1">
                  <span className="text-body font-medium">{subject}</span>
                  <span className="text-caption">{formatMinutes(minutes)}</span>
                </div>
              ))}
          </div>
        </CuteCard>
      )}

      <CuteCard emoji="📝" title={`최근 기록${sessions.length > 0 ? ` (${sessions.length})` : ""}`}>
        {sessions.length === 0 ? (
          <p className="text-caption py-4 text-center">
            아직 기록이 없어요. 공부 타이머를 시작해보세요!
          </p>
        ) : (
          <div className="max-h-72 space-y-0.5 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1"
              >
                <p className="min-w-0 flex-1 truncate text-xs text-soft-text">
                  <span className="font-medium">{session.subject}</span>
                  <span className="text-soft-muted"> · {session.studied_at} · </span>
                  <span className="text-pink">{session.minutes}분</span>
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(session.id)}
                  className="shrink-0 px-1 text-xs text-soft-muted hover:text-coral"
                  aria-label="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </CuteCard>
    </div>
  );
}
