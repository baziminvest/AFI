CREATE TABLE public.investor_profiles (
  user_id uuid PRIMARY KEY,
  initial_capital numeric NOT NULL DEFAULT 1000 CHECK (initial_capital > 0),
  base_currency text NOT NULL DEFAULT 'USD',
  objective text NOT NULL DEFAULT 'balanced',
  horizon_years integer NOT NULL DEFAULT 5 CHECK (horizon_years BETWEEN 1 AND 50),
  risk_tolerance smallint NOT NULL DEFAULT 3 CHECK (risk_tolerance BETWEEN 1 AND 6),
  risk_capacity smallint NOT NULL DEFAULT 3 CHECK (risk_capacity BETWEEN 1 AND 6),
  liquidity_need text NOT NULL DEFAULT 'medium',
  income_required boolean NOT NULL DEFAULT false,
  experience text NOT NULL DEFAULT 'some',
  preferred_assets text[] NOT NULL DEFAULT ARRAY['equities','etfs','cash'],
  restrictions text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investor_profiles TO authenticated;
GRANT ALL ON public.investor_profiles TO service_role;
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage investor profile" ON public.investor_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.paper_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'AFI internal test portfolio',
  base_currency text NOT NULL DEFAULT 'USD',
  starting_cash numeric NOT NULL DEFAULT 1000 CHECK (starting_cash > 0),
  cash_balance numeric NOT NULL DEFAULT 1000,
  risk_profile smallint NOT NULL DEFAULT 3 CHECK (risk_profile BETWEEN 1 AND 6),
  simulation_started boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paper_portfolios TO authenticated;
GRANT ALL ON public.paper_portfolios TO service_role;
ALTER TABLE public.paper_portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage paper portfolios" ON public.paper_portfolios FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX paper_portfolios_user_idx ON public.paper_portfolios(user_id);