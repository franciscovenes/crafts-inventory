-- Function that updates the timestamp automatically
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger that runs before every item update
drop trigger if exists items_updated_at on items;

create trigger items_updated_at
before update on items
for each row
execute function update_updated_at();

REVOKE EXECUTE ON FUNCTION update_updated_at() FROM PUBLIC, anon;