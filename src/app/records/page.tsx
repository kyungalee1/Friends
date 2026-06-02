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
      const data = await api<{ sessions: StudySession[] }>("/api/study/sessions");
      const all = data.sessions;
      const today = new Date().toISOString().split("T")[0];

      setSessions(all);
      setTodayTotal(
        all.filter((s) => s.studied_at === today).reduce((sum, s) => sum + s.minutes, 0)
      );
      setWeekTotal(all.reduce((sum, s) => sum + s.minutes, 0));
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
    <div className="space-y-5 px-4 pt-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-soft-text">공부 기록 📊</h1>
        <p className="text-sm text-soft-muted">얼마나 열심히 했는지 확인해요</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <CuteCard className="text-center">
          <p className="text-sm text-soft-muted">오늘</p>
          <p className="text-2xl font-bold text-soft-text">{formatMinutes(todayTotal)}</p>
        </CuteCard>
        <CuteCard className="text-center">
          <p className="text-sm text-soft-muted">이번 주</p>
          <p className="text-2xl font-bold text-soft-text">{formatMinutes(weekTotal)}</p>
        </CuteCard>
      </div>

      {Object.keys(subjectTotals).length > 0 && (
        <CuteCard emoji="📖" title="과목별 (이번 주)">
          <div className="space-y-2">
            {Object.entries(subjectTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => (
                <div key={subject} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2">
                  <span className="font-bold">{subject}</span>
                  <span className="text-soft-muted">{formatMinutes(minutes)}</span>
                </div>
              ))}
          </div>
        </CuteCard>
      )}

      <CuteCard emoji="📝" title="최근 기록">
        {sessions.length === 0 ? (
          <p className="py-6 text-center text-soft-muted">
            아직 기록이 없어요. 공부 타이머를 시작해보세요! 📚
          </p>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 20).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2"
              >
                <div>
                  <span className="font-bold">{session.subject}</span>
                  <span className="ml-2 text-xs text-soft-muted">{session.studied_at}</span>
                </div>
                <span className="font-bold text-pink">{session.minutes}분</span>
              </div>
            ))}
          </div>
        )}
      </CuteCard>
    </div>
  );
}
