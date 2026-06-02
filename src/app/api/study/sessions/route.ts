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
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStart = weekAgo.toISOString().split("T")[0];

    const sessions = await sql`
      SELECT id, user_id, subject, minutes, studied_at, created_at
      FROM study_sessions
      WHERE user_id = ${userId} AND studied_at >= ${weekStart}
      ORDER BY studied_at DESC, created_at DESC
    `;

    return NextResponse.json({ sessions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "조회에 실패했어요" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const body = await request.json();
    const subject = (body.subject || "").trim();
    const minutes = parseInt(body.minutes, 10);
    const studiedAt = body.studied_at || new Date().toISOString().split("T")[0];

    if (!subject || !minutes || minutes <= 0) {
      return NextResponse.json({ error: "과목과 시간을 확인해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const rows = await sql`
      INSERT INTO study_sessions (user_id, subject, minutes, studied_at)
      VALUES (${userId}, ${subject}, ${minutes}, ${studiedAt})
      RETURNING id, user_id, subject, minutes, studied_at, created_at
    `;

    return NextResponse.json({ session: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "저장에 실패했어요" }, { status: 500 });
  }
}
