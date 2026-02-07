"use client";

import { format, differenceInDays } from "date-fns";
import { ExternalLink, Users, Zap, CheckCircle, XCircle, Sparkles } from "lucide-react";
import type { Bill } from "@/types";

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

const statusStyles: Record<string, string> = {
  Enacted: "bg-foreground text-background",
  "Passed Both Chambers": "bg-foreground text-background",
  "Passed House": "border-2 border-foreground text-foreground",
  "Passed Senate": "border-2 border-foreground text-foreground",
  "In Committee": "border border-foreground/50 text-foreground/70",
  Introduced: "border border-foreground/30 text-muted-foreground",
  Vetoed: "bg-destructive text-destructive-foreground",
  Pending: "border border-foreground/30 text-muted-foreground",
};

function isNewBill(introducedDate: Date | null): boolean {
  if (!introducedDate) return false;
  const days = differenceInDays(new Date(), introducedDate);
  return days <= 7;
}

export function BillDetail({ bill, summary }: BillDetailProps) {
  const statusStyle = statusStyles[bill.status || "Pending"] || statusStyles.Pending;
  const billNumber = `${bill.billType.toUpperCase()} ${bill.billNumber}`;
  const isNew = isNewBill(bill.introducedDate);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Bill Header */}
      <header className="mb-8">
        {/* Bill Number and Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-foreground text-background font-mono text-sm font-bold tracking-widest uppercase px-4 py-2">
            {billNumber}
          </span>
          {isNew && (
            <span className="bg-urgent text-urgent-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-1">
              New
            </span>
          )}
          <span className={`font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 ${statusStyle}`}>
            {bill.status || "Pending"}
          </span>
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Congress {bill.congressNumber}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-foreground mb-4">
          {bill.shortTitle || bill.title}
        </h1>

        {/* Full Title if different */}
        {bill.shortTitle && bill.title !== bill.shortTitle && (
          <p className="font-serif text-lg italic text-muted-foreground mb-6">
            {bill.title}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-foreground/30 mb-6" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <dt className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
              Introduced
            </dt>
            <dd className="font-sans text-sm text-foreground">
              {bill.introducedDate
                ? format(new Date(bill.introducedDate), "MMMM d, yyyy")
                : "Unknown"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
              Latest Action
            </dt>
            <dd className="font-sans text-sm text-foreground">
              {bill.latestActionDate
                ? format(new Date(bill.latestActionDate), "MMMM d, yyyy")
                : "Unknown"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
              Sponsor
            </dt>
            <dd className="font-sans text-sm text-foreground">
              {bill.sponsorName ? (
                <>
                  {bill.sponsorName}
                  {bill.sponsorParty && <span className="text-muted-foreground"> ({bill.sponsorParty})</span>}
                  {bill.sponsorState && <span className="text-muted-foreground"> - {bill.sponsorState}</span>}
                </>
              ) : (
                <span className="text-muted-foreground">Unknown</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
              Official Source
            </dt>
            <dd>
              {bill.congressUrl ? (
                <a
                  href={bill.congressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-sans text-sm text-urgent hover:underline"
                >
                  Congress.gov
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="font-sans text-sm text-muted-foreground">Not available</span>
              )}
            </dd>
          </div>
        </div>

        {/* Latest Action Text */}
        {bill.latestActionText && (
          <div className="mt-6 border-t border-foreground/20 pt-4">
            <dt className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
              Latest Action
            </dt>
            <dd className="font-sans text-sm text-foreground">
              {bill.latestActionText}
            </dd>
          </div>
        )}

        {/* Subjects */}
        {bill.subjects && bill.subjects.length > 0 && (
          <div className="mt-4 border-t border-foreground/20 pt-4">
            <dt className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
              Subjects
            </dt>
            <dd className="flex flex-wrap gap-2">
              {bill.subjects.map((subject, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] tracking-wide uppercase px-2 py-1 border border-foreground/30 text-muted-foreground"
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
        <div className="space-y-8">
          {/* One-liner Highlight */}
          <section className="border-l-4 border-urgent bg-urgent/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-urgent" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-urgent font-bold">
                AI Summary
              </span>
            </div>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground">
              {summary.oneLiner}
            </p>
          </section>

          {/* Detailed Summary */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-foreground/30" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
                What This Bill Does
              </span>
              <div className="h-px flex-1 bg-foreground/30" />
            </div>
            <p className="font-sans leading-relaxed text-foreground">
              {summary.detailedSummary}
            </p>
          </section>

          {/* Key Points */}
          {summary.keyPoints.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-foreground/30" />
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
                  Key Points
                </span>
                <div className="h-px flex-1 bg-foreground/30" />
              </div>
              <ul className="space-y-3">
                {summary.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-urgent" />
                    <span className="font-sans text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Impact Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Who's Affected */}
            {summary.impact.whoAffected.length > 0 && (
              <section className="border-t-[3px] border-foreground p-6 bg-muted/20">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-foreground" />
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    Who Would Be Affected
                  </h2>
                </div>
                <ul className="space-y-2">
                  {summary.impact.whoAffected.map((group, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-sm text-foreground">
                      <span className="text-urgent mt-1">•</span>
                      {group}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Potential Effects */}
            {summary.impact.potentialEffects.length > 0 && (
              <section className="border-t-[3px] border-foreground p-6 bg-muted/20">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-foreground" />
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    Potential Effects
                  </h2>
                </div>
                <ul className="space-y-2">
                  {summary.impact.potentialEffects.map((effect, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-sm text-foreground">
                      <span className="text-urgent mt-1">•</span>
                      {effect}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Political Context */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-foreground/30" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
                Political Context
              </span>
              <div className="h-px flex-1 bg-foreground/30" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-sans text-sm text-muted-foreground">
                Likely bipartisan support:
              </span>
              {summary.politicalContext.bipartisanSupport ? (
                <span className="inline-flex items-center gap-1 bg-foreground text-background font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                  <CheckCircle className="w-3 h-3" />
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 border border-foreground text-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                  <XCircle className="w-3 h-3" />
                  Unlikely
                </span>
              )}
            </div>
          </section>

          {/* AI Disclaimer */}
          <div className="border-t border-foreground/30 pt-4 text-center">
            <p className="font-mono text-[10px] tracking-wide uppercase text-muted-foreground">
              Summary generated by AI ({summary.modelUsed}) on{" "}
              {format(new Date(summary.generatedAt), "MMMM d, yyyy")}
            </p>
            <p className="font-serif text-xs italic text-muted-foreground mt-1">
              This is an automated analysis and may contain errors. Always refer to the official bill text.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-t-[3px] border-dashed border-foreground/30 py-16 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
            AI Summary Coming Soon
          </h3>
          <p className="font-serif text-sm italic text-muted-foreground">
            Our AI is still processing this bill. Check back later for a detailed summary.
          </p>
        </div>
      )}
    </div>
  );
}
