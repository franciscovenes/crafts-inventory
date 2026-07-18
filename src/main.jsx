import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "./features/auth/AuthProvider.jsx";
import App from "./app/App.jsx";
import "./css/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
