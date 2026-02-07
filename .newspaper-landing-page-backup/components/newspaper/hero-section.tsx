import Image from "next/image"

export function HeroSection() {
  return (
    <section id="featured" className="border-b-[3px] border-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Main story */}
        <div className="lg:col-span-8 lg:border-r border-foreground/30 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-urgent text-urgent-foreground font-mono text-xs font-bold tracking-widest uppercase px-3 py-1">
              Breaking
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Exclusive Report
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 text-balance">
            Congress Passes Sweeping 1,200-Page Spending Bill Nobody Has Read
          </h2>

          <div className="relative aspect-[16/9] mb-6 grayscale">
            <Image
              src="/images/hero-capitol.jpg"
              alt="The United States Capitol building dome in Washington D.C."
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="border-t border-foreground/20 pt-4">
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/90 mb-4 italic">
              Buried inside: provisions that could affect your taxes, healthcare,
              and privacy. We break it all down so you don{"'"}t have to.
            </p>
            <p className="font-sans text-base leading-relaxed text-muted-foreground max-w-prose">
              Every year, thousands of pages of legislation are passed with minimal public understanding.
              Hidden riders, last-minute amendments, and dense legal language keep citizens in the dark
              about laws that directly impact their lives. {"What's in That Bill"} exists to change that.
            </p>
          </div>
        </div>

        {/* Sidebar stories */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Sidebar item 1 */}
          <div className="p-6 border-b border-foreground/30 flex-1">
            <span className="bg-destructive text-destructive-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-3 inline-block">
              Urgent
            </span>
            <h3 className="font-serif text-2xl font-bold leading-tight mb-3">
              Healthcare Rider Found in Defense Authorization Act
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              A provision on page 847 would restructure prescription drug pricing
              for millions of Americans &mdash; but it was never debated on the floor.
            </p>
          </div>

          {/* Sidebar item 2 */}
          <div className="p-6 border-b border-foreground/30 flex-1">
            <h3 className="font-serif text-2xl font-bold leading-tight mb-3">
              Privacy Clause Slipped Into Infrastructure Package
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Section 12(b) grants federal agencies new authority to collect
              digital records without a warrant. Buried on page 1,041.
            </p>
          </div>

          {/* Sidebar item 3 */}
          <div className="p-6 flex-1">
            <span className="bg-urgent text-urgent-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-3 inline-block">
              Alert
            </span>
            <h3 className="font-serif text-2xl font-bold leading-tight mb-3">
              Tax Amendment Affects 40 Million Households
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              The standard deduction change, added at 2 AM during markup, would
              shift the burden to middle-income earners starting next fiscal year.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
