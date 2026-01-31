import { jsx, jsxs } from 'react/jsx-runtime';

function NavBar({ currentPath }) {
  const links = [
    { href: "/generate", label: "Generate" },
    { href: "/history", label: "Historia" }
  ];
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  }
  return /* @__PURE__ */ jsx("nav", { className: "bg-gray-900 border-b border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 flex items-center justify-between h-14", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-white text-lg", children: "Mood5" }),
      links.map((link) => /* @__PURE__ */ jsx(
        "a",
        {
          href: link.href,
          className: `text-sm transition ${currentPath === link.href ? "text-indigo-400" : "text-gray-400 hover:text-white"}`,
          children: link.label
        },
        link.href
      ))
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleLogout,
        className: "text-sm text-gray-400 hover:text-white transition",
        children: "Wyloguj"
      }
    )
  ] }) });
}

const tempoColors = {
  slow: "bg-blue-900/50 text-blue-300",
  medium: "bg-yellow-900/50 text-yellow-300",
  fast: "bg-red-900/50 text-red-300"
};
function TrackList({ tracks }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-white", children: "Twoja playlista" }),
    tracks.map((track, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm mr-2", children: [
                i + 1,
                "."
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-white", children: track.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
                " — ",
                track.artist
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-xs px-2 py-1 rounded-full ${tempoColors[track.tempo] || ""}`,
                  children: track.tempo
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300", children: track.mood_tag })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 italic", children: track.explanation }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-sm", children: [
            track.spotify_url && /* @__PURE__ */ jsx(
              "a",
              {
                href: track.spotify_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-green-400 hover:text-green-300 transition",
                children: "Spotify"
              }
            ),
            track.youtube_url && /* @__PURE__ */ jsx(
              "a",
              {
                href: track.youtube_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-red-400 hover:text-red-300 transition",
                children: "YouTube"
              }
            )
          ] })
        ]
      },
      i
    ))
  ] });
}

export { NavBar as N, TrackList as T };
