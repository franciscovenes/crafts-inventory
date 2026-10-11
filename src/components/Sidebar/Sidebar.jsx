import { navigation } from "../../app/navigation";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { X } from "lucide-react";
import AccountPanel from "../AccountPanel/AccountPanel";
import { useContext } from "react";
import { AuthenticationContext } from "../../features/auth/AuthenticationContext";

export default function Sidebar({ className, isSidebarOpen, onClose }) {
  const { currentUser } = useContext(AuthenticationContext);
  return (
    <aside
      className={`${styles.container} ${className} ${isSidebarOpen ? styles.open : ""}`}
    >
      <button type="button" className={styles.menuCloseBtn} onClick={onClose}>
        <X />
      </button>
      <nav className={styles.mainMenu} onClick={onClose}>
        {navigation.map(({ to, label, end, requiredRole }) => {
          if (requiredRole === undefined || requiredRole === currentUser.role) {
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                {label}
              </NavLink>
            );
          }
        })}
      </nav>
      <AccountPanel />
    </aside>
  );
}
