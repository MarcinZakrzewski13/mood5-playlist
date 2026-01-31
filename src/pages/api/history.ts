import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  const supabase = locals.supabase;

  const { data: requests, error } = await supabase
    .from("requests")
    .select(
      `
      id,
      user_input,
      inferred_emotion,
      inferred_energy,
      goal,
      created_at,
      tracks (
        id,
        artist,
        title,
        tempo,
        mood_tag,
        spotify_url,
        youtube_url,
        explanation
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ requests: requests ?? [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  const supabase = locals.supabase;

  let body: { request_id?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.request_id) {
    return new Response(JSON.stringify({ error: "request_id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Tracks are cascade-deleted via FK constraint
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", body.request_id)
    .eq("user_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
