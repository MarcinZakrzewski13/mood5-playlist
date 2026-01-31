import { e as createComponent, n as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D7ABcXeN.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BYKacKdJ.mjs';
import { T as TrackList, N as NavBar } from '../chunks/TrackList_DPynqYTa.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

function HistoryList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  useEffect(() => {
    fetchHistory();
  }, []);
  async function fetchHistory() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Błąd ładowania");
        return;
      }
      setRequests(data.requests);
    } catch {
      setError("Błąd połączenia");
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(requestId) {
    if (!confirm("Czy na pewno chcesz usunąć tę playlistę?")) return;
    setDeletingId(requestId);
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId })
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Ładowanie..." });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg", children: error });
  }
  if (requests.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Brak wygenerowanych playlist" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/generate",
          className: "text-indigo-400 hover:text-indigo-300 transition",
          children: "Wygeneruj pierwszą"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: requests.map((req) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-white", children: req.user_input }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
              req.inferred_emotion && /* @__PURE__ */ jsx("span", { className: "bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full", children: req.inferred_emotion }),
              req.inferred_energy && /* @__PURE__ */ jsxs("span", { className: "bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full", children: [
                "Energia: ",
                req.inferred_energy,
                "/5"
              ] }),
              req.goal && /* @__PURE__ */ jsx("span", { className: "bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full", children: req.goal })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: new Date(req.created_at).toLocaleString("pl-PL") })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(req.id),
              disabled: deletingId === req.id,
              className: "text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition shrink-0",
              children: deletingId === req.id ? "Usuwam..." : "Usuń"
            }
          )
        ] }),
        req.tracks && req.tracks.length > 0 && /* @__PURE__ */ jsx(TrackList, { tracks: req.tracks })
      ]
    },
    req.id
  )) });
}

const $$History = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mood5 \u2013 Historia" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-950"> ${renderComponent($$result2, "NavBar", NavBar, { "currentPath": "/history", "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/mzak/mood5-playlist/src/components/NavBar", "client:component-export": "default" })} <main class="max-w-3xl mx-auto px-4 py-8"> <h1 class="text-2xl font-bold text-white mb-6">Historia playlist</h1> ${renderComponent($$result2, "HistoryList", HistoryList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/mzak/mood5-playlist/src/components/HistoryList", "client:component-export": "default" })} </main> </div> ` })}`;
}, "/home/mzak/mood5-playlist/src/pages/history.astro", void 0);

const $$file = "/home/mzak/mood5-playlist/src/pages/history.astro";
const $$url = "/history";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$History,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
