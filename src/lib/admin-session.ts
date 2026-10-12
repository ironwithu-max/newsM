// ─────────────────────────────────────────────────────────────
//  관리자 표시용 쿠키 — /admin 에 Basic 인증으로 로그인하면 발급.
//  공개 페이지에서 "새 상담문의 말풍선"을 관리자에게만 보여주는 데 사용.
//  (관리자 화면 접근 자체는 여전히 Basic 인증으로만 허용)
// ─────────────────────────────────────────────────────────────
import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'minam_admin';
/** JS가 읽는 표시용 쿠키 (값에 비밀 없음) — 있을 때만 말풍선 개수를 조회 */
export const ADMIN_UI_COOKIE = 'minam_admin_ui';
export const ADMIN_COOKIE_DAYS = 30;

const secret = () =>
  'minam-admin:' + (process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '');

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

/** `아이디.만료시각.서명` */
export function makeAdminToken(user: string): string {
  const exp = Date.now() + ADMIN_COOKIE_DAYS * 86400_000;
  const payload = `${encodeURIComponent(user)}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token || secret() === 'minam-admin:') return false;
  const i = token.lastIndexOf('.');
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const exp = Number(payload.split('.')[1]);
  if (!exp || exp < Date.now()) return false;
  const a = Buffer.from(token.slice(i + 1));
  const b = Buffer.from(sign(payload));
  return a.length === b.length && timingSafeEqual(a, b);
}
