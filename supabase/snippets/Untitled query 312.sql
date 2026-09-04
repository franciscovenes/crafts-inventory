select
  items.id,
  item_color_data.colors
from
  items
  inner join (
    select
    item_colors.item_id,
    array_agg(colors.name) as colors
  from
    item_colors
    inner join
      colors on colors.id = item_colors.color_id
  group by
    item_colors.item_id
  ) as item_color_data
  on item_color_data.item_id = items.id

