import { CATEGORY_TO_DISPLAY } from "../../constants";
import styles from "./CategoriesMenu.module.css";
export default function CategoriesMenu() {
  return (
    <nav className={styles.navigation}>
      <ul>
        {Object.keys(CATEGORY_TO_DISPLAY).map((key, index) => (
          <li key={index}>
            <a href={`#${key}`}>{CATEGORY_TO_DISPLAY[key]}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
