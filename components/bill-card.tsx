import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { BillWithSummary } from "@/types";

interface BillCardProps {
  bill: BillWithSummary;
}

const statusStyles: Record<string, string> = {
  Enacted: "bg-foreground text-background",
  "Passed Both Chambers": "bg-foreground text-background",
  "Passed House": "border border-foreground text-foreground",
  "Passed Senate": "border border-foreground text-foreground",
  "In Committee": "border border-foreground/50 text-foreground/70",
  Introduced: "border border-foreground/30 text-muted-foreground",
  Vetoed: "bg-destructive text-destructive-foreground",
  Pending: "border border-foreground/30 text-muted-foreground",
};

// Check if bill is "new" (introduced within last 7 days)
function isNewBill(introducedDate: Date | null): boolean {
  if (!introducedDate) return false;
  const days = differenceInDays(new Date(), introducedDate);
  return days <= 7;
}

export function BillCard({ bill }: BillCardProps) {
  const statusStyle = statusStyles[bill.status || "Pending"] || statusStyles.Pending;
  const isNew = isNewBill(bill.introducedDate);

  const billNumber = `${bill.billType.toUpperCase()} ${bill.billNumber}`;
  const formattedDate = bill.introducedDate
    ? format(new Date(bill.introducedDate), "MMM d, yyyy").toUpperCase()
    : "DATE UNKNOWN";

  return (
    <Link href={`/bills/${bill.id}`} className="group block h-full">
      <article className="relative h-full border-t-[3px] border-foreground bg-background p-6 transition-colors hover:bg-muted/30">
        {/* Header Row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isNew && (
              <span className="bg-urgent text-urgent-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
                New
              </span>
            )}
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              {billNumber}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 font-serif text-xl font-bold leading-tight tracking-tight text-foreground group-hover:text-urgent transition-colors">
          {bill.shortTitle || bill.title}
        </h3>

        {/* AI Summary */}
        {bill.summary ? (
          <p className="mb-4 font-sans text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {bill.summary.shortSummary || bill.summary.oneLiner}
          </p>
        ) : (
          <p className="mb-4 font-serif text-sm italic text-muted-foreground/60">
            AI summary pending...
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-foreground/20 pt-4">
          <div className="font-mono text-xs tracking-wide text-muted-foreground">
            {bill.sponsorName ? (
              <span>
                {bill.sponsorName}
                {bill.sponsorParty && (
                  <span className="text-foreground/50"> ({bill.sponsorParty})</span>
                )}
              </span>
            ) : (
              <span className="italic">Sponsor unknown</span>
            )}
          </div>
          <span
            className={`font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-1 ${statusStyle}`}
          >
            {bill.status || "Pending"}
          </span>
        </div>

        {/* Read More Link */}
        <div className="mt-4 flex items-center gap-1 font-mono text-xs tracking-widest uppercase text-foreground group-hover:text-urgent transition-colors">
          Read Analysis
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  );
}
