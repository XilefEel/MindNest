// app/(auth)/landing/page.tsx or wherever your landing lives
import { Heading } from "@/components/Heading";
import { Heroes } from "@/components/Heroes";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col cursor-default">
      <Heading />
      <Heroes />
      <Footer />
    </div>
  );
}
