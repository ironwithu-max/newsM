import type { APIRoute } from 'astro';
import { getServiceClient } from '../../lib/works';
import { hashPassword } from '../../lib/consults';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

// 공개 상담요청 접수 (같은 사이트 요청만 — middleware 에서 검사)
export const POST: APIRoute = async ({ request }) => {
  const sb = getServiceClient();
  if (!sb) return json({ error: '현재 온라인 접수를 받을 수 없습니다. 전화로 문의해 주세요.' }, 500);

  const form = await request.formData();
  const str = (k: string, max: number) => (form.get(k) || '').toString().trim().slice(0, max);

  // 스팸 방지: 사람에게 보이지 않는 칸이 채워져 있으면 접수한 척만 함
  if (str('website', 200)) return json({ ok: true });

  const name = str('name', 50);
  const phone = str('phone', 30);
  const password = (form.get('password') || '').toString();
  if (!name) return json({ error: '이름을 입력해 주세요.' }, 400);
  if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) return json({ error: '연락처를 정확히 입력해 주세요.' }, 400);
  if (password.length < 4 || password.length > 20)
    return json({ error: '비밀번호는 4~20자로 입력해 주세요.' }, 400);
  if (form.get('agree') !== 'on') return json({ error: '개인정보 수집·이용에 동의해 주세요.' }, 400);

  const { data, error } = await sb
    .from('consults')
    .insert({
      name,
      phone,
      space_type: str('type', 60),
      message: str('message', 3000),
      password_hash: hashPassword(password),
    })
    .select('id')
    .single();
  if (error) return json({ error: '접수 중 오류가 발생했습니다. 전화로 문의해 주세요.' }, 500);
  return json({ ok: true, id: data.id });
};
