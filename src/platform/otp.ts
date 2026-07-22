import crypto from 'node:crypto';

// ─────────────────────────────────────────────────────────────
//  전화 개인인증(SMS OTP) — 구조만 구축. 발송사 연동 전엔 비활성.
//  활성 조건: env OTP_ENABLED=true  AND  발송사 키(SMS_API_KEY) 존재.
//  비활성이면 /my 는 기존처럼 전화번호만으로 조회(무료).
// ─────────────────────────────────────────────────────────────

function env(k: string): string {
  return (import.meta.env as any)[k] ?? (process.env as any)[k] ?? '';
}
function secret(): string {
  return env('ADMIN_PASSWORD') || 'life-news-otp-secret';
}

export function normPhone(p: string): string {
  return String(p).replace(/\D/g, '');
}
export function isValidPhone(p: string): boolean {
  return /^01[016789]\d{7,8}$/.test(normPhone(p));
}

/** 솔라피(Solapi) 발송 키·발신번호가 모두 설정돼 있는지 */
export function isSmsConfigured(): boolean {
  return (
    env('SOLAPI_API_KEY').length > 0 &&
    env('SOLAPI_API_SECRET').length > 0 &&
    normPhone(env('SOLAPI_SENDER')).length > 0
  );
}
/** OTP 인증 요구 여부. 솔라피 준비되면 자동 ON (OTP_ENABLED=false 로 강제 끌 수 있음) */
export function isOtpEnabled(): boolean {
  return isSmsConfigured() && env('OTP_ENABLED') !== 'false';
}

export function genCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}
export function hashCode(phone: string, code: string): string {
  return crypto.createHash('sha256').update(`otp::${normPhone(phone)}::${code}`).digest('hex');
}

/** 인증 완료 쿠키 토큰(전화번호 귀속). 발급 후 짧게 유효. */
export function verifyToken(phone: string): string {
  return crypto.createHash('sha256').update(`verified::${normPhone(phone)}::${secret()}`).digest('hex');
}
export function isPhoneVerified(phone: string, cookie: string | undefined): boolean {
  if (!cookie) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(verifyToken(phone));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export const VERIFY_COOKIE = 'my_verified';

/**
 * 솔라피(Solapi) 문자 발송. v4 HMAC-SHA256 인증.
 *  필요 env: SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER(등록된 발신번호)
 */
export async function sendSms(phone: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = env('SOLAPI_API_KEY');
  const apiSecret = env('SOLAPI_API_SECRET');
  const from = normPhone(env('SOLAPI_SENDER'));
  if (!apiKey || !apiSecret || !from) return { ok: false, error: 'solapi env 미설정' };

  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', apiSecret).update(date + salt).digest('hex');
  const authorization = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;

  try {
    const res = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: { Authorization: authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { to: normPhone(phone), from, text } }),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error('[solapi] 발송 실패', res.status, body);
      return { ok: false, error: `HTTP ${res.status} ${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[solapi] 오류', msg);
    return { ok: false, error: msg };
  }
}
