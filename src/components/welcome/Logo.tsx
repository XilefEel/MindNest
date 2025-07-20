import logo from "@/assets/logo.svg";
import logo_dark from "@/assets/logo-dark.svg";

export const Logo = () => {
  return (
    <div className="hidden md:flex md:flex-row items-center gap-x-2">
      <img src={logo} alt="MindNest Logo" className="dark:hidden h-10 w-10" />
      <img
        src={logo_dark}
        alt="MindNest Logo"
        className="hidden dark:block h-10 w-10"
      />
      <p className="text-2xl font-bold">MindNest</p>
    </div>
  );
};
