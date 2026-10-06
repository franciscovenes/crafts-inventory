import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./app/router.jsx";
import AppProviders from "./app/providers.jsx";
import { RouterProvider } from "react-router-dom";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/typography.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
