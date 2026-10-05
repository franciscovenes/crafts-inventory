export function normalizeMasterDataValue(value) {
  return value.trim().replace(/\s{2,}/g, " ");
}
