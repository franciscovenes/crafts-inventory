create or replace function test_item_text (
    p_item_id integer
) 
returns tsvector
language plpgsql
as $$
declare 
    model_name text;
    type_name text;
    state_name text;
    condition_name text;
    color_names text;
    location text;
begin
    select models.name, types.name, states.name, conditions.name, items.location
    into model_name, type_name, state_name, condition_name, location
    from items
    inner join models on items.model_id = models.id
    inner join types on items.type_id = types.id
    inner join states on items.state_id = states.id
    inner join conditions on items.condition_id = conditions.id
    where items.id = p_item_id;

    select string_agg(colors.name, ' ')
    into color_names
    from item_colors
    inner join colors on item_colors.color_id = colors.id
    where item_colors.item_id = p_item_id;
    
    return setweight(to_tsvector(model_name), 'A') || 
        setweight(to_tsvector(type_name), 'B') ||
        setweight(to_tsvector(state_name), 'C') ||
        setweight(to_tsvector(condition_name), 'C') ||
        setweight(to_tsvector(color_names), 'B') ||
        setweight(to_tsvector(coalesce(location, '')), 'C');
end
$$;