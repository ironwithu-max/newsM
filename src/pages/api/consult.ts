import type { APIRoute } from 'astro';
import { getProduct } from '../../platform/products';
import { getCategory } from '../../platform/categories';
import { getSupabaseAdmin } from '../../platform/supabaseServer';

// 온디맨드(서버리스) 실행
export const prerender = false;

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return /^01[016789]\d{7,8}$/.test(digits);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: '잘못된 요청 형식입니다.' }, 400);
  }

  const name = String(data.name ?? '').trim();
  const phone = String(data.phone ?? '').trim();
  const categorySlug = String(data.categorySlug ?? '').trim();
  const productId = String(data.productId ?? '').trim() || undefined;
  const message = String(data.message ?? '').trim() || undefined;
  const birthYearRaw = String(data.birthYear ?? '').trim();
  const genderRaw = String(data.gender ?? '').trim();
  const agreed = data.agreedPrivacy === true || data.agreedPrivacy === 'on';

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = '이름을 정확히 입력해 주세요.';
  if (!isValidPhone(phone))
    fieldErrors.phone = '올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)';
  if (!categorySlug || !getCategory(categorySlug))
    fieldErrors.categorySlug = '상담받을 보험 종류를 선택해 주세요.';
  if (!agreed) fieldErrors.agreedPrivacy = '개인정보 수집·이용에 동의해 주세요.';

  let birthYear: number | undefined;
  if (birthYearRaw) {
    birthYear = Number(birthYearRaw);
    const thisYear = new Date().getFullYear();
    if (Number.isNaN(birthYear) || birthYear < 1920 || birthYear > thisYear) {
      fieldErrors.birthYear = '출생연도를 확인해 주세요.';
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return json({ ok: false, error: '입력값을 확인해 주세요.', fieldErrors }, 422);
  }

  const product = productId ? getProduct(productId) : undefined;
  const gender =
    genderRaw === 'male' || genderRaw === 'female' ? genderRaw : undefined;

  const lead = {
    name,
    phone,
    category_slug: product?.categorySlug ?? categorySlug,
    product_id: product?.id ?? null,
    birth_year: birthYear ?? null,
    gender: gender ?? null,
    message: message ?? null,
    agreed_privacy: true,
    created_at: new Date().toISOString(),
  };

  // Supabase 가 설정돼 있으면 leads 테이블에 저장, 아니면 로그만 남기고 성공 처리
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from('leads').insert(lead);
    if (error) {
      console.error('[consult] supabase insert error:', error.message);
      return json(
        { ok: false, error: '상담 신청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.' },
        500
      );
    }
  } else {
    console.log('[consult] 새 상담 신청 (DB 미연동 — 로그만):', lead);
  }

  return json({ ok: true });
};
