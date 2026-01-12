-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create word_search_configs table for customizable word search games
CREATE TABLE IF NOT EXISTS public.word_search_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  stage INTEGER NOT NULL,
  language TEXT NOT NULL,
  words TEXT[] NOT NULL,
  grid_size INTEGER DEFAULT 15,
  time_limit INTEGER DEFAULT 180,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_games table for Kahoot-style games
CREATE TABLE IF NOT EXISTS public.quiz_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  time_per_question INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_game_id UUID NOT NULL REFERENCES public.quiz_games(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  time_limit INTEGER DEFAULT 20,
  points INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_answers table
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  answer_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_participants table
CREATE TABLE IF NOT EXISTS public.quiz_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_game_id UUID NOT NULL REFERENCES public.quiz_games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  current_question INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quiz_game_id, player_name)
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES public.quiz_participants(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES public.quiz_answers(id),
  time_taken INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_search_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Public policies for game access
CREATE POLICY "Anyone can view active word search configs"
  ON public.word_search_configs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active quiz games"
  ON public.quiz_games FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view quiz answers"
  ON public.quiz_answers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view quiz participants"
  ON public.quiz_participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert quiz participants"
  ON public.quiz_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their quiz participant"
  ON public.quiz_participants FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert quiz responses"
  ON public.quiz_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view quiz responses"
  ON public.quiz_responses FOR SELECT
  USING (true);

-- Admin policies (for admin panel - will need auth)
CREATE POLICY "Admins can do everything on word_search_configs"
  ON public.word_search_configs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can do everything on quiz_games"
  ON public.quiz_games FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can do everything on quiz_questions"
  ON public.quiz_questions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can do everything on quiz_answers"
  ON public.quiz_answers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_search_configs_code ON public.word_search_configs(game_code);
CREATE INDEX IF NOT EXISTS idx_quiz_games_code ON public.quiz_games(game_code);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_game ON public.quiz_questions(quiz_game_id, question_order);
CREATE INDEX IF NOT EXISTS idx_quiz_participants_game ON public.quiz_participants(quiz_game_id, total_score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_participant ON public.quiz_responses(participant_id);

-- Insert demo admin (password: admin123 - hash generated with bcrypt)
-- Note: In production, you should create proper authentication
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$rKzWQX0wVXYFq7EhxvZPEuKxWXJ.H4Sm0Z3N4MGYJPX8K8LV0Nx7m')
ON CONFLICT (username) DO NOTHING;
