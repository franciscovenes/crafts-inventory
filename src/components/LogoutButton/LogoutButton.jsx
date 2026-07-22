import { Power } from "lucide-react";
import styles from "./LogoutButton.module.css";

export default function LogoutButton({ variant = "header" }) {
  // const navigate = useNavigate();

  // Logout current user
  /* async function handleLogout(event) {
    event.preventDefault();
    // await logOut();
    navigate("/");
  } */

  return (
    <button type="button" className={`${styles.container} ${styles[variant]}`}>
      <Power />
      <span>Logout</span>
    </button>
  );
}
