import styles from "./EditControls.module.css";

export default function EditControls({ children, mobile = false }) {
  return (
    <div className={`${styles.container} ${mobile ? styles.mobileOnly : ""}`}>
      {children}
    </div>
  );
}
