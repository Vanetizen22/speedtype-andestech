-- competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL DEFAULT 'Competencia SpeedType'
);

-- participants table
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  time_seconds DOUBLE PRECISION,
  errors INT NOT NULL DEFAULT 0,
  wpm INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (no auth required for this app)
CREATE POLICY "allow_all_competitions" ON public.competitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_participants" ON public.participants FOR ALL USING (true) WITH CHECK (true);
