import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { products, getProduct } from '../../platform/products';
import { getCategory } from '../../platform/categories';
import { getInsurer } from '../../platform/insurers';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getApiKey(): string {
  return (
    import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? ''
  );
}

// LLM에 넘길 간결한 상품 카탈로그
function buildCatalog() {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    category: getCategory(p.categorySlug)?.name ?? p.categorySlug,
    insurer: getInsurer(p.insurerId)?.name ?? '',
    monthly_premium: p.monthlyPremium,
    coverage: p.coverageSummary,
    age_range: `${p.minAge}~${p.maxAge}`,
    tags: p.tags,
    highlights: p.highlights,
  }));
}

const SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['productId', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['summary', 'recommendations'],
  additionalProperties: false,
} as const;

const SYSTEM = `당신은 한국 보험 비교 플랫폼 'Life news'의 보험 추천 도우미입니다.
사용자가 한국어 자연어로 질문하면, 제공된 상품 카탈로그(JSON)에서 가장 잘 맞는 상품을 골라 적합도 순으로 추천합니다.
규칙:
- 카탈로그에 실제로 존재하는 상품만, 정확한 id로 참조합니다. 없는 상품을 지어내지 마세요.
- 최대 4개까지 추천합니다.
- 모든 텍스트는 한국어로 작성합니다.
- summary: 사용자 질문에 대한 1~2문장 답변과 고려할 점.
- 각 recommendation의 reason: 이 상품이 질문에 맞는 이유를 한 문장으로.
- 카탈로그에 맞는 상품이 없으면 recommendations를 빈 배열로 두고 summary에 그 사실을 설명합니다.
- 표시 보험료·보장은 데모 예시임을 감안해, 확정 정보가 아니라 참고용임을 과장 없이 안내하세요.`;

export const POST: APIRoute = async ({ request }) => {
  let q = '';
  try {
    const data = await request.json();
    q = String(data.q ?? '').trim();
  } catch {
    return json({ ok: false, error: '잘못된 요청' }, 400);
  }

  if (!q) return json({ ok: true, fallback: true, reason: 'empty-query' });

  const apiKey = getApiKey();
  if (!apiKey) {
    // AI 키 미설정 → 클라이언트가 키워드 검색으로 폴백
    return json({ ok: true, fallback: true, reason: 'no-api-key' });
  }

  try {
    const client = new Anthropic({ apiKey });
    const res = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      output_config: { format: { type: 'json_schema', schema: SCHEMA }, effort: 'low' },
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `사용자 질문: "${q}"\n\n상품 카탈로그:\n${JSON.stringify(buildCatalog())}`,
        },
      ],
    });

    const textBlock = res.content.find((b) => b.type === 'text');
    const raw = textBlock && 'text' in textBlock ? textBlock.text : '';
    const parsed = JSON.parse(raw) as {
      summary: string;
      recommendations: { productId: string; reason: string }[];
    };

    // 카탈로그에 실제 존재하는 상품만 통과
    const recommendations = (parsed.recommendations ?? [])
      .filter((r) => getProduct(r.productId))
      .slice(0, 4)
      .map((r) => ({ productId: r.productId, reason: r.reason }));

    return json({
      ok: true,
      ai: true,
      summary: parsed.summary ?? '',
      recommendations,
    });
  } catch (err) {
    console.error('[ai-search] error:', err instanceof Error ? err.message : err);
    // 실패 시에도 검색이 끊기지 않도록 폴백
    return json({ ok: true, fallback: true, reason: 'ai-error' });
  }
};
