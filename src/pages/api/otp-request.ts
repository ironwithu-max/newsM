import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../platform/supabaseServer';
import { isOtpEnabled, isValidPhone, normPhone, genCode, hashCode, sendSms } from '../../platform/otp';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // OTP 미활성 시: 인증 단계 없이 바로 조회하도록 프론트에 알림
  if (!isOtpEnabled()) return json({ ok: false, enabled: false });

  let phone = '';
  try {
    phone = String((await request.json()).phone ?? '').trim();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }
  if (!isValidPhone(phone)) return json({ ok: false, error: '올바른 휴대폰 번호를 입력해 주세요.' }, 422);

  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: '인증 서비스가 준비되지 않았습니다.' }, 500);

  const digits = normPhone(phone);
  const code = genCode();
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5분

  const { error } = await supabase.from('otp_codes').upsert({
    phone: digits,
    code_hash: hashCode(digits, code),
    expires_at: expires,
    attempts: 0,
    created_at: new Date().toISOString(),
  });
  if (error) return json({ ok: false, error: '인증번호 발급 오류' }, 500);

  const sent = await sendSms(phone, `[Life news] 본인확인 인증번호 ${code} (5분 내 입력)`);
  if (!sent.ok) {
    // 진단용: 솔라피 원인 detail 임시 노출 (원인 확인 후 제거)
    return json({ ok: false, error: '인증번호 발송에 실패했습니다. 번호를 확인 후 다시 시도해 주세요.', detail: sent.error }, 502);
  }
  return json({ ok: true });
};
