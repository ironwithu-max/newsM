import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, verifyAdminToken } from '../../lib/admin-session';
import { countNewConsults } from '../../lib/consults';

export const prerender = false;

// 새 상담문의 개수 — 관리자 쿠키가 있는 브라우저에만 알려줌 (메뉴 말풍선용)
export const GET: APIRoute = async ({ cookies }) => {
  const admin = verifyAdminToken(cookies.get(ADMIN_COOKIE)?.value);
  const count = admin ? await countNewConsults() : 0;
  return new Response(JSON.stringify({ admin, count }), {
    status: admin ? 200 : 401,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' },
  });
};
