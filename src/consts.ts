// ─────────────────────────────────────────────────────────────
//  사이트 전역 설정 — 여기만 고치면 전체에 반영됩니다.
//  (미남건축디자인 ㈜미남테크 — 실내건축·전기공사 전문 설계시공)
// ─────────────────────────────────────────────────────────────
export const SITE = {
  /** 사이트 이름(브랜드) */
  name: '미남건축디자인',
  /** 한 줄 소개 (검색결과/OG에 노출) */
  description:
    '단순한 건물, 그 이상의 공간 설계 — 실내건축·전기공사·전기차 충전 인프라 전문 설계시공. ㈜미남테크가 심미성과 실용성을 겸비한 공간을 시공합니다.',
  /** 배포 도메인 (SEO 기준 주소) */
  url: 'https://newsm.ai.kr',
  /** 작성자/운영자명 */
  author: '㈜미남테크',
  /** 문의 이메일 */
  email: 'mm9820@daum.net',

  // ── 애드센스 ───────────────────────────────────────────────
  //  승인 후 발급받은 게시자 ID를 넣으면 광고가 자동 활성화됩니다.
  //  (빈 값이면 광고 스크립트가 로드되지 않음)
  adsenseClient: 'ca-pub-8883301143843759',
};

// ─────────────────────────────────────────────────────────────
//  회사 정보 (푸터·회사소개·상담 섹션에서 공용 사용)
// ─────────────────────────────────────────────────────────────
export const COMPANY = {
  legalName: '㈜미남테크',
  brandName: '미남건축디자인',
  ceo: '서혜림',
  founded: '2021.12.21',
  staff: '8명',
  tel: '1533-9820',
  email: 'mm9820@daum.net',
  blog: 'https://blog.naver.com/withudesign',
  site: 'https://cellrio.kr',
  hqAddress: '경남 김해시 서김해산단안길 66 하이원빌딩 303호',
  branchAddress: '부산 강서구 대저중앙로 94',
  fields: '실내건축업 · 전기공사업 · 금속창호공사',
  licenses: '전기공사업 부산-02152호 · 실내건축공사업 등록',
  slogan: '공간을 넘어선 아름다움을 시공합니다',
  tagline: '단순한 건물, 그 이상의 공간 설계를 제안합니다',
};

/** 상단/모바일 내비게이션 (미남건축디자인) */
export const NAV = [
  { href: '/', label: '홈' },
  { href: '/#business', label: '사업분야' },
  { href: '/#works', label: '시공사례' },
  { href: '/#about', label: '회사소개' },
  { href: '/#contact', label: '상담문의' },
  { href: 'https://blog.naver.com/withudesign', label: '블로그', external: true },
] as const;

// ─────────────────────────────────────────────────────────────
//  아래 CATEGORIES 는 기존 정보 블로그(하위 페이지)에서 계속
//  사용되므로 그대로 유지합니다.
// ─────────────────────────────────────────────────────────────
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
