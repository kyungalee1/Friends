import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { createSession } from "@/lib/auth-session";
import { verifyPin } from "@/lib/auth-credentials";
import { isValidPin, normalizePhone } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone || "");
    const pin = body.pin || "";

    if (phone.length < 10) {
      return NextResponse.json({ error: "휴대폰 번호를 입력해주세요" }, { status: 400 });
    }
    if (!isValidPin(pin)) {
      return NextResponse.json({ error: "PIN 4자리를 입력해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const rows = await sql`
      SELECT id, phone, pin_hash, nickname, emoji, group_id, created_at
      FROM users WHERE phone = ${phone}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "가입되지 않은 번호예요. 회원가입해주세요!" }, { status: 404 });
    }

    const user = rows[0];
    const valid = await verifyPin(pin, user.pin_hash as string);
    if (!valid) {
      return NextResponse.json({ error: "PIN이 맞지 않아요" }, { status: 401 });
    }

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
    return NextResponse.json({ error: "로그인에 실패했어요" }, { status: 500 });
  }
}
