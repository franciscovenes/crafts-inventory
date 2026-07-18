import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
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
