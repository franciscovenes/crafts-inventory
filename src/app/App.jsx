import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../components/MainLayout";
import RequireAuth from "../features/auth/RequireAuth";

const Add = lazy(() => {
  import("../pages/Add");
});

const Retrieve = lazy(() => import("../pages/Retrieve"));

const Login = lazy(() => import("../pages/Login"));

const Home = lazy(() => import("../pages/Home"));

const NotFound = lazy(() => import("../pages/NotFound"));

const fallback = <h2>Cargando...</h2>;

function App() {
  return (
    <Router>
      <Suspense fallback={fallback}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="add" element={<Add />} />
              <Route path="retrieve" element={<Retrieve />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
