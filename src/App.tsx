import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Welcome";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
