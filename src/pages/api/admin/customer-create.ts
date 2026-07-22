import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, isValidSession } from '../../../platform/adminAuth';
import { getSupabaseAdmin } from '../../../platform/supabaseServer';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidPhone(phone: string): boolean {
  return /^01[016789]\d{7,8}$/.test(phone.replace(/\D/g, ''));
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isValidSession(cookies.get(ADMIN_COOKIE)?.value)) {
    return json({ ok: false, error: '인증 필요' }, 401);
  }

  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }

  const name = String(d.name ?? '').trim();
  const phone = String(d.phone ?? '').trim();
  if (name.length < 2) return json({ ok: false, error: '이름을 입력하세요.' }, 422);
  if (!isValidPhone(phone)) return json({ ok: false, error: '휴대폰 번호를 확인하세요.' }, 422);

  const row = {
    name,
    phone,
    email: String(d.email ?? '').trim() || null,
    birthday: String(d.birthday ?? '').trim() || null,
    anniversary: String(d.anniversary ?? '').trim() || null,
    agent: String(d.agent ?? '').trim() || null,
    memo: String(d.memo ?? '').trim() || null,
    source: 'direct',
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: 'DB 미연결' }, 500);

  const { error } = await supabase.from('customers').insert(row);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};
