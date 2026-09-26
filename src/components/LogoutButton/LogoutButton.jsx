import { Power } from "lucide-react";
import styles from "./LogoutButton.module.css";

import { useContext } from "react";
import { AuthenticationContext } from "../../features/auth/AuthProvider";

export default function LogoutButton({ variant = "header" }) {
  // const navigate = useNavigate();

  // Logout current user
  /* async function handleLogout(event) {
    event.preventDefault();
    // await logOut();
    navigate("/");
  } */

  const { logoutUser } = useContext(AuthenticationContext);

  const handleLogout = async () => {
    const result = await logoutUser();
    console.log("SignOut");
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
