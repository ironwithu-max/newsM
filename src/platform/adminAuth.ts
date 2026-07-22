import crypto from 'node:crypto';

/** 관리자 세션 쿠키 이름 */
export const ADMIN_COOKIE = 'admin_session';

function getAdminPassword(): string {
  return import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? '';
}

/** 허용 관리자 아이디 목록 (env ADMIN_USERS="newsm1,newsm2,newsm3") */
function getAdminUsers(): string[] {
  const raw = import.meta.env.ADMIN_USERS ?? process.env.ADMIN_USERS ?? '';
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** (아이디, 비밀번호)로부터 세션 토큰(해시) 생성. 쿠키에는 이 값을 저장. */
function tokenFor(username: string, password: string): string {
  return crypto
    .createHash('sha256')
    .update(`insurance-admin::${username}::${password}`)
    .digest('hex');
}

/** 관리자 기능 사용 가능 여부(아이디·비밀번호가 설정돼 있는지) */
export function isAdminConfigured(): boolean {
  return getAdminPassword().length > 0 && getAdminUsers().length > 0;
}

/** 아이디·비밀번호가 맞으면 세션 토큰을 반환, 아니면 null */
export function verifyCredentials(username: string, password: string): string | null {
  const real = getAdminPassword();
  const users = getAdminUsers();
  if (!real || !users.includes(username) || password !== real) return null;
  return tokenFor(username, real);
}

/** 쿠키의 세션 토큰이 유효한 관리자 계정의 것인지 검사 */
export function isValidSession(cookieToken: string | undefined): boolean {
  const real = getAdminPassword();
  if (!real || !cookieToken) return false;
  const a = Buffer.from(cookieToken);
  // 허용된 아이디들 중 하나의 토큰과 일치하면 유효
  return getAdminUsers().some((u) => {
    const b = Buffer.from(tokenFor(u, real));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}
