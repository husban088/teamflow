import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { UseCases } from "@/components/landing/UseCases";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CtaBand, Footer } from "@/components/landing/CtaFooter";

export default function Home() {
  return (
    <div className="grain min-h-dvh overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <UseCases />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
