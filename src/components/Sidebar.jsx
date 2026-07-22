import { NavLink } from "react-router-dom";
import UserPanel from "./AccountPanel/AccountPanel";
import { navigation } from "../app/navigation";

export default function Sidebar() {
  return (
    <div>
      <nav className="home-nav">
        {navigation.map(({ to, label, end }) => (
          <NavLink key={to} className="home-nav-link" to={to} end={end}>
            {label}
          </NavLink>
        ))}
      </nav>
      <UserPanel />
    </div>
  );
}
