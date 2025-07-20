import { useAuth } from "@/context/AuthContext";
import NestCard from "./NestCard";

export default function HomeSection() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">
        Welcome Back, {user?.username}👋
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NestCard name="🪺 Startup Vault" lastUpdated="1 hour ago" />
        <NestCard name="🪺 Writing Notes" lastUpdated="Yesterday" />
        <NestCard name="🪺 Planner Board" lastUpdated="3 days ago" />
      </div>
    </section>
  );
}
