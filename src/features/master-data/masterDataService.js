import { supabase } from "../../lib/supabase";
// Get all rows from a specified master data table

export async function getAll(table, select = "*", orderBy = "name") {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .order(orderBy);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getActive(table, select = "*", orderBy = "name") {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq("active", true)
    .order(orderBy);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getActiveIncludingId(
  table,
  id,
  select = "*",
  orderBy = "name",
) {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .or(`active.eq.true, id.eq.${id}`)
    .order(orderBy);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getActiveColorsIncludingItemColors(itemId) {
  // Get color ids assigned to the item
  const { data: itemColors, error: itemColorsError } = await supabase
    .from("item_colors")
    .select("color_id")
    .eq("item_id", itemId);

  if (itemColorsError) {
    throw new Error(itemColorsError.message);
  }

  const colorIds = itemColors.map(({ color_id }) => color_id);

  let query = supabase.from("colors").select("*").order("name");

  if (colorIds.length > 0) {
    query = query.or(`active.eq.true, id.in.(${colorIds.join(",")})`);
  } else {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function insertMasterData(category, payload) {
  const { data, error } = await supabase.rpc("create_masterdata", {
    p_category: category,
    p_payload: payload,
  });

  if (error) throw error;
  return data;
}

export async function toggleMasterDataActivation(category, id) {
  const { error } = await supabase.rpc("update_masterdata", {
    p_category: category,
    p_id: id,
  });

  if (error) throw error;
}
