import styles from "./FieldError.module.css";

export default function FieldError({ className, errors }) {
  if (!errors?.length) return null;

  return (
    <ul className={`${styles.error} ${className}`}>
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
}
