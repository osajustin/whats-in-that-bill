"use client";

import Link from "next/link";
import { format } from "date-fns";
import type { Bill, Summary } from "@/types";

interface BillDetailProps {
  bill: Bill;
  summary: {
    oneLiner: string;
    shortSummary: string;
    detailedSummary: string;
    keyPoints: string[];
    impact: {
      whoAffected: string[];
      potentialEffects: string[];
    };
    politicalContext: {
      bipartisanSupport: boolean;
      relatedBills: string[];
      controversialAspects: string[];
    };
    generatedAt: Date;
    modelUsed: string;
  } | null;
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

export function BillDetail({ bill, summary }: BillDetailProps) {
  const statusColor =
    statusColors[bill.status || "Pending"] || statusColors.Pending;
  const partyColor = partyColors[bill.sponsorParty || ""] || "text-navy-600";
  const billNumber = `${bill.billType.toUpperCase()} ${bill.billNumber}`;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-navy-600 transition-colors hover:text-crimson-600"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back to all bills
      </Link>

      {/* Bill Header */}
      <header className="mb-8 rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-lg font-bold text-crimson-600">
            {billNumber}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColor}`}
          >
            {bill.status || "Pending"}
          </span>
          <span className="text-sm text-navy-500">
            Congress {bill.congressNumber}
          </span>
        </div>

        <h1 className="mb-4 font-serif text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
          {bill.shortTitle || bill.title}
        </h1>

        {bill.shortTitle && bill.title !== bill.shortTitle && (
          <p className="mb-4 text-navy-600">{bill.title}</p>
        )}

        {/* Metadata Grid */}
        <div className="grid gap-4 border-t border-navy-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Introduced
            </dt>
            <dd className="mt-1 text-sm font-medium text-navy-900">
              {bill.introducedDate
                ? format(new Date(bill.introducedDate), "MMMM d, yyyy")
                : "Unknown"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Latest Action
            </dt>
            <dd className="mt-1 text-sm font-medium text-navy-900">
              {bill.latestActionDate
                ? format(new Date(bill.latestActionDate), "MMMM d, yyyy")
                : "Unknown"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Sponsor
            </dt>
            <dd className="mt-1 text-sm">
              {bill.sponsorName ? (
                <span className={`font-medium ${partyColor}`}>
                  {bill.sponsorName}
                  {bill.sponsorParty && ` (${bill.sponsorParty})`}
                  {bill.sponsorState && ` - ${bill.sponsorState}`}
                </span>
              ) : (
                <span className="text-navy-500">Unknown</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Official Source
            </dt>
            <dd className="mt-1">
              {bill.congressUrl ? (
                <a
                  href={bill.congressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-crimson-600 hover:text-crimson-700"
                >
                  Congress.gov
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              ) : (
                <span className="text-sm text-navy-500">Not available</span>
              )}
            </dd>
          </div>
        </div>

        {/* Latest Action Text */}
        {bill.latestActionText && (
          <div className="mt-4 border-t border-navy-100 pt-4">
            <dt className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Latest Action
            </dt>
            <dd className="mt-1 text-sm text-navy-700">
              {bill.latestActionText}
            </dd>
          </div>
        )}

        {/* Subjects */}
        {bill.subjects && bill.subjects.length > 0 && (
          <div className="mt-4 border-t border-navy-100 pt-4">
            <dt className="mb-2 text-xs font-medium uppercase tracking-wider text-navy-400">
              Subjects
            </dt>
            <dd className="flex flex-wrap gap-2">
              {bill.subjects.map((subject, i) => (
                <span
                  key={i}
                  className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-700"
                >
                  {subject}
                </span>
              ))}
            </dd>
          </div>
        )}
      </header>

      {/* AI Summary Section */}
      {summary ? (
        <div className="space-y-6">
          {/* One-liner */}
          <section className="rounded-xl border border-crimson-200 bg-crimson-50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-crimson-700">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
              AI Summary
            </h2>
            <p className="font-serif text-xl leading-relaxed text-navy-900">
              {summary.oneLiner}
            </p>
          </section>

          {/* Detailed Summary */}
          <section className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-xl font-semibold text-navy-900">
              What This Bill Does
            </h2>
            <p className="leading-relaxed text-navy-700">
              {summary.detailedSummary}
            </p>
          </section>

          {/* Key Points */}
          {summary.keyPoints.length > 0 && (
            <section className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-xl font-semibold text-navy-900">
                Key Points
              </h2>
              <ul className="space-y-3">
                {summary.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-crimson-500" />
                    <span className="text-navy-700">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Impact Analysis */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Who's Affected */}
            {summary.impact.whoAffected.length > 0 && (
              <section className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
                  Who Would Be Affected
                </h2>
                <ul className="space-y-2">
                  {summary.impact.whoAffected.map((group, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-navy-700"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      {group}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Potential Effects */}
            {summary.impact.potentialEffects.length > 0 && (
              <section className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
                  Potential Effects
                </h2>
                <ul className="space-y-2">
                  {summary.impact.potentialEffects.map((effect, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-navy-700"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                        />
                      </svg>
                      {effect}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Political Context */}
          <section className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
              Political Context
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-navy-600">
                Likely bipartisan support:
              </span>
              {summary.politicalContext.bipartisanSupport ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Unlikely
                </span>
              )}
            </div>
          </section>

          {/* AI Disclaimer */}
          <div className="rounded-lg bg-navy-50 px-4 py-3 text-center text-xs text-navy-500">
            Summary generated by AI ({summary.modelUsed}) on{" "}
            {format(new Date(summary.generatedAt), "MMMM d, yyyy")}. This is an
            automated analysis and may contain errors. Always refer to the
            official bill text for accurate information.
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-navy-200 bg-white/50 py-12 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-navy-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
          <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">
            AI Summary Coming Soon
          </h3>
          <p className="text-sm text-navy-500">
            Our AI is still processing this bill. Check back later for a
            detailed summary.
          </p>
        </div>
      )}
    </div>
  );
}
