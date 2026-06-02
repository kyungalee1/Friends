import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";
import { getTodayDateKey, toDateKey } from "@/lib/utils";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const sql = getSql();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStart = toDateKey(weekAgo);

    const rows = await sql`
      SELECT id, user_id, subject, minutes, studied_at, created_at
      FROM study_sessions
      WHERE user_id = ${userId} AND studied_at >= ${weekStart}
      ORDER BY studied_at DESC, created_at DESC
    `;

    const sessions = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      minutes: row.minutes,
      studied_at: toDateKey(String(row.studied_at)),
      created_at: row.created_at,
    }));

    const today = getTodayDateKey();
    const todayTotal = sessions
      .filter((s) => s.studied_at === today)
      .reduce((sum, s) => sum + s.minutes, 0);
    const weekTotal = sessions.reduce((sum, s) => sum + s.minutes, 0);

    return NextResponse.json({ sessions, todayTotal, weekTotal, today });
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
    const studiedAt = body.studied_at || getTodayDateKey();

    if (!subject || !minutes || minutes <= 0) {
      return NextResponse.json({ error: "과목과 시간을 확인해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const rows = await sql`
      INSERT INTO study_sessions (user_id, subject, minutes, studied_at)
      VALUES (${userId}, ${subject}, ${minutes}, ${studiedAt})
      RETURNING id, user_id, subject, minutes, studied_at, created_at
    `;

    const row = rows[0];
    return NextResponse.json({
      session: {
        ...row,
        studied_at: toDateKey(String(row.studied_at)),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "저장에 실패했어요" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "삭제할 기록을 지정해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const result = await sql`
      DELETE FROM study_sessions WHERE id = ${id} AND user_id = ${userId} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "삭제할 수 없어요" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "삭제에 실패했어요" }, { status: 500 });
  }
}
