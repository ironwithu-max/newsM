-- ─────────────────────────────────────────────────────────────
--  보험 상담 리드 테이블
--  상담 신청 폼(/consult) → /api/consult 엔드포인트가 서비스롤 키로 insert.
--  RLS 활성화 + 공개 정책 없음 → anon/공개 키로는 접근 불가(서버 서비스롤만 접근).
-- ─────────────────────────────────────────────────────────────

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  category_slug text not null,
  product_id    text,
  birth_year    integer,
  gender        text check (gender in ('male', 'female')),
  message       text,
  agreed_privacy boolean not null default false,
  -- 상담 처리 상태: new(접수) → contacted(연락함) → done(완료) / canceled(취소)
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'done', 'canceled')),
  created_at    timestamptz not null default now()
);

-- 관리자 조회용 인덱스 (최신순, 상태별)
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- RLS 활성화. 정책을 추가하지 않으면 anon/authenticated 는 전부 차단되고,
-- 서버의 service_role 키만 접근 가능(리드는 민감정보이므로 공개 접근 금지).
alter table public.leads enable row level security;
