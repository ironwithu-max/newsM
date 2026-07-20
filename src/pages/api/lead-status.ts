import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, isValidSession } from '../../platform/adminAuth';
import { getSupabaseAdmin } from '../../platform/supabaseServer';

export const prerender = false;

const VALID = ['new', 'contacted', 'done', 'canceled'];

export const POST: APIRoute = async ({ request, cookies }) => {
  // 관리자 세션 확인
  if (!isValidSession(cookies.get(ADMIN_COOKIE)?.value)) {
    return new Response(JSON.stringify({ ok: false, error: '인증 필요' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let id = '';
  let status = '';
  try {
    const data = await request.json();
    id = String(data.id ?? '');
    status = String(data.status ?? '');
  } catch {
    return new Response(JSON.stringify({ ok: false, error: '잘못된 요청' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id || !VALID.includes(status)) {
    return new Response(JSON.stringify({ ok: false, error: '잘못된 값' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return new Response(
      JSON.stringify({ ok: false, error: 'DB가 연결되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
