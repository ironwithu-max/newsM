import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../platform/supabaseServer';
import { getProduct } from '../../platform/products';
import { getCategory } from '../../platform/categories';
import { isOtpEnabled, isPhoneVerified, VERIFY_COOKIE } from '../../platform/otp';

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

export const POST: APIRoute = async ({ request, cookies }) => {
  let phone = '';
  try {
    phone = String((await request.json()).phone ?? '').trim();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }
  if (!isValidPhone(phone)) {
    return json({ ok: false, error: '올바른 휴대폰 번호를 입력해 주세요.' }, 422);
  }

  // OTP 활성 시: 본인 인증(문자) 완료돼야 조회 가능
  if (isOtpEnabled() && !isPhoneVerified(phone, cookies.get(VERIFY_COOKIE)?.value)) {
    return json({ ok: false, needVerify: true, error: '문자 본인인증이 필요합니다.' }, 401);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ ok: false, error: '조회 서비스가 준비되지 않았습니다.' }, 500);
  }
  const digits = normPhone(phone);

  // ── 1) 본인 보험 계약 (customers 전화번호 매칭 → policies) ──
  const custRes = await supabase.from('customers').select('id, name, phone');
  const myCustomers = (custRes.data ?? []).filter(
    (c) => normPhone(String(c.phone)) === digits
  );
  const custIds = myCustomers.map((c) => c.id);

  let policies: any[] = [];
  if (custIds.length > 0) {
    const polRes = await supabase
      .from('policies')
      .select('*')
      .in('customer_id', custIds)
      .order('expiry_date', { ascending: true });
    policies = (polRes.data ?? []).map((p) => ({
      insurer: p.insurer,
      product: p.product_name,
      category: p.category_slug ? getCategory(p.category_slug)?.name ?? p.category_slug : null,
      monthlyPremium: p.monthly_premium,
      startDate: p.start_date,
      expiryDate: p.expiry_date,
      renewalDate: p.renewal_date,
      agent: p.agent ?? null,
      status: p.status,
    }));
  }

  // ── 2) 상담 내역 (leads 전화번호 매칭) ──
  const leadRes = await supabase
    .from('leads')
    .select('category_slug, product_id, status, created_at, phone')
    .order('created_at', { ascending: false });
  const consultations = (leadRes.data ?? [])
    .filter((r) => normPhone(String(r.phone)) === digits)
    .map((r) => ({
      category: getCategory(r.category_slug)?.name ?? r.category_slug,
      product: r.product_id ? getProduct(r.product_id)?.name ?? null : null,
      status: r.status,
      createdAt: r.created_at,
    }));

  return json({
    ok: true,
    name: myCustomers[0]?.name ?? null,
    policies,
    consultations,
    policyCount: policies.length,
    consultCount: consultations.length,
  });
};
