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
      <Sun size={16} />
    ) : currentTheme === "dark" ? (
      <Moon size={16} />
    ) : (
      <Laptop size={16} />
    );

  return (
    <button
      onClick={cycleTheme}
      className="rounded-md bg-black p-2.5 text-white shadow-sm transition-colors active:scale-95 dark:bg-white dark:text-black"
    >
      {icon}
    </button>
  );
}
