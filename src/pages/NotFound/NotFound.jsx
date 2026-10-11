import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.notFoundImage} aria-label="404" role="img" />
      <h1>Page not found</h1>
    </div>
  );
}
