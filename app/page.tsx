import { Suspense } from "react";
import { Masthead } from "@/components/newspaper/masthead";
import { Ticker } from "@/components/newspaper/ticker";
import { HeroSection } from "@/components/newspaper/hero-section";
import { HowItWorks } from "@/components/newspaper/how-it-works";
import { LatestBills } from "@/components/newspaper/latest-bills";
import { CtaSection } from "@/components/newspaper/cta-section";
import { Footer } from "@/components/newspaper/footer";

function LatestBillsFallback() {
  return (
    <section id="latest" className="border-b-[3px] border-foreground">
      <div className="p-6 md:p-10">
        <div className="h-64 animate-pulse bg-muted rounded" />
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <Ticker />
      <main>
        <HeroSection />
        <HowItWorks />
        <Suspense fallback={<LatestBillsFallback />}>
          <LatestBills />
        </Suspense>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
