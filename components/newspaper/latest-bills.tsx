import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getLatestBillsWithSummariesForHome } from "@/lib/bills/queries";

export async function LatestBills() {
  const bills = await getLatestBillsWithSummariesForHome(2);

  if (bills.length === 0) {
    return (
      <section id="latest" className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10 text-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Latest Coverage
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-center mb-6 tracking-tight">
            Fresh Off the Press
          </h2>
          <p className="font-serif text-muted-foreground italic max-w-xl mx-auto mb-6">
            We&apos;re syncing the latest bills and AI summaries. Browse the archive or check back soon.
          </p>
          <Link
            href="/bills"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors group border-2 border-foreground px-4 py-2"
          >
            Browse all bills
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    );
  }

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
              <div className="relative aspect-16/10 mb-5 grayscale overflow-hidden">
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
                  {bill.billLabel}
                </span>
                <span className="font-mono text-xs tracking-widest text-muted-foreground">
                  {bill.introducedDate
                    ? format(bill.introducedDate, "MMM d, yyyy").toUpperCase()
                    : "DATE TBD"}
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3">
                {bill.title}
              </h3>

              <p className="font-sans text-sm leading-relaxed text-muted-foreground mb-4">
                {bill.teaser}
              </p>

              <Link
                href={`/bills/${bill.id}`}
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors group"
              >
                Read the Full Breakdown
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
