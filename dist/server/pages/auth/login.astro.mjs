import { e as createComponent, f as createAstro, n as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D7ABcXeN.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYKacKdJ.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const cookieHeader = Astro2.request.headers.get("cookie") ?? "";
  const accessToken = cookieHeader.match(/sb-access-token=([^;]+)/)?.[1];
  if (accessToken) {
    const supabase = createClient(
      undefined                            ,
      undefined                            
    );
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (user) {
      return Astro2.redirect("/generate");
    }
  }
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mood5 – Login" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-gray-950 px-4"> <div class="w-full max-w-sm space-y-6"> <div class="text-center"> <h1 class="text-3xl font-bold text-white">Mood5 Playlist</h1> <p class="text-gray-400 mt-2">Zaloguj się, aby generować playlisty</p> </div> ${error && renderTemplate`<div class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded"> ${decodeURIComponent(error)} </div>`} <div class="space-y-4"> <input id="email" type="email" placeholder="Email" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"> <input id="password" type="password" placeholder="Hasło (min. 6 znaków)" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"> <button id="btn-login" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition">
Zaloguj się
</button> <button id="btn-register" class="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg border border-gray-700 transition">
Zarejestruj się
</button> <p id="auth-message" class="text-sm text-center text-gray-400 hidden"></p> </div> </div> </div> ` })} ${renderScript($$result, "/home/mzak/mood5-playlist/src/pages/auth/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/mzak/mood5-playlist/src/pages/auth/login.astro", void 0);
const $$file = "/home/mzak/mood5-playlist/src/pages/auth/login.astro";
const $$url = "/auth/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
