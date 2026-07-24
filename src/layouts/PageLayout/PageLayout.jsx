import styles from "./PageLayout.module.css";

export default function PageLayout({ title, children }) {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
