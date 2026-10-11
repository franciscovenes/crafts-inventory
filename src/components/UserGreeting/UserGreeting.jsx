import styles from "./UserGreeting.module.css";
import { useContext } from "react";
import { AuthenticationContext } from "../../features/auth/AuthenticationContext";

export default function UserGreeting() {
  const { currentUser } = useContext(AuthenticationContext);
  return (
    <div className={styles.container}>
      <span>
        Hello, <strong>{currentUser.displayName}</strong>!
      </span>
      <div className={styles.roleBadge}>{currentUser.role}</div>
    </div>
  );
}
