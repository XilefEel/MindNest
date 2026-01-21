import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@/components/nest-dashboard/settings/theme-provider";
import Titlebar from "./components/TitleBar";
import { AuthProvider } from "./context/AuthContext";
import SessionRestorer from "./components/SessionRestorer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SessionRestorer />
        <ThemeProvider defaultTheme="system" storageKey="mindnest-theme">
          <Titlebar />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
