import { FaPowerOff, FaHome } from "react-icons/fa";
import "../css/header.css";
import { AuthenticationContext } from "../features/auth/AuthProvider";
import { logOut } from "../api";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useCurrentUser } from "../features/auth/useCurrentUser";
import UserPanel from "./UserPanel";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Logout current user
  async function handleLogout(event) {
    event.preventDefault();
    await logOut();
    navigate("/");
  }

  return (
    <div className="header-container">
      <UserPanel />

      {/* <button className="logout-btn" onClick={handleLogout}>
          Salir <FaPowerOff />
        </button> */}
    </div>
  );
}
