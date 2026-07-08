# newsM (AdSense 콘텐츠 사이트)

금융·보험·부동산·건강·IT리뷰 정보/후기 사이트 — https://newsm.ai.kr
Astro 기반 정적 사이트로 SEO·속도에 최적화되어 있으며 Google AdSense 게재를
전제로 설계되었습니다.

## 빠른 시작

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 정적 파일 생성
npm run preview  # 빌드 결과 미리보기
```

## 글 쓰는 법

`src/content/blog/` 에 마크다운 파일을 추가하면 자동으로 목록·카테고리·RSS에
반영됩니다. 프론트매터 예시:

```yaml
---
title: '글 제목'
description: '검색결과에 노출될 한 줄 요약'
pubDate: 2026-07-08
category: 'finance'   # finance | insurance | realestate | health | it
tags: ['태그1', '태그2']
draft: false           # true면 발행 안 됨
---
```

## 배포 전 체크리스트 (AdSense 승인용)

1. `src/consts.ts` — 사이트 이름·도메인·이메일 수정
2. **커스텀 도메인 연결** (Vercel/Cloudflare Pages 무료 플랜 + 도메인 구매)
3. 양질의 글 20~30개 이상 발행
4. Google Search Console 등록 → 색인 요청
5. AdSense 신청 → 승인 후:
   - `src/consts.ts` 의 `adsenseClient` 에 `ca-pub-...` 입력
   - `public/ads.txt` 의 `pub-...` 교체
6. `public/robots.txt` 와 `astro.config.mjs` 의 도메인 확인

## 구조

```
src/
├─ consts.ts              # ★ 사이트 전역 설정 (여기부터 수정)
├─ content/blog/          # 글(마크다운) — 여기에 계속 추가
├─ components/
│  ├─ AdSlot.astro        # 애드센스 광고 슬롯
│  ├─ Seo.astro           # 메타/OG 태그
│  ├─ Header/Footer/PostCard
├─ layouts/BaseLayout.astro
└─ pages/
   ├─ index.astro         # 홈
   ├─ about/contact/privacy  # 승인 필수 페이지
   ├─ blog/               # 목록 + 상세
   └─ category/[category] # 카테고리별
public/
├─ ads.txt  robots.txt  favicon.svg
```
