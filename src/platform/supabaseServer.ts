import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 서버 전용 Supabase 관리자 클라이언트.
 * 환경변수(SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)가 없으면 null 을 반환하여
 * DB 미연동 상태에서도 앱이 동작하도록 한다. (추후 .env 채우면 자동 활성화)
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url =
    import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const key =
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
