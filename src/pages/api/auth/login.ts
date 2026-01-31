import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.json();
  const { email, password } = formData;

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email i hasło są wymagane" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  // Set auth cookies
  const { access_token, refresh_token } = data.session;
  response.headers.append(
    "Set-Cookie",
    `sb-access-token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
  );
  response.headers.append(
    "Set-Cookie",
    `sb-refresh-token=${refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
  );

  return response;
};
