export { renderers } from '../../renderers.mjs';

async function generatePlaylist(input) {
  {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }
}

const VALID_TEMPOS = ["slow", "medium", "fast"];
const VALID_VOCAL_STYLES = ["instrumental", "mixed", "vocal"];
function validatePlaylistResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Response is not a valid object");
  }
  const obj = data;
  if (!obj.inference || typeof obj.inference !== "object") {
    throw new Error("Missing or invalid 'inference' field");
  }
  const inference = obj.inference;
  if (typeof inference.emotion !== "string" || !inference.emotion) {
    throw new Error("Missing inference.emotion");
  }
  if (typeof inference.goal !== "string" || !inference.goal) {
    throw new Error("Missing inference.goal");
  }
  if (typeof inference.energy !== "number" || !Number.isInteger(inference.energy) || inference.energy < 1 || inference.energy > 5) {
    throw new Error(`Invalid inference.energy: must be integer 1-5, got ${inference.energy}`);
  }
  if (typeof inference.vocal_style !== "string" || !VALID_VOCAL_STYLES.includes(inference.vocal_style)) {
    throw new Error(`Invalid inference.vocal_style: ${inference.vocal_style}`);
  }
  if (!Array.isArray(obj.tracks)) {
    throw new Error("Missing or invalid 'tracks' field");
  }
  if (obj.tracks.length !== 5) {
    throw new Error(`Expected exactly 5 tracks, got ${obj.tracks.length}`);
  }
  const tracks = obj.tracks.map((track, i) => {
    if (!track || typeof track !== "object") {
      throw new Error(`Track ${i} is not a valid object`);
    }
    const t = track;
    if (typeof t.artist !== "string" || !t.artist) {
      throw new Error(`Track ${i}: missing artist`);
    }
    if (typeof t.title !== "string" || !t.title) {
      throw new Error(`Track ${i}: missing title`);
    }
    if (typeof t.tempo !== "string" || !VALID_TEMPOS.includes(t.tempo)) {
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
      tempo: t.tempo,
      mood_tag: t.mood_tag,
      spotify_url: typeof t.spotify_url === "string" ? t.spotify_url : null,
      youtube_url: typeof t.youtube_url === "string" ? t.youtube_url : null,
      explanation: t.explanation
    };
  });
  return {
    inference: {
      emotion: inference.emotion,
      goal: inference.goal,
      energy: inference.energy,
      constraints: {
        avoid: Array.isArray(inference.constraints?.avoid) ? inference.constraints.avoid : [],
        prefer: Array.isArray(inference.constraints?.prefer) ? inference.constraints.prefer : []
      },
      vocal_style: inference.vocal_style
    },
    tracks
  };
}

const POST = async ({ request, locals }) => {
  const user = locals.user;
  const supabase = locals.supabase;
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const userInput = body.user_input?.trim();
  if (!userInput) {
    return new Response(JSON.stringify({ error: "user_input is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (userInput.length > 1e3) {
    return new Response(JSON.stringify({ error: "user_input is too long (max 1000 chars)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let rawResponse;
  try {
    rawResponse = await generatePlaylist({ user_input: userInput });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return new Response(JSON.stringify({ error: `AI error: ${message}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
  let playlist;
  try {
    playlist = validatePlaylistResponse(rawResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Validation failed";
    return new Response(
      JSON.stringify({ error: `Validation error: ${message}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
  const { data: requestRow, error: insertError } = await supabase.from("requests").insert({
    user_id: user.id,
    user_input: userInput,
    inferred_emotion: playlist.inference.emotion,
    inferred_energy: playlist.inference.energy,
    goal: playlist.inference.goal
  }).select("id").single();
  if (insertError || !requestRow) {
    return new Response(
      JSON.stringify({ error: `DB error: ${insertError?.message ?? "Unknown"}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const tracksToInsert = playlist.tracks.map((track) => ({
    request_id: requestRow.id,
    artist: track.artist,
    title: track.title,
    tempo: track.tempo,
    mood_tag: track.mood_tag,
    spotify_url: track.spotify_url,
    youtube_url: track.youtube_url,
    explanation: track.explanation
  }));
  const { error: tracksError } = await supabase.from("tracks").insert(tracksToInsert);
  if (tracksError) {
    return new Response(
      JSON.stringify({ error: `DB error saving tracks: ${tracksError.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(
    JSON.stringify({
      request_id: requestRow.id,
      inference: playlist.inference,
      tracks: playlist.tracks
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
