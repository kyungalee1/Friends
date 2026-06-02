"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CuteCard } from "@/components/CuteCard";
import { PageHeader } from "@/components/PageHeader";
import { CheerPicker } from "@/components/CheerPicker";
import type { Group, Profile } from "@/types";

export default function GroupPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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
  }, [loadData]);

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
      setMessage("그룹이 만들어졌어요!");
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
      setMessage("그룹에 참여했어요!");
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
      setMessage(`"${cheerText}" 응원을 보냈어요!`);
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
      setMessage("초대 코드가 복사됐어요!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-3xl animate-bounce">👥</span>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="그룹 👥"
        subtitle={profile ? `${profile.emoji} ${profile.nickname}` : undefined}
      />

      {!group ? (
        <>
          <CuteCard emoji="✨" title="새 그룹 만들기">
            <label className="text-label mb-1.5 block">그룹 이름</label>
            <input
              type="text"
              className="input-cute mb-4"
              placeholder="예: 2학년 3반"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={actionLoading}
              className="btn-primary"
            >
              {actionLoading ? "만드는 중..." : "그룹 만들기"}
            </button>
          </CuteCard>

          <CuteCard emoji="🔗" title="초대 코드로 참여">
            <label className="text-label mb-1.5 block">초대 코드</label>
            <input
              type="text"
              className="input-cute mb-4 text-center uppercase tracking-widest"
              placeholder="ABC123"
              maxLength={6}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
            <button
              type="button"
              onClick={handleJoinGroup}
              disabled={actionLoading}
              className="btn-primary"
            >
              {actionLoading ? "참여 중..." : "참여하기"}
            </button>
          </CuteCard>
        </>
      ) : (
        <>
          <CuteCard emoji="🏠" title={group.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-label">초대 코드</p>
                <p className="text-stat mt-1 tracking-widest">{group.invite_code}</p>
                <p className="text-caption mt-2">
                  멤버 {members.length} / {group.max_members}명
                </p>
              </div>
              <button
                type="button"
                onClick={copyInviteCode}
                className="btn-inline-secondary shrink-0"
              >
                복사
              </button>
            </div>
          </CuteCard>

          <CuteCard emoji="🐰" title="멤버">
            <div className="space-y-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`list-row ${member.id === profile?.id ? "!bg-pink/10 ring-1 ring-pink/25" : ""}`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-base leading-none">{member.emoji}</span>
                    <span className="text-body font-medium">
                      {member.nickname}
                      {member.id === profile?.id && (
                        <span className="text-caption ml-1 text-pink">(나)</span>
                      )}
                    </span>
                  </div>
                  {member.id !== profile?.id && (
                    <CheerPicker
                      memberName={member.nickname}
                      memberEmoji={member.emoji}
                      onSend={(msg) => handleSendCheer(member.id, msg)}
                    />
                  )}
                </div>
              ))}
            </div>
          </CuteCard>
        </>
      )}

      {message && <p className="toast-info">{message}</p>}

      <button type="button" onClick={handleLogout} className="btn-primary">
        로그아웃
      </button>
    </div>
  );
}
