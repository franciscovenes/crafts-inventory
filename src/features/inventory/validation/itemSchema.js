import * as z from "zod";

const requiredNumber = (fieldName) =>
  z.number({
    error: (issue) =>
      issue.input === null
        ? `${fieldName} is required.`
        : `${fieldName} must be a number.`,
  });

const idSchema = z
  .number({
    error: "Invalid identifier.",
  })
  .int()
  .positive();

export const itemSchema = z.object({
  model_id: idSchema,
  type_id: idSchema,
  artisan_id: idSchema,
  state_id: idSchema,
  condition_id: idSchema,
  colors: z
    .array(
      z.object({
        id: z.number().int().positive(),
        hex: z
          .string()
          .trim()
          .regex(/^#[0-9A-Fa-f]{6}$/),
        name: z.string().trim().min(1),
      }),
    )
    .min(1, "Select at least one color."),
  price: requiredNumber("Price")
    .nonnegative({ error: "Price cannot be negative." })
    .max(99_999_999.99, { error: "Max price allowed is 99 999 999.99 €" })
    .multipleOf(0.01, { error: "Price can have at most 2 decimal places." }),
  length_cm: requiredNumber("Length")
    .positive({ error: "Length must be greater than zero." })
    .max(999.99, { error: "Max length allowed is 999.99 cm" })
    .multipleOf(0.01, { error: "Length can have at most 2 decimal places." }),
  width_cm: requiredNumber("Width")
    .positive({ error: "Width must be greater than zero." })
    .max(999.99, { error: "Max width allowed is 999.99 cm" })
    .multipleOf(0.01, { error: "Width can have at most 2 decimal places." }),
  production_hours: requiredNumber("Production hours")
    .nonnegative({ error: "Production time cannot be negative." })
    .max(999.99, { error: "Max production time allowed is 999.99 hours" })
    .multipleOf(0.1, {
      error: "Production time can have at most 1 decimal places.",
    }),
  location: z.string().trim().nullable(),
});
