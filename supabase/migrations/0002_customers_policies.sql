-- ─────────────────────────────────────────────────────────────
--  가입 고객 + 보험 계약 (관리자 CRM / 알림 대시보드용)
--  RLS 활성화 + 공개 정책 없음 → 서버 secret 키(관리자)만 접근.
-- ─────────────────────────────────────────────────────────────

-- 가입 고객
create table if not exists public.customers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  email        text,
  birthday     date,            -- 생일
  anniversary  date,            -- 기념일(결혼기념일 등)
  memo         text,
  source       text not null default 'direct',  -- 가입 경로: direct/consult 등
  created_at   timestamptz not null default now()
);

-- 보험 계약
create table if not exists public.policies (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.customers(id) on delete cascade,
  insurer         text not null,          -- 보험사
  product_name    text not null,          -- 상품명
  category_slug   text,                   -- 보험 종류(auto/medical/...)
  monthly_premium integer,                -- 월 보험료(원)
  start_date      date,                   -- 가입일
  expiry_date     date,                   -- 만기일(계약 만료)
  renewal_date    date,                   -- 갱신일(매년 갱신)
  status          text not null default 'active'
                    check (status in ('active', 'expired', 'canceled')),
  created_at      timestamptz not null default now()
);

create index if not exists policies_customer_idx on public.policies (customer_id);
create index if not exists policies_expiry_idx on public.policies (expiry_date);
create index if not exists policies_renewal_idx on public.policies (renewal_date);

alter table public.customers enable row level security;
alter table public.policies enable row level security;

-- ── 샘플 데이터 (데모용, 상대 날짜로 알림이 뜨도록 구성) ──
insert into public.customers (name, phone, email, birthday, anniversary, memo, source) values
  ('김민수', '010-1111-2001', 'minsu@example.com',
     make_date(1988, extract(month from current_date)::int, 12),  -- 이번 달 생일
     make_date(2016, extract(month from current_date)::int, 5),   -- 이번 달 기념일
     '자동차+실손 보유', 'consult'),
  ('이서연', '010-2222-2002', 'seoyeon@example.com',
     make_date(1992, extract(month from current_date)::int, 24),  -- 이번 달 생일
     null,
     '암보험 관심', 'direct'),
  ('박지훈', '010-3333-2003', 'jihoon@example.com',
     make_date(1980, ((extract(month from current_date)::int % 12) + 1), 3), -- 다음 달 생일
     make_date(2010, extract(month from current_date)::int, 18),  -- 이번 달 기념일
     '가족 종신 가입', 'consult'),
  ('최유진', '010-4444-2004', 'yujin@example.com',
     make_date(1975, ((extract(month from current_date)::int % 12) + 2), 9),
     null, '여행자보험 반복 가입', 'direct'),
  ('정하늘', '010-5555-2005', 'haneul@example.com',
     make_date(1995, extract(month from current_date)::int, 28),  -- 이번 달 생일
     null, '치아보험 문의', 'consult')
on conflict do nothing;

-- 보험 계약 (고객을 전화번호로 연결)
insert into public.policies (customer_id, insurer, product_name, category_slug, monthly_premium, start_date, expiry_date, renewal_date, status)
select id, '미래로화재', '미래로 프리미엄 안심', 'auto', 78000,
       current_date - interval '10 months', current_date + interval '2 months', current_date + interval '2 months', 'active'
from public.customers where phone = '010-1111-2001';

insert into public.policies (customer_id, insurer, product_name, category_slug, monthly_premium, start_date, expiry_date, renewal_date, status)
select id, '다온생명', '다온 4세대 실손의료비', 'medical', 13500,
       current_date - interval '3 years', current_date + interval '20 months', current_date + interval '18 days', 'active'
from public.customers where phone = '010-1111-2001';

insert into public.policies (customer_id, insurer, product_name, category_slug, monthly_premium, start_date, expiry_date, renewal_date, status)
select id, '미래로화재', '미래로 암보장 플러스', 'cancer', 28000,
       current_date - interval '1 year', current_date + interval '75 days', null, 'active'
from public.customers where phone = '010-2222-2002';

insert into public.policies (customer_id, insurer, product_name, category_slug, monthly_premium, start_date, expiry_date, renewal_date, status)
select id, '하나로생명', '하나로 평생지킴 종신', 'life', 92000,
       current_date - interval '2 years', current_date + interval '5 years', null, 'active'
from public.customers where phone = '010-3333-2003';

insert into public.policies (customer_id, insurer, product_name, category_slug, monthly_premium, start_date, expiry_date, renewal_date, status)
select id, '새롬손해보험', '새롬 글로벌 여행안심', 'travel', 12000,
       current_date - interval '11 months', current_date + interval '25 days', current_date + interval '25 days', 'active'
from public.customers where phone = '010-4444-2004';

insert into public.policies (customer_id, insurer, product_name, category_slug, monthly_premium, start_date, expiry_date, renewal_date, status)
select id, '하나로생명', '하나로 스마일 치아', 'dental', 19800,
       current_date - interval '8 months', current_date + interval '85 days', null, 'active'
from public.customers where phone = '010-5555-2005';
