import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, isValidSession, canDelete } from '../../../platform/adminAuth';
import { getSupabaseAdmin } from '../../../platform/supabaseServer';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(token)) return json({ ok: false, error: '인증 필요' }, 401);
  if (!canDelete(token)) return json({ ok: false, error: '삭제 권한이 없습니다.' }, 403);

  let id = '';
  try {
    id = String((await request.json()).id ?? '').trim();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }
  if (!id) return json({ ok: false, error: '대상이 없습니다.' }, 422);

  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: 'DB 미연결' }, 500);

  // 고객 삭제 시 보유 보험(policies)은 FK on delete cascade로 함께 삭제됨
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};
