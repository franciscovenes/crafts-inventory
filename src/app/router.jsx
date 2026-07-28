import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AppLayout from "../layouts/AppLayout/AppLayout";
import {
  getItems,
  getItemById,
  getModels,
  getTypes,
  getArtisans,
  getStates,
  getConditions,
  getColors,
} from "../features/inventory/inventoryService";
import { IoLogoModelS } from "react-icons/io";

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
            loader: () => ({ recentItemsPromise: getItems({ limit: 5 }) }),
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
                dataPromise: getItems({ page, pageSize: INVENTORY_PAGE_SIZE }),
              };
            },
          },
          {
            path: "inventory/:id",
            lazy: async () => {
              const { default: InventoryItem } =
                await import("../pages/InventoryItem/InventoryItem");
              return { Component: InventoryItem };
            },
            loader: ({ params }) => ({
              itemPromise: getItemById(params.id),
              masterDataPromise: Promise.all([
                getModels(),
                getTypes(),
                getArtisans(),
                getStates(),
                getConditions(),
                getColors(),
              ]).then(
                ([models, types, artisans, states, conditions, colors]) => ({
                  models,
                  types,
                  artisans,
                  states,
                  conditions,
                  colors,
                }),
              ),
            }),
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
