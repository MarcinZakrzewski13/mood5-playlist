import { describe, it, expect } from "vitest";
import { validatePlaylistResponse } from "../src/lib/validate-playlist";

// Mock AI response simulating what OpenRouter would return
const mockAIResponse = {
  inference: {
    emotion: "zmęczenie z determinacją",
    goal: "trening biegowy",
    energy: 4,
    constraints: {
      avoid: ["ballady", "wolne utwory", "depresyjne"],
      prefer: ["energetyczne", "szybkie tempo", "motywujące"],
    },
    vocal_style: "vocal",
  },
  tracks: [
    {
      artist: "Eminem",
      title: "Lose Yourself",
      tempo: "fast",
      mood_tag: "motivation",
      spotify_url: "https://open.spotify.com/track/5Z01UMMf7V1o0MzF86s6WJ",
      youtube_url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s",
      explanation:
        "Intense motivational rap that pushes through fatigue during a run.",
    },
    {
      artist: "Survivor",
      title: "Eye of the Tiger",
      tempo: "fast",
      mood_tag: "power",
      spotify_url: null,
      youtube_url: "https://www.youtube.com/watch?v=btPJPFnesV4",
      explanation:
        "Classic workout anthem with driving rhythm perfect for running.",
    },
    {
      artist: "Kanye West",
      title: "Stronger",
      tempo: "medium",
      mood_tag: "determination",
      spotify_url: "https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3",
      youtube_url: null,
      explanation:
        "Electronic-infused hip-hop channeling tiredness into strength.",
    },
    {
      artist: "Imagine Dragons",
      title: "Radioactive",
      tempo: "medium",
      mood_tag: "energy",
      spotify_url: null,
      youtube_url: "https://www.youtube.com/watch?v=ktvTqknDobU",
      explanation:
        "Powerful anthem with building energy ideal for pushing limits.",
    },
    {
      artist: "The Prodigy",
      title: "Firestarter",
      tempo: "fast",
      mood_tag: "adrenaline",
      spotify_url: null,
      youtube_url: "https://www.youtube.com/watch?v=wmin5WkOuPw",
      explanation:
        "High-energy electronic track to boost adrenaline during exercise.",
    },
  ],
};

describe("validatePlaylistResponse", () => {
  it("validates a correct AI response with 5 tracks", () => {
    const result = validatePlaylistResponse(mockAIResponse);

    expect(result.tracks).toHaveLength(5);
    expect(result.inference.energy).toBeGreaterThanOrEqual(1);
    expect(result.inference.energy).toBeLessThanOrEqual(5);
  });

  it("validates energy is within range 1-5", () => {
    const result = validatePlaylistResponse(mockAIResponse);
    expect(result.inference.energy).toBe(4);
  });

  it("validates tempo values are valid enums", () => {
    const result = validatePlaylistResponse(mockAIResponse);
    const validTempos = ["slow", "medium", "fast"];
    for (const track of result.tracks) {
      expect(validTempos).toContain(track.tempo);
    }
  });

  it("rejects response with wrong number of tracks", () => {
    const badResponse = {
      ...mockAIResponse,
      tracks: mockAIResponse.tracks.slice(0, 3),
    };
    expect(() => validatePlaylistResponse(badResponse)).toThrow(
      "Expected exactly 5 tracks",
    );
  });

  it("rejects response with invalid energy value", () => {
    const badResponse = {
      ...mockAIResponse,
      inference: { ...mockAIResponse.inference, energy: 7 },
    };
    expect(() => validatePlaylistResponse(badResponse)).toThrow(
      "Invalid inference.energy",
    );
  });

  it("rejects response with invalid tempo", () => {
    const badResponse = {
      ...mockAIResponse,
      tracks: mockAIResponse.tracks.map((t, i) =>
        i === 0 ? { ...t, tempo: "allegro" } : t,
      ),
    };
    expect(() => validatePlaylistResponse(badResponse)).toThrow(
      'invalid tempo "allegro"',
    );
  });

  it("ensures training-oriented input produces high energy and no slow ballads", () => {
    const result = validatePlaylistResponse(mockAIResponse);

    // For training goal, energy should be >= 3
    expect(result.inference.energy).toBeGreaterThanOrEqual(3);

    // No slow tracks for workout
    const slowTracks = result.tracks.filter((t) => t.tempo === "slow");
    expect(slowTracks).toHaveLength(0);
  });

  it("allows nullable spotify_url and youtube_url", () => {
    const result = validatePlaylistResponse(mockAIResponse);

    // Some tracks have null URLs, which is valid
    const tracksWithNullSpotify = result.tracks.filter(
      (t) => t.spotify_url === null,
    );
    expect(tracksWithNullSpotify.length).toBeGreaterThan(0);
  });

  it("rejects non-object input", () => {
    expect(() => validatePlaylistResponse(null)).toThrow();
    expect(() => validatePlaylistResponse("string")).toThrow();
    expect(() => validatePlaylistResponse(42)).toThrow();
  });
});
