import type { PlaylistTrack } from "../lib/validate-playlist";

interface Props {
  tracks: PlaylistTrack[];
}

const tempoColors: Record<string, string> = {
  slow: "bg-blue-900/50 text-blue-300",
  medium: "bg-yellow-900/50 text-yellow-300",
  fast: "bg-red-900/50 text-red-300",
};

export default function TrackList({ tracks }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">Twoja playlista</h2>
      {tracks.map((track, i) => (
        <div
          key={i}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-gray-500 text-sm mr-2">{i + 1}.</span>
              <span className="font-semibold text-white">{track.title}</span>
              <span className="text-gray-400"> — {track.artist}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <span
                className={`text-xs px-2 py-1 rounded-full ${tempoColors[track.tempo] || ""}`}
              >
                {track.tempo}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                {track.mood_tag}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400 italic">{track.explanation}</p>
          <div className="flex gap-3 text-sm">
            {track.spotify_url && (
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition"
              >
                Spotify
              </a>
            )}
            {track.youtube_url && (
              <a
                href={track.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 transition"
              >
                YouTube
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
