-- 영업자(설계사) 표기 컬럼 추가
--  customers.agent  : 고객 유입 담당 영업자
--  policies.agent   : 보험 계약 체결 영업자
alter table public.customers add column if not exists agent text;
alter table public.policies  add column if not exists agent text;
