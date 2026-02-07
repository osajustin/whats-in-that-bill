import Image from "next/image"
import { ArrowRight } from "lucide-react"

const bills = [
  {
    id: "H.R. 4821",
    date: "FEB 4, 2026",
    title: "The Digital Identity Verification Act",
    summary:
      "Mandates biometric data collection for all federal online services. Section 7 exempts corporate contractors from the same standards applied to citizens.",
    urgent: true,
    image: "/images/gavel.jpg",
    imageAlt: "A judge's gavel on a wooden desk with scattered legal documents",
  },
  {
    id: "S. 1337",
    date: "JAN 28, 2026",
    title: "American Infrastructure & Jobs Package",
    summary:
      "A 900-page omnibus bill funding roads, bridges, and broadband. Page 612 quietly authorizes eminent domain expansion for private energy projects.",
    urgent: false,
    image: "/images/congress-floor.jpg",
    imageAlt: "A legislative chamber floor with rows of desks and chairs",
  },
]

export function LatestBills() {
  return (
    <section id="latest" className="border-b-[3px] border-foreground">
      <div className="p-6 md:p-10">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="h-px flex-1 bg-foreground/30" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Latest Coverage
          </span>
          <div className="h-px flex-1 bg-foreground/30" />
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-black text-center mb-10 tracking-tight">
          Fresh Off the Press
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {bills.map((bill, i) => (
            <article
              key={bill.id}
              className={`${i === 0 ? "lg:border-r border-foreground/20" : ""} ${i === 0 ? "border-b lg:border-b-0 border-foreground/20 pb-8 lg:pb-0 lg:pr-8" : "pt-8 lg:pt-0 lg:pl-8"}`}
            >
              <div className="relative aspect-[16/10] mb-5 grayscale overflow-hidden">
                <Image
                  src={bill.image || "/placeholder.svg"}
                  alt={bill.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-3 mb-3">
                {bill.urgent && (
                  <span className="bg-urgent text-urgent-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
                    Urgent
                  </span>
                )}
                <span className="font-mono text-xs tracking-widest text-muted-foreground">
                  {bill.id}
                </span>
                <span className="font-mono text-xs tracking-widest text-muted-foreground">
                  {bill.date}
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3">
                {bill.title}
              </h3>

              <p className="font-sans text-sm leading-relaxed text-muted-foreground mb-4">
                {bill.summary}
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors group"
              >
                Read the Full Breakdown
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
