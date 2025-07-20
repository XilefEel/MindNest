import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "./routes/Routes";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
