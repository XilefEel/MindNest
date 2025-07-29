import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "./routes/Routes";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
