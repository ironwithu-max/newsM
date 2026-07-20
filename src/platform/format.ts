/** 원화 표기: 62000 -> "62,000원" */
export function won(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/** 월 보험료 표기: "월 62,000원" */
export function monthly(amount: number): string {
  return `월 ${amount.toLocaleString("ko-KR")}원`;
}

/** 평점 별 표기용: 4.4 -> "★ 4.4" */
export function stars(rating: number): string {
  return `★ ${rating.toFixed(1)}`;
}
