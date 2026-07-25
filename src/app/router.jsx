import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home/Home";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AppLayout from "../layouts/AppLayout/AppLayout";
import { getItems } from "../features/inventory/inventoryService";

const INVENTORY_PAGE_SIZE = 5;

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
            loader: () => getItems({ limit: 5 }),
          },
          {
            path: "inventory",
            lazy: async () => {
              const { default: Inventory } =
                await import("../pages/Inventory/Inventory");
              return {
                Component: Inventory,
              };
            },
            loader: ({ request }) => {
              const url = new URL(request.url);
              const page = Number(url.searchParams.get("page")) || 1;

              return {
                pageSize: INVENTORY_PAGE_SIZE,
                data: getItems({ page, pageSize: INVENTORY_PAGE_SIZE }),
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
