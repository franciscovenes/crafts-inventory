with
  primitive_filter_data as (
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
              jsonb_array_elements(
                '{
          "keywords": [
            "oak",
            "dining chair",
            "modern",
            "wood",
            "dark"
          ],
          "hardFilters": [
            {
              "type": "masterData",
              "field": "model",
              "value": "Model A"
            },
            {
              "type": "masterData",
              "field": "type",
              "value": "Chair"
            },
            {
              "type": "masterData",
              "field": "state",
              "value": "in_stock"
            },
            {
              "type": "masterData",
              "field": "condition",
              "value": "good"
            },
            {
              "type": "masterData",
              "field": "color",
              "value": "Oak"
            },

            {
              "type": "primitive",
              "field": "price",
              "operator": ">",
              "value": "500"
            },
            {
              "type": "primitive",
              "field": "price",
              "operator": ">=",
              "value": "700"
            },
            {
              "type": "primitive",
              "field": "price",
              "operator": "<",
              "value": "1500"
            },
            {
              "type": "primitive",
              "field": "price",
              "operator": "<=",
              "value": "2000"
            },
            {
              "type": "primitive",
              "field": "price",
              "operator": "=",
              "value": "750"
            },
            {
              "type": "primitive",
              "field": "price",
              "operator": "=",
              "value": "800"
            },

            {
              "type": "primitive",
              "field": "width",
              "operator": ">=",
              "value": "10"
            },
            {
              "type": "primitive",
              "field": "width",
              "operator": "<",
              "value": "25"
            },

            {
              "type": "primitive",
              "field": "length",
              "operator": ">",
              "value": "30"
            },
            {
              "type": "primitive",
              "field": "length",
              "operator": "<=",
              "value": "60"
            },

            {
              "type": "primitive",
              "field": "production_hours",
              "operator": ">=",
              "value": "2.5"
            },
            {
              "type": "primitive",
              "field": "production_hours",
              "operator": ">=",
              "value": "4.0"
            },
            {
              "type": "primitive",
              "field": "production_hours",
              "operator": "<",
              "value": "10.0"
            }
          ]
        }'::jsonb -> 'hardFilters'
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
  )
select
  primitive_filter_data.primitive_filters
from
  primitive_filter_data;