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

/** 발송사(문자) 키가 설정돼 있는지 */
export function isSmsConfigured(): boolean {
  return env('SMS_API_KEY').length > 0;
}
/** OTP 인증을 실제로 요구할지 (플래그 + 발송사 모두 준비돼야 true) */
export function isOtpEnabled(): boolean {
  return env('OTP_ENABLED') === 'true' && isSmsConfigured();
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
 * 실제 문자 발송. 구조만 — 발송사 연동 지점.
 * 연동 예시(알리고): POST https://apis.aligo.in/send/
 *   body: { key, user_id, sender, receiver, msg }
 * 다른 대행사(NHN Cloud / 네이버 SENS / 카카오 알림톡)도 이 함수만 교체하면 됨.
 */
export async function sendSms(phone: string, text: string): Promise<boolean> {
  if (!isSmsConfigured()) return false;
  // TODO: 아래에 발송사 API 호출 구현 후 true 반환
  //   const key = env('SMS_API_KEY');
  //   const res = await fetch('https://apis.aligo.in/send/', { method:'POST', body: new URLSearchParams({...}) });
  console.log(`[otp] (발송 미연동) ${phone} → ${text}`);
  return false;
}
