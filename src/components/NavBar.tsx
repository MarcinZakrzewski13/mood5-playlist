interface Props {
  currentPath: string;
}

export default function NavBar({ currentPath }: Props) {
  const links = [
    { href: "/generate", label: "Generate" },
    { href: "/history", label: "Historia" },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="font-bold text-white text-lg">Mood5</span>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition ${
                currentPath === link.href
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Wyloguj
        </button>
      </div>
    </nav>
  );
}
