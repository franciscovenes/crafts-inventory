ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.items TO authenticated;
GRANT SELECT ON TABLE public.models TO authenticated;
GRANT SELECT ON TABLE public.types TO authenticated;
GRANT SELECT ON TABLE public.artisans TO authenticated;
GRANT SELECT ON TABLE public.conditions TO authenticated;
GRANT SELECT ON TABLE public.states TO authenticated;
GRANT SELECT ON TABLE public.colors TO authenticated;
GRANT SELECT ON TABLE public.item_colors TO authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;

CREATE POLICY "Allow authenticated read its own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.profiles.id = auth.uid());

CREATE POLICY "Allow authenticated read items"
ON public.items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read models"
ON public.models
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read types"
ON public.types
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read artisans"
ON public.artisans
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read conditions"
ON public.conditions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read states"
ON public.states
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read colors"
ON public.colors
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);

CREATE POLICY "Allow authenticated read item_colors"
ON public.item_colors
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE 
            public.profiles.id = auth.uid() AND
            public.profiles.active = true 
    )
);
