import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.container}>
      <Outlet />
      <Footer />
    </div>
  );
}
