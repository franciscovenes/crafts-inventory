select
  items.id as item_id,
  hard_filters ->> 'field' as field,
  array_agg(hard_filters ->> 'value') as filter_values,
  states.name as state_name,
  case
    when hard_filters ->> 'field' = 'color' then item_color_data.colors && array_agg(hard_filters ->> 'value')
    else
      case hard_filters->>'field'
        when 'model' then models.name
        when 'type' then types.name
        when 'condition' then conditions.name
        when 'state' then states.name
      end =  any(array_agg(hard_filters->>'value'))
  end as matches
from
  items
  cross join jsonb_array_elements(
    '{
  "keywords": [
    "ocean",
    "forest",
    "bracelet",
    "blue",
    "silver"
  ],
  "hardFilters": [
    {
      "type": "masterData",
      "field": "model",
      "value": "Andean Forest"
    },
    {
      "type": "masterData",
      "field": "model",
      "value": "Ocean Whisper"
    },

    {
      "type": "masterData",
      "field": "type",
      "value": "Bracelet"
    },
    {
      "type": "masterData",
      "field": "type",
      "value": "Necklace"
    },

    {
      "type": "masterData",
      "field": "state",
      "value": "In Stock"
    },
    {
      "type": "masterData",
      "field": "state",
      "value": "In production"
    },

    {
      "type": "masterData",
      "field": "condition",
      "value": "Good"
    },

    {
      "type": "masterData",
      "field": "color",
      "value": "Blue"
    },
    {
      "type": "masterData",
      "field": "color",
      "value": "Silver"
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
      "value": "780"
    },
    {
      "type": "primitive",
      "field": "price",
      "operator": "=",
      "value": "1250"
    },

    {
      "type": "primitive",
      "field": "width",
      "operator": ">=",
      "value": "1.5"
    },
    {
      "type": "primitive",
      "field": "width",
      "operator": "<",
      "value": "3.0"
    },

    {
      "type": "primitive",
      "field": "length",
      "operator": ">",
      "value": "15"
    },
    {
      "type": "primitive",
      "field": "length",
      "operator": "<=",
      "value": "45"
    },

    {
      "type": "primitive",
      "field": "production_hours",
      "operator": ">=",
      "value": "20"
    },
    {
      "type": "primitive",
      "field": "production_hours",
      "operator": ">=",
      "value": "30"
    },
    {
      "type": "primitive",
      "field": "production_hours",
      "operator": "<",
      "value": "40"
    }
  ]
}'::jsonb -> 'hardFilters'
  ) as hard_filters
  inner join models on models.id = items.model_id
  inner join types on types.id = items.type_id
  inner join states on states.id = items.state_id
  inner join conditions on conditions.id = items.condition_id
  inner join (
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
  hard_filters ->> 'field',
  item_color_data.colors,
  models.name,
  types.name,
  conditions.name,
  states.name
order by
  item_id