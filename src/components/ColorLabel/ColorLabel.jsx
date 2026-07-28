import styles from "./ColorLabel.module.css";

export default function ColorLabel({ hex, name }) {
  return (
    <span className={styles.container}>
      <span
        className={styles.colorSwatch}
        style={{ "--color": hex }}
        aria-hidden="true"
      />
      <span>{name}</span>
    </span>
  );
}
