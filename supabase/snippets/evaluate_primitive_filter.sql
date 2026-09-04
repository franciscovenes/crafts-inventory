drop function evaluate_primitive_filter (numeric, text, jsonb);

create or replace function evaluate_primitive_filter (
  p_item_value numeric,
  p_field text,
  p_primitive_filters jsonb
) returns jsonb language plpgsql as $$
begin
  return (
    select
      jsonb_build_object('item_value', p_item_value, 'field', p_field, 'selected_filters', p_primitive_filters -> p_field, 'simplified_filters', jsonb_build_object('upper_filter', simplified_filters.upper_filter, 'lower_filter', simplified_filters.lower_filter, 'equal_values', simplified_filters.equal_values))
    from (
      select
        (array_agg(jsonb_build_object('operator', normalized_groups.operator, 'boundary', normalized_groups.boundary)
          order by normalized_groups.boundary desc, case normalized_groups.operator
            when '>' then
              0
            when '>=' then
              1
            end) filter (where normalized_groups.operator in ('>', '>=')))[1] as lower_filter,
        (array_agg(jsonb_build_object('operator', normalized_groups.operator, 'boundary', normalized_groups.boundary)
          order by normalized_groups.boundary asc, case normalized_groups.operator
            when '<' then
              0
            when '<=' then
              1
            end) filter (where normalized_groups.operator in ('<', '<=')))[1] as upper_filter,
        array_agg(normalized_groups.values) filter (
  where normalized_groups.operator = '='
) as equal_values
      from (
        select
          operator_group ->> 'operator' as
          operator, case when operator_group ->> 'operator' in ( '<', '<=') then
        (
          select
            min( value::numeric)
        from
          jsonb_array_elements_text( operator_group -> 'values') as value)
          when operator_group ->> 'operator' in ( '>', '>=') then
        (
          select
            max( value::numeric)
        from
          jsonb_array_elements_text( operator_group -> 'values') as value)
          end as boundary,
          case when operator_group ->> 'operator' = '=' then
            operator_group -> 'values'
          end as
        values
          from jsonb_array_elements( p_primitive_filters -> p_field) as operator_group) as normalized_groups) as simplified_filters
);
end;
$$;