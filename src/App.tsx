import { useEffect } from "react";
import "./App.css";
import { ThemeProvider } from "@/components/nest-dashboard/settings/theme-provider";
import AppRoutes from "./routes/Routes";
import { Toaster } from "sonner";
import { useFontMode, useSettingsActions } from "./stores/useSettingsStore";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function App() {
  const fontMode = useFontMode();
  const { loadSettings } = useSettingsActions();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    document.documentElement.classList.remove("font-sans", "font-mono");
    document.documentElement.classList.add(`font-${fontMode}`);
  }, [fontMode]);

  return (
    <ThemeProvider>
      <Tooltip.Provider delayDuration={300}>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </Tooltip.Provider>
    </ThemeProvider>
  );
}
