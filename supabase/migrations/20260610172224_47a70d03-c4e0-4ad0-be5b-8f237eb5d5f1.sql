
-- Anon never needs to call has_role; split product visibility instead
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM anon;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
