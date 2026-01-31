import Link from "next/link";
import { format } from "date-fns";
import type { BillWithSummary } from "@/types";

interface BillCardProps {
  bill: BillWithSummary;
}

const statusColors: Record<string, string> = {
  Enacted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Passed Both Chambers": "bg-teal-100 text-teal-800 border-teal-200",
  "Passed House": "bg-blue-100 text-blue-800 border-blue-200",
  "Passed Senate": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "In Committee": "bg-amber-100 text-amber-800 border-amber-200",
  Introduced: "bg-slate-100 text-slate-800 border-slate-200",
  Vetoed: "bg-red-100 text-red-800 border-red-200",
  Pending: "bg-gray-100 text-gray-800 border-gray-200",
};

const partyColors: Record<string, string> = {
  D: "text-blue-600",
  R: "text-red-600",
  I: "text-purple-600",
};

export function BillCard({ bill }: BillCardProps) {
  const statusColor = statusColors[bill.status || "Pending"] || statusColors.Pending;
  const partyColor = partyColors[bill.sponsorParty || ""] || "text-navy-600";

  const billNumber = `${bill.billType.toUpperCase()} ${bill.billNumber}`;
  const formattedDate = bill.introducedDate
    ? format(new Date(bill.introducedDate), "MMM d, yyyy")
    : "Date unknown";

  return (
    <Link href={`/bills/${bill.id}`} className="group block">
      <article className="relative h-full overflow-hidden rounded-xl border border-navy-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-crimson-300 hover:shadow-md">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-crimson-600">
              {billNumber}
            </span>
            <span className="text-navy-400">•</span>
            <span className="text-sm text-navy-500">{formattedDate}</span>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {bill.status || "Pending"}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 font-serif text-lg font-semibold leading-snug text-navy-900 transition-colors group-hover:text-crimson-700">
          {bill.shortTitle || bill.title}
        </h3>

        {/* AI Summary */}
        {bill.summary ? (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-navy-600">
            {bill.summary.shortSummary || bill.summary.oneLiner}
          </p>
        ) : (
          <p className="mb-4 text-sm italic text-navy-400">
            AI summary pending...
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-navy-100 pt-3">
          <div className="text-sm">
            {bill.sponsorName ? (
              <span className="text-navy-600">
                <span className="text-navy-400">Sponsored by </span>
                <span className={`font-medium ${partyColor}`}>
                  {bill.sponsorName}
                </span>
                {bill.sponsorState && (
                  <span className="text-navy-400"> ({bill.sponsorState})</span>
                )}
              </span>
            ) : (
              <span className="text-navy-400">Sponsor unknown</span>
            )}
          </div>
          <svg
            className="h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-crimson-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </article>
    </Link>
  );
}
