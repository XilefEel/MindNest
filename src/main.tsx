import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@/components/nest-dashboard/settings/theme-provider";
import Titlebar from "./components/TitleBar";
import SessionRestorer from "./components/SessionRestorer";
import * as Tooltip from "@radix-ui/react-tooltip";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Tooltip.Provider delayDuration={300}>
        <SessionRestorer />
        <ThemeProvider defaultTheme="system" storageKey="mindnest-theme">
          <Titlebar />
          <App />
        </ThemeProvider>
      </Tooltip.Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
