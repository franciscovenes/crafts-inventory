import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./DashboardLayout.module.css";
import { useState } from "react";
import { useContext } from "react";
import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useEffect } from "react";

export default function DashboardLayout() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthenticationContext);

  const [isSidebarOpen, setisSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className={styles.container}>
      <Header className={styles.header} onOpen={() => setisSidebarOpen(true)} />
      <Sidebar
        className={styles.sidebar}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setisSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setisSidebarOpen(false)}
        ></div>
      )}

      <main className={styles.main}>
        {navigation.state === "loading" && <div>Loading...</div>}
        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}
