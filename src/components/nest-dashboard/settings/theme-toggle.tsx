import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";
import { useCallback } from "react";

export function useThemeToggle() {
  const { setTheme, theme } = useTheme();

  return useCallback(() => {
    const currentTheme = theme || "system";

    if (currentTheme === "light") {
      setTheme("dark");
    } else if (currentTheme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  }, [theme, setTheme]);
}

export function ThemeToggle() {
  const { theme } = useTheme();
  const cycleTheme = useThemeToggle();

  const currentTheme = theme || "system";
  const icon =
    currentTheme === "light" ? (
      <Sun className="h-4 w-4" />
    ) : currentTheme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Laptop className="h-4 w-4" />
    );

  return (
    <button
      onClick={cycleTheme}
      className="rounded-md bg-black p-2.5 text-white transition-colors dark:bg-white dark:text-black"
    >
      {icon}
    </button>
  );
}
