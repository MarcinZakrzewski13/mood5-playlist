import { e as createComponent, k as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_D7ABcXeN.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html> <head><meta charset="UTF-8"><title>Authenticating...</title>${renderHead()}</head> <body> <p>Authenticating...</p> ${renderScript($$result, "/home/mzak/mood5-playlist/src/pages/auth/callback.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/mzak/mood5-playlist/src/pages/auth/callback.astro", void 0);

const $$file = "/home/mzak/mood5-playlist/src/pages/auth/callback.astro";
const $$url = "/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
