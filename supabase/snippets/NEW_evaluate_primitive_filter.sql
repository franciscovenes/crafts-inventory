drop function evaluate_primitive_filter (numeric, text, jsonb);

create or replace function evaluate_primitive_filter (
  p_item_value numeric,
  p_field text,
  p_primitive_filters jsonb
) returns boolean
language plpgsql as $$
begin
return (
  with
    normalized_groups as (
      select
        operator_group ->> 'operator' as operator, 
        case 
          when operator_group ->> 'operator' in ( '<', '<=') 
            then (
              select
                min( filter_value::numeric)
              from
                jsonb_array_elements_text( operator_group -> 'values') as filter_value
            )
          when operator_group ->> 'operator' in ( '>', '>=') 
            then (
              select
                max( filter_value::numeric)
              from
                jsonb_array_elements_text( operator_group -> 'values') as filter_value
              )
        end as boundary,
        case 
          when operator_group ->> 'operator' = '='
            then operator_group -> 'values'
        end as values
      from jsonb_array_elements( p_primitive_filters -> p_field) as operator_group
    ),
    simplified_filters as (
      select 
        (
          array_agg(
            jsonb_build_object(
              'operator', normalized_groups.operator,
              'boundary', normalized_groups.boundary
            )
            order by normalized_groups.boundary desc,
            case normalized_groups.operator
              when '>' then 0
              when '>=' then 1
            end
          ) filter (
              where normalized_groups.operator in ('>', '>=')
            )
        ) [1] as lower_filter,
        (
          array_agg(
            jsonb_build_object(
              'operator', normalized_groups.operator, 
              'boundary', normalized_groups.boundary
            )
            order by normalized_groups.boundary asc, 
            case normalized_groups.operator
              when '<' then 0
              when '<=' then 1
            end
          ) filter (
              where normalized_groups.operator in ('<', '<=')
          )
        )[1] as upper_filter,
        array_agg(normalized_groups.values) filter ( where normalized_groups.operator = '=') as equal_values,
        count(*) > 0 as has_filter
      from normalized_groups
    ),
    evaluated_equal_values as (
      select
        equal_values.equal_value,
        (case lower_filter ->> 'operator'
          when '>' then
            equal_values.equal_value::numeric > (lower_filter->>'boundary')::numeric
          when '>=' then
            equal_values.equal_value::numeric >= (lower_filter->>'boundary')::numeric
          else
            null
        end) as passes_lower_boundary,
        (case upper_filter ->> 'operator'
          when '<' then
            equal_values.equal_value::numeric < (upper_filter->>'boundary')::numeric
          when '<=' then
            equal_values.equal_value::numeric <= (upper_filter->>'boundary')::numeric
          else
            null
        end) as passes_upper_boundary,
        (
          (case 
            when lower_filter is not null then 1
           else 0 
          end) 
          + 
          (case
            when upper_filter is not null 
              then 1
             else 0 
          end)
        ) as boundary_count
      from simplified_filters
      cross join unnest(simplified_filters.equal_values) as equality_group
      cross join jsonb_array_elements_text(equality_group) as equal_values(equal_value)
    ),
    counted_boundaries as (
      select
        evaluated_equal_values.equal_value,
        evaluated_equal_values.boundary_count,
        (case
          when passes_lower_boundary
            then 1
          else 0
        end )
        +
        (case
          when passes_upper_boundary
            then 1
          else 0
        end ) as boundaries_passed
      from evaluated_equal_values
    ),
    remaining_equal_values as (
      select
        counted_boundaries.equal_value
      from counted_boundaries
      where counted_boundaries.boundaries_passed <> counted_boundaries.boundary_count
    )
    select
      case 
        when final_evaluation.has_filter
          then final_evaluation.item_equality_match
            or (
              final_evaluation.item_lower_filter_match
              and final_evaluation.item_upper_filter_match
              and final_evaluation.has_boundary
            )
        else
          true
      end  
    from (
      select
        coalesce(bool_or(remaining_equal_values.equal_value::numeric = p_item_value), false) as item_equality_match,
        coalesce((case simplified_filters.lower_filter ->> 'operator'
          when '>' then
            p_item_value > (simplified_filters.lower_filter ->> 'boundary')::numeric
          when '>=' then
            p_item_value >= (simplified_filters.lower_filter ->> 'boundary')::numeric
          else
            null
        end), true) as item_lower_filter_match,
        coalesce((case simplified_filters.upper_filter ->> 'operator'
            when '<' then
              p_item_value < (simplified_filters.upper_filter ->> 'boundary')::numeric
            when '<=' then
              p_item_value <= (simplified_filters.upper_filter ->> 'boundary')::numeric
            else
              null
          end), true) as item_upper_filter_match,
          (simplified_filters.lower_filter is not null
          or simplified_filters.upper_filter is not null) as has_boundary,
          simplified_filters.has_filter as has_filter
      from
      simplified_filters
      left join lateral (
        select equal_value
        from remaining_equal_values
      ) as remaining_equal_values
      on true
      group by
        simplified_filters.upper_filter,
        simplified_filters.lower_filter,
        simplified_filters.has_filter
    ) as final_evaluation  
); 
end;
$$;