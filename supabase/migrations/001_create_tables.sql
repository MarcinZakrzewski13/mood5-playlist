-- Mood5 Playlist: requests + tracks tables with RLS

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_input TEXT NOT NULL,
  inferred_emotion TEXT,
  inferred_energy INTEGER CHECK (inferred_energy BETWEEN 1 AND 5),
  goal TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  artist TEXT NOT NULL,
  title TEXT NOT NULL,
  tempo TEXT NOT NULL CHECK (tempo IN ('slow', 'medium', 'fast')),
  mood_tag TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  explanation TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_request_id ON tracks(request_id);

-- Enable RLS
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- RLS policies for requests: users can only access their own data
CREATE POLICY "Users can view own requests"
  ON requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests"
  ON requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own requests"
  ON requests FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for tracks: users can access tracks through their requests
CREATE POLICY "Users can view tracks of own requests"
  ON tracks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = tracks.request_id
      AND requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tracks for own requests"
  ON tracks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = tracks.request_id
      AND requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tracks of own requests"
  ON tracks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = tracks.request_id
      AND requests.user_id = auth.uid()
    )
  );
