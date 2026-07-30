create or replace function update_item(
    p_item_id integer,
    p_item jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin


    update items
    set
        model_id = (p_item->>'model_id')::integer,
        type_id = (p_item->>'type_id')::integer,
        artisan_id = (p_item->>'artisan_id')::integer,
        state_id = (p_item->>'state_id')::integer,
        condition_id = (p_item->>'condition_id')::integer,
        price = (p_item->>'price')::numeric,
        length_cm = (p_item->>'length_cm')::numeric,
        width_cm = (p_item->>'width_cm')::numeric,
        production_hours = (p_item->>'production_hours')::numeric,
        location = p_item->>'location'
    where id = p_item_id;

    if not found then
        raise exception 'Item % does not exist.', p_item_id;
    end if;

    delete from item_colors
    where item_id = p_item_id;

    insert into item_colors (item_id, color_id)
    select
        p_item_id,
        value::integer
    from jsonb_array_elements_text(coalesce(p_item->'color_ids', '[]'::jsonb));
end;
$$;

GRANT EXECUTE ON FUNCTION update_item(integer, jsonb) TO anon;
        