import type { Insurer } from "./types";

// 예시용 가상의 보험사 (실제 회사와 무관)
export const insurers: Insurer[] = [
  { id: "ins-hanul", name: "한울손해보험", shortName: "한울", rating: 4.3 },
  { id: "ins-daon", name: "다온생명", shortName: "다온", rating: 4.1 },
  { id: "ins-miraero", name: "미래로화재", shortName: "미래로", rating: 4.4 },
  { id: "ins-saerom", name: "새롬손해보험", shortName: "새롬", rating: 4.0 },
  { id: "ins-hana", name: "하나로생명", shortName: "하나로", rating: 4.2 },
];

const insurerMap = new Map(insurers.map((i) => [i.id, i]));

export function getInsurer(id: string): Insurer | undefined {
  return insurerMap.get(id);
}
