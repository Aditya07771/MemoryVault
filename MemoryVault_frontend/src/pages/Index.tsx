import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { WhySection } from "@/components/WhySection";
import { UploadSection } from "@/components/UploadSection";
import { SecuritySection } from "@/components/SecuritySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-vertex-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <WhySection />
      <UploadSection />
      <SecuritySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
