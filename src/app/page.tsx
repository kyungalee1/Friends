"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
import { RaceTrack } from "@/components/RaceTrack";
import type { DailyTotal, Profile } from "@/types";
import { formatMinutes } from "@/lib/utils";
import Link from "next/link";

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totals, setTotals] = useState<DailyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const me = await api<{ user: Profile }>("/api/auth/me");
      setProfile(me.user);

      if (me.user.group_id) {
        const race = await api<{ totals: DailyTotal[] }>("/api/groups/race");
        setTotals(race.totals);
      } else {
        setTotals([]);
      }
    } catch {
      setProfile(null);
      setTotals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-4xl animate-bounce">🐰</span>
      </div>
    );
  }

  const maxMinutes = Math.max(...totals.map((t) => t.total_minutes), 60);
  const myTotal = totals.find((t) => t.user_id === profile?.id);
  const groupAvg =
    totals.length > 0
      ? Math.round(totals.reduce((s, t) => s + t.total_minutes, 0) / totals.length)
      : 0;

  return (
    <div className="space-y-5 px-4 pt-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-soft-text">오늘의 레이스 🏁</h1>
        <p className="text-sm text-soft-muted">
          {new Date().toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </p>
      </header>

      {!profile?.group_id ? (
        <CuteCard emoji="👥" title="그룹에 참여해요">
          <p className="mb-4 text-sm text-soft-muted">
            친구들과 함께 레이스를 시작하려면 그룹에 가입하세요!
          </p>
          <Link href="/group" className="btn-primary block text-center">
            그룹 참여하기
          </Link>
        </CuteCard>
      ) : (
        <>
          <CuteCard emoji={profile.emoji} title="내 오늘 공부">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-soft-text">
                  {formatMinutes(myTotal?.total_minutes || 0)}
                </p>
                <p className="text-sm text-soft-muted">
                  그룹 평균 {formatMinutes(groupAvg)}
                </p>
              </div>
              <Link href="/study" className="btn-primary text-sm !py-2 !px-4">
                📚 공부하기
              </Link>
            </div>
          </CuteCard>

          <CuteCard emoji="🏃" title="레이스 현황">
            {totals.length === 0 ? (
              <p className="py-8 text-center text-soft-muted">
                아직 오늘 공부 기록이 없어요. 첫 번째 주자가 되어보세요! 🐰
              </p>
            ) : (
              <div className="space-y-3">
                {totals.map((member, idx) => (
                  <RaceTrack
                    key={member.user_id}
                    nickname={member.nickname}
                    emoji={member.emoji}
                    minutes={member.total_minutes}
                    maxMinutes={maxMinutes}
                    isMe={member.user_id === profile?.id}
                    rank={idx + 1}
                  />
                ))}
              </div>
            )}
          </CuteCard>

          {myTotal && myTotal.total_minutes > 0 && (
            <div className="rounded-2xl bg-mint/30 px-4 py-3 text-center text-sm font-bold text-soft-text">
              {myTotal.total_minutes >= groupAvg
                ? "🌟 평균 이상! 오늘도 잘하고 있어요!"
                : "💪 조금만 더 하면 평균을 넘을 수 있어요!"}
            </div>
          )}
        </>
      )}
    </div>
  );
}
