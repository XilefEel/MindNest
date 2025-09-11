import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "./routes/Routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
