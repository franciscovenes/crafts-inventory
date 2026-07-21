import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import DashboardLayout from "../layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "add",
        lazy: async () => {
          const { default: Add } = await import("../pages/Add");
          return {
            Component: Add,
          };
        },
      },
      {
        path: "retrieve",
        lazy: async () => {
          const { default: Retrieve } = await import("../pages/Retrieve");
          return {
            Component: Retrieve,
          };
        },
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
