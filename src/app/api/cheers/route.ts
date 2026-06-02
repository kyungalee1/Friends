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
    const cheers = await sql`
      SELECT
        c.id,
        c.message,
        c.created_at,
        u.nickname AS from_nickname,
        u.emoji AS from_emoji
      FROM cheers c
      JOIN users u ON u.id = c.from_user
      WHERE c.to_user = ${userId}
      ORDER BY c.created_at DESC
      LIMIT 30
    `;

    return NextResponse.json({ cheers });
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
    const toUser = body.to_user;
    const message = (body.message || "").trim();

    if (!toUser || !message) {
      return NextResponse.json({ error: "응원 메시지를 확인해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const myGroup = await sql`SELECT group_id FROM users WHERE id = ${userId}`;
    const theirGroup = await sql`SELECT group_id FROM users WHERE id = ${toUser}`;

    if (
      !myGroup[0]?.group_id ||
      myGroup[0].group_id !== theirGroup[0]?.group_id
    ) {
      return NextResponse.json({ error: "같은 그룹 친구에게만 응원할 수 있어요" }, { status: 403 });
    }

    await sql`
      INSERT INTO cheers (from_user, to_user, message)
      VALUES (${userId}, ${toUser}, ${message})
    `;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "응원 전송에 실패했어요" }, { status: 500 });
  }
}
