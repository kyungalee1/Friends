"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
import { CHEER_MESSAGES } from "@/types";
import type { Group, Profile, ReceivedCheer } from "@/types";
import { ReceivedCheers } from "@/components/ReceivedCheers";

export default function GroupPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [receivedCheers, setReceivedCheers] = useState<ReceivedCheer[]>([]);

  const loadCheers = useCallback(async () => {
    try {
      const data = await api<{ cheers: ReceivedCheer[] }>("/api/cheers");
      setReceivedCheers(data.cheers);
    } catch {
      setReceivedCheers([]);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const data = await api<{
        profile: Profile;
        group: Group | null;
        members: Profile[];
      }>("/api/groups");
      setProfile(data.profile);
      setGroup(data.group);
      setMembers(data.members);
    } catch {
      setProfile(null);
      setGroup(null);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadCheers();
  }, [loadData, loadCheers]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setMessage("그룹 이름을 입력해주세요");
      return;
    }
    setActionLoading(true);
    setMessage("");
    try {
      await api("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name: groupName.trim() }),
      });
      setMessage("🎉 그룹이 만들어졌어요!");
      await loadData();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "그룹 생성 실패");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      setMessage("초대 코드를 입력해주세요");
      return;
    }
    setActionLoading(true);
    setMessage("");
    try {
      await api("/api/groups/join", {
        method: "POST",
        body: JSON.stringify({ invite_code: inviteCode.trim().toUpperCase() }),
      });
      setMessage("🎉 그룹에 참여했어요!");
      setInviteCode("");
      await loadData();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "참여 실패");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendCheer = async (toUserId: string, cheerText: string) => {
    try {
      await api("/api/cheers", {
        method: "POST",
        body: JSON.stringify({ to_user: toUserId, message: cheerText }),
      });
      setMessage(`💌 "${cheerText}" 응원을 보냈어요!`);
    } catch {
      setMessage("응원 전송에 실패했어요");
    }
  };

  const handleLogout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const copyInviteCode = () => {
    if (group?.invite_code) {
      navigator.clipboard.writeText(group.invite_code);
      setMessage("📋 초대 코드가 복사됐어요!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-4xl animate-bounce">👥</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 pt-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-soft-text">그룹 👥</h1>
        <p className="text-sm text-soft-muted">
          {profile?.emoji} {profile?.nickname}
        </p>
      </header>

      {!group ? (
        <>
          <CuteCard emoji="✨" title="새 그룹 만들기">
            <input
              type="text"
              className="input-cute mb-3"
              placeholder="그룹 이름 (예: 2학년 3반)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={actionLoading}
              className="btn-primary w-full"
            >
              {actionLoading ? "만드는 중..." : "🎉 그룹 만들기"}
            </button>
          </CuteCard>

          <CuteCard emoji="🔗" title="초대 코드로 참여">
            <input
              type="text"
              className="input-cute mb-3 text-center uppercase tracking-widest"
              placeholder="ABC123"
              maxLength={6}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
            <button
              type="button"
              onClick={handleJoinGroup}
              disabled={actionLoading}
              className="btn-secondary w-full"
            >
              {actionLoading ? "참여 중..." : "👋 참여하기"}
            </button>
          </CuteCard>
        </>
      ) : (
        <>
          <CuteCard emoji="💌" title="받은 응원" compact className="!p-3">
            <ReceivedCheers cheers={receivedCheers} />
          </CuteCard>

          <CuteCard emoji="🏠" title={group.name} compact className="!p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-soft-muted">초대 코드</p>
                <p className="text-2xl font-bold tracking-widest text-soft-text">
                  {group.invite_code}
                </p>
              </div>
              <button type="button" onClick={copyInviteCode} className="btn-secondary !py-2 !px-4 text-sm">
                📋 복사
              </button>
            </div>
            <p className="mt-2 text-xs text-soft-muted">
              멤버 {members.length} / {group.max_members}명
            </p>
          </CuteCard>

          <CuteCard emoji="🐰" title="멤버" compact className="!p-3">
            <div className="space-y-1.5">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`rounded-xl p-2 ${
                    member.id === profile?.id ? "bg-pink/15 ring-1 ring-pink/30" : "bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{member.emoji}</span>
                    <span className="text-sm font-bold">
                      {member.nickname}
                      {member.id === profile?.id && (
                        <span className="ml-1 text-xs text-pink">(나)</span>
                      )}
                    </span>
                  </div>
                  {member.id !== profile?.id && (
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {CHEER_MESSAGES.map((cheer) => (
                        <button
                          key={cheer.id}
                          type="button"
                          onClick={() =>
                            handleSendCheer(member.id, `${cheer.emoji} ${cheer.text}`)
                          }
                          className="rounded-full bg-white px-1.5 py-0.5 text-[10px] transition-all hover:bg-pink/20 active:scale-95"
                        >
                          {cheer.emoji} {cheer.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CuteCard>
        </>
      )}

      {message && (
        <div className="rounded-2xl bg-lavender/30 px-4 py-3 text-center text-sm font-bold text-soft-text">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-3 text-sm text-soft-muted underline"
      >
        로그아웃
      </button>
    </div>
  );
}
