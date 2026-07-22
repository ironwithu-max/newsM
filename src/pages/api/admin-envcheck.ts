import type { APIRoute } from 'astro';

export const prerender = false;

// 임시 진단용: 환경변수 "값"은 노출하지 않고 존재 여부/개수만 반환. (진단 후 삭제)
export const GET: APIRoute = async () => {
  const p = process.env as Record<string, string | undefined>;
  const im = import.meta.env as Record<string, string | undefined>;
  const val = (k: string) => im[k] ?? p[k] ?? '';
  const present = (k: string) => String(val(k)).trim().length > 0;

  return new Response(
    JSON.stringify({
      ADMIN_USERS: present('ADMIN_USERS'),
      ADMIN_USERS_count: String(val('ADMIN_USERS')).split(',').filter(Boolean).length,
      ADMIN_PASSWORD: present('ADMIN_PASSWORD'),
      SUPABASE_URL: present('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: present('SUPABASE_SERVICE_ROLE_KEY'),
      via_import_meta_ADMIN_USERS: String(im.ADMIN_USERS ?? '').length > 0,
      via_process_ADMIN_USERS: String(p.ADMIN_USERS ?? '').length > 0,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
