import { ThemeToggle } from "@/components/nest-dashboard/settings/theme-toggle";
import logo from "@/assets/logo.svg";
import logo_dark from "@/assets/logo-dark.svg";

export default function Heading() {
  return (
    <header className="flex w-full items-center justify-between p-2 px-6">
      <div className="flex items-center gap-2">
        <img src={logo} alt="MindNest Logo" className="h-8 w-8 dark:hidden" />
        <img
          src={logo_dark}
          alt="MindNest Logo Dark"
          className="hidden h-8 w-8 dark:block"
        />
        <p className="text-xl font-bold">MindNest</p>
      </div>
      <ThemeToggle />
    </header>
  );
}
