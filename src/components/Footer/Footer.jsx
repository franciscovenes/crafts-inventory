import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <footer className={styles.container}>
      <p>
        Warmi Muyu · Created by{" "}
        <a
          href="https://panchos-portfolio.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Francisco Venes
        </a>
      </p>
    </footer>
  );
}
