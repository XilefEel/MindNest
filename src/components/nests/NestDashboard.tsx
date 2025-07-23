// NestDashboardPage.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNestFromId } from "@/lib/nests"; // you’ll create this
import { Nest } from "@/lib/types";

export default function NestDashboardPage() {
  const { id } = useParams(); // <-- get the :id from route
  const [nest, setNest] = useState<Nest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNest() {
      try {
        const data = await getNestFromId(Number(id));
        setNest(data);
      } catch (error) {
        console.error("Failed to fetch nest", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNest();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!nest) return <p>Nest not found.</p>;

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold">{nest.title}</h1>
      <p className="text-gray-500">Created at: {nest.created_at}</p>

      {/* More components here: notes, boards, etc */}
    </section>
  );
}
