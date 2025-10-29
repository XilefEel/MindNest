import NestPreview from "./NestPreview";
import SharedPreview from "./SharedPreview";
import DiscoverPreview from "./DiscoverPreview";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

function getGreeting(hour: number) {
  if (hour < 12) return "Good Morning 🌅";
  if (hour < 18) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
}

export default function HomeSection() {
  const { user } = useAuth();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const currentDate = time.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const greeting = getGreeting(time.getHours());

  return (
    <section className="flex flex-col gap-5 overflow-y-auto pt-6">
      <div className="items-center justify-between px-6 md:flex">
        <h1 className="text-4xl font-bold">
          {greeting}, {user?.username}
        </h1>
        <div className="mt-2 md:mt-0 md:text-right">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            {currentTime}
          </div>
          <div className="text-lg text-gray-500 dark:text-gray-400">
            {currentDate}
          </div>
        </div>
      </div>
      <NestPreview />
      <SharedPreview />
      <DiscoverPreview />
    </section>
  );
}
