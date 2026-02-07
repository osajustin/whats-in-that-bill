import { Masthead } from "@/components/newspaper/masthead"
import { Ticker } from "@/components/newspaper/ticker"
import { HeroSection } from "@/components/newspaper/hero-section"
import { HowItWorks } from "@/components/newspaper/how-it-works"
import { LatestBills } from "@/components/newspaper/latest-bills"
import { CtaSection } from "@/components/newspaper/cta-section"
import { Footer } from "@/components/newspaper/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground max-w-[1400px] mx-auto border-x border-foreground/20">
      <Masthead />
      <Ticker />
      <HeroSection />
      <HowItWorks />
      <LatestBills />
      <CtaSection />
      <Footer />
    </main>
  )
}
