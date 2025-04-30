"use client";

import { navLinks, messages, steps, features, faqs } from "@/data/homePageData";

// Import the new section components
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import HowItWorks from "@/components/layout/HowItWorks";
import Features from "@/components/layout/Features";
import CallToAction from "@/components/layout/CallToAction";
import FaqSection from "@/components/layout/FaqSection";
import Footer from "@/components/layout/Footer";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  const { isAuthenticated, user } = useUserStore();

  // State/Effects related to the entire page structure or shared across sections
  // can remain here if absolutely necessary, but most have been moved.

  return (
    // Use arbitrary value for the specific dark background
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <main>
        <Hero messages={messages} />
        <HowItWorks steps={steps} />
        <Features features={features} />
        <CallToAction />
        <FaqSection faqs={faqs} />
      </main>

      <Footer navLinks={navLinks} /* Pass other necessary props if needed */ />
    </div>
  );
}
