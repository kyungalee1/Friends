"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
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

  const subjectTotals = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.subject] = (acc[s.subject] || 0) + s.minutes;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-4xl animate-bounce">📊</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-5">
      <header className="text-center">
        <h1 className="text-xl font-bold text-soft-text">공부 기록 📊</h1>
        <p className="text-xs text-soft-muted">얼마나 열심히 했는지 확인해요</p>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <CuteCard className="!p-3 text-center">
          <p className="text-xs text-soft-muted">오늘</p>
          <p className="text-xl font-bold text-soft-text">{formatMinutes(todayTotal)}</p>
        </CuteCard>
        <CuteCard className="!p-3 text-center">
          <p className="text-xs text-soft-muted">이번 주</p>
          <p className="text-xl font-bold text-soft-text">{formatMinutes(weekTotal)}</p>
        </CuteCard>
      </div>

      {Object.keys(subjectTotals).length > 0 && (
        <CuteCard emoji="📖" title="과목별 (이번 주)" className="!p-3">
          <div className="space-y-0.5">
            {Object.entries(subjectTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => (
                <div
                  key={subject}
                  className="flex items-center justify-between rounded-lg bg-white/60 px-2 py-1 text-sm"
                >
                  <span className="font-bold">{subject}</span>
                  <span className="text-xs text-soft-muted">{formatMinutes(minutes)}</span>
                </div>
              ))}
          </div>
        </CuteCard>
      )}

      <CuteCard emoji="📝" title="최근 기록" className="!p-3">
        {sessions.length === 0 ? (
          <p className="py-4 text-center text-xs text-soft-muted">
            아직 기록이 없어요. 공부 타이머를 시작해보세요! 📚
          </p>
        ) : (
          <div className="max-h-64 space-y-0.5 overflow-y-auto">
            {sessions.slice(0, 30).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg bg-white/60 px-2 py-1 text-sm"
              >
                <div className="min-w-0 truncate">
                  <span className="font-bold">{session.subject}</span>
                  <span className="ml-1.5 text-[10px] text-soft-muted">{session.studied_at}</span>
                </div>
                <span className="ml-2 shrink-0 text-xs font-bold text-pink">{session.minutes}분</span>
              </div>
            ))}
          </div>
        )}
      </CuteCard>
    </div>
  );
}
