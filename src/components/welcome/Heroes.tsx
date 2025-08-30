import documents from "@/assets/documents.png";
import documents_dark from "@/assets/documents-dark.png";
import reading from "@/assets/reading.png";
import reading_dark from "@/assets/reading-dark.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export default function Heroes() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-6 text-center md:px-4">
      <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
        Welcome to{" "}
        <span className="text-teal-600 dark:text-teal-400">MindNest</span>
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
            className="bg-teal-600 text-white hover:scale-105 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            🚀 Get Started Free
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
        <Link to="/login">
          <Button
            size="lg"
            variant="outline"
            className="hover:scale-105 hover:text-teal-600 dark:hover:text-teal-300"
          >
            Log In
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>

      <div className="mt-10 flex justify-center gap-8">
        <img
          src={documents}
          alt="Documents"
          className="h-auto w-3/4 md:w-1/3 dark:hidden"
          loading="lazy"
          aria-hidden="true"
        />
        <img
          src={documents_dark}
          alt="Documents Dark"
          className="hidden h-auto w-3/4 md:w-1/3 dark:block"
          loading="lazy"
          aria-hidden="true"
        />
        <img
          src={reading}
          alt="Reading"
          className="hidden h-auto w-1/3 md:block dark:hidden"
          loading="lazy"
          aria-hidden="true"
        />
        <img
          src={reading_dark}
          alt="Reading Dark"
          className="hidden h-auto w-1/3 md:hidden dark:hidden dark:md:block"
          loading="lazy"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
