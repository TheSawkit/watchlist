import HeroSection from "@/components/layout/HeroSection";
import FeaturesSection from "@/components/layout/FeaturesSection";
import CTASection from "@/components/layout/CTASection";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
