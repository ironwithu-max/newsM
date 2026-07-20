import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../platform/supabaseServer';
import { getProduct } from '../../platform/products';
import { getCategory } from '../../platform/categories';

export const prerender = false;

function normPhone(p: string): string {
  return p.replace(/\D/g, '');
}
function isValidPhone(p: string): boolean {
  return /^01[016789]\d{7,8}$/.test(normPhone(p));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let phone = '';
  try {
    const data = await request.json();
    phone = String(data.phone ?? '').trim();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }

  if (!isValidPhone(phone)) {
    return json({ ok: false, error: '올바른 휴대폰 번호를 입력해 주세요.' }, 422);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ ok: false, error: '조회 서비스가 준비되지 않았습니다.' }, 500);
  }

  // 하이픈 유무 모두 대응: 원문/정규화 두 형태로 조회
  const digits = normPhone(phone);
  const { data, error } = await supabase
    .from('leads')
    .select('category_slug, product_id, status, created_at, phone')
    .order('created_at', { ascending: false });

  if (error) {
    return json({ ok: false, error: '조회 중 오류가 발생했습니다.' }, 500);
  }

  // 서버에서 전화번호 정규화 비교(저장 형식이 하이픈 포함일 수 있어서)
  const rows = (data ?? [])
    .filter((r) => normPhone(String(r.phone)) === digits)
    .map((r) => ({
      category: getCategory(r.category_slug)?.name ?? r.category_slug,
      product: r.product_id ? getProduct(r.product_id)?.name ?? null : null,
      status: r.status,
      createdAt: r.created_at,
    }));

  return json({ ok: true, count: rows.length, items: rows });
};
