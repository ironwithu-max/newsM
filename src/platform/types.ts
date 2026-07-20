// 보험 비교·중개 플랫폼 도메인 타입
// (MVP 단계: 시드 데이터 기반. 추후 Supabase 테이블로 매핑)

export interface Category {
  slug: string; // URL 식별자 (예: "auto")
  name: string; // 표시명 (예: "자동차보험")
  icon: string; // 이모지 아이콘
  tagline: string; // 짧은 소개
  description: string; // 상세 소개
}

export interface Insurer {
  id: string;
  name: string;
  shortName: string;
  rating: number; // 고객 평점 0~5
}

export interface CoverageItem {
  label: string; // 보장 항목명 (예: "대인배상")
  value: string; // 보장 내용 (예: "무한")
}

export interface Product {
  id: string;
  categorySlug: string;
  insurerId: string;
  name: string;
  /** 월 예상 보험료(원). 나이/조건별 예시값 */
  monthlyPremium: number;
  /** 주요 보장 한도 요약 (예: "최대 1억원") */
  coverageSummary: string;
  /** 카드에 노출할 핵심 강점 */
  highlights: string[];
  /** 상세 보장 항목 */
  coverages: CoverageItem[];
  /** 가입 가능 연령 */
  minAge: number;
  maxAge: number;
  /** 특징 태그 (필터용) */
  tags: string[];
  rating: number; // 상품 평점 0~5
  reviewCount: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  categorySlug: string;
  productId?: string;
  birthYear?: number;
  gender?: "male" | "female";
  message?: string;
  agreedPrivacy: boolean;
  createdAt: string; // ISO
}
