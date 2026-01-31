import type { APIRoute } from "astro";
import { generatePlaylist } from "../../lib/openrouter";
import { validatePlaylistResponse } from "../../lib/validate-playlist";

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  const supabase = locals.supabase;

  let body: { user_input?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userInput = body.user_input?.trim();
  if (!userInput) {
    return new Response(JSON.stringify({ error: "user_input is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (userInput.length > 1000) {
    return new Response(
      JSON.stringify({ error: "user_input is too long (max 1000 chars)" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Call AI
  let rawResponse: unknown;
  try {
    rawResponse = await generatePlaylist({ user_input: userInput });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return new Response(JSON.stringify({ error: `AI error: ${message}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate response
  let playlist;
  try {
    playlist = validatePlaylistResponse(rawResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Validation failed";
    return new Response(
      JSON.stringify({
        error: `Validation error: ${message}`,
        raw: rawResponse,
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  // Save to DB
  const { data: requestRow, error: insertError } = await supabase
    .from("requests")
    .insert({
      user_id: user.id,
      user_input: userInput,
      inferred_emotion: playlist.inference.emotion,
      inferred_energy: playlist.inference.energy,
      goal: playlist.inference.goal,
    })
    .select("id")
    .single();

  if (insertError || !requestRow) {
    return new Response(
      JSON.stringify({
        error: `DB error: ${insertError?.message ?? "Unknown"}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
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
    explanation: track.explanation,
  }));

  const { error: tracksError } = await supabase
    .from("tracks")
    .insert(tracksToInsert);

  if (tracksError) {
    return new Response(
      JSON.stringify({
        error: `DB error saving tracks: ${tracksError.message}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      request_id: requestRow.id,
      inference: playlist.inference,
      tracks: playlist.tracks,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
