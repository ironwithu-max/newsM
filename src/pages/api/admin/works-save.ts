import type { APIRoute } from 'astro';
import { getServiceClient, getWork, isUuid, parseImages, removeFiles } from '../../../lib/works';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// 관리자 게시글 등록/수정 (미들웨어에서 인증). id 가 있으면 수정, 없으면 신규 등록.
export const POST: APIRoute = async ({ request }) => {
  const sb = getServiceClient();
  if (!sb) return json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' }, 500);

  const form = await request.formData();
  const str = (k: string, max = 200) => (form.get(k) || '').toString().trim().slice(0, max);

  const id = str('id', 40);
  const title = str('title');
  const workDate = str('work_date', 10);
  const sortRaw = str('sort', 10);
  const row = {
    title,
    tag: str('tag', 40),
    location: str('location', 100),
    work_date: /^\d{4}-\d{2}-\d{2}$/.test(workDate) ? workDate : null,
    content: str('content', 20000),
    images: parseImages(str('images', 20000)),
    sort: sortRaw ? parseInt(sortRaw, 10) || 0 : 0,
    published: form.get('published') === 'on' || form.get('published') === 'true',
    updated_at: new Date().toISOString(),
  };

  if (!title) return json({ error: '제목을 입력하세요.' }, 400);
  if (row.images.length === 0) return json({ error: '사진을 1장 이상 등록하세요.' }, 400);

  if (id) {
    if (!isUuid(id)) return json({ error: '잘못된 게시글 id 입니다.' }, 400);
    const old = await getWork(id, true);
    if (!old) return json({ error: '게시글을 찾을 수 없습니다.' }, 404);
    const { error } = await sb.from('works').update(row).eq('id', id);
    if (error) return json({ error: 'DB 저장 실패: ' + error.message }, 500);
    // 수정에서 빠진 사진은 Storage 에서도 삭제
    const kept = new Set(row.images.map((i) => i.path));
    await removeFiles(sb, old.images.filter((i) => !kept.has(i.path)));
    return json({ ok: true, id });
  }

  const { data, error } = await sb.from('works').insert(row).select('id').single();
  if (error) return json({ error: 'DB 저장 실패: ' + error.message }, 500);
  return json({ ok: true, id: data.id });
};
