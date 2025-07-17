import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Link } from "react-router-dom";

export const Heading = () => {
  return (
    <header className="w-full p-4 flex justify-between items-center">
      <ThemeToggle />
      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden sm:block">
          <Button className="bg-black dark:bg-white text-white dark:text-black transition-transform hover:scale-105">
            Log In
          </Button>
        </Link>
        <Link to="/signup" className="hidden sm:block">
          <Button className="bg-black dark:bg-white text-white dark:text-black transition-transform hover:scale-105">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
};
