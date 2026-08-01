export const createEmptyItem = (masterData = {}) => ({
  model_id: masterData.models?.[0]?.id ?? null,
  type_id: masterData.types?.[0]?.id ?? null,
  artisan_id: masterData.artisans?.[0]?.id ?? null,
  condition_id: masterData.conditions?.[0]?.id ?? null,
  state_id: masterData.states?.[0]?.id ?? null,

  colors: [],
  price: null,
  length_cm: null,
  width_cm: null,
  production_hours: null,
  location: null,
});
