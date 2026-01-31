import { useState, useEffect } from "react";
import TrackList from "./TrackList";
import type { PlaylistTrack } from "../lib/validate-playlist";

interface HistoryRequest {
  id: string;
  user_input: string;
  inferred_emotion: string | null;
  inferred_energy: number | null;
  goal: string | null;
  created_at: string;
  tracks: PlaylistTrack[];
}

export default function HistoryList() {
  const [requests, setRequests] = useState<HistoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function handleDelete(requestId: string) {
    if (!confirm("Czy na pewno chcesz usunąć tę playlistę?")) return;

    setDeletingId(requestId);
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId }),
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      }
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="text-gray-400">Ładowanie...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Brak wygenerowanych playlist</p>
        <a
          href="/generate"
          className="text-indigo-400 hover:text-indigo-300 transition"
        >
          Wygeneruj pierwszą
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-white">{req.user_input}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {req.inferred_emotion && (
                  <span className="bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full">
                    {req.inferred_emotion}
                  </span>
                )}
                {req.inferred_energy && (
                  <span className="bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full">
                    Energia: {req.inferred_energy}/5
                  </span>
                )}
                {req.goal && (
                  <span className="bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">
                    {req.goal}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(req.created_at).toLocaleString("pl-PL")}
              </p>
            </div>
            <button
              onClick={() => handleDelete(req.id)}
              disabled={deletingId === req.id}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition shrink-0"
            >
              {deletingId === req.id ? "Usuwam..." : "Usuń"}
            </button>
          </div>

          {req.tracks && req.tracks.length > 0 && (
            <TrackList tracks={req.tracks} />
          )}
        </div>
      ))}
    </div>
  );
}
