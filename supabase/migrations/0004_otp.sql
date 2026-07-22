-- 전화 개인인증(SMS OTP) 코드 임시 저장 — OTP 활성화 시에만 필요.
--  (지금은 OTP 비활성이라 실행 안 해도 무방. 문자 인증을 켤 때 실행하세요.)
create table if not exists public.otp_codes (
  phone       text primary key,           -- 숫자만(정규화된 번호)
  code_hash   text not null,
  expires_at  timestamptz not null,
  attempts    integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.otp_codes enable row level security;
