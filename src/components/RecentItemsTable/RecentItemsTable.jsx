import { Link } from "react-router-dom";
import StatusBadge from "../StatusBadge/StatusBadge";
import styles from "./RecentItemsTable.module.css";
export default function RecentItemsTable({ items }) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Model</th>
            <th>Type</th>
            <th>Artisan</th>
            <th className={styles.price}>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, model, type, artisan, state, price }) => (
            <tr key={id}>
              <td>{model}</td>
              <td>{type}</td>
              <td>{artisan}</td>
              <td className={styles.price}>{price} €</td>
              <td>
                <StatusBadge>{state}</StatusBadge>
              </td>
              <td>
                <Link className={styles.actionLink} to={`/inventory/${id}`}>
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
