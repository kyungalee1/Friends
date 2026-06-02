import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";
import { generateInviteCode } from "@/lib/utils";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const sql = getSql();
    const userRows = await sql`
      SELECT id, phone, nickname, emoji, group_id, created_at
      FROM users WHERE id = ${userId}
    `;
    const profile = userRows[0];
    if (!profile?.group_id) {
      return NextResponse.json({ profile, group: null, members: [] });
    }

    const groupRows = await sql`
      SELECT id, name, invite_code, max_members, created_by, created_at
      FROM study_groups WHERE id = ${profile.group_id}
    `;
    const memberRows = await sql`
      SELECT id, phone, nickname, emoji, group_id, created_at
      FROM users WHERE group_id = ${profile.group_id}
      ORDER BY created_at
    `;

    return NextResponse.json({
      profile: {
        id: profile.id,
        phone: profile.phone,
        nickname: profile.nickname,
        emoji: profile.emoji,
        group_id: profile.group_id,
        created_at: profile.created_at,
      },
      group: groupRows[0] || null,
      members: memberRows.map((m) => ({
        id: m.id,
        phone: m.phone,
        nickname: m.nickname,
        emoji: m.emoji,
        group_id: m.group_id,
        created_at: m.created_at,
      })),
    });
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
    const name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "그룹 이름을 입력해주세요" }, { status: 400 });
    }

    const sql = getSql();
    const existing = await sql`SELECT group_id FROM users WHERE id = ${userId}`;
    if (existing[0]?.group_id) {
      return NextResponse.json({ error: "이미 그룹에 속해 있어요" }, { status: 400 });
    }

    const inviteCode = generateInviteCode();
    const groupRows = await sql`
      INSERT INTO study_groups (name, invite_code, created_by)
      VALUES (${name}, ${inviteCode}, ${userId})
      RETURNING id, name, invite_code, max_members, created_by, created_at
    `;
    const group = groupRows[0];

    await sql`UPDATE users SET group_id = ${group.id} WHERE id = ${userId}`;

    return NextResponse.json({ group });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "그룹 생성에 실패했어요" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const sql = getSql();
    const userRows = await sql`SELECT group_id FROM users WHERE id = ${userId}`;
    const groupId = userRows[0]?.group_id;
    if (!groupId) {
      return NextResponse.json({ error: "속한 그룹이 없어요" }, { status: 400 });
    }

    const groupRows = await sql`
      SELECT id, created_by FROM study_groups WHERE id = ${groupId}
    `;
    const group = groupRows[0];
    if (!group) {
      return NextResponse.json({ error: "그룹을 찾을 수 없어요" }, { status: 404 });
    }

    if (group.created_by !== userId) {
      return NextResponse.json(
        { error: "그룹을 만든 사람만 삭제할 수 있어요" },
        { status: 403 }
      );
    }

    await sql`DELETE FROM study_groups WHERE id = ${groupId}`;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "그룹 삭제에 실패했어요" }, { status: 500 });
  }
}
