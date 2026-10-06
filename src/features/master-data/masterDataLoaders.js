import {
  getAll,
  getActive,
  getActiveIncludingId,
  getActiveColorsIncludingItemColors,
} from "./masterDataService";

export async function getMasterDataPromise() {
  const [models, types, artisans, states, conditions, colors] =
    await Promise.all([
      getAll("models"),
      getAll("types"),
      getAll("artisans"),
      getAll("states"),
      getAll("conditions"),
      getAll("colors"),
    ]);

  return {
    models,
    types,
    artisans,
    states,
    conditions,
    colors,
  };
}

export async function getActiveMasterDataPromise() {
  const [models, types, artisans, states, conditions, colors] =
    await Promise.all([
      getActive("models"),
      getActive("types"),
      getActive("artisans"),
      getActive("states"),
      getActive("conditions"),
      getActive("colors"),
    ]);

  return {
    models,
    types,
    artisans,
    states,
    conditions,
    colors,
  };
}
export async function getItemMasterDataPromise(item) {
  const { id, model_id, type_id, artisan_id, state_id, condition_id } = item;
  const [models, types, artisans, states, conditions, colors] =
    await Promise.all([
      getActiveIncludingId("models", model_id),
      getActiveIncludingId("types", type_id),
      getActiveIncludingId("artisans", artisan_id),
      getActiveIncludingId("states", state_id),
      getActiveIncludingId("conditions", condition_id),
      getActiveColorsIncludingItemColors(id),
    ]);

  return {
    models,
    types,
    artisans,
    states,
    conditions,
    colors,
  };
}
