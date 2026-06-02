import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const body = await request.json();
    const targetUserId = (body.user_id || "").trim();
    if (!targetUserId) {
      return NextResponse.json({ error: "멤버를 지정해주세요" }, { status: 400 });
    }

    if (targetUserId === userId) {
      return NextResponse.json({ error: "자기 자신은 제외할 수 없어요" }, { status: 400 });
    }

    const sql = getSql();
    const userRows = await sql`SELECT group_id FROM users WHERE id = ${userId}`;
    const groupId = userRows[0]?.group_id;
    if (!groupId) {
      return NextResponse.json({ error: "속한 그룹이 없어요" }, { status: 400 });
    }

    const groupRows = await sql`
      SELECT created_by FROM study_groups WHERE id = ${groupId}
    `;
    const group = groupRows[0];
    if (!group) {
      return NextResponse.json({ error: "그룹을 찾을 수 없어요" }, { status: 404 });
    }

    if (group.created_by !== userId) {
      return NextResponse.json(
        { error: "그룹장만 멤버를 제외할 수 있어요" },
        { status: 403 }
      );
    }

    const targetRows = await sql`
      SELECT id, group_id FROM users WHERE id = ${targetUserId}
    `;
    const target = targetRows[0];
    if (!target || target.group_id !== groupId) {
      return NextResponse.json({ error: "같은 그룹 멤버가 아니에요" }, { status: 404 });
    }

    await sql`UPDATE users SET group_id = NULL WHERE id = ${targetUserId}`;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "멤버 제거에 실패했어요" }, { status: 500 });
  }
}
