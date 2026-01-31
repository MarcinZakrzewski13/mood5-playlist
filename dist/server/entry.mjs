import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C3WE_bAX.mjs';
import { manifest } from './manifest_DZ_2-IGR.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/login.astro.mjs');
const _page2 = () => import('./pages/api/auth/logout.astro.mjs');
const _page3 = () => import('./pages/api/auth/register.astro.mjs');
const _page4 = () => import('./pages/api/generate.astro.mjs');
const _page5 = () => import('./pages/api/history.astro.mjs');
const _page6 = () => import('./pages/auth/callback.astro.mjs');
const _page7 = () => import('./pages/auth/login.astro.mjs');
const _page8 = () => import('./pages/generate.astro.mjs');
const _page9 = () => import('./pages/history.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/auth/login.ts", _page1],
    ["src/pages/api/auth/logout.ts", _page2],
    ["src/pages/api/auth/register.ts", _page3],
    ["src/pages/api/generate.ts", _page4],
    ["src/pages/api/history.ts", _page5],
    ["src/pages/auth/callback.astro", _page6],
    ["src/pages/auth/login.astro", _page7],
    ["src/pages/generate.astro", _page8],
    ["src/pages/history.astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///home/mzak/mood5-playlist/dist/client/",
    "server": "file:///home/mzak/mood5-playlist/dist/server/",
    "host": false,
    "port": 3000,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
