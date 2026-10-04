import {
  createBrowserRouter,
  createContext,
  redirect,
  RouterContextProvider,
} from "react-router-dom";
import Home from "../pages/Home/Home";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AppLayout from "../layouts/AppLayout/AppLayout";
import { getItems, getItemById } from "../features/inventory/inventoryService";
import { getMasterDataPromise } from "../features/master-data/masterDataLoaders";
import { searchItems } from "../features/inventory/components/SearchItems/searchService";
import { getAuthMe } from "../features/auth/authService";

const INVENTORY_PAGE_SIZE = 5;

export const authContext = createContext();

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      HydrateFallback: () => <p>Loading...</p>,
      children: [
        {
          element: <DashboardLayout />,
          loader: ({ context }) => {
            const user = context.get(authContext);
            if (!user?.active) {
              throw redirect("/login");
            }
          },
          children: [
            {
              path: "/",
              Component: Home,
              loader: ({ context }) => ({
                recentItemsPromise: getItems({ limit: 5 }),
              }),
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
                const searchPayload = JSON.parse(
                  url.searchParams.get("search"),
                );

                if (searchPayload !== null) {
                  return {
                    pageSize: INVENTORY_PAGE_SIZE,
                    dataPromise: searchItems({
                      searchPayload,
                      page,
                      pageSize: INVENTORY_PAGE_SIZE,
                    }),
                    masterDataPromise: getMasterDataPromise(),
                  };
                } else {
                  return {
                    pageSize: INVENTORY_PAGE_SIZE,
                    dataPromise: getItems({
                      page,
                      pageSize: INVENTORY_PAGE_SIZE,
                    }),
                    masterDataPromise: getMasterDataPromise(),
                  };
                }
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
                masterDataPromise: getMasterDataPromise(),
              }),
            },
            {
              path: "create",
              lazy: async () => {
                const { default: CreateItem } =
                  await import("../pages/CreateItem/CreateItem");
                return {
                  Component: CreateItem,
                };
              },
              loader: async () => ({
                masterData: await getMasterDataPromise(),
              }),
            },
            {
              path: "admin",
              loader: ({ context }) => {
                const user = context.get(authContext);
                if (user?.role !== "admin") {
                  throw redirect("/");
                }
              },
              children: [
                {
                  index: true,
                  loader: () => {
                    return redirect("/");
                  },
                },
                {
                  path: "master-data",
                  lazy: async () => {
                    const { default: MasterData } =
                      await import("../pages/MasterData/MasterData");
                    return { Component: MasterData };
                  },
                  loader: async () => ({
                    masterData: await getMasterDataPromise(),
                  }),
                },
              ],
            },
          ],
        },
        {
          path: "/login",
          lazy: async () => {
            const { default: Login } = await import("../pages/Login/Login");

            return {
              Component: Login,
            };
          },
          loader: ({ context }) => {
            const user = context.get(authContext);
            if (user?.active) {
              throw redirect("/");
            }
          },
        },
        {
          path: "*",
          lazy: async () => {
            const { default: NotFound } =
              await import("../pages/NotFound/NotFound");

            return {
              Component: NotFound,
            };
          },
        },
      ],
    },
  ],
  {
    async getContext() {
      const context = new RouterContextProvider();
      context.set(authContext, await getAuthMe());
      return context;
    },
  },
);
