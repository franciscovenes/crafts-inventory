import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./app/router.jsx";

import "./css/index.css";
import AppProviders from "./app/providers.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
