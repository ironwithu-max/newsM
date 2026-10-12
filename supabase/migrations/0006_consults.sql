-- ─────────────────────────────────────────────────────────────
--  상담게시판 (손님 상담요청 비밀글 → 관리자 답글)
--  Supabase 대시보드 → SQL Editor 에 붙여넣고 한 번 실행하세요.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.consults (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  space_type text not null default '',
  message text not null default '',
  -- 손님이 답글 확인용으로 정한 비밀번호 (scrypt 해시, 원문 저장 안 함)
  password_hash text not null,
  fail_count int not null default 0,
  status text not null default 'new' check (status in ('new', 'done')),
  reply text not null default '',
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists consults_list_idx on public.consults (created_at desc);
create index if not exists consults_status_idx on public.consults (status);

-- 서버(API)만 service_role 키로 접근. anon 키로는 읽기·쓰기 모두 불가.
alter table public.consults enable row level security;
