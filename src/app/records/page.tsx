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
          <div className="space-y-1">
            {Object.entries(subjectTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => (
                <div key={subject} className="list-row !py-1.5">
                  <span className="text-body font-medium">{subject}</span>
                  <span className="text-caption">{formatMinutes(minutes)}</span>
                </div>
              ))}
          </div>
        </CuteCard>
      )}

      <CuteCard emoji="📝" title="최근 기록">
        {sessions.length === 0 ? (
          <p className="text-caption py-4 text-center">
            아직 기록이 없어요. 공부 타이머를 시작해보세요!
          </p>
        ) : (
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {sessions.slice(0, 30).map((session) => (
              <div key={session.id} className="list-row !py-1.5">
                <div className="min-w-0 truncate">
                  <span className="text-body font-medium">{session.subject}</span>
                  <span className="text-caption ml-2">{session.studied_at}</span>
                </div>
                <span className="text-body ml-2 shrink-0 font-medium text-pink">
                  {session.minutes}분
                </span>
              </div>
            ))}
          </div>
        )}
      </CuteCard>
    </div>
  );
}
