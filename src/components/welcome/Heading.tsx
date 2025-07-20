import { ThemeToggle } from "@/components/theme-toggle";
import logo from "@/assets/logo.svg";
import logo_dark from "@/assets/logo-dark.svg";

export const Heading = () => {
  return (
    <header className="w-full p-2 flex justify-between items-center px-6 cursor-default">
      <div className="flex items-center gap-2">
        <img src={logo} alt="MindNest Logo" className="dark:hidden h-8 w-8" />
        <img
          src={logo_dark}
          alt="MindNest Logo Dark"
          className="hidden dark:block h-8 w-8"
        />
        <p className="text-xl font-bold">MindNest</p>
      </div>
      <ThemeToggle />
    </header>
  );
};
