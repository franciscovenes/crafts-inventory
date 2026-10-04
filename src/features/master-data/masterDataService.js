import { supabase } from "../../lib/supabase";
// Get all rows from a specified master data table

async function getAll(table, select = "*", orderBy = "name") {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .order(orderBy);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Get master data fucnctions

export async function getModels() {
  return getAll("models");
}
export async function getTypes() {
  return getAll("types");
}
export async function getArtisans() {
  return getAll("artisans");
}
export async function getStates() {
  return getAll("states");
}
export async function getConditions() {
  return getAll("conditions");
}

export async function getColors() {
  return getAll("colors");
}

export async function addMasterData(category, payload) {
  console.log(category, payload);
}
