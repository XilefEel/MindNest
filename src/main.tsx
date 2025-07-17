import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";
import Titlebar from "./components/TitleBar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="mindnest-theme">
        <Titlebar />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
