// ─────────────────────────────────────────────────────────────
//  사이트 전역 설정 — 여기만 고치면 전체에 반영됩니다.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  /** 사이트 이름(브랜드) */
  name: '머니노트',
  /** 한 줄 소개 (검색결과/OG에 노출) */
  description: '금융·보험·부동산·건강·IT 실속 정보를 쉽게 정리합니다.',
  /** 배포 도메인 (반드시 커스텀 도메인으로 교체 → 애드센스 승인/SEO에 필수) */
  url: 'https://example.com',
  /** 작성자/운영자명 */
  author: '머니노트',
  /** 문의 이메일 (연락처 페이지·애드센스 신청에 사용) */
  email: 'you@example.com',

  // ── 애드센스 ───────────────────────────────────────────────
  //  승인 후 발급받은 게시자 ID를 넣으면 광고가 자동 활성화됩니다.
  //  예: 'ca-pub-1234567890123456'  (빈 값이면 광고 스크립트가 로드되지 않음)
  adsenseClient: '',
};

/** 카테고리 정의 (slug ↔ 한글 라벨) */
export const CATEGORIES = [
  { slug: 'finance', label: '금융' },
  { slug: 'insurance', label: '보험' },
  { slug: 'realestate', label: '부동산' },
  { slug: 'health', label: '건강' },
  { slug: 'it', label: 'IT리뷰' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const categoryLabel = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
