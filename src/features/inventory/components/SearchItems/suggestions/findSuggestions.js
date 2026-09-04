import { CATEGORY_PRECEDENCE, CATEGORY_TO_FIELD } from "../parser/constants";
import { tokenExists } from "../searchItemsUtils";

export function findSuggestions(input, masterData, tokens) {
  let normalizedInput = input.toLowerCase();

  const suggestions = [];

  const words = normalizedInput.split(/[\s\p{P}]+/u).filter(Boolean);

  for (const categoryName of CATEGORY_PRECEDENCE) {
    const field = CATEGORY_TO_FIELD[categoryName];
    for (const categoryObject of masterData[categoryName]) {
      const { normalizedName, name } = categoryObject;

      const normalizedNameWords = normalizedName.split(" ");

      for (let i = 0; i < words.length; i++) {
        const candidateSequence = words.slice(i).join(" ");
        console.log(candidateSequence);
        if (
          candidateSequence.length > 1 &&
          ((words.length === 1 &&
            normalizedNameWords.some((word) =>
              word.startsWith(candidateSequence),
            )) ||
            normalizedName.startsWith(candidateSequence)) &&
          !tokenExists(tokens, field, name)
        ) {
          suggestions.push({
            field,
            value: categoryObject,
            candidateSequence,
          });
        }
      }
    }
  }
  return suggestions;
}
