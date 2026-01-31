export interface PlaylistInference {
  emotion: string;
  goal: string;
  energy: number;
  constraints: {
    avoid: string[];
    prefer: string[];
  };
  vocal_style: "instrumental" | "mixed" | "vocal";
}

export interface PlaylistTrack {
  artist: string;
  title: string;
  tempo: "slow" | "medium" | "fast";
  mood_tag: string;
  spotify_url: string | null;
  youtube_url: string | null;
  explanation: string;
}

export interface PlaylistResponse {
  inference: PlaylistInference;
  tracks: PlaylistTrack[];
}

const VALID_TEMPOS = ["slow", "medium", "fast"] as const;
const VALID_VOCAL_STYLES = ["instrumental", "mixed", "vocal"] as const;

export function validatePlaylistResponse(data: unknown): PlaylistResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Response is not a valid object");
  }

  const obj = data as Record<string, unknown>;

  // Validate inference
  if (!obj.inference || typeof obj.inference !== "object") {
    throw new Error("Missing or invalid 'inference' field");
  }

  const inference = obj.inference as Record<string, unknown>;

  if (typeof inference.emotion !== "string" || !inference.emotion) {
    throw new Error("Missing inference.emotion");
  }
  if (typeof inference.goal !== "string" || !inference.goal) {
    throw new Error("Missing inference.goal");
  }
  if (
    typeof inference.energy !== "number" ||
    !Number.isInteger(inference.energy) ||
    inference.energy < 1 ||
    inference.energy > 5
  ) {
    throw new Error(`Invalid inference.energy: must be integer 1-5, got ${inference.energy}`);
  }
  if (
    typeof inference.vocal_style !== "string" ||
    !VALID_VOCAL_STYLES.includes(inference.vocal_style as typeof VALID_VOCAL_STYLES[number])
  ) {
    throw new Error(`Invalid inference.vocal_style: ${inference.vocal_style}`);
  }

  // Validate tracks
  if (!Array.isArray(obj.tracks)) {
    throw new Error("Missing or invalid 'tracks' field");
  }
  if (obj.tracks.length !== 5) {
    throw new Error(`Expected exactly 5 tracks, got ${obj.tracks.length}`);
  }

  const tracks: PlaylistTrack[] = obj.tracks.map((track: unknown, i: number) => {
    if (!track || typeof track !== "object") {
      throw new Error(`Track ${i} is not a valid object`);
    }
    const t = track as Record<string, unknown>;

    if (typeof t.artist !== "string" || !t.artist) {
      throw new Error(`Track ${i}: missing artist`);
    }
    if (typeof t.title !== "string" || !t.title) {
      throw new Error(`Track ${i}: missing title`);
    }
    if (typeof t.tempo !== "string" || !VALID_TEMPOS.includes(t.tempo as typeof VALID_TEMPOS[number])) {
      throw new Error(`Track ${i}: invalid tempo "${t.tempo}"`);
    }
    if (typeof t.mood_tag !== "string" || !t.mood_tag) {
      throw new Error(`Track ${i}: missing mood_tag`);
    }
    if (typeof t.explanation !== "string" || !t.explanation) {
      throw new Error(`Track ${i}: missing explanation`);
    }

    return {
      artist: t.artist,
      title: t.title,
      tempo: t.tempo as PlaylistTrack["tempo"],
      mood_tag: t.mood_tag,
      spotify_url: typeof t.spotify_url === "string" ? t.spotify_url : null,
      youtube_url: typeof t.youtube_url === "string" ? t.youtube_url : null,
      explanation: t.explanation,
    };
  });

  return {
    inference: {
      emotion: inference.emotion as string,
      goal: inference.goal as string,
      energy: inference.energy as number,
      constraints: {
        avoid: Array.isArray((inference.constraints as Record<string, unknown>)?.avoid)
          ? ((inference.constraints as Record<string, unknown>).avoid as string[])
          : [],
        prefer: Array.isArray((inference.constraints as Record<string, unknown>)?.prefer)
          ? ((inference.constraints as Record<string, unknown>).prefer as string[])
          : [],
      },
      vocal_style: inference.vocal_style as PlaylistInference["vocal_style"],
    },
    tracks,
  };
}
