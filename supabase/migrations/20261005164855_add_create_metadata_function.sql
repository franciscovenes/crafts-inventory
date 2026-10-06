create or replace function create_masterdata(
    p_category text,
    p_payload text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    if not exists (
        select 1
        from profiles
        where profiles.id = auth.uid() 
            and profiles.active = true
            and profiles.role = 'admin'
    ) then
        raise exception 'Unauthorized master data creation';
    end if;

    if p_category not in (
        'models',
        'types',
        'artisans',
        'conditions',
        'states'
    ) then
        raise exception 'Invalid master data category: %', p_category;
    end if;

    execute format(
        'insert into %I (name)
        values ($1)',
        p_category
        )
    using p_payload;
    return true;
end;
$$;

REVOKE EXECUTE ON FUNCTION create_masterdata(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION create_masterdata(text, text) TO authenticated;