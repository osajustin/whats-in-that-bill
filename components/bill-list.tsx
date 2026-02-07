"use client";

import { BillCard } from "./bill-card";
import { FileText } from "lucide-react";
import type { BillWithSummary } from "@/types";

interface BillListProps {
  bills: BillWithSummary[];
  isLoading?: boolean;
}

function BillCardSkeleton() {
  return (
    <div className="animate-pulse border-t-[3px] border-foreground/30 bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-foreground/20" />
          <div className="h-4 w-16 bg-foreground/10" />
        </div>
        <div className="h-3 w-20 bg-foreground/10" />
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-6 w-full bg-foreground/20" />
        <div className="h-6 w-3/4 bg-foreground/20" />
      </div>
      <div className="mb-4 space-y-1.5">
        <div className="h-4 w-full bg-foreground/10" />
        <div className="h-4 w-full bg-foreground/10" />
        <div className="h-4 w-2/3 bg-foreground/10" />
      </div>
      <div className="flex items-center justify-between border-t border-foreground/20 pt-4">
        <div className="h-3 w-32 bg-foreground/10" />
        <div className="h-5 w-20 bg-foreground/10" />
      </div>
      <div className="mt-4 h-3 w-24 bg-foreground/10" />
    </div>
  );
}

export function BillList({ bills, isLoading }: BillListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${i % 3 !== 2 ? "lg:border-r" : ""} ${i < 3 ? "border-b lg:border-b-0" : ""} border-foreground/20`}>
            <BillCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="border-t-[3px] border-dashed border-foreground/30 py-16 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
          No Bills Found
        </h3>
        <p className="font-serif text-sm italic text-muted-foreground max-w-sm mx-auto">
          Try adjusting your search filters or check back later for new legislation.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
      {bills.map((bill, i) => (
        <div
          key={bill.id}
          className={`${(i + 1) % 3 !== 0 ? "lg:border-r" : ""} ${i < bills.length - (bills.length % 3 || 3) ? "border-b" : ""} border-foreground/20`}
        >
          <BillCard bill={bill} />
        </div>
      ))}
    </div>
  );
}
