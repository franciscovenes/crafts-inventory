import { formatCurrency } from "../../../../utils/utils";
import styles from "./InventoryItemDetails.module.css";
import Badge from "../Badge/Badge";

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

  console.log(item);

  return (
    <dl className={styles.details}>
      <dt>Model</dt>
      <dd>{model}</dd>
      <dt>Type</dt>
      <dd>{type}</dd>
      <dt>Artisan</dt>
      <dd>{artisan}</dd>
      <dt>Colors</dt>
      <dd>
        <ul className={styles.colors}>
          {colors.map(({ id, hex, name }) => (
            <li key={id}>
              <span
                className={styles.colorSwatch}
                style={{ "--color": hex }}
                aria-hidden="true"
              />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </dd>
      <dt>Condition</dt>
      <dd>
        <Badge>{condition}</Badge>
      </dd>
      <dt>State</dt>
      <dd>
        <Badge>{state}</Badge>
      </dd>
      <dt>Price</dt>
      <dd className={styles.price}>{formatCurrency(price)}</dd>
      <dt>Dimensions</dt>
      <dd>
        {length_cm} × {width_cm} cm
      </dd>
      <dt>Production time</dt>
      <dd>{production_hours} hours</dd>
      {location && (
        <>
          <dt>Location</dt>
          <dd>{location}</dd>
        </>
      )}
    </dl>
  );
}
