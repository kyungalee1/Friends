import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";

import { getTodayDateKey } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || getTodayDateKey();

    const sql = getSql();
    const userRows = await sql`SELECT group_id FROM users WHERE id = ${userId}`;
    const groupId = userRows[0]?.group_id;

    if (!groupId) {
      return NextResponse.json({ totals: [] });
    }

    const totals = await sql`
      SELECT
        u.id AS user_id,
        u.nickname,
        u.emoji,
        COALESCE(SUM(s.minutes), 0)::int AS total_minutes
      FROM users u
      LEFT JOIN study_sessions s ON s.user_id = u.id AND s.studied_at = ${date}
      WHERE u.group_id = ${groupId}
      GROUP BY u.id, u.nickname, u.emoji
      ORDER BY total_minutes DESC
    `;

    return NextResponse.json({ totals });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "조회에 실패했어요" }, { status: 500 });
  }
}
