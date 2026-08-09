import {
  FIELD_TO_CATEGORY,
  masterDataFieldRegex,
  primitiveFieldAliasMap,
  primitiveRegex,
} from "./constants";

import {
  clipMetadataInput,
  insertMetadataToken,
  isSeparator,
  tokenExists,
} from "../searchItemsUtils";

export function parseCurrentInput(input, currentTokens, masterData) {
  const { clippedInput: afterPrimitives, tokens: tokensAfterPrimitives } =
    parsePrimitives(input, currentTokens);

  const { clippedInput, tokens } = parseMasterData(
    afterPrimitives,
    masterData,
    tokensAfterPrimitives,
  );

  return {
    tokens,
    clippedInput,
  };
}

// This is a syntax-driven parser (field + operator + value)
// For fields price, width, length and production_hours
export function parsePrimitives(input, currentTokens) {
  const tokens = [...currentTokens];

  // Get matches from inputed text
  const matches = [...input.matchAll(primitiveRegex)];

  // Update the primitive tokens array with tokens
  matches.forEach((match) => {
    const canonicalField = primitiveFieldAliasMap[match.groups.field];
    const value = Number(match.groups.value);

    if (canonicalField && !tokenExists(tokens, canonicalField, value))
      tokens.push({
        id: crypto.randomUUID(),
        type: "primitive",
        field: canonicalField,
        operator: match.groups.operator,
        value,
      });
  });

  // Remove matched patterns from the input text and normalize whitespace
  const clippedInput = input
    .replaceAll(primitiveRegex, "")
    .replace(/\s{2,}/g, " ");

  return {
    clippedInput,
    tokens,
  };
}

export function parseMasterData(input, masterData, currentTokens) {
  // This is a dictionary-driven parser. Go through master data categories sequentially
  // Follow this order: Models, Types, Conditions, States, Colors

  const tokens = [...currentTokens];
  let clippedInput = input;

  // Find explicit (category:name) patterns

  const matches = [...input.matchAll(masterDataFieldRegex)];
  // console.log("Matches: ", matches);

  for (const match of matches) {
    const valueStart = match.index + match[0].length;
    const remainingText = input.slice(valueStart);

    const { field } = match.groups;

    const foundValue = masterData[FIELD_TO_CATEGORY[field]].find(
      (obj) =>
        remainingText.toLowerCase().startsWith(obj.normalizedName) &&
        isSeparator(remainingText[obj.normalizedName.length]),
    );

    if (foundValue) {
      insertMetadataToken(tokens, field, foundValue);
      const consumedLength = match[0].length + foundValue.normalizedName.length;
      clippedInput = clipMetadataInput(
        clippedInput,
        match.index,
        consumedLength,
      );

      break;
    }
  }

  return {
    clippedInput,
    tokens,
  };
}
