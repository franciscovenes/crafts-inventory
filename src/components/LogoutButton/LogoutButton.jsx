import { Power } from "lucide-react";
import styles from "./LogoutButton.module.css";
import { useContext } from "react";
import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ variant = "header" }) {
  const navigate = useNavigate();

  const { logoutUser } = useContext(AuthenticationContext);

  const handleLogout = async () => {
    const result = await logoutUser();
    navigate("/login");
  };

  return (
    <button
      type="button"
      className={`${styles.container} ${styles[variant]}`}
      onClick={handleLogout}
    >
      <Power />
      <span>Logout</span>
    </button>
  );
}
