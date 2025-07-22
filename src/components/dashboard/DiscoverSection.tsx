export default function ExploreSection() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Discover Public Nests</h1>
      <input
        type="text"
        placeholder="Search Nests..."
        className="w-full p-2 border rounded mb-4"
      />
      <ul className="space-y-3">
        <li>🌐 “Creative Mind Vault” by @juno</li>
        <li>🌐 “Deep Work Flow” by @elise</li>
      </ul>
    </section>
  );
}
