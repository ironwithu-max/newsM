import type { APIRoute } from 'astro';
import { getServiceClient, publicUrl, WORKS_BUCKET } from '../../../lib/works';

export const prerender = false;

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
// Vercel 서버리스 요청 본문 한도(4.5MB) 아래로 유지. 관리자 화면에서 업로드 전 자동 압축함.
const MAX_BYTES = 4 * 1024 * 1024;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// 관리자 사진 1장 업로드 (미들웨어에서 인증) → { url, path }
export const POST: APIRoute = async ({ request }) => {
  const sb = getServiceClient();
  if (!sb) return json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' }, 500);

  const form = await request.formData();
  const file = form.get('image');
  if (!(file instanceof File) || file.size === 0) return json({ error: '이미지 파일이 없습니다.' }, 400);
  const ext = EXT[file.type];
  if (!ext) return json({ error: 'jpg·png·webp 이미지만 업로드할 수 있습니다.' }, 400);
  if (file.size > MAX_BYTES) return json({ error: '이미지가 4MB를 넘습니다.' }, 400);

  const path = `works/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await sb.storage
    .from(WORKS_BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
  if (up.error) return json({ error: '스토리지 업로드 실패: ' + up.error.message }, 500);

  return json({ url: publicUrl(sb, path), path });
};
