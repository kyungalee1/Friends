import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { createSession } from "@/lib/auth-session";
import { hashPin } from "@/lib/auth-credentials";
import { isValidPin, normalizePhone } from "@/lib/utils";
import type { EmojiChar } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone || "");
    const pin = body.pin || "";
    const nickname = (body.nickname || "").trim();
    const emoji = (body.emoji || "🐰") as EmojiChar;

    if (phone.length < 10 || phone.length > 11) {
      return NextResponse.json({ error: "올바른 휴대폰 번호를 입력해주세요" }, { status: 400 });
    }
    if (!isValidPin(pin)) {
      return NextResponse.json({ error: "PIN은 4자리 숫자여야 해요" }, { status: 400 });
    }
    if (!nickname || nickname.length > 12) {
      return NextResponse.json({ error: "닉네임을 입력해주세요 (12자 이내)" }, { status: 400 });
    }
    if (emoji !== "🐰" && emoji !== "🐢") {
      return NextResponse.json({ error: "캐릭터를 선택해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const existing = await sql`SELECT id FROM users WHERE phone = ${phone}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "이미 가입된 번호예요. 로그인해주세요!" }, { status: 409 });
    }

    const pinHash = await hashPin(pin);
    const rows = await sql`
      INSERT INTO users (phone, pin_hash, nickname, emoji)
      VALUES (${phone}, ${pinHash}, ${nickname}, ${emoji})
      RETURNING id, phone, nickname, emoji, group_id, created_at
    `;

    const user = rows[0];
    await createSession(user.id as string);

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        emoji: user.emoji,
        group_id: user.group_id,
        created_at: user.created_at,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "회원가입에 실패했어요" }, { status: 500 });
  }
}
