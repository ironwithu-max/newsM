// ─────────────────────────────────────────────────────────────
//  관리자 인증 미들웨어 — /admin/*, /api/admin/* 를 HTTP Basic 인증으로 보호
//  ADMIN_USERS(쉼표 구분 아이디) + ADMIN_PASSWORD(공통 비밀번호) 사용
// ─────────────────────────────────────────────────────────────
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const isProtected =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isProtected) return next();

  const users = (process.env.ADMIN_USERS || import.meta.env.ADMIN_USERS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const password =
    process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '';

  const auth = context.request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ') && password) {
    try {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
      const i = decoded.indexOf(':');
      const u = decoded.slice(0, i);
      const p = decoded.slice(i + 1);
      if (users.includes(u) && p === password) return next();
    } catch {
      /* fallthrough → 401 */
    }
  }

  return new Response('관리자 인증이 필요합니다.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MINAM Admin", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8',
    },
  });
});
