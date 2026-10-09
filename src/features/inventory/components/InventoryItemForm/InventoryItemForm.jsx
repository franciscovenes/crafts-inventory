import styles from "./InventoryItemForm.module.css";
import itemFields from "../../styles/ItemFields.module.css";
import ColorLabel from "../../../../components/ColorLabel/ColorLabel";
import { INVENTORY_STATE } from "../../constants/constants";

export default function InventoryItemForm({
  item,
  setItem,
  masterData,
  onSubmit,
}) {
  const {
    models,
    types,
    artisans,
    states,
    conditions,
    colors: masterColors,
  } = masterData;

  function handleFieldChange(event) {
    const { name, type, value } = event.target;

    const parsedValue =
      value === "" ? null : type === "number" ? Number(value) : value;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: parsedValue,
    }));
  }

  function handleMasterDataChange(event) {
    const { name, value } = event.target;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: Number(value),
    }));
  }

  function handleColorChange(event) {
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
      const selectedColor = masterColors.find((color) => color.id === colorId);

      // Safeguard for undefined find
      if (!selectedColor) return prevItem;

      return {
        ...prevItem,
        colors: [...prevItem.colors, selectedColor],
      };
    });
  }
  return (
    <form
      className={`${styles.form} ${itemFields.layout}`}
      id="inventory-form"
      onSubmit={onSubmit}
      autoComplete="off"
    >
      {/* Model */}
      <label className={itemFields.label} htmlFor="model">
        Model
      </label>
      <select
        id="model"
        name="model_id"
        value={item.model_id}
        onChange={handleMasterDataChange}
        className={itemFields.fieldValue}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>

      {/* Type */}
      <label className={itemFields.label} htmlFor="type">
        Type
      </label>
      <select
        id="type"
        name="type_id"
        value={item.type_id}
        onChange={handleMasterDataChange}
        className={itemFields.fieldValue}
      >
        {types.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {/* Artisan */}
      <label className={itemFields.label} htmlFor="artisan">
        Artisan
      </label>
      <select
        id="artisan"
        name="artisan_id"
        value={item.artisan_id}
        onChange={handleMasterDataChange}
        className={itemFields.fieldValue}
      >
        {artisans.map((artisan) => (
          <option key={artisan.id} value={artisan.id}>
            {artisan.name}
          </option>
        ))}
      </select>

      {/* Colors */}
      <label className={itemFields.label}>Colors</label>
      <fieldset className={`${itemFields.fieldValue} ${styles.colorsFieldset}`}>
        <legend className={styles.visuallyHidden}>Colors</legend>
        {masterColors.map(({ id, name, hex_code }) => (
          <label className={styles.colorOption} key={id}>
            <input
              type="checkbox"
              id={`color_${id}`}
              name="colors"
              value={id}
              checked={item.colors.some((color) => color.id === id)}
              onChange={handleColorChange}
            />

            <ColorLabel hex_code={hex_code} name={name} />
          </label>
        ))}
      </fieldset>

      {/* Condition */}
      <label className={itemFields.label} htmlFor="condition">
        Condition
      </label>
      <select
        id="condition"
        name="condition_id"
        value={item.condition_id}
        onChange={handleMasterDataChange}
        className={itemFields.fieldValue}
      >
        {conditions.map((condition) => (
          <option key={condition.id} value={condition.id}>
            {condition.name}
          </option>
        ))}
      </select>

      {/* State */}
      <label className={itemFields.label} htmlFor="state">
        State
      </label>
      <select
        id="state"
        name="state_id"
        value={item.state_id}
        onChange={handleMasterDataChange}
        className={itemFields.fieldValue}
      >
        {states.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>

      {/* Price */}
      <label className={itemFields.label} htmlFor="price">
        Price
      </label>
      <input
        id="price"
        name="price"
        type="number"
        min="0"
        step="0.01"
        value={item.price}
        onChange={handleFieldChange}
        className={itemFields.fieldValue}
      />

      {/* Dimensions */}
      <label className={itemFields.label}>Dimensions</label>
      <fieldset className={itemFields.fieldValue}>
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
            value={item.length_cm}
            onChange={handleFieldChange}
            className={itemFields.fieldValue}
          />
          <span>cm</span>
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
            value={item.width_cm}
            onChange={handleFieldChange}
            className={itemFields.fieldValue}
          />
          <span>cm</span>
        </div>
      </fieldset>

      {/* Production Time */}
      <label className={itemFields.label} htmlFor="production_hours">
        Production Time
      </label>
      <input
        id="production_hours"
        name="production_hours"
        type="number"
        min="0"
        step="0.1"
        value={item.production_hours}
        onChange={handleFieldChange}
        className={itemFields.fieldValue}
      />

      {/* Location */}
      {(item.state_id === INVENTORY_STATE.IN_STOCK ||
        item.state_id === INVENTORY_STATE.BEING_RESTORED) && (
        <>
          <label className={itemFields.label} htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={item.location}
            onChange={handleFieldChange}
            className={itemFields.fieldValue}
          />
        </>
      )}
    </form>
  );
}
