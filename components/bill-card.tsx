import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import type { BillWithSummary } from "@/types";

interface BillCardProps {
  bill: BillWithSummary;
}

const statusColors: Record<string, string> = {
  Enacted: "bg-emerald-100 text-emerald-800",
  "Passed Both Chambers": "bg-teal-100 text-teal-800",
  "Passed House": "bg-blue-100 text-blue-800",
  "Passed Senate": "bg-indigo-100 text-indigo-800",
  "In Committee": "bg-amber-100 text-amber-800",
  Introduced: "bg-sepia-200 text-sepia-800",
  Vetoed: "bg-red-100 text-red-800",
  Pending: "bg-sepia-100 text-sepia-700",
};

const partyColors: Record<string, string> = {
  D: "text-blue-600",
  R: "text-red-600",
  I: "text-purple-600",
};

// Check if bill is "new" (introduced within last 7 days)
function isNewBill(introducedDate: Date | null): boolean {
  if (!introducedDate) return false;
  const days = differenceInDays(new Date(), introducedDate);
  return days <= 7;
}

export function BillCard({ bill }: BillCardProps) {
  const statusColor = statusColors[bill.status || "Pending"] || statusColors.Pending;
  const partyColor = partyColors[bill.sponsorParty || ""] || "text-sepia-700";
  const isNew = isNewBill(bill.introducedDate);

  const billNumber = `${bill.billType.toUpperCase()} ${bill.billNumber}`;
  const formattedDate = bill.introducedDate
    ? format(new Date(bill.introducedDate), "d MMM yyyy")
    : "Date unknown";

  return (
    <Link href={`/bills/${bill.id}`} className="group block">
      <article className="relative h-full overflow-hidden border-t-2 border-sepia-800 bg-paper p-5 transition-all duration-200 hover:bg-sepia-50">
        {/* Top Decorative Line is handled by border-t */}
        
        {/* Header with Bill Number and NEW Badge */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-bold tracking-tight text-sepia-900">
              {billNumber}
            </span>
            {isNew && (
              <span className="rounded bg-coral-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                NEW
              </span>
            )}
          </div>
          <span className="text-xs text-sepia-500">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="mb-3 font-serif text-lg font-semibold leading-snug text-sepia-900 transition-colors group-hover:text-coral-700">
          {bill.shortTitle || bill.title}
        </h3>

        {/* AI Summary */}
        {bill.summary ? (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-sepia-600">
            {bill.summary.shortSummary || bill.summary.oneLiner}
          </p>
        ) : (
          <p className="mb-4 text-sm italic text-sepia-400">
            AI summary pending...
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-sepia-200 pt-3">
          <div className="text-sm">
            {bill.sponsorName ? (
              <span className="text-sepia-600">
                <span className={`font-medium ${partyColor}`}>
                  {bill.sponsorName}
                </span>
                {bill.sponsorState && (
                  <span className="text-sepia-400"> ({bill.sponsorState})</span>
                )}
              </span>
            ) : (
              <span className="text-sepia-400">Sponsor unknown</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusColor}`}
            >
              {bill.status || "Pending"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
