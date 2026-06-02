# 공부 레이스 🐰🐢

중학생 친구들(최대 25명)이 함께 시험공부하는 **재미있는 공부 경쟁 앱**입니다.

- 휴대폰 번호 + 4자리 PIN 로그인
- 과목별 공부 타이머 & 시간 기록
- 거북이·토끼 이모지 레이스 보드
- 그룹 초대 코드로 참여 (최대 25명)
- 친구에게 응원 보내기

## 기술 스택

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Database**: [Neon](https://neon.tech) PostgreSQL (무료 티어)
- **Auth**: 휴대폰 번호 + PIN (JWT 세션)
- **배포**: Vercel

## 왜 Neon?

Supabase 무료 티어가 종료되거나 제한될 수 있어, **Neon PostgreSQL 무료 플랜**으로 전환했습니다.

- PostgreSQL 호환 (기존 SQL 그대로 사용)
- Vercel과 연동 쉬움
- 25명 규모 앱에 충분한 무료 용량 (0.5GB)

## 시작하기

### 1. Neon DB 설정

1. [neon.tech](https://neon.tech)에서 무료 계정 생성
2. 새 프로젝트 생성
3. **SQL Editor**에서 `db/schema.sql` 실행
4. **Connection string** 복사 (DATABASE_URL)

### 2. 환경 변수

`.env.local` 파일 생성:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=랜덤-문자열-32자-이상
```

> `JWT_SECRET`은 아무 긴 랜덤 문자열이면 됩니다.

### 3. 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

### 4. Vercel 배포

1. GitHub에 프로젝트 push
2. [Vercel](https://vercel.com)에서 Import
3. Environment Variables 추가:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy

## 로그인 방식

SMS OTP 대신 **휴대폰 번호 + 4자리 PIN**을 사용합니다.

- SMS 비용 없음
- 중학생 25명 소규모 그룹에 적합
- 회원가입 시 PIN 설정, 이후 PIN으로 로그인

## 화면 구성

| 화면 | 설명 |
|------|------|
| 로그인/회원가입 | 휴대폰 번호 + PIN, 닉네임·캐릭터 설정 |
| 레이스 (홈) | 오늘의 거북이·토끼 레이스 현황 |
| 공부 | 과목 선택 + 타이머 |
| 기록 | 오늘/이번 주 공부 시간, 과목별 통계 |
| 그룹 | 그룹 생성/참여, 멤버 목록, 응원 |

## 모바일 앱처럼 사용하기

Vercel에 배포 후 모바일 브라우저에서 접속 → **홈 화면에 추가**하면 PWA처럼 사용할 수 있습니다.
