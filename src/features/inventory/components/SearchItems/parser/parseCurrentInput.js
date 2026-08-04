import {
  CATEGORY_PRECEDENCE,
  CATEGORY_TO_FIELD,
  FIELD_TO_CATEGORY,
  masterDataFieldRegex,
  primitiveFieldAliasMap,
  primitiveRegex,
} from "./constants";
import { isSeparator, isValidBoundary, tokenExists } from "./parserUtils";

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

  // console.log("New tokens: ", primitiveTokens);
  // console.log("New input: ", clippedInput);

  return {
    clippedInput,
    tokens,
  };
}

export function parseMasterData(input, masterData, currentTokens) {
  // This is a dictionary-driven parser. Go through master data categories sequentially
  // Follow this order: Models, Types, Conditions, States, Colors
  // Look for longest names first (achieved via previous preparation)

  const tokens = [...currentTokens];
  let clippedInput = input;

  // Find explicit (category:name) patterns

  const matches = [...input.matchAll(masterDataFieldRegex)];
  // console.log("Matches: ", matches);

  const removals = [];
  matches.forEach((match) => {
    const valueStart = match.index + match[0].length;
    const remainingText = input.slice(valueStart);

    const { field } = match.groups;

    const foundValue = masterData[FIELD_TO_CATEGORY[field]].find(
      (obj) =>
        remainingText.toLowerCase().startsWith(obj.normalizedName) &&
        isSeparator(remainingText[obj.normalizedName.length]),
    );

    if (foundValue) {
      if (!tokenExists(tokens, field, foundValue.name)) {
        tokens.push({
          id: crypto.randomUUID(),
          type: "masterData",
          field,
          value: foundValue.name,
          ...(field === "color" && {
            hex: foundValue.hex,
            isLight: foundValue.isLight,
          }),
        });
      }

      const consumedLength = match[0].length + foundValue.normalizedName.length;
      removals.push({
        start: match.index,
        end: match.index + consumedLength,
      });
    }
  });

  removals
    .sort((a, b) => b.start - a.start)
    .forEach(({ start, end }) => {
      clippedInput = clippedInput.slice(0, start) + clippedInput.slice(end);
    });

  // let clippedInput = normalizeInput(input.replaceAll(masterDataRegex, ""));
  clippedInput = clippedInput.replace(/\s{2,}/g, " ");

  // Find implicit category names

  /* let normalizedInput = clippedInput.toLowerCase();
  CATEGORY_PRECEDENCE.forEach((category) => {
    // console.log(category);
    const field = CATEGORY_TO_FIELD[category];
    masterData[category].forEach((obj) => {
      const { normalizedName, name, hex, isLight } = obj;
      // console.log("Normalized name: ", normalizedName);
      const patternStartIndex = normalizedInput.indexOf(normalizedName);
      // console.log("Index start: ", patternStartIndex);
      if (
        patternStartIndex > -1 &&
        isValidBoundary(clippedInput, patternStartIndex, normalizedName.length)
      ) {
        if (!tokenExists(tokens, field, name)) {
          tokens.push({
            id: crypto.randomUUID(),
            type: "masterData",
            field: field,
            value: name,
            ...(field === "color" && { hex, isLight }),
          });
        }

        const start = patternStartIndex;
        const end = start + normalizedName.length;

        clippedInput = clippedInput.slice(0, start) + clippedInput.slice(end);
        normalizedInput = clippedInput.toLowerCase();
      }
    });
  }); */

  return {
    clippedInput,
    tokens,
  };
}
