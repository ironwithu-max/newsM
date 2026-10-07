import type { APIRoute } from 'astro';
import { getServiceClient, getWork, removeFiles } from '../../../lib/works';

export const prerender = false;

// 관리자 게시글 삭제 (미들웨어에서 인증) — 게시글 행 + Storage 사진 삭제
export const POST: APIRoute = async ({ request, redirect }) => {
  const sb = getServiceClient();
  if (!sb) return new Response('Supabase 환경변수가 설정되지 않았습니다.', { status: 500 });

  const form = await request.formData();
  const id = (form.get('id') || '').toString().trim();
  const work = await getWork(id, true);
  if (!work) return new Response('게시글을 찾을 수 없습니다.', { status: 404 });

  const { error } = await sb.from('works').delete().eq('id', id);
  if (error) return new Response('삭제 실패: ' + error.message, { status: 500 });
  await removeFiles(sb, work.images);

  return redirect('/admin/works', 303);
};
