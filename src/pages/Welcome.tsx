// app/(auth)/landing/page.tsx or wherever your landing lives
import { Heading } from "@/components/welcome/Heading";
import { Heroes } from "@/components/welcome/Heroes";
import { Footer } from "@/components/welcome/Footer";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen cursor-default flex-col">
      <Heading />
      <Heroes />
      <Footer />
    </div>
  );
}
