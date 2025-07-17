import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [current, setCurrent] = useState("system");

  useEffect(() => {
    setCurrent(resolvedTheme || "system");
  }, [resolvedTheme]);

  const cycleTheme = () => {
    if (current === "light") {
      setTheme("dark");
    } else if (current === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const icon =
    current === "light" ? (
      <Sun className="w-4 h-4" />
    ) : current === "dark" ? (
      <Moon className="w-4 h-4" />
    ) : (
      <Laptop className="w-4 h-4" />
    );

  return (
    <Button
      size="icon"
      onClick={cycleTheme}
      className="bg-black dark:bg-white text-white dark:text-black"
    >
      {icon}
    </Button>
  );
}
