import type { APIRoute } from 'astro';
import { getServiceClient } from '../../lib/works';
import { getConsult, checkPassword, MAX_FAILS } from '../../lib/consults';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' },
  });

// 상담글 비밀번호 확인 → 본문 + 관리자 답글 반환
export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const id = (form.get('id') || '').toString();
  const password = (form.get('password') || '').toString();

  const c = await getConsult(id);
  if (!c) return json({ error: '글을 찾을 수 없습니다.' }, 404);
  if (c.fail_count >= MAX_FAILS)
    return json({ error: '비밀번호를 여러 번 틀려 잠긴 글입니다. 전화(고객센터)로 문의해 주세요.' }, 423);

  if (!checkPassword(password, c.password_hash)) {
    await getServiceClient()!.from('consults').update({ fail_count: c.fail_count + 1 }).eq('id', id);
    const left = MAX_FAILS - c.fail_count - 1;
    return json({ error: `비밀번호가 맞지 않습니다. (남은 횟수 ${left}회)` }, 403);
  }
  if (c.fail_count > 0) await getServiceClient()!.from('consults').update({ fail_count: 0 }).eq('id', id);

  return json({
    name: c.name,
    space_type: c.space_type,
    message: c.message,
    created_at: c.created_at,
    status: c.status,
    reply: c.reply,
    replied_at: c.replied_at,
  });
};
