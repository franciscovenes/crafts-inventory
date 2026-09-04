/* select
i,
phrase,
websearch_to_tsquery('english', '"' || phrase || '"') as phrase_query
from
(
select
i,
(array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
from
generate_series(1, 2) as i
) as phrases; */
/* select
i,
letter
from
generate_series(1, 3) as i
cross join (
values
('A'),
('B')
) as j (letter); */
/* select
i,
(array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
from
generate_series(1, 2) as i; */
/* select
items.id as item_id,
phrase,
websearch_to_tsquery('english', '"' || phrase || '"') as phrase_query,
test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrase || '"') as matches
from
items
cross join (
select
i,
(array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
from
generate_series(1, 2) as i
); */
/* select
item_id,
ts_rank(
test_item_text (item_id),
to_tsquery(
'english',
array_to_string(array['Tuscan', 'Sunlight', 'Ring'], ' | ')
)
) as base_rank,
count(*) filter (
where
matches
) as phrase_matches
from
(
select
items.id as item_id,
websearch_to_tsquery('english', '"' || phrase || '"') as phrase_query,
test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrase || '"') as matches
from
items
cross join (
select
i,
(array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
from
generate_series(1, 2) as i
)
)
group by
item_id; */
/* select
exists (
select
1
from
models
where
name ilike 'Andean Forest'
)
or exists (
select
1
from
types
where
name ilike 'Andean Forest'
)
or exists (
select
1
from
states
where
name ilike 'Andean Forest'
)
or exists (
select
1
from
conditions
where
name ilike 'Andean Forest'
)
or exists (
select
1
from
colors
where
name ilike 'Andean Forest'
); */
-- drop view master_data_names;
/* create view master_data_names as
select name, 'model' AS category from models
union all
select name, 'type' AS category from types
union all
select name, 'state' AS category from states
union all
select name, 'condition' AS category from conditions
union all
select name, 'color' AS category from colors; */
-- select * from master_data_names;
/* select
exists (
select
1
from
master_data_names
where master_data_names.name ilike 'Andean Forest'
); */
--
/* select
items.id as item_id,
phrase,
exists (
select
1
from
master_data_names
where
master_data_names.name ilike phrase
) as is_master_phrase,
test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrase || '"') as matches
from
items
cross join (
select
i,
(array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
from
generate_series(1, 2) as i
); */
--
with
  input as (
    select
      array['Tuscan', 'Sunlight', 'Ring']::text[] as keywords
  ),
  base_rank as (
    select
      items.id as item_id,
      ts_rank(
        test_item_text (items.id),
        to_tsquery('english', array_to_string(input.keywords, ' | ')) 
      ) as base_rank
    from
      items
      cross join input
  ),
   phrases as (
    select
      i,
      input.keywords[i] || ' ' || input.keywords[i + 1] as phrase
    from
      input
      cross join generate_series(1, array_length(input.keywords, 1) - 1) as i
  ),
  item_phrase_matches as (
    select
      items.id as item_id,
      phrases.phrase,
      exists (
        select
          1
        from
          master_data_names
        where
          master_data_names.name ilike phrase
      ) as is_master_phrase,
      test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrases.phrase || '"') as matches
    from
      items
      cross join phrases
  )
select
  base_rank.item_id,
  base_rank,
  count(*) filter (
    where
      item_phrase_matches.is_master_phrase
      and item_phrase_matches.matches
  ) as master_phrase_matches
from
  base_rank
  inner join item_phrase_matches on base_rank.item_id = item_phrase_matches.item_id
group by 
  base_rank.item_id,
  base_rank;

--
/* with
  input as (
    select
      array['Tuscan', 'Sunlight', 'Ring']::text[] as keywords
  ),
  phrases as (
    select
      i,
      input.keywords[i] || ' ' || input.keywords[i + 1] as phrase
    from
      input
      cross join generate_series(1, array_length(input.keywords, 1) - 1) as i
  ),
  item_phrase_matches as (
    select
      items.id as item_id,
      phrases.phrase,
      exists (
        select
          1
        from
          master_data_names
        where
          master_data_names.name ilike phrase
      ) as is_master_phrase,
      test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrases.phrase || '"') as matches
    from
      items
      cross join phrases
  )
select
  item_id,
  count(*) filter (
    where
      is_master_phrase
      and matches
  ) as master_phrase_matches
from
  item_phrase_matches
group by
  item_id; */

--
/* select
  i,
  input.keywords[i] || ' ' || input.keywords[i + 1] as phrase
from
  input
  cross join generate_series(1, array_length(input.keywords, 1) - 1) as i;

select
  item_id,
  ts_rank(
    test_item_text (item_id),
    to_tsquery('english', array_to_string(input.keywords, ' | '))
  ) as base_rank,
  count(*) filter (
    where
      is_master_phrase
      and matches
  ) as master_phrase_matches
from
  (
    select
      items.id as item_id,
      exists (
        select
          1
        from
          master_data_names
        where
          master_data_names.name ilike phrase
      ) as is_master_phrase,
      test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrase || '"') as matches
    from
      items
      cross join (
        select
          i,
          (array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
        from
          generate_series(1, 2) as i
      )
  )
group by
  item_id; */

--
/*   select
items.id as item_id,
exists (
select
1
from
master_data_names
where
master_data_names.name ilike phrase
) as is_master_phrase,
test_item_text (items.id) @@ websearch_to_tsquery('english', '"' || phrase || '"') as matches
from
items
cross join (
select
i,
(array['Tuscan', 'Sunlight', 'Ring']) [i] || ' ' || (array['Tuscan', 'Sunlight', 'Ring']) [i + 1] as phrase
from
generate_series(1, 2) as i
); */