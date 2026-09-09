create or replace function create_item(
    p_item jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_item_id integer;
begin
    if not exists (
        select 1
        from profiles
        where profiles.id = auth.uid() and profiles.active = true
    ) then
        raise exception 'Unauthorized item creation';  
    end if;

    insert into items (
        model_id,
        type_id,
        artisan_id,
        state_id,
        condition_id,
        price,
        length_cm,
        width_cm,
        production_hours,
        location
    )
    values (
        (p_item->>'model_id')::integer,
        (p_item->>'type_id')::integer,
        (p_item->>'artisan_id')::integer,
        (p_item->>'state_id')::integer,
        (p_item->>'condition_id')::integer,
        (p_item->>'price')::numeric,
        (p_item->>'length_cm')::numeric,
        (p_item->>'width_cm')::numeric,
        (p_item->>'production_hours')::numeric,
        p_item->>'location'
    )
    returning id INTO v_item_id;

    insert into item_colors (item_id, color_id)
    select
        v_item_id,
        value::integer
    from jsonb_array_elements_text(coalesce(p_item->'color_ids', '[]'::jsonb));
    return v_item_id;
end;
$$;

GRANT EXECUTE ON FUNCTION create_item(jsonb) TO authenticated;
