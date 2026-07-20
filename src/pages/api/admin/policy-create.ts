import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, isValidSession } from '../../../platform/adminAuth';
import { getSupabaseAdmin } from '../../../platform/supabaseServer';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isValidSession(cookies.get(ADMIN_COOKIE)?.value)) {
    return json({ ok: false, error: '인증 필요' }, 401);
  }

  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }

  const customer_id = String(d.customer_id ?? '').trim();
  const insurer = String(d.insurer ?? '').trim();
  const product_name = String(d.product_name ?? '').trim();
  if (!customer_id) return json({ ok: false, error: '고객을 선택하세요.' }, 422);
  if (!insurer || !product_name)
    return json({ ok: false, error: '보험사·상품명을 입력하세요.' }, 422);

  const premiumRaw = String(d.monthly_premium ?? '').replace(/\D/g, '');
  const row = {
    customer_id,
    insurer,
    product_name,
    category_slug: String(d.category_slug ?? '').trim() || null,
    monthly_premium: premiumRaw ? Number(premiumRaw) : null,
    start_date: String(d.start_date ?? '').trim() || null,
    expiry_date: String(d.expiry_date ?? '').trim() || null,
    renewal_date: String(d.renewal_date ?? '').trim() || null,
    status: 'active',
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: 'DB 미연결' }, 500);

  const { error } = await supabase.from('policies').insert(row);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
};
