// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { SITE } from './src/consts';

// https://astro.build/config
export default defineConfig({
  // ★ 배포 도메인 (sitemap/robots/OG에 사용됨)
  site: SITE.url,
  // 기본은 정적(prerender). 상담 접수 API 등 일부 라우트만
  //  `export const prerender = false` 로 서버리스 실행 (Vercel 어댑터).
  adapter: vercel(),
  // Astro 기본 Origin 검사는 Vercel 프록시 뒤에서 같은 사이트 요청도 403으로 막음
  //  → 끄고, src/middleware.ts 에서 Host 헤더 기준으로 직접 검사
  security: { checkOrigin: false },
  integrations: [sitemap()],
});
