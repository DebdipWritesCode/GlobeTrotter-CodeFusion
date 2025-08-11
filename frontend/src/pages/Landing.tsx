import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { EnhancedHero } from "@/components/EnhancedHero";
// Components
import Header1 from "@/components/mvpblocks/header-1";
import Footer4Col from "@/components/mvpblocks/footer-4col";
import Loading from "@/components/Loading";
import HeroSection from "@/components/landing/HeroSection";
import { SmoothScrollHero } from "@/components/SmoothScrollHero";
import DestinationsShowcase from "@/components/landing/DestinationsShowcase";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PlanningTools from "@/components/landing/PlanningTools";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";
import TravelInspirationSection from "@/components/landing/TravelInspirationSection";

// Store
import type { RootState } from "@/redux/store";

const Landing = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle redirect if already logged in
  useEffect(() => {
    if (!loading && accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, loading, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
  <div 
    ref={scrollRef} 
    className="overflow-x-hidden min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
    <Header1 />
    
    <main className="flex-grow">
      <SmoothScrollHero />
      <DestinationsShowcase />
      <FeaturesSection />
      <PlanningTools />
      <TestimonialsSection />
      <TravelInspirationSection />
      <CtaSection />
    </main>
    
    <Footer4Col />
  </div>
);
};

export default Landing;