import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "auto",
    name: "자동차보험",
    icon: "🚗",
    tagline: "의무보험, 매년 갱신 전 비교 필수",
    description:
      "대인·대물·자기신체·자기차량 보장을 한 번에. 운전 경력과 차종에 따라 보험료가 크게 달라지니 매년 갱신 전 비교하세요.",
  },
  {
    slug: "medical",
    name: "실손의료비",
    icon: "🏥",
    tagline: "병원비 실제 부담액을 돌려받는 국민보험",
    description:
      "입원·통원 치료비 중 본인부담금을 보장하는 필수 보험. 4세대 실손 기준 자기부담률과 비급여 특약을 꼭 확인하세요.",
  },
  {
    slug: "cancer",
    name: "암보험",
    icon: "🎗️",
    tagline: "진단·치료·요양까지 목돈 보장",
    description:
      "암 진단 시 진단금을 일시에 지급받아 치료와 생활비에 대비. 유사암·소액암 보장 범위와 갱신형/비갱신형을 비교하세요.",
  },
  {
    slug: "life",
    name: "종신·정기보험",
    icon: "🛡️",
    tagline: "가족을 위한 사망보장 설계",
    description:
      "사망 시 유가족에게 보험금을 남기는 보장. 평생 보장하는 종신형과 기간을 정하는 정기형 중 목적에 맞게 선택하세요.",
  },
  {
    slug: "travel",
    name: "여행자보험",
    icon: "✈️",
    tagline: "해외여행 상해·질병·휴대품까지",
    description:
      "여행 중 상해·질병 치료비, 휴대품 손해, 항공기 지연까지 단기로 저렴하게 보장. 출국 전 가입하세요.",
  },
  {
    slug: "home",
    name: "주택화재보험",
    icon: "🏠",
    tagline: "화재·누수·배상책임 한 번에",
    description:
      "화재·폭발·누수로 인한 재산 피해와 일상생활 배상책임을 보장. 자가·전세 모두 가입 가능합니다.",
  },
  {
    slug: "driver",
    name: "운전자보험",
    icon: "⚖️",
    tagline: "교통사고 형사·행정 비용 대비",
    description:
      "자동차보험이 보장하지 않는 벌금·변호사선임비·교통사고처리지원금을 보장. 12대 중과실 사고에 대비하세요.",
  },
  {
    slug: "dental",
    name: "치아보험",
    icon: "🦷",
    tagline: "임플란트·크라운·충치치료 보장",
    description:
      "임플란트, 크라운, 브릿지, 충전치료 등 비싼 치과 치료비를 보장. 면책기간과 감액기간을 확인하세요.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
