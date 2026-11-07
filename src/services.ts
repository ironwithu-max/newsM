// ─────────────────────────────────────────────────────────────
//  사업분야 상세 페이지 콘텐츠 — /business/[slug]
//  여기만 고치면 각 사업분야 상세 페이지에 반영됩니다.
// ─────────────────────────────────────────────────────────────
export interface ServiceWork {
  img: string;
  label: string;
  tag: string;
  /** 누르면 이동할 곳 (시공사례 상세 등) */
  href?: string;
}
export interface ServiceFeature {
  title: string;
  desc: string;
}
export interface ServiceFaq {
  q: string;
  a: string;
}
export interface Service {
  slug: string;
  tag: string;
  icon: string;
  title: string;
  lead: string;
  intro: string;
  scope: string[];
  features: ServiceFeature[];
  steps: { title: string; desc: string }[];
  works: ServiceWork[];
  faq: ServiceFaq[];
  note?: string;
}

const STEPS_DEFAULT = [
  { title: '상담·현장조사', desc: '문의 접수 후 현장을 방문해 상황을 파악하고 실측합니다.' },
  { title: '설계·견적', desc: '공간 계획과 디자인을 제안하고 투명한 견적을 안내합니다.' },
  { title: '시공', desc: '자격 기술자가 직접 시공하며 품질을 지속 관리합니다.' },
  { title: '준공·A/S', desc: '최종 점검 후 인도하며 시공 이후에도 책임 관리합니다.' },
];

export const SERVICES: Service[] = [
  {
    slug: 'architecture',
    tag: 'ARCHITECTURE',
    icon: '🏛️',
    title: '건축공사',
    lead: '계획부터 시공, 감리까지 — 건축공정의 전 과정을 책임집니다.',
    intro:
      '신축·증축·대수선 등 건축물의 기획 단계부터 인허가, 시공, 감리, 준공까지 전 과정을 일원화된 관리로 진행합니다. 근린생활시설과 상가, 주택, 상업시설 등 다양한 용도의 건축 프로젝트를 수행하며, 설계와 시공의 책임을 한 팀이 맡아 공정 지연과 책임 공백을 없앱니다.',
    scope: [
      '신축·증축·대수선 공사',
      '근린생활시설·상가 건축',
      '주택·전원주택 신축',
      '금속창호·이건창호·징크 공사',
      '인허가 및 준공 행정 지원',
    ],
    features: [
      { title: '전 공정 일원화 관리', desc: '설계·시공·감리를 한 팀이 맡아 소통 비용과 책임 공백을 최소화합니다.' },
      { title: '전문건설 면허 보유', desc: '실내건축공사업 등록 및 관련 면허를 갖춘 정식 전문 시공업체입니다.' },
      { title: '350건+ 시공 경험', desc: '상가·주택·관공서·학교 등 폭넓은 건축 프로젝트 노하우를 보유합니다.' },
    ],
    steps: STEPS_DEFAULT,
    works: [
      { img: '/images/partners/hiwon/works/32.webp', label: '장전동 지온병원', tag: '병원 · 협력사 시공', href: '/works/84b02da0-7602-412f-80cc-b51ca95c99ad' },
      { img: '/images/partners/hiwon/works/30.webp', label: '연산동 서호병원 신축공사', tag: '병원 · 협력사 시공 · 조감도', href: '/partners/hiwon#photos' },
      { img: '/images/partners/hiwon/works/28.webp', label: '하단 서호병원', tag: '병원 · 협력사 시공', href: '/works/2554b25f-4fe0-4e14-8ae1-6e4f667df77f' },
      { img: '/images/partners/hiwon/works/23.webp', label: '김해한솔병원 신관', tag: '병원 · 협력사 시공', href: '/works/f2dc4624-e076-4c91-9260-3bd27dae3fef' },
      { img: '/images/partners/hiwon/works/33.webp', label: '장전동 에스원메디컬 신축공사', tag: '의료 · 협력사 시공', href: '/works/84a39425-7fc2-49ab-9acc-818da60600f2' },
      { img: '/images/partners/hiwon/works/43.webp', label: '영남냉장(주) 아이스크림공장 신축공사', tag: '공장 · 협력사 시공', href: '/works/bf3cbc8c-3863-403d-b420-27c8dd7b9a73' },
      { img: '/images/partners/hiwon/works/29.webp', label: '광안동 주상복합', tag: '주상복합 · 협력사 시공', href: '/works/bd60db85-e8c1-4ac7-a8eb-8ba8f0d9b484' },
      { img: '/images/partners/hiwon/works/14.webp', label: '통영 상수도사업소', tag: '공공시설 · 협력사 시공', href: '/works/820fd41c-e0fe-4891-b52a-eb4bdbf96dba' },
    ],
    faq: [
      { q: '설계도면 없이도 상담이 가능한가요?', a: '네, 대략적인 구상만 있어도 현장 조사와 상담을 통해 계획과 견적을 함께 잡아드립니다.' },
      { q: '인허가 절차도 대행해 주시나요?', a: '건축 인허가와 준공에 필요한 행정 절차를 함께 지원해 드립니다.' },
      { q: '경남·부산 외 지역도 시공하나요?', a: '김해 본사와 부산 지사를 기반으로 경남·부산 전역을 우선 시공하며, 그 외 지역은 상담 시 협의합니다.' },
    ],
  },
  {
    slug: 'interior',
    tag: 'INTERIOR',
    icon: '🛋️',
    title: '실내건축',
    lead: '심미성과 기능성이 조화를 이루는 공간을 설계하고 시공합니다.',
    intro:
      '고객의 라이프스타일과 공간의 콘셉트에 맞춰 실내 인테리어를 디자인하고 공간을 최적화합니다. 아파트·주택 리모델링부터 욕실·주방 부분 시공, 카페·매장 같은 상업공간, 전시관·홍보관까지 — 주거와 상업 공간 모두 맞춤형으로 완성합니다.',
    scope: [
      '아파트·주택 전체 리모델링',
      '욕실·주방 부분 시공',
      '카페·매장 등 상업공간',
      '전시관·홍보관·쇼룸',
      '한샘리하우스 등 브랜드 전시매장',
    ],
    features: [
      { title: '고객 맞춤형 디자인', desc: '요구와 조건에 맞는 설계 솔루션으로 새로운 공간 가치를 제안합니다.' },
      { title: '공간 최적화 설계', desc: '동선과 수납, 채광을 고려해 실사용에 최적화된 공간을 구성합니다.' },
      { title: '감성과 실용의 균형', desc: '보기 좋은 공간을 넘어 오래 편하게 쓰는 공간을 지향합니다.' },
    ],
    steps: STEPS_DEFAULT,
    works: [
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791780186787-o7ft2k.webp', label: '진해 GS자이 103동 리모델링', tag: '아파트 리모델링', href: '/works/b999930b-24ae-4d5f-965c-6b262406b44d' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791778846734-hf3jye.webp', label: '마산 마린파이브 34평 리모델링', tag: '아파트 리모델링', href: '/works/296d78a9-6822-4cdb-8db3-0a546b1b9950' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791778745438-icmpjw.webp', label: '창원 동정동 무학아파트 32평 리모델링', tag: '아파트 리모델링', href: '/works/5f9fd2ba-cb91-4953-9b57-f791ebd0fe48' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791774309324-rud4if.webp', label: '창원 트리비앙 아파트 34평형 리모델링', tag: '아파트 리모델링', href: '/works/aa9165d7-521f-40c1-a36c-36bee07387d9' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1793167038931-6hbt7q.webp', label: '마산 린뷰티샾', tag: '상업공간', href: '/works/36ae9e88-c555-4aeb-898c-6b4f7fcf6004' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1793167701532-5qxp51.webp', label: '창원 상남동 트렌디카 안경원', tag: '상업공간', href: '/works/01349ed5-6126-40d3-9f68-118631a77845' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1793167295947-izmj6h.webp', label: '창원 대방동 링키 영어학원', tag: '학원·교육', href: '/works/f5f28ee7-3512-4cd4-84a1-23e6efca2508' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1793927795115-vf6j6u.webp', label: '부산 금정 내사랑 주간보호센터 인테리어', tag: '주간보호센터', href: '/works/6db2c89c-40f7-4f4b-b5df-e20a7c153779' },
    ],
    faq: [
      { q: '거주하면서 부분 시공만 할 수 있나요?', a: '욕실·주방 등 부분 시공도 가능하며, 생활 불편을 최소화하도록 일정을 조율합니다.' },
      { q: '자재나 브랜드를 지정할 수 있나요?', a: '원하시는 자재·브랜드를 반영해 설계하며, 예산에 맞는 대안도 함께 제안합니다.' },
      { q: '시공 후 하자 보수는 어떻게 되나요?', a: '준공 이후에도 책임 관리하며, 하자 발생 시 신속히 대응합니다.' },
    ],
  },
  {
    slug: 'electric',
    tag: 'ELECTRIC',
    icon: '💡',
    title: '전기공사',
    lead: '안정성과 효율성을 고려한 전기 설비 설계·시공·유지보수.',
    intro:
      '건축물의 전기배선, 조명, 각종 전기 설비의 설치와 유지보수를 수행합니다. 전기공사업 면허(부산-02152호)를 보유하고, 전기기사·전기산업기사·소방설비기사 등 전문 자격을 갖춘 기술 인력이 안전하고 효율적인 전기 시스템을 책임집니다.',
    scope: [
      '전기배선·배관 공사',
      '조명·콘센트·분전반 설치',
      '수·변전 설비 공사',
      '소방 전기 설비',
      '에너지 효율 개선·유지보수',
    ],
    features: [
      { title: '전기공사업 면허 보유', desc: '전기공사업 부산-02152호를 보유한 정식 전기 시공업체입니다.' },
      { title: '자격 기술자 직접 시공', desc: '전기기사·전기산업기사·소방설비기사가 직접 설계·시공합니다.' },
      { title: '안전·효율 우선 설계', desc: '안정성과 에너지 효율을 함께 고려한 전기 시스템을 구축합니다.' },
    ],
    steps: STEPS_DEFAULT,
    works: [
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791790577987-mjs7w6.webp', label: '창원 힐링파크골프', tag: '조명·전기 공사', href: '/works/6810d9ca-9309-4751-8d70-d5fdc9f5b59c' },
      { img: '/images/works/open-kitchen.webp', label: '오픈키친 다이닝 레스토랑', tag: '조명·전기 공사', href: '/works/851875b9-a616-44bd-b058-239e5c88e6d7' },
      { img: '/images/works/lounge-pub.webp', label: '다크그린 라운지 펍', tag: '조명·전기 공사', href: '/works/ab0ac7c0-070c-47e2-b622-2d831fcb5eab' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791775223999-fif7qw.webp', label: '창원 남산동 퇴근길 술한잔', tag: '조명·전기 공사', href: '/works/953f85a5-c7bc-4b6e-8758-82dec098b9a4' },
    ],
    faq: [
      { q: '실내건축과 전기공사를 함께 맡길 수 있나요?', a: '네, 인테리어와 전기공사를 한 곳에서 통합 진행해 공정과 책임을 일원화할 수 있습니다.' },
      { q: '노후 전기 설비 점검·교체도 하나요?', a: '분전반·배선 등 노후 설비 점검과 교체, 안전 진단을 함께 진행합니다.' },
      { q: '소방 전기 설비도 시공하나요?', a: '소방설비기사(전기분야) 보유로 소방 전기 설비 시공이 가능합니다.' },
    ],
    note: '보유 자격 · 전기기사 / 전기산업기사 / 소방설비기사(전기분야) / 실내건축기능사 / 건설기술경력',
  },
  {
    slug: 'ev-charging',
    tag: 'EV CHARGING',
    icon: '🔌',
    title: '전기차 충전 인프라',
    lead: '충전소 설계부터 설치·관리까지, 전기차 충전 토털 솔루션.',
    intro:
      '저탄소 시대로의 전환에 발맞춰 전기차 충전소의 설계부터 설치, 유지관리까지 필요한 모든 과정을 제공합니다. 아파트·상가·사업장 등 현장 여건에 맞는 완속·급속 충전 인프라를 구축하며, 전기공사 역량을 기반으로 안전하고 안정적인 충전 환경을 만듭니다.',
    scope: [
      '완속·급속 충전기 설치',
      '아파트·상가·사업장 충전 인프라',
      '충전소 설계 및 전기 증설',
      '설치 보조금 신청 지원',
      '설치 후 유지관리',
    ],
    features: [
      { title: '전기공사 역량 기반', desc: '전기공사 면허와 기술력을 바탕으로 충전 설비까지 안정적으로 시공합니다.' },
      { title: '현장 맞춤 설계', desc: '주차 여건과 전기 용량을 진단해 최적의 충전 구성을 제안합니다.' },
      { title: '친환경·지속가능', desc: '빠르게 성장하는 전기차 시장에 맞춘 지속 가능한 모빌리티 솔루션.' },
    ],
    steps: STEPS_DEFAULT,
    works: [
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791778464921-yhegj1.webp', label: 'LG볼트업 충전기 시공', tag: '전기차 충전기', href: '/works/1017ec9b-ee70-49bc-a3a8-d94b7bd0c453' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791778538273-otkdro.webp', label: 'GS차지비 충전기 설치 공사', tag: '전기차 충전기', href: '/works/7013efa7-960a-41e4-8a7e-60987c7494ff' },
      { img: 'https://euwbfvckjpwemxlukgyz.supabase.co/storage/v1/object/public/works/works/1791778505270-glrk43.webp', label: 'SK일렉링크 충전기 설치 공사', tag: '전기차 충전기', href: '/works/abd0474d-d4db-47a3-8e2b-c8437491c019' },
    ],
    faq: [
      { q: '아파트 단지에도 설치할 수 있나요?', a: '단지 전기 용량과 주차 여건을 진단해 완속·급속 충전 인프라를 구축합니다.' },
      { q: '설치 보조금 신청도 도와주나요?', a: '설치 보조금 신청에 필요한 절차를 함께 지원해 드립니다.' },
      { q: '설치 후 관리도 맡길 수 있나요?', a: '설치 이후 점검과 유지관리까지 이어서 진행할 수 있습니다.' },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
