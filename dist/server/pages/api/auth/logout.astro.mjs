export { renderers } from '../../../renderers.mjs';

const POST = async () => {
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
