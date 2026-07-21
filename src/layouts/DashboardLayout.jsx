import { Outlet, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/mainLayout.css";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const navigation = useNavigation();

  return (
    <div className="mainLayout-container">
      <Header />
      <Sidebar />

      {navigation.state === "loading" && <div>Cargando...</div>}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
