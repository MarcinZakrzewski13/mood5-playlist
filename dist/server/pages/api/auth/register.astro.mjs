import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const formData = await request.json();
  const { email, password } = formData;
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email i hasło są wymagane" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (password.length < 6) {
    return new Response(JSON.stringify({ error: "Hasło musi mieć min. 6 znaków" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabase = createClient(
    undefined                            ,
    undefined                            
  );
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (data.session) {
    const response = new Response(
      JSON.stringify({ success: true, message: "Konto utworzone i zalogowano" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    response.headers.append(
      "Set-Cookie",
      `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
    );
    response.headers.append(
      "Set-Cookie",
      `sb-refresh-token=${data.session.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    return response;
  }
  return new Response(
    JSON.stringify({ success: true, message: "Sprawdź email, aby potwierdzić konto" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
