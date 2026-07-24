import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home/Home";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AppLayout from "../layouts/AppLayout/AppLayout";
import { getRecentItems } from "../features/inventory/inventoryService";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            Component: Home,
            loader: async () => {
              return await getRecentItems({ limit: 5 });
            },
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
        ],
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
