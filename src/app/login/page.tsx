"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { normalizePhone } from "@/lib/utils";
import type { EmojiChar } from "@/types";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [emoji, setEmoji] = useState<EmojiChar>("🐰");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone: normalizePhone(phone), pin }),
      });
      window.location.href = "/";
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요");
      return;
    }
    if (pin !== pinConfirm) {
      setError("PIN이 일치하지 않아요");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          phone: normalizePhone(phone),
          pin,
          nickname: nickname.trim(),
          emoji,
        }),
      });
      window.location.href = "/group";
    } catch (e) {
      setError(e instanceof Error ? e.message : "회원가입에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center gap-4 text-6xl">
          <span className="animate-race-run">🐰</span>
          <span className="text-4xl self-center">🏁</span>
          <span className="animate-race-run" style={{ animationDelay: "0.3s" }}>🐢</span>
        </div>
        <h1 className="text-3xl font-bold text-soft-text">공부 레이스</h1>
        <p className="mt-2 text-soft-muted">친구들과 함께 달려봐요!</p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => { setMode("login"); setError(""); }}
          className={`rounded-2xl px-5 py-2 text-sm font-bold transition-all ${
            mode === "login" ? "bg-pink text-white shadow-cute" : "bg-white/60 text-soft-muted"
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setError(""); }}
          className={`rounded-2xl px-5 py-2 text-sm font-bold transition-all ${
            mode === "register" ? "bg-pink text-white shadow-cute" : "bg-white/60 text-soft-muted"
          }`}
        >
          회원가입
        </button>
      </div>

      <div className="card-cute w-full max-w-sm space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold text-soft-muted">휴대폰 번호</label>
          <input
            type="tel"
            className="input-cute"
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-soft-muted">PIN (4자리)</label>
          <input
            type="password"
            className="input-cute text-center text-2xl tracking-[0.5em]"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {mode === "register" && (
          <>
            <div>
              <label className="mb-1 block text-sm font-bold text-soft-muted">PIN 확인</label>
              <input
                type="password"
                className="input-cute text-center text-2xl tracking-[0.5em]"
                placeholder="••••"
                maxLength={4}
                inputMode="numeric"
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-soft-muted">닉네임</label>
              <input
                type="text"
                className="input-cute"
                placeholder="예: 공부왕"
                maxLength={12}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div>
              <p className="mb-2 text-center text-sm text-soft-muted">캐릭터 선택</p>
              <div className="flex justify-center gap-4">
                {(["🐰", "🐢"] as EmojiChar[]).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`rounded-2xl p-4 text-4xl transition-all ${
                      emoji === e ? "bg-pink/30 ring-2 ring-pink scale-110" : "bg-white/60"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-soft-muted">
                {emoji === "🐰" ? "토끼 — 빠르게 달려요!" : "거북이 — 꾸준히 달려요!"}
              </p>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading || phone.length < 10 || pin.length < 4}
          className="btn-primary w-full"
        >
          {loading
            ? "처리 중..."
            : mode === "login"
              ? "🔑 로그인"
              : "🎉 시작하기"}
        </button>

        {error && (
          <p className="rounded-xl bg-coral/20 px-3 py-2 text-center text-sm text-coral">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
