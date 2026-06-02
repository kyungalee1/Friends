import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const sql = getSql();
    const rows = await sql`
      SELECT id, phone, nickname, emoji, group_id, created_at
      FROM users WHERE id = ${userId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "사용자를 찾을 수 없어요" }, { status: 404 });
    }

    const user = rows[0];
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
    return NextResponse.json({ error: "조회에 실패했어요" }, { status: 500 });
  }
}
