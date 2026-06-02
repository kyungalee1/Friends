import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL 환경 변수를 설정해주세요.");
  }
  return neon(url);
}
