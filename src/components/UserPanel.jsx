import { useCurrentUser } from "../features/auth/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

export default function UserPanel() {
  const currentUser = useCurrentUser();

  const navigate = useNavigate();

  // Logout current user
  async function handleLogout(event) {
    event.preventDefault();
    // await logOut();
    navigate("/");
  }

  return (
    <section>
      <p>Hello, {currentUser.displayName}!</p>
      <button type="button">
        {" "}
        <FaPowerOff /> Logout
      </button>
    </section>
  );
}
