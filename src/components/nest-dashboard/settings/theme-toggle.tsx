import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const cycleTheme = () => {
    const currentTheme = theme || "system";

    if (currentTheme === "light") {
      setTheme("dark");
    } else if (currentTheme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

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
    <Button
      size="icon"
      onClick={cycleTheme}
      className="bg-black text-white dark:bg-white dark:text-black"
    >
      {icon}
    </Button>
  );
}
