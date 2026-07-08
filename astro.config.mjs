// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/consts';

// https://astro.build/config
export default defineConfig({
  // ★ 배포 도메인을 여기에 넣으세요 (sitemap/robots/OG에 사용됨)
  site: SITE.url,
  integrations: [sitemap()],
});
