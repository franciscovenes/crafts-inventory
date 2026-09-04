drop function search_items (jsonb);

create or replace function search_items (p_search_payload jsonb) returns table (
  item_id integer,
  model text,
  type text,
  artisan text,
  state text,
  price numeric,
  created_at timestamp with time zone,
  final_rank double precision
) language plpgsql as $$
begin
return query
with
  input as (
    select
      array(
        select jsonb_array_elements_text(p_search_payload->'keywords')
      ) as keywords
  ),
  -- Token based search (hard filters)
  masterdata_filter_data as (
    select
  items.id as item_id,
  hard_filters ->> 'type' as type,
  hard_filters ->> 'field' as field,
  array_agg(hard_filters ->> 'value') as filter_values,
  case
    when hard_filters ->> 'field' = 'color' 
      then item_color_data.colors 
        && array_agg(hard_filters ->> 'value')
    else
      bool_or(
        case hard_filters ->> 'field'
            when 'model' then models.name
            when 'type' then types.name
            when 'condition' then conditions.name
            when 'state' then states.name
          end = hard_filters ->> 'value'
      )
  end as matches
from
  items
  cross join jsonb_array_elements(
    p_search_payload -> 'hardFilters'
  ) as hard_filters
  inner join models on models.id = items.model_id
  inner join types on types.id = items.type_id
  inner join states on states.id = items.state_id
  inner join conditions on conditions.id = items.condition_id
  left join (
    select
      item_colors.item_id,
      array_agg(colors.name) as colors
    from
      item_colors
      inner join colors on colors.id = item_colors.color_id
    group by
      item_colors.item_id
  ) as item_color_data on item_color_data.item_id = items.id
where
  hard_filters ->> 'type' = 'masterData'
group by
  items.id,
  hard_filters ->> 'type',
  hard_filters ->> 'field',
  item_color_data.colors,
  models.name,
  types.name,
  conditions.name,
  states.name
  ),
  masterdata_filtered_items as (
    select
      masterdata_filter_data.item_id
    from masterdata_filter_data
    group by
      masterdata_filter_data.item_id
    having bool_and(masterdata_filter_data.matches)
  ),
  eligible_masterdata_items as (
    select masterdata_filtered_items.item_id
    from masterdata_filtered_items
    union all
    select items.id as item_id
    from items 
    where not exists (
      select 1 
      from jsonb_array_elements(p_search_payload -> 'hardFilters') as hard_filters 
      where hard_filters ->> 'type' = 'masterData'
    )
  ),
  item_primitive_filters as (
    select
      jsonb_object_agg(
        field_groups.field,
        field_groups.primitive_filters
      ) as primitive_filters
    from
      (
        select
          operator_groups.field,
          jsonb_agg(
            jsonb_build_object(
              'operator',
              operator_groups.operator,
              'values',
              operator_groups.values
            )
          ) as primitive_filters
        from
          (
            select
              hard_filters ->> 'field' as field,
              hard_filters ->> 'operator' as operator,
              array_agg(hard_filters ->> 'value') as
            values
            from
              jsonb_array_elements(p_search_payload -> 'hardFilters'
              ) as hard_filters
            where
              hard_filters ->> 'type' = 'primitive'
            group by
              hard_filters ->> 'field',
              hard_filters ->> 'operator'
          ) as operator_groups
        group by
          operator_groups.field
      ) as field_groups
  ),
  primitive_filter_data as (
    select
      items.id as item_id,
      items.price,
      items.width_cm,
      items.length_cm,
      items.production_hours,
      primitive_filter.field,
      primitive_filter.value,
      evaluate_primitive_filter(
        case primitive_filter.field
          when 'price' then items.price
          when 'width' then items.width_cm
          when 'length' then items.length_cm
          when 'production_hours' then items.production_hours
        end,
        primitive_filter.field,
        item_primitive_filters.primitive_filters
      ) as primitive_matches
    from 
      items
      inner join eligible_masterdata_items
        on eligible_masterdata_items.item_id = items.id
      cross join item_primitive_filters
      cross join lateral 
        jsonb_each(
          item_primitive_filters.primitive_filters
        ) as primitive_filter(field, value)
  ),
  primitive_filtered_items as (
    select
      primitive_filter_data.item_id
    from primitive_filter_data
    group by 
      primitive_filter_data.item_id
    having
      bool_and(primitive_filter_data.primitive_matches)

  ),
  eligible_primitive_items as (
    select *
    from primitive_filtered_items
    union all
    select eligible_masterdata_items.item_id
    from eligible_masterdata_items
    where not exists (
      select 1
      from jsonb_array_elements(p_search_payload -> 'hardFilters') as hard_filters
      where hard_filters ->> 'type' = 'primitive'
    )
  ),
  -- Soft keyword search
  item_search_documents as (
  select
    eligible_primitive_items.item_id,
    build_item_search_document(eligible_primitive_items.item_id) as search_document
  from
    eligible_primitive_items
),
keyword_ranks as (
  select
    item_search_documents.item_id,
    ts_rank(
      item_search_documents.search_document,
      to_tsquery(
        'english',
        array_to_string(input.keywords, ' | ')
      )
    ) as base_rank
  from
    item_search_documents
    cross join input
),

phrases as (
  select
    i,
    input.keywords[i] || ' ' || input.keywords[i + 1] as phrase
  from
    input
    cross join generate_series(
      1,
      array_length(input.keywords, 1) - 1
    ) as i
),

item_phrase_matches as (
  select
    item_search_documents.item_id,
    phrases.phrase,

    exists (
      select
        1
      from
        master_data_names
      where
        master_data_names.name ilike phrase
    ) as is_master_phrase,

    search_document @@ websearch_to_tsquery(
      'english',
      '"' || phrases.phrase || '"'
    ) as matches

  from
    item_search_documents
    cross join phrases
),

ranked_items as (
  select
    keyword_ranks.item_id as item_id,
    keyword_ranks.base_rank as base_rank,

    count(*) filter (
      where
        item_phrase_matches.is_master_phrase
        and item_phrase_matches.matches
    ) as master_phrase_matches

  from
    keyword_ranks

    left join item_phrase_matches
      on keyword_ranks.item_id = item_phrase_matches.item_id

  group by
    keyword_ranks.item_id,
    keyword_ranks.base_rank
)
select
  ranked_items.item_id,
  models.name as model,
  types.name as type,
  artisans.name as artisan,
  states.name as state,
  items.price,
  items.created_at,
  ranked_items.base_rank * (
    1 + 0.2 * ranked_items.master_phrase_matches
        / (ranked_items.master_phrase_matches + 3)
  ) as final_rank

from
  ranked_items
  inner join items on items.id = ranked_items.item_id
  inner join models on models.id = items.model_id
  inner join types on types.id = items.type_id
  inner join artisans on artisans.id = items.artisan_id
  inner join states on states.id = items.state_id
order by
  final_rank desc;
end;
$$;
        