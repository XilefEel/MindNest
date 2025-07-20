export default function NestCard({
  name,
  lastUpdated,
}: {
  name: string;
  lastUpdated: string;
}) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition">
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
    </div>
  );
}
