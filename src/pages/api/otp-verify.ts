import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../platform/supabaseServer';
import {
  isOtpEnabled, isValidPhone, normPhone, hashCode, verifyToken, VERIFY_COOKIE,
} from '../../platform/otp';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isOtpEnabled()) return json({ ok: false, enabled: false });

  let phone = '';
  let code = '';
  try {
    const d = await request.json();
    phone = String(d.phone ?? '').trim();
    code = String(d.code ?? '').trim();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }
  if (!isValidPhone(phone) || !/^\d{6}$/.test(code))
    return json({ ok: false, error: '번호와 6자리 인증번호를 확인해 주세요.' }, 422);

  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: '인증 서비스가 준비되지 않았습니다.' }, 500);

  const digits = normPhone(phone);
  const { data } = await supabase.from('otp_codes').select('*').eq('phone', digits).maybeSingle();
  if (!data) return json({ ok: false, error: '인증번호를 먼저 요청해 주세요.' }, 400);
  if (new Date(data.expires_at).getTime() < Date.now())
    return json({ ok: false, error: '인증번호가 만료되었습니다. 다시 요청해 주세요.' }, 400);
  if ((data.attempts ?? 0) >= 5)
    return json({ ok: false, error: '시도 횟수를 초과했습니다. 다시 요청해 주세요.' }, 429);

  if (hashCode(digits, code) !== data.code_hash) {
    await supabase.from('otp_codes').update({ attempts: (data.attempts ?? 0) + 1 }).eq('phone', digits);
    return json({ ok: false, error: '인증번호가 일치하지 않습니다.' }, 401);
  }

  // 성공 → 코드 삭제 + 인증 쿠키(10분)
  await supabase.from('otp_codes').delete().eq('phone', digits);
  cookies.set(VERIFY_COOKIE, verifyToken(digits), {
    httpOnly: true, sameSite: 'lax', secure: import.meta.env.PROD, path: '/', maxAge: 600,
  });
  return json({ ok: true });
};
