// app/(auth)/landing/page.tsx or wherever your landing lives
import { Heading } from "@/components/welcome/Heading";
import { Heroes } from "@/components/welcome/Heroes";
import { Footer } from "@/components/welcome/Footer";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col cursor-default">
      <Heading />
      <Heroes />
      <Footer />
    </div>
  );
}
