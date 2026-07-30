ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_colors ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.items TO anon;
GRANT SELECT ON TABLE public.models TO anon;
GRANT SELECT ON TABLE public.types TO anon;
GRANT SELECT ON TABLE public.artisans TO anon;
GRANT SELECT ON TABLE public.conditions TO anon;
GRANT SELECT ON TABLE public.states TO anon;
GRANT SELECT ON TABLE public.colors TO anon;
GRANT SELECT ON TABLE public.item_colors TO anon;

CREATE POLICY "Allow anon read items"
ON public.items
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read models"
ON public.models
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read types"
ON public.types
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read artisans"
ON public.artisans
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read conditions"
ON public.conditions
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read states"
ON public.states
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read colors"
ON public.colors
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon read item_colors"
ON public.item_colors
FOR SELECT
TO anon
USING (true);
