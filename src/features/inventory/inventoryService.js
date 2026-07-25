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
