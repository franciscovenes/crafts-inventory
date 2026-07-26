import { Outlet, useNavigation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./DashboardLayout.module.css";
import { useState } from "react";

export default function DashboardLayout() {
  const navigation = useNavigation();

  const [isSidebarOpen, setisSidebarOpen] = useState(false);

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
      {navigation.state === "loading" && <div>Loading...</div>}
      <main className={styles.main}>
        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}
