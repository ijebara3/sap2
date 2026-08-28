import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Motto from "@/components/site/Motto";
import Studio from "@/components/site/Studio";
import Included from "@/components/site/Included";
import Impressie from "@/components/site/Impressie";
import HowItWorks from "@/components/site/HowItWorks";
import Pricing from "@/components/site/Pricing";
import LocationContact from "@/components/site/LocationContact";
import Faq from "@/components/site/Faq";
import FinalCta from "@/components/site/FinalCta";
import SiteFooter from "@/components/site/SiteFooter";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <main>
        <h1 className="sr-only">Podcaststudio Amsterdam — professionele podcast opnemen aan het Oeverpad</h1>
        <Hero />
        <Motto />
        <Studio />
        <Included />
        <Impressie />
        <HowItWorks />
        <Pricing />
        <LocationContact />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
