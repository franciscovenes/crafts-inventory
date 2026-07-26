import { useCurrentUser } from "../../features/auth/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import LogoutButton from "../LogoutButton/LogoutButton";
import UserGreeting from "../UserGreeting/UserGreeting";
import styles from "./AccountPanel.module.css";

export default function AccountPanel() {
  return (
    <section className={styles.container}>
      {/* <UserGreeting /> */}
      <div className={styles.mobileLogout}>
        <LogoutButton variant="sidebar" />
      </div>
    </section>
  );
}
