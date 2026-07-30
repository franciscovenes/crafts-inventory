import styles from "./Badge.module.css";

export default function StatusBadge({ children }) {
  return <span className={styles.container}>{children}</span>;
}
