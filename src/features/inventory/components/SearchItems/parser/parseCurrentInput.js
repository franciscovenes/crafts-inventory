import { parseMasterData, parsePrimitives } from "./parserUtils";

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
