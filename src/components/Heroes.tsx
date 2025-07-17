import documents from "@/assets/documents.png";
import documents_dark from "@/assets/documents-dark.png";
import reading from "@/assets/reading.png";
import reading_dark from "@/assets/reading-dark.png";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export const Heroes = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 md:px-4 py-6 gap-6">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
        <span className="underline">Welcome to MindNest</span>
        <br /> Your All-in-One Thinking Space.
      </h2>
      <p className="text-muted-foreground max-w-xl text-lg">
        Where clarity meets creativity. Organize your life and work with notes,
        boards, planners, and journals — all in one intelligent Nest.
      </p>
      <div className="flex gap-4">
        <Link to="/signup">
          <Button
            size="lg"
            className="bg-black dark:bg-white text-white dark:text-black transition-transform hover:scale-105"
          >
            🚀 Get Started Free
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
        <Link to="/login">
          <Button
            size="lg"
            className="bg-black dark:bg-white text-white dark:text-black transition-transform hover:scale-105"
          >
            Log In
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
      <div className="flex justify-center gap-8 mt-10">
        <img
          src={documents}
          alt="Documents"
          className="w-3/4 md:w-1/3 h-auto dark:hidden"
          loading="lazy"
          aria-hidden="true"
        />
        <img
          src={documents_dark}
          alt="Documents Dark"
          className="w-3/4 md:w-1/3 h-auto hidden dark:block"
          loading="lazy"
          aria-hidden="true"
        />
        <img
          src={reading}
          alt="Reading"
          className="w-1/3 h-auto hidden md:block dark:hidden"
          loading="lazy"
          aria-hidden="true"
        />
        <img
          src={reading_dark}
          alt="Reading Dark"
          className="w-1/3 h-auto hidden md:hidden dark:hidden dark:md:block "
          loading="lazy"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
