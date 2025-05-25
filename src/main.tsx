import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/auth-context.tsx";
import { DataProvider } from "./contexts/data-context.tsx";
import { Toaster } from "./ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <App />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  </StrictMode>
);
