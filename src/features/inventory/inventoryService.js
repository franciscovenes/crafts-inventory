import { supabase } from "../../lib/supabase";

export async function getRecentItems({ limit = 5 } = {}) {
  const { data, error } = await supabase
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
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(({ id, models, types, artisans, states, price }) => ({
    id,
    model: models.name,
    type: types.name,
    artisan: artisans.name,
    state: states.name,
    price,
  }));
}
