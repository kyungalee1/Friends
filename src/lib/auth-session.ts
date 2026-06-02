import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET 환경 변수를 설정해주세요.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.userId as string;
  } catch {
    return null;
  }
}

export function verifySessionToken(token: string): Promise<string | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return Promise.resolve(null);
  return jwtVerify(token, new TextEncoder().encode(secret))
    .then(({ payload }) => payload.userId as string)
    .catch(() => null);
}
