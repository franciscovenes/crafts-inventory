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
            loader: () => {
              return {
                recentItems: getRecentItems({ limit: 5 }),
              };
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
        lazy: async () => {
          const { default: Login } = await import("../pages/Login");

          return {
            Component: Login,
          };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { default: NotFound } = await import("../pages/NotFound");

          return {
            Component: NotFound,
          };
        },
      },
    ],
  },
]);
