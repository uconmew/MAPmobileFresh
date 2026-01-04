import React from "react";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import InstallationsSection from "@/components/home/InstallationsSection";
import ProcessSection from "@/components/home/ProcessSection";
import PriceMatchSection from "@/components/home/PriceMatchSection";
import LocationSection from "@/components/home/LocationSection";
import NewsletterSection from "@/components/NewsletterSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      <HeroSection />
      <BenefitsSection />
      <InstallationsSection />
      <ProcessSection />
      <PriceMatchSection />
      <LocationSection />
      <NewsletterSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
