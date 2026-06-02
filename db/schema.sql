-- Study Race App - Neon PostgreSQL Schema
-- Neon SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  max_members INT DEFAULT 25,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🐰' CHECK (emoji IN ('🐰', '🐢')),
  group_id UUID REFERENCES study_groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE study_groups
  DROP CONSTRAINT IF EXISTS study_groups_created_by_fkey;
ALTER TABLE study_groups
  ADD CONSTRAINT study_groups_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  minutes INT NOT NULL CHECK (minutes > 0),
  studied_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cheers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, studied_at);
CREATE INDEX IF NOT EXISTS idx_users_group ON users(group_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_invite ON study_groups(invite_code);
