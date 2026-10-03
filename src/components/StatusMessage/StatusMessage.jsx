import styles from "./StatusMessage.module.css";

export default function StatusMessage({ children, variant, mobile = false }) {
  return (
    <div
      className={`${styles.container} ${styles[variant]} ${mobile ? styles.mobileOnly : ""}`}
    >
      {children}
    </div>
  );
}
