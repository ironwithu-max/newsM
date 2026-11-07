// ─────────────────────────────────────────────────────────────
//  협력사 — /partners 목록 · /partners/[slug] 상세
//  새 협력사는 PARTNERS 배열에 항목 하나를 추가하면 페이지가 자동으로 생깁니다.
//  (이미지는 public/images/partners/<slug>/ 에 둡니다)
//  ⚠️ 개인정보(주민·법인등록번호, 직원 실명·자격 회원번호, 개인 연락처, 인감)는 넣지 않습니다. 대표자 이름은 공개 가능.
// ─────────────────────────────────────────────────────────────
export interface PartnerPhoto {
  src: string;
  caption: string;
  /** 조감도(완공 예상도)면 true */
  render?: boolean;
}
export interface Partner {
  slug: string;
  name: string;
  nameEn?: string;
  logo?: string;
  /** 협력 분야 (카드·배지에 표시) */
  field: string;
  slogan?: string;
  summary: string;
  overview: { label: string; value: string }[];
  history?: { year: string; items: string[] }[];
  mind?: { title: string; desc: string }[];
  mottos?: string[];
  organization?: string[];
  licenses?: { name: string; no?: string; issued?: string }[];
  /** 기술인력 — 이름은 가운데 글자를 가린 형태(이○호)만, 회원번호 등은 넣지 않음 */
  staff?: { total: number; detail: string; list?: { name: string; joined: string; grade: string }[] };
  records?: { total: string; highlights: string[] };
  certificates?: { src: string; title: string }[];
  photos?: PartnerPhoto[];
  contact?: { tel?: string; fax?: string; address?: string };
}

const H = '/images/partners/hiwon';
const RENDERS = new Set([11, 22, 24, 25, 27, 30, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46]);
const HIWON_CAPTIONS = [
  '엑셀 코리아 공장', '유영산업(서산) 공장', '디에스(영암) 공장', '글로리 화학 공장', 'NS 오토텍(송악) 공장',
  '유라엘텍(청원) 공장', '미래브이씨(김제) 공장', '여수 엑스포 주유소', '아나 EG(광주) 공장', '(주)영케미칼 공장',
  '영선동 다가구주택 신축공사', '주례 다세대주택', '주례 다세대주택', '통영 상수도사업소', '창동공영주차장 증축공사',
  '군북 기숙사 신축공사', '부산 글로벌 어린이집', '물금 숙박시설', '좌천동 주상복합', '물금 숙박시설',
  '물금 숙박시설', '진해구 용원동 근린생활시설 신축공사', '김해한솔병원 신관', '김해바른병원', '당리동 OK오병원',
  '대한수산 냉동공장', '토요애 유통센터', '하단 서호병원', '광안동 주상복합', '연산동 서호병원 신축공사',
  '대연동 근린생활시설', '장전동 지온병원', '장전동 에스원메디컬 신축공사', '에스쇼핑센터 및 요양병원 신축공사', '수안동 마더즈병원 신축공사',
  '외동 한양빌 아파트 신축공사', '서동 창고 및 근린생활시설 신축공사', '구포동 주차장 신축공사', '내동 타운하우스 신축공사', '서동메디컬센터 신축공사',
  '화정초 작은학교살리기 커뮤니티시설', '서김해일반산업단지 공장 신축공사', '영남냉장(주) 아이스크림공장 신축공사', '덕천동 금락메디컬빌딩 신축공사', '하이코스 연구소 신축공사',
  '사상교회 비전관 신축공사',
];

export const PARTNERS: Partner[] = [
  {
    slug: 'hiwon',
    name: '하이원종합건설㈜',
    nameEn: 'HIGH-ONE CONSTRUCTION CO., LTD.',
    logo: `${H}/logo.png`,
    field: '종합건설 · 건축공사업',
    slogan: '고객감동을 실현하는 기업',
    summary:
      '2001년 건축공사업 등록 이후 공장·병원·주상복합·근린생활시설·공공시설까지 100건이 넘는 건축 공사를 수행해 온 김해 소재 종합건설사입니다. 미남건축디자인과 협력해 신축·증축 등 건축공사를 함께 진행합니다.',
    overview: [
      { label: '상호', value: '하이원종합건설 주식회사' },
      { label: '대표이사', value: '이길호' },
      { label: '공사업종', value: '건축공사업' },
      { label: '건설업 등록', value: '2001. 6. 15' },
      { label: '자본금', value: '5억 원' },
      { label: '시공능력평가액', value: '234억 2,400만 원' },
      { label: '시공능력 순위', value: '건축공사업 경남 4위 · 김해 2위 (2022)' },
      { label: '소재지', value: '경남 김해시 서김해산단안길 66, 3층 301호 (풍유동, 하이원빌딩)' },
    ],
    history: [
      { year: '2001', items: ['회사 설립', '건설업(건축공사업) 등록'] },
      { year: '2011', items: ['상호 변경 — 하이원종합건설㈜', '본사 김해 이전'] },
      { year: '2014', items: ['이길호 대표이사 취임'] },
      { year: '2021', items: ['시공능력평가 건축공사업 경남 3위 · 김해 2위'] },
      { year: '2022', items: ['본사 이전 — 김해 서김해산단 하이원빌딩', '시공능력평가 건축공사업 경남 4위 · 김해 2위'] },
    ],
    mottos: ['나의 행동이 올바른가', '내가 주인이 맞는가', '고객의 성공에 헌신하라'],
    mind: [
      { title: '고객제일주의', desc: '창조적이며 동선을 고려한 실용적이고 철저한 시공으로 고객의 이익을 실현합니다.' },
      { title: '합리적인 시공', desc: '작은 것 하나도 놓치지 않는 섬세함과 불합리한 비용 제거로 책임 시공을 약속합니다.' },
      { title: '가치창조', desc: '축적된 경험을 바탕으로 기본에 충실하며, 오래 남을 완벽한 시공을 지향합니다.' },
    ],
    organization: ['대표이사 · 감사', '전무이사 · 상무이사', '건축부 (공무팀 · 시공팀 · 설계팀)', '토목부 (시공/장비)', '관리부 (업무 · 경리 · 공무기획팀 · A/S팀)'],
    licenses: [{ name: '건설업(건축공사업)', no: '제01-0828호', issued: '2001. 6. 15 등록' }],
    staff: {
      total: 18,
      detail: '건축·토목·기계·안전관리·조경 분야 건설기술인 — 특급 7 · 고급 5 · 중급 2 · 초급 8 (복수 자격 포함)',
      list: [
      { name: '이○호', joined: '2014.01', grade: '건축 초급' },
      { name: '윤○환', joined: '2015.07', grade: '건축 중급 · 기계 초급' },
      { name: '이○호', joined: '2015.10', grade: '건축 특급 · 토목 초급' },
      { name: '최○구', joined: '2017.04', grade: '건축 고급' },
      { name: '곽○주', joined: '2018.07', grade: '안전관리 초급 · 토목 특급' },
      { name: '이○현', joined: '2020.01', grade: '건축 초급' },
      { name: '전○주', joined: '2020.05', grade: '건축 특급' },
      { name: '김○진', joined: '2022.02', grade: '건축 고급' },
      { name: '박○철', joined: '2022.06', grade: '건축 고급 · 안전관리 초급' },
      { name: '박○웅', joined: '2022.06', grade: '안전관리 고급' },
      { name: '유○만', joined: '2022.07', grade: '건축 고급' },
      { name: '주○정', joined: '2022.10', grade: '건축 초급' },
      { name: '김○선', joined: '2023.05', grade: '조경 초급' },
      { name: '신○범', joined: '2023.09', grade: '건축 특급' },
      { name: '안○준', joined: '2024.11', grade: '건축 중급 · 안전관리 초급' },
      { name: '유○종', joined: '2024.11', grade: '건축 특급 · 안전관리 초급' },
      { name: '이○경', joined: '2024.12', grade: '건축 특급' },
      { name: '남○성', joined: '2025.02', grade: '건축 특급' },
      ],
    },
    records: {
      total: '2006년 ~ 2026년 총 114건',
      highlights: [
        '병원 — 김해한솔병원 신관·본관 증축, 김해바른병원, 하단·연산동 서호병원, 장전동 지온병원, 수안동 마더즈병원',
        '공장·산업시설 — 영남냉장 아이스크림공장, 서김해일반산업단지 공장, 대한수산 냉동공장, 영케미칼 공장',
        '주거·복합 — 광안동·좌천동 주상복합, 외동 한양빌 아파트, 내동 타운하우스, 남천동 도시형생활주택',
        '공공·교육 — 통영 상수도사업소, 창동공영주차장 증축, 화정초 작은학교살리기 커뮤니티시설, 부산 글로벌 어린이집',
        '근린·업무 — 덕천동 금락메디컬빌딩, 하이코스 연구소, 서동메디컬센터, 사상교회 비전관',
      ],
    },
    certificates: [
      { src: `${H}/cert-business.webp`, title: '사업자등록증' },
      { src: `${H}/cert-construction.webp`, title: '건설업등록증' },
    ],
    photos: HIWON_CAPTIONS.map((caption, i) => ({
      src: `${H}/works/${String(i + 1).padStart(2, '0')}.webp`,
      caption,
      render: RENDERS.has(i + 1),
    })),
    contact: { tel: '055-312-2185', fax: '055-312-2184', address: '경남 김해시 서김해산단안길 66, 3층 301호' },
  },
];

export const getPartner = (slug: string) => PARTNERS.find((p) => p.slug === slug);

/** 사업분야(건축공사) 페이지에 보여줄 협력사 시공 사진 (실제 사진 우선) */
export const partnerShowcase = (n = 9) =>
  PARTNERS.flatMap((p) => (p.photos || []).filter((ph) => !ph.render).map((ph) => ({ ...ph, partner: p.name, slug: p.slug }))).slice(0, n);
