import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const body = await request.json();
    const inviteCode = (body.invite_code || "").trim().toUpperCase();
    if (!inviteCode) {
      return NextResponse.json({ error: "초대 코드를 입력해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const userRows = await sql`SELECT group_id FROM users WHERE id = ${userId}`;
    if (userRows[0]?.group_id) {
      return NextResponse.json({ error: "이미 그룹에 속해 있어요" }, { status: 400 });
    }

    const groupRows = await sql`
      SELECT id, max_members FROM study_groups WHERE invite_code = ${inviteCode}
    `;
    if (groupRows.length === 0) {
      return NextResponse.json({ error: "초대 코드를 찾을 수 없어요" }, { status: 404 });
    }

    const group = groupRows[0];
    const countRows = await sql`
      SELECT COUNT(*)::int AS count FROM users WHERE group_id = ${group.id}
    `;
    const memberCount = countRows[0].count as number;

    if (memberCount >= (group.max_members as number)) {
      return NextResponse.json({ error: "그룹이 가득 찼어요 (최대 25명)" }, { status: 400 });
    }

    await sql`UPDATE users SET group_id = ${group.id} WHERE id = ${userId}`;

    return NextResponse.json({ success: true, group_id: group.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "참여에 실패했어요" }, { status: 500 });
  }
}
