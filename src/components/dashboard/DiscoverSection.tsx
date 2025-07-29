export default function ExploreSection() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Discover Public Nests</h1>
      <input
        type="text"
        placeholder="Search Nests..."
        className="mb-4 w-full rounded border p-2"
      />
      <ul className="space-y-3">
        <li>🌐 “Creative Mind Vault” by @juno</li>
        <li>🌐 “Deep Work Flow” by @elise</li>
      </ul>
    </section>
  );
}
