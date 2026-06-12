
-- 1. Remove duplicate role column from profiles (source of truth = user_roles)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 2. Update signup trigger to not reference removed column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 3. Restrict profile visibility — users see only their own row; admins see all
DROP POLICY IF EXISTS "Profiles are viewable by everyone authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR private.has_role(auth.uid(), 'admin'));

-- 4. Lock user_roles writes to admins only (defense in depth against self-promotion)
DROP POLICY IF EXISTS "Users insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated insert own role" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- 5. Hide stock_quantity from anonymous visitors via column-level grants
REVOKE SELECT ON public.products FROM anon;
GRANT SELECT (id, name, description, price, category, image_url, is_active, created_at)
  ON public.products TO anon;
