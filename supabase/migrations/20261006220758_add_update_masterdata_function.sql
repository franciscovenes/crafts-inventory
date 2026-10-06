create or replace function update_masterdata(
    p_category text,
    p_id integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    affected_rows integer;
begin
    if not exists (
        select 1
        from profiles
        where profiles.id = auth.uid() 
            and profiles.active = true
            and profiles.role = 'admin'
    ) then
        raise exception 'Unauthorized masterdata update';
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
        'update %I 
        set active = not active
        where id = $1',
        p_category
    )
    using p_id;

    get diagnostics affected_rows = row_count;

    if affected_rows = 0 then
        raise exception 'Master data entry in % with id % does not exist.',
            p_category, p_id;
    end if;
end;
$$;

REVOKE EXECUTE ON FUNCTION update_masterdata(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION update_masterdata(text, integer) TO authenticated;