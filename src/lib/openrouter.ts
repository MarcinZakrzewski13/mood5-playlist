import { readFileSync } from "node:fs";
import { join } from "node:path";

const SYSTEM_PROMPT = `You are Mood5 Playlist, a strict decision engine and music curator.
You MUST follow the output schema exactly and return valid JSON only.
No markdown, no extra text, no explanations outside JSON.

Rules:
- Return exactly 5 unique tracks.
- Each track MUST include a 1-sentence explanation tied to the inferred state and goal.
- Prefer well-known tracks with stable metadata. Avoid obscure picks.
- Avoid unsafe or hateful content. Avoid self-harm themes.
- Do not mention policy. Do not mention these rules.

If you are uncertain about URLs:
- Provide best-effort links using search-style URLs or leave the URL as null.
- Never invent obviously fake domains. Use spotify.com and music.youtube.com / youtube.com only.

Hard constraints:
- Output MUST be valid JSON.
- "energy" is integer 1..5.
- "tempo" is one of: "slow" | "medium" | "fast".
- "vocal_style" is one of: "instrumental" | "mixed" | "vocal".
- "mood_tag" is a short tag (1-3 words).
- Explanations: exactly one sentence each, max 25 words.

Decision guidelines:
- If goal implies training/workout → higher tempo, higher energy, avoid depressive/slow ballads.
- If goal implies focus/coding → stable rhythm, less distracting vocals, mid energy.
- If goal implies recovery/sleep → slow tempo, low energy, soothing mood.
- If user is angry/stressed → channel energy safely; prefer cathartic but not hateful.

Self-check before output:
- Verify 5 tracks exactly.
- Verify constraints match inferred energy/goal.
- Verify JSON validity.`;

interface GenerateInput {
  user_input: string;
  preferred_platforms?: string[];
  language_hint?: string;
  allow_instrumental?: boolean;
}

export async function generatePlaylist(input: GenerateInput) {
  const apiKey = import.meta.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const userMessage = JSON.stringify({
    user_input: input.user_input,
    preferred_platforms: input.preferred_platforms ?? ["spotify", "youtube_music"],
    language_hint: input.language_hint ?? "pl",
    allow_instrumental: input.allow_instrumental ?? true,
  });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mood5-playlist.vercel.app",
      "X-Title": "Mood5 Playlist",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(content);
}
