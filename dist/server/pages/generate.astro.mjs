import { e as createComponent, n as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D7ABcXeN.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BYKacKdJ.mjs';
import { T as TrackList, N as NavBar } from '../chunks/TrackList_DPynqYTa.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

function GenerateForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  async function handleGenerate() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: trimmed })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Wystąpił błąd");
        return;
      }
      setResult(data);
    } catch {
      setError("Błąd połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: "Opisz swój nastrój i cel, np. 'Jestem zmęczony, ale chcę iść pobiegać' lub 'Potrzebuję skupienia do kodowania'",
          rows: 4,
          maxLength: 1e3,
          disabled: loading,
          className: "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-50"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
          input.length,
          "/1000"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleGenerate,
            disabled: loading || !input.trim(),
            className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition",
            children: loading ? "Generuję..." : "Generate"
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg", children: error }),
    result && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gray-800/50 border border-gray-700 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full", children: result.inference.emotion }),
        /* @__PURE__ */ jsxs("span", { className: "bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full", children: [
          "Cel: ",
          result.inference.goal
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full", children: [
          "Energia: ",
          result.inference.energy,
          "/5"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full", children: result.inference.vocal_style })
      ] }) }),
      /* @__PURE__ */ jsx(TrackList, { tracks: result.tracks })
    ] })
  ] });
}

const $$Generate = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mood5 \u2013 Generate" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-950"> ${renderComponent($$result2, "NavBar", NavBar, { "currentPath": "/generate", "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/mzak/mood5-playlist/src/components/NavBar", "client:component-export": "default" })} <main class="max-w-3xl mx-auto px-4 py-8"> <h1 class="text-2xl font-bold text-white mb-6">Wygeneruj playlistę</h1> ${renderComponent($$result2, "GenerateForm", GenerateForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/mzak/mood5-playlist/src/components/GenerateForm", "client:component-export": "default" })} </main> </div> ` })}`;
}, "/home/mzak/mood5-playlist/src/pages/generate.astro", void 0);

const $$file = "/home/mzak/mood5-playlist/src/pages/generate.astro";
const $$url = "/generate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Generate,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
