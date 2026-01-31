import type { APIRoute } from "astro";

export const POST: APIRoute = async () => {
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  // Clear auth cookies
  response.headers.append(
    "Set-Cookie",
    "sb-access-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  response.headers.append(
    "Set-Cookie",
    "sb-refresh-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );

  return response;
};
