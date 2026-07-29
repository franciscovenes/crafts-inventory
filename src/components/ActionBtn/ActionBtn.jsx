import styles from "./ActionBtn.module.css";
import { ACTION_BTN_VARIANT } from "./constants";

export default function ActionBtn({
  children,
  variant = ACTION_BTN_VARIANT.SECONDARY,
  type = "button",
  ...props
}) {
  if (!styles[variant]) {
    throw new Error(`Unknown ActionBtn variant: "${variant}"`);
  }
  return (
    <button
      className={`${styles.container} ${styles[variant]}`}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
}
