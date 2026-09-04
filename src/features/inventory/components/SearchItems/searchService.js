import { supabase } from "../../../../lib/supabase";

export async function searchItems({ searchPayload, page, pageSize } = {}) {
  let query = supabase.rpc(
    "search_items",
    {
      p_search_payload: searchPayload,
    },
    { count: page ? "exact" : undefined },
  );

  if (page && pageSize) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error, count: total } = await query;

  if (error) {
    throw error;
  }

  const items = data.map(({ item_id, model, type, artisan, state, price }) => ({
    id: item_id,
    model,
    type,
    artisan,
    state,
    price,
  }));

  return { items, total };
}
