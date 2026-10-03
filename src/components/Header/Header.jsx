import styles from "./Header.module.css";
import UserGreeting from "../UserGreeting/UserGreeting";
import { Menu } from "lucide-react";
import LogoutButton from "../LogoutButton/LogoutButton";

export default function Header({ className, onOpen }) {
  return (
    <header className={`${styles.container} ${className}`}>
      <button type="button" className={styles.menuOpenBtn} onClick={onOpen}>
        <Menu />
      </button>

      <img src="../../logo/logo-light.svg" className={styles.logo} />
      <UserGreeting />
      <div className={styles.desktopLogout}>
        <LogoutButton />
      </div>
    </header>
  );
}
