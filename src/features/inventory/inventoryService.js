import { supabase } from "../../lib/supabase";

export async function getItems({ limit, page, pageSize } = {}) {
  let query = supabase
    .from("items")
    .select(
      `
      id,
      price,
      created_at,
      models (
      name
      ),
      types (
      name
      ),
      artisans (
      name
      ),
      states (
      name
      )
      `,
      { count: page ? "exact" : undefined },
    )
    .order("created_at", { ascending: false });

  if (page && pageSize) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  } else if (limit) {
    query = query.limit(limit);
  }

  const { data, error, count: total } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const items = data.map(({ id, models, types, artisans, states, price }) => ({
    id,
    model: models.name,
    type: types.name,
    artisan: artisans.name,
    state: states.name,
    price,
  }));

  return { items, total };
}

export async function getItemById(id) {
  const { data, error } = await supabase
    .from("items")
    .select(
      `
      id,
      model_id,
      type_id,
      artisan_id,
      state_id,
      condition_id,
      price,
      length_cm,
      width_cm,
      production_hours,
      location,
      created_at,
      updated_at,
      models(name),
      types(name),
      artisans(name),
      states(name),
      conditions(name),
      item_colors(
        colors(name)
      )
      `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { models, types, artisans, states, conditions, item_colors, ...rest } =
    data;

  return {
    ...rest,
    model: models.name,
    type: types.name,
    artisan: artisans.name,
    state: states.name,
    condition: conditions.name,
    colors: item_colors.map(({ colors }) => colors.name),
  };
}
