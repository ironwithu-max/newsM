import crypto from 'node:crypto';

/** 관리자 세션 쿠키 이름 */
export const ADMIN_COOKIE = 'admin_session';

function getAdminPassword(): string {
  return (
    import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? ''
  );
}

/** 비밀번호로부터 세션 토큰(해시) 생성. 쿠키에는 원문 대신 이 값을 저장. */
function tokenFor(password: string): string {
  return crypto
    .createHash('sha256')
    .update(`insurance-admin::${password}`)
    .digest('hex');
}

/** 관리자 기능 사용 가능 여부(비밀번호가 설정돼 있는지) */
export function isAdminConfigured(): boolean {
  return getAdminPassword().length > 0;
}

/** 입력 비밀번호가 맞으면 세션 토큰을 반환, 아니면 null */
export function verifyPassword(password: string): string | null {
  const real = getAdminPassword();
  if (!real || password !== real) return null;
  return tokenFor(real);
}

/** 쿠키의 세션 토큰이 유효한지 검사 */
export function isValidSession(cookieToken: string | undefined): boolean {
  const real = getAdminPassword();
  if (!real || !cookieToken) return false;
  const expected = tokenFor(real);
  // 타이밍 공격 방지용 상수시간 비교
  const a = Buffer.from(cookieToken);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
