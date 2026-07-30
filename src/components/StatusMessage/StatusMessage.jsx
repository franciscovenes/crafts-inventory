import styles from "./StatusMessage.module.css";
import { STATUS_MESSAGE_VARIANT } from "./constants";

export default function StatusMessage({ children, variant, mobile = false }) {
  return (
    <div
      className={`${styles.container} ${styles[variant]} ${mobile ? styles.mobileOnly : ""}`}
    >
      {children}
    </div>
  );
}
