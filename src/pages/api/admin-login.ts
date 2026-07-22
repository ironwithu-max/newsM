import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, verifyCredentials, isAdminConfigured } from '../../platform/adminAuth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminConfigured()) {
    return new Response(
      JSON.stringify({ ok: false, error: '관리자 계정(ADMIN_USERS/ADMIN_PASSWORD)이 설정되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let username = '';
  let password = '';
  try {
    const data = await request.json();
    username = String(data.username ?? '').trim();
    password = String(data.password ?? '');
  } catch {
    return new Response(JSON.stringify({ ok: false, error: '잘못된 요청' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = verifyCredentials(username, password);
  if (!token) {
    return new Response(
      JSON.stringify({ ok: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }),
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
