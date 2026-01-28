import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ProgramsSection } from "@/components/landing/courses-section";
import { PartnersSection } from "@/components/landing/partners-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import "@/components/landing/index.css";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ProgramsSection />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
