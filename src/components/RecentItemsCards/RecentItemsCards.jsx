import StatusBadge from "../StatusBadge/StatusBadge";
import styles from "./RecentItemsCards.module.css";
import { Link } from "react-router-dom";

export default function RecentItemsCards({ items }) {
  return (
    <ul className={styles.container}>
      {items.map(({ id, model, artisan, type, price, state }) => (
        <li key={id}>
          <article className={styles.card}>
            <h3>{model}</h3>
            <p className={styles.meta}>{type}</p>
            <p className={styles.meta}>{artisan}</p>
            <p className={styles.price}>{price} €</p>
            <div className={styles.cardFooter}>
              <StatusBadge>{state}</StatusBadge>
              <Link to={`/inventory/${id}`}>View item →</Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
