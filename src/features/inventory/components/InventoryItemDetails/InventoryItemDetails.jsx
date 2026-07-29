import { formatCurrency } from "../../../../utils/utils";
import styles from "./InventoryItemDetails.module.css";
import itemFields from "../../styles/ItemFields.module.css";
import Badge from "../Badge/Badge";
import ColorLabel from "../../../../components/ColorLabel/ColorLabel";

export default function InventoryItemDetails({ item }) {
  const {
    artisan,
    colors,
    condition,
    model,
    price,
    state,
    type,
    production_hours,
    length_cm,
    width_cm,
    location,
  } = item;

  console.log("Item: ", item);

  return (
    <dl className={`${styles.details} ${itemFields.layout}`}>
      <dt className={itemFields.label}>Model</dt>
      <dd className={itemFields.fieldValue}>{model}</dd>
      <dt className={itemFields.label}>Type</dt>
      <dd className={itemFields.fieldValue}>{type}</dd>
      <dt className={itemFields.label}>Artisan</dt>
      <dd className={itemFields.fieldValue}>{artisan}</dd>
      <dt className={itemFields.label}>Colors</dt>
      <dd className={itemFields.fieldValue}>
        <ul className={styles.colors}>
          {colors.map(({ id, hex, name }) => (
            <li key={id}>
              <ColorLabel hex={hex} name={name} />
            </li>
          ))}
        </ul>
      </dd>
      <dt className={itemFields.label}>Condition</dt>
      <dd className={itemFields.fieldValue}>
        <Badge>{condition}</Badge>
      </dd>
      <dt className={itemFields.label}>State</dt>
      <dd className={itemFields.fieldValue}>
        <Badge>{state}</Badge>
      </dd>
      <dt className={itemFields.label}>Price</dt>
      <dd className={`${styles.price} ${itemFields.fieldValue}`}>
        {formatCurrency(price)}
      </dd>
      <dt className={itemFields.label}>Dimensions</dt>
      <dd>
        {length_cm} × {width_cm} cm
      </dd>
      <dt className={itemFields.label}>Production time</dt>
      <dd className={itemFields.fieldValue}>{production_hours} hours</dd>
      {location && (
        <>
          <dt>Location</dt>
          <dd>{location}</dd>
        </>
      )}
    </dl>
  );
}
