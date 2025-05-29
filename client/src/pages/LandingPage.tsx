import { useState, useEffect } from "react";
import { PublicHeader } from "../components/headers/PublicHeader";
import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  TestimonialsSection,
  CtaSection,
} from "../components/landing";

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <HeroSection isVisible={isVisible} />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
