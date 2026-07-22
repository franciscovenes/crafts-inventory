import { FaPowerOff, FaHome } from "react-icons/fa";
import styles from "./Header.module.css";
import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/useCurrentUser";
import UserPanel from "../AccountPanel/AccountPanel";
import UserGreeting from "../UserGreeting/UserGreeting";
import { Menu } from "lucide-react";
import LogoutButton from "../LogoutButton/LogoutButton";

export default function Header({ className, onOpen }) {
  const location = useLocation();

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
