// ─────────────────────────────────────────────────────────────
//  시공사례 게시판 — 서버 전용 Supabase 접근 (service_role)
//  ⚠️ service_role 키는 서버(API/SSR 페이지)에서만 사용. 클라이언트 노출 금지.
// ─────────────────────────────────────────────────────────────
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

/** 사진 저장용 Storage 버킷 이름 */
export const WORKS_BUCKET = 'works';

/** 게시판 분류(태그) 기본 목록 — 관리자 입력 자동완성 + 게시판 필터에 사용 */
export const WORK_TAGS = [
  '주거공간',
  '상업공간',
  '전시·쇼룸',
  '욕실 리모델링',
  '오피스',
  '교육공간',
  '건축공사',
  '전기공사',
  '전기차 충전',
];

export interface WorkImage {
  url: string;
  /** Storage 내 경로 (기본 제공 이미지는 null) */
  path: string | null;
}

export interface Work {
  id: string;
  title: string;
  tag: string;
  location: string;
  work_date: string | null;
  content: string;
  images: WorkImage[];
  sort: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

let _client: SupabaseClient | null = null;

/** 설정이 있으면 service_role 클라이언트를, 없으면 null 을 반환 */
export function getServiceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!_client) {
    _client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

const COLS = 'id,title,tag,location,work_date,content,images,sort,published,created_at,updated_at';

/** 목록 조회 (정렬: sort 오름차순 → 최신순). 미설정/오류 시 빈 결과 */
export async function listWorks(opts: {
  tag?: string;
  page?: number;
  perPage?: number;
  includeHidden?: boolean;
} = {}): Promise<{ items: Work[]; total: number }> {
  const sb = getServiceClient();
  if (!sb) return { items: [], total: 0 };
  const perPage = opts.perPage ?? 12;
  const page = Math.max(1, opts.page ?? 1);
  let q = sb
    .from('works')
    .select(COLS, { count: 'exact' })
    .order('sort', { ascending: true })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);
  if (!opts.includeHidden) q = q.eq('published', true);
  if (opts.tag) q = q.eq('tag', opts.tag);
  const { data, count, error } = await q;
  if (error) return { items: [], total: 0 };
  return { items: (data as Work[]) || [], total: count ?? 0 };
}

/** 단건 조회. 없거나 오류면 null */
export async function getWork(id: string, includeHidden = false): Promise<Work | null> {
  const sb = getServiceClient();
  if (!sb || !isUuid(id)) return null;
  let q = sb.from('works').select(COLS).eq('id', id);
  if (!includeHidden) q = q.eq('published', true);
  const { data, error } = await q.maybeSingle();
  if (error) return null;
  return (data as Work) || null;
}

/** 이전/다음 글 (게시판 정렬 기준) */
export async function getNeighbors(work: Work): Promise<{ prev: Work | null; next: Work | null }> {
  const { items } = await listWorks({ perPage: 1000 });
  const i = items.findIndex((w) => w.id === work.id);
  return {
    prev: i > 0 ? items[i - 1] : null,
    next: i >= 0 && i < items.length - 1 ? items[i + 1] : null,
  };
}

export function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

/** 대표사진 URL (없으면 빈 문자열) */
export const coverOf = (w: Work) => w.images?.[0]?.url || '';

/** 관리자 폼에서 넘어온 이미지 목록(JSON)을 검증 — 우리 버킷 또는 기본 이미지만 허용 */
export function parseImages(raw: string): WorkImage[] {
  let arr: unknown;
  try {
    arr = JSON.parse(raw || '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  const sb = getServiceClient();
  const out: WorkImage[] = [];
  for (const it of arr) {
    if (!it || typeof it !== 'object') continue;
    const u = String((it as any).url || '');
    const p = (it as any).path == null ? null : String((it as any).path);
    if (p !== null && (!sb || !/^works\/[\w.-]+$/.test(p) || u !== publicUrl(sb, p))) continue;
    if (p === null && !/^\/images\/works\/[\w.-]+$/.test(u)) continue;
    out.push({ url: u, path: p });
  }
  return out.slice(0, 30);
}

export const publicUrl = (sb: SupabaseClient, path: string) =>
  sb.storage.from(WORKS_BUCKET).getPublicUrl(path).data.publicUrl;

/** Storage 파일 삭제 (기본 이미지 등 path 없는 항목은 건너뜀) */
export async function removeFiles(sb: SupabaseClient, images: WorkImage[]) {
  const paths = images.map((i) => i.path).filter((p): p is string => !!p);
  if (paths.length) await sb.storage.from(WORKS_BUCKET).remove(paths);
}

/** DB 미설정·등록 글 없음일 때 메인/게시판에 대신 보여줄 기본 사례 (상세 링크 없음) */
export const FALLBACK_WORKS = [
  { img: '/images/works/open-kitchen.webp', title: '오픈키친 다이닝 레스토랑', tag: '상업공간' },
  { img: '/images/works/lounge-pub.webp', title: '다크그린 라운지 펍', tag: '상업공간' },
  { img: '/images/works/cafe-biyul.webp', title: '비율_02 카페', tag: '상업공간' },
  { img: '/images/works/hair-salon.webp', title: '헤어살롱 인테리어', tag: '상업공간' },
  { img: '/images/works/chicken-pub-hall.webp', title: '청춘튀겨 치킨펍', tag: '상업공간' },
];

/** 공개 페이지용 카드 데이터로 변환 */
export interface WorkCardData {
  href?: string;
  img: string;
  title: string;
  tag: string;
  location?: string;
  count?: number;
}
export const toCard = (w: Work): WorkCardData => ({
  href: `/works/${w.id}`,
  img: coverOf(w),
  title: w.title,
  tag: w.tag,
  location: w.location,
  count: w.images.length,
});

/** 공개 SSR 페이지 CDN 캐시 (관리자 수정 후 최대 1분 내 반영) */
export const PUBLIC_CACHE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300';
