create or replace function build_item_search_document (
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
begin
    select models.name, types.name, states.name, conditions.name
    into model_name, type_name, state_name, condition_name
    from items
    inner join models on items.model_id = models.id
    inner join types on items.type_id = types.id
    inner join states on items.state_id = states.id
    inner join conditions on items.condition_id = conditions.id
    where items.id = p_item_id;
    
    return to_tsvector(
        'english',
        model_name || ' ' || type_name || ' ' || state_name || ' ' || condition_name
    );
end
$$;