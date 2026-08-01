import {
  getModels,
  getTypes,
  getArtisans,
  getStates,
  getConditions,
  getColors,
} from "./inventoryService";

export async function getMasterDataPromise() {
  const [models, types, artisans, states, conditions, colors] =
    await Promise.all([
      getModels(),
      getTypes(),
      getArtisans(),
      getStates(),
      getConditions(),
      getColors(),
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
