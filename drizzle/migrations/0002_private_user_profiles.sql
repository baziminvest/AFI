CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL DEFAULT '',
 avatar_url text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_read_own ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE FUNCTION public.afi_create_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$ BEGIN INSERT INTO public.profiles(id, display_name) VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'display_name', '')) ON CONFLICT (id) DO NOTHING; RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.afi_create_profile() FROM PUBLIC;
CREATE TRIGGER afi_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.afi_create_profile();
INSERT INTO public.profiles(id, display_name) SELECT id, coalesce(raw_user_meta_data->>'display_name', '') FROM auth.users ON CONFLICT (id) DO NOTHING;
CREATE FUNCTION public.afi_profile_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER afi_profile_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.afi_profile_updated_at();