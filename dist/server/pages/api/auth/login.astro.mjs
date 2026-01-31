import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, redirect }) => {
  const formData = await request.json();
  const { email, password } = formData;
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email i hasło są wymagane" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabase = createClient(
    undefined                            ,
    undefined                            
  );
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
  const { access_token, refresh_token } = data.session;
  response.headers.append(
    "Set-Cookie",
    `sb-access-token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
  );
  response.headers.append(
    "Set-Cookie",
    `sb-refresh-token=${refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  );
  return response;
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
