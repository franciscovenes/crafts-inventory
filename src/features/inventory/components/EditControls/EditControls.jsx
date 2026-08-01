import styles from "./EditControls.module.css";

export default function EditControls({ children, mobile = false, hidden }) {
  return (
    <div className={`${styles.container} ${mobile ? styles.mobileOnly : ""}`}>
      {children}
    </div>
  );
}
