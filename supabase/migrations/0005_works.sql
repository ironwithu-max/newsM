-- ─────────────────────────────────────────────────────────────
--  시공사례 게시판 (관리자가 사진+글 등록 → /works 게시판·메인페이지에 표시)
--  Supabase 대시보드 → SQL Editor 에 붙여넣고 한 번 실행하세요.
-- ─────────────────────────────────────────────────────────────

-- 1) 게시글 테이블
--    images: [{"url": "...", "path": "works/xxx.webp" | null}, ...]  (첫 번째 = 대표사진)
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default '',
  location text not null default '',
  work_date date,
  content text not null default '',
  images jsonb not null default '[]'::jsonb,
  sort int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists works_list_idx
  on public.works (published, sort, created_at desc);

-- 서버(API)는 service_role 키로 RLS를 우회합니다.
-- RLS를 켜고 정책을 만들지 않아 anon 키로는 읽기·쓰기 모두 불가하게 막아 둡니다.
alter table public.works enable row level security;

-- 2) 사진 저장용 공개 Storage 버킷 (파일 URL로 누구나 볼 수 있음, 업로드는 서버만)
insert into storage.buckets (id, name, public)
values ('works', 'works', true)
on conflict (id) do nothing;

-- 3) 현재 메인 5장을 초기 게시글로 등록 (테이블이 비어 있을 때만 1회)
insert into public.works (title, tag, images, sort)
select v.title, v.tag, jsonb_build_array(jsonb_build_object('url', v.url, 'path', null)), v.sort
from (values
  ('/images/works/open-kitchen.webp',     '오픈키친 다이닝 레스토랑', '상업공간', 1),
  ('/images/works/lounge-pub.webp',       '다크그린 라운지 펍',       '상업공간', 2),
  ('/images/works/cafe-biyul.webp',       '비율_02 카페',             '상업공간', 3),
  ('/images/works/hair-salon.webp',       '헤어살롱 인테리어',        '상업공간', 4),
  ('/images/works/chicken-pub-hall.webp', '청춘튀겨 치킨펍',          '상업공간', 5)
) as v(url, title, tag, sort)
where not exists (select 1 from public.works);
