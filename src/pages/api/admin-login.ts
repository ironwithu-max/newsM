import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, verifyPassword, isAdminConfigured } from '../../platform/adminAuth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminConfigured()) {
    return new Response(
      JSON.stringify({ ok: false, error: 'ADMIN_PASSWORD가 설정되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let password = '';
  try {
    const data = await request.json();
    password = String(data.password ?? '');
  } catch {
    return new Response(JSON.stringify({ ok: false, error: '잘못된 요청' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = verifyPassword(password);
  if (!token) {
    return new Response(
      JSON.stringify({ ok: false, error: '비밀번호가 올바르지 않습니다.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: 60 * 60 * 8, // 8시간
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
