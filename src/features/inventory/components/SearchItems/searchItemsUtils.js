// Prepare master data: add normalized name
export function prepareMasterData(masterData) {
  return Object.fromEntries(
    Object.entries(masterData).map(([category, values]) => [
      category,
      prepareCategory(category, values),
    ]),
  );
}

function prepareCategory(category, values) {
  return values
    .map((value) => ({
      ...value,
      normalizedName: value.name.trim().toLowerCase(),
      ...(category === "colors" && {
        isLight: isLightColor(value.hex),
      }),
    }))
    .sort((a, b) => b.normalizedName.length - a.normalizedName.length);
}

function isLightColor(hex) {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

  return luminance > 220;
}

export function isValidBoundary(input, startIndex, matchLength) {
  const beforeChar = input[startIndex - 1];
  const afterChar = input[startIndex + matchLength];

  return isSeparator(beforeChar) && isSeparator(afterChar);
}

export function isSeparator(character) {
  return character === undefined || /[\s\p{P}\p{S}]/u.test(character);
}

export function tokenExists(tokens, field, name) {
  return tokens.some((token) => token.field === field && token.value === name);
}

export function shouldCommitInput(text) {
  return /[\s,;]$/.test(text);
}

export function insertMetadataToken(tokens, field, value) {
  if (tokenExists(tokens, field, value.name)) return;

  tokens.push({
    id: crypto.randomUUID(),
    type: "masterData",
    field,
    value: value.name,
    ...(field === "color" && {
      hex: value.hex,
      isLight: value.isLight,
    }),
  });
}

export function clipMetadataInput(input, start, length) {
  input = input.slice(0, start) + input.slice(start + length);

  return input.replace(/\s{2,}/g, " ");
}
