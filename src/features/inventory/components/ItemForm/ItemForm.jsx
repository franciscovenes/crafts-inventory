import styles from "./ItemForm.module.css";
import itemFields from "../../styles/ItemFields.module.css";
import ColorLabel from "../../../../components/ColorLabel/ColorLabel";
import { INVENTORY_STATE } from "../../constants/constants";
import { useState } from "react";
import * as z from "zod";
import { itemSchema } from "../../validation/itemSchema";
import FieldError from "../FieldError/FieldError";

export default function ItemForm({
  onSave,
  formId,
  masterData,
  item,
  setItem,
}) {
  const {
    models,
    types,
    artisans,
    states,
    conditions,
    colors: masterColors,
  } = masterData;

  const {
    artisan_id,
    colors: selectedColors,
    condition_id,
    model_id,
    price,
    state_id,
    type_id,
    production_hours,
    length_cm,
    width_cm,
    location,
  } = item;

  const [zodErrors, setZodErrors] = useState(null);

  // console.log("Zod Errors: ", zodErrors);

  const handleSubmit = (event) => {
    console.log("Handle Submit clicked!");
    event.preventDefault();
    const validationOutcome = itemSchema.safeParse(item);

    if (!validationOutcome.success) {
      //  If validation fails, there are errors. Treeify, store and send them to form fields
      setZodErrors(z.treeifyError(validationOutcome.error));

      return;
    }

    setZodErrors(null);
    onSave(validationOutcome.data);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: Number(value),
    }));
  };

  const handleColorChange = (event) => {
    const colorId = Number(event.target.value);

    setItem((prevItem) => {
      //  Check if this color is already assigned to the item
      const isSelected = prevItem.colors.some((color) => color.id === colorId);

      // If it's there, remove it
      if (isSelected) {
        return {
          ...prevItem,
          colors: prevItem.colors.filter((color) => color.id !== colorId),
        };
      }

      // Otherwise, add it from masterData to item
      const colorToAdd = masterColors.find((color) => color.id === colorId);

      // Safeguard for undefined find
      if (!colorToAdd) return prevItem;

      return {
        ...prevItem,
        colors: [...prevItem.colors, colorToAdd],
      };
    });
  };

  const handleFieldChange = (event) => {
    const { name, type, value } = event.target;
    console.log("Handle field change");

    const parsedValue =
      type === "number" ? (value === "" ? null : Number(value)) : value;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: parsedValue,
    }));
  };

  return (
    <form
      className={`${styles.form} ${itemFields.layout}`}
      id={formId}
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      {/* Model */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="model"
      >
        Model
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <select
          id="model"
          name="model_id"
          value={model_id ?? ""}
          onChange={handleSelectChange}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <FieldError errors={zodErrors?.properties?.model_id?.errors} />
      </div>
      {/* Type */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="type"
      >
        Type
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <select
          id="type"
          name="type_id"
          value={type_id ?? ""}
          onChange={handleSelectChange}
        >
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <FieldError errors={zodErrors?.properties?.type_id?.errors} />
      </div>

      {/* Artisan */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="artisan"
      >
        Artisan
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <select
          id="artisan"
          name="artisan_id"
          value={artisan_id ?? ""}
          onChange={handleSelectChange}
        >
          {artisans.map((artisan) => (
            <option key={artisan.id} value={artisan.id}>
              {artisan.name}
            </option>
          ))}
        </select>
        <FieldError errors={zodErrors?.properties?.artisan_id?.errors} />
      </div>

      {/* Colors */}
      <label className={`${itemFields.label} ${styles.formLabel}`}>
        Colors
      </label>
      <div className={itemFields.fieldValue}>
        <fieldset className={styles.colorsFieldset}>
          <legend className={styles.visuallyHidden}>Colors</legend>

          {masterColors.map(({ id, name, hex }) => (
            <label className={styles.colorOption} key={id}>
              <input
                type="checkbox"
                id={`color_${id}`}
                name="colors"
                value={id}
                checked={selectedColors.some((color) => color.id === id)}
                onChange={handleColorChange}
              />

              <ColorLabel hex={hex} name={name} />
            </label>
          ))}
        </fieldset>
        <FieldError errors={zodErrors?.properties?.colors?.errors} />
      </div>

      {/* Condition */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="condition"
      >
        Condition
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <select
          id="condition"
          name="condition_id"
          value={condition_id ?? ""}
          onChange={handleSelectChange}
        >
          {conditions.map((condition) => (
            <option key={condition.id} value={condition.id}>
              {condition.name}
            </option>
          ))}
        </select>
        <FieldError errors={zodErrors?.properties?.condition_id?.errors} />
      </div>

      {/* State */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="state"
      >
        State
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <select
          id="state"
          name="state_id"
          value={state_id ?? ""}
          onChange={handleSelectChange}
        >
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
        <FieldError errors={zodErrors?.properties?.state_id?.errors} />
      </div>

      {/* Price */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="price"
      >
        Price
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={price ?? ""}
          onChange={handleFieldChange}
        />
        <span>€</span>
        <FieldError errors={zodErrors?.properties?.price?.errors} />
      </div>

      {/* Dimensions */}
      <label className={`${itemFields.label} ${styles.formLabel}`}>
        Dimensions
      </label>
      <fieldset
        className={`${itemFields.fieldValue} ${styles.dimensionsFieldset}`}
      >
        <legend className={styles.visuallyHidden}>Dimensions</legend>
        <div className={styles.dimension}>
          <label className={itemFields.label} htmlFor="length_cm">
            Length
          </label>

          <input
            id="length_cm"
            name="length_cm"
            type="number"
            min="0"
            step="0.1"
            value={length_cm ?? ""}
            onChange={handleFieldChange}
          />
          <span>cm</span>
          <FieldError
            className={styles.dimensionError}
            errors={zodErrors?.properties?.length_cm?.errors}
          />
        </div>
        <div className={styles.dimension}>
          <label className={itemFields.label} htmlFor="width_cm">
            Width
          </label>

          <input
            id="width_cm"
            name="width_cm"
            type="number"
            min="0"
            step="0.1"
            value={width_cm ?? ""}
            onChange={handleFieldChange}
          />
          <span>cm</span>
          <FieldError
            className={styles.dimensionError}
            errors={zodErrors?.properties?.width_cm?.errors}
          />
        </div>
      </fieldset>

      {/* Production Time */}
      <label
        className={`${itemFields.label} ${styles.formLabel}`}
        htmlFor="production_hours"
      >
        Production Time
      </label>
      <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
        <input
          id="production_hours"
          name="production_hours"
          type="number"
          min="0"
          step="0.1"
          value={production_hours ?? ""}
          onChange={handleFieldChange}
        />
        <FieldError errors={zodErrors?.properties?.production_hours?.errors} />
      </div>

      {/* Location */}
      {(state_id === INVENTORY_STATE.IN_STOCK ||
        state_id === INVENTORY_STATE.BEING_RESTORED) && (
        <>
          <label
            className={`${itemFields.label} ${styles.formLabel}`}
            htmlFor="location"
          >
            Location
          </label>
          <div className={`${styles.fieldControl} ${itemFields.fieldValue}`}>
            <input
              id="location"
              name="location"
              type="text"
              value={location ?? ""}
              onChange={handleFieldChange}
            />
          </div>
        </>
      )}
    </form>
  );
}
