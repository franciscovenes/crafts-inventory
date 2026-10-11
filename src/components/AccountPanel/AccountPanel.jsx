import { useContext } from "react";
import LogoutButton from "../LogoutButton/LogoutButton";
import styles from "./AccountPanel.module.css";
import { AuthenticationContext } from "../../features/auth/AuthenticationContext";

export default function AccountPanel() {
  const { currentUser } = useContext(AuthenticationContext);
  return (
    <section className={styles.container}>
      <div className={styles.mobileLogout}>
        <div className={styles.userInfo}>
          {currentUser.displayName}
          <span>{currentUser.role}</span>
        </div>
        <LogoutButton variant="sidebar" />
      </div>
    </section>
  );
}
