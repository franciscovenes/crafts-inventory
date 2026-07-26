import { useCurrentUser } from "../../features/auth/useCurrentUser";
import styles from "./UserGreeting.module.css";

export default function UserGreeting() {
  const currentUser = useCurrentUser();
  return (
    <span className={styles.container}>
      Hello, <strong>{currentUser.displayName}</strong>!
    </span>
  );
}
