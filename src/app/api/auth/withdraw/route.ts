import { NextResponse } from "next/server";
import { destroySession, getSessionUserId } from "@/lib/auth-session";
import { getSql } from "@/lib/db";

export async function DELETE() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요해요" }, { status: 401 });
    }

    const sql = getSql();

    await sql`DELETE FROM study_groups WHERE created_by = ${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;

    await destroySession();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "탈퇴 처리에 실패했어요" }, { status: 500 });
  }
}
