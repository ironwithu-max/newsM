import type { APIRoute } from 'astro';
import { getServiceClient, isUuid } from '../../../lib/works';

export const prerender = false;

// 관리자 상담글 처리 (미들웨어에서 인증) — 답글 저장 / 답변 전으로 되돌리기 / 잠금 해제 / 삭제
export const POST: APIRoute = async ({ request, redirect }) => {
  const sb = getServiceClient();
  if (!sb) return new Response('Supabase 환경변수가 설정되지 않았습니다.', { status: 500 });

  const form = await request.formData();
  const id = (form.get('id') || '').toString();
  const action = (form.get('action') || '').toString();
  if (!isUuid(id)) return new Response('잘못된 요청입니다.', { status: 400 });

  let error;
  let to = `/admin/consults/${id}?saved=1`;
  if (action === 'reply') {
    const reply = (form.get('reply') || '').toString().trim().slice(0, 5000);
    ({ error } = await sb
      .from('consults')
      .update(reply ? { reply, status: 'done', replied_at: new Date().toISOString() } : { reply: '', status: 'new', replied_at: null })
      .eq('id', id));
  } else if (action === 'reopen') {
    ({ error } = await sb.from('consults').update({ status: 'new' }).eq('id', id));
  } else if (action === 'unlock') {
    ({ error } = await sb.from('consults').update({ fail_count: 0 }).eq('id', id));
  } else if (action === 'delete') {
    ({ error } = await sb.from('consults').delete().eq('id', id));
    to = '/admin/consults';
  } else {
    return new Response('알 수 없는 작업입니다.', { status: 400 });
  }
  if (error) return new Response('처리 실패: ' + error.message, { status: 500 });
  return redirect(to, 303);
};
