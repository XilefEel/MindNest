import SearchBar from "./SearchBar";
import Header from "./Header";
import StatsSection from "./StatsSection";
import PinnedSection from "./PinnedSection";
import RecentSection from "./RecentSection";

export default function Home({ nestId }: { nestId: number }) {
  return (
    <main className="flex flex-col gap-8">
      <Header nestId={nestId} />
      <SearchBar />
      <StatsSection />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <PinnedSection />
        <RecentSection />
      </section>
    </main>
  );
}
