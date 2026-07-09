// ─────────────────────────────────────────────────────────────
//  사이트 전역 설정 — 여기만 고치면 전체에 반영됩니다.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  /** 사이트 이름(브랜드) */
  name: 'newsM',
  /** 한 줄 소개 (검색결과/OG에 노출) */
  description: '금융·보험·부동산·건강·IT 실속 정보와 후기를 쉽게 전달합니다.',
  /** 배포 도메인 (애드센스 승인/SEO 기준 주소) */
  url: 'https://newsm.ai.kr',
  /** 작성자/운영자명 */
  author: 'newsM',
  /** 문의 이메일 (연락처 페이지·애드센스 신청에 사용 — 실제 이메일로 교체 권장) */
  email: 'you@example.com',

  // ── 애드센스 ───────────────────────────────────────────────
  //  승인 후 발급받은 게시자 ID를 넣으면 광고가 자동 활성화됩니다.
  //  예: 'ca-pub-1234567890123456'  (빈 값이면 광고 스크립트가 로드되지 않음)
  adsenseClient: '',
};

/** 카테고리 정의 (slug ↔ 한글 라벨) */
export const CATEGORIES = [
  { slug: 'finance', label: '금융' },
  { slug: 'economy', label: '경제' },
  { slug: 'realestate', label: '부동산' },
  { slug: 'insurance', label: '보험' },
  { slug: 'tax', label: '세금·절세' },
  { slug: 'subsidy', label: '정부지원금' },
  { slug: 'health', label: '건강' },
  { slug: 'life', label: '생활정보' },
  { slug: 'it', label: 'IT리뷰' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const categoryLabel = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
