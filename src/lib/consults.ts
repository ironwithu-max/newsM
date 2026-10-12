// ─────────────────────────────────────────────────────────────
//  상담게시판 — 서버 전용 Supabase 접근 (service_role)
// ─────────────────────────────────────────────────────────────
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { getServiceClient, isUuid } from './works';

export interface Consult {
  id: string;
  name: string;
  phone: string;
  space_type: string;
  message: string;
  status: 'new' | 'done';
  reply: string;
  replied_at: string | null;
  fail_count: number;
  created_at: string;
}

/** 공개 목록에 보여줄 최소 정보 */
export interface ConsultListItem {
  id: string;
  name: string;
  space_type: string;
  status: 'new' | 'done';
  created_at: string;
}

/** 비밀번호를 이만큼 틀리면 해당 글 조회 잠금 (관리자 화면에 표시) */
export const MAX_FAILS = 10;

const COLS = 'id,name,phone,space_type,message,status,reply,replied_at,fail_count,created_at';

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(pw, salt, 32).toString('hex')}`;
}

export function checkPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const a = scryptSync(pw, salt, 32);
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** 홍길동 → 홍*동, 김철 → 김* */
export function maskName(name: string): string {
  const c = [...name.trim()];
  if (c.length <= 1) return c.join('') || '고객';
  if (c.length === 2) return c[0] + '*';
  return c[0] + '*'.repeat(c.length - 2) + c[c.length - 1];
}

/** 공개 목록 (마스킹은 화면에서) */
export async function listPublic(page = 1, perPage = 15): Promise<{ items: ConsultListItem[]; total: number }> {
  const sb = getServiceClient();
  if (!sb) return { items: [], total: 0 };
  const { data, count, error } = await sb
    .from('consults')
    .select('id,name,space_type,status,created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);
  if (error) return { items: [], total: 0 };
  return { items: (data as ConsultListItem[]) || [], total: count ?? 0 };
}

/** 관리자 목록 */
export async function listConsults(status?: 'new' | 'done'): Promise<Consult[]> {
  const sb = getServiceClient();
  if (!sb) return [];
  let q = sb.from('consults').select(COLS).order('created_at', { ascending: false }).limit(500);
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return [];
  return (data as Consult[]) || [];
}

export async function getConsult(id: string): Promise<(Consult & { password_hash: string }) | null> {
  const sb = getServiceClient();
  if (!sb || !isUuid(id)) return null;
  const { data, error } = await sb.from('consults').select(COLS + ',password_hash').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as unknown as Consult & { password_hash: string };
}

/** 새(답변 전) 상담 개수 */
export async function countNewConsults(): Promise<number> {
  const sb = getServiceClient();
  if (!sb) return 0;
  const { count, error } = await sb
    .from('consults')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');
  return error ? 0 : count ?? 0;
}

export const fmtDate = (s: string) => s.slice(0, 10).replace(/-/g, '.');
export const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'medium', timeStyle: 'short' });

export { isUuid };
