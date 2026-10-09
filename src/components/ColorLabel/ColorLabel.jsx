import styles from "./ColorLabel.module.css";

export default function ColorLabel({ hex_code, name }) {
  return (
    <span className={styles.container}>
      <span
        className={styles.colorSwatch}
        style={{ "--color": hex_code }}
        aria-hidden="true"
      />
      <span>{name}</span>
    </span>
  );
}
