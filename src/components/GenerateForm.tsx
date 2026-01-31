import { useState } from "react";
import type {
  PlaylistTrack,
  PlaylistInference,
} from "../lib/validate-playlist";
import TrackList from "./TrackList";

interface GenerateResult {
  request_id: string;
  inference: PlaylistInference;
  tracks: PlaylistTrack[];
}

export default function GenerateForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

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
        body: JSON.stringify({ user_input: trimmed }),
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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Opisz swój nastrój i cel, np. 'Jestem zmęczony, ale chcę iść pobiegać' lub 'Potrzebuję skupienia do kodowania'"
          rows={4}
          maxLength={1000}
          disabled={loading}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{input.length}/1000</span>
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            {loading ? "Generuję..." : "Generate"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">
                {result.inference.emotion}
              </span>
              <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full">
                Cel: {result.inference.goal}
              </span>
              <span className="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full">
                Energia: {result.inference.energy}/5
              </span>
              <span className="bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full">
                {result.inference.vocal_style}
              </span>
            </div>
          </div>

          <TrackList tracks={result.tracks} />
        </div>
      )}
    </div>
  );
}
