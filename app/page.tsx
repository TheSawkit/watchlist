import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
