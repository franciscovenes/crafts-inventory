export const PRIMITIVE_FIELDS = {
  price: {
    aliases: ["price"],
  },

  width: {
    aliases: ["width"],
  },

  length: {
    aliases: ["length"],
  },

  production_hours: {
    aliases: ["production_hours", "hours"],
  },
};

// Normalization object that maps aliases to their corresponding canonical field

export const primitiveFieldAliasMap = Object.fromEntries(
  Object.entries(PRIMITIVE_FIELDS).flatMap(([field, { aliases }]) =>
    aliases.map((alias) => [alias, field]),
  ),
);

// console.log("Primitive field alias map: ", primitiveFieldAliasMap);

// Create an aliases list for the regex pattern so the user can use different names. Example: hours and production_hours are both matched
const primitiveFieldAliases = Object.entries(PRIMITIVE_FIELDS).flatMap(
  ([_field, { aliases }]) => aliases,
);

// console.log(primitiveFieldAliases);

// Order aliases by decreasing length to avoid partial matches when one alias is a prefix of a longer one

const fieldPattern = primitiveFieldAliases
  .sort((a, b) => b.length - a.length)
  .join("|");

// console.log(fieldPattern);

// Search pattern for primitives

export const primitiveRegex = new RegExp(
  `\\b(?<field>${fieldPattern})` +
    `\\s*` +
    `(?<operator>>=|<=|>|<|=)` +
    `\\s*` +
    `(?<value>\\d+(?:\\.\\d+)?)`,
  "gi",
);

// Consumption order for master data categories
export const CATEGORY_PRECEDENCE = [
  "models",
  "types",
  "conditions",
  "states",
  "colors",
];

export const CATEGORY_TO_FIELD = {
  models: "model",
  types: "type",
  conditions: "condition",
  states: "state",
  colors: "color",
};

export const FIELD_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_TO_FIELD).map(([category, field]) => [
    field,
    category,
  ]),
);

const metaDataFieldPattern = CATEGORY_PRECEDENCE.map(
  (category) => CATEGORY_TO_FIELD[category],
).join("|");

export const masterDataFieldRegex = new RegExp(
  `(?<field>${metaDataFieldPattern}):`,
  "gi",
);
