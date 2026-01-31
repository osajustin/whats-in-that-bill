"use client";

import { BillCard } from "./bill-card";
import type { BillWithSummary } from "@/types";

interface BillListProps {
  bills: BillWithSummary[];
  isLoading?: boolean;
}

function BillCardSkeleton() {
  return (
    <div className="animate-pulse border-t-2 border-sepia-300 bg-paper p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-sepia-200" />
          <div className="h-4 w-12 bg-coral-100" />
        </div>
        <div className="h-4 w-16 bg-sepia-100" />
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-6 w-full bg-sepia-200" />
        <div className="h-6 w-3/4 bg-sepia-200" />
      </div>
      <div className="mb-4 space-y-1.5">
        <div className="h-4 w-full bg-sepia-100" />
        <div className="h-4 w-full bg-sepia-100" />
        <div className="h-4 w-2/3 bg-sepia-100" />
      </div>
      <div className="flex items-center justify-between border-t border-sepia-200 pt-3">
        <div className="h-4 w-32 bg-sepia-100" />
        <div className="h-4 w-16 bg-sepia-100" />
      </div>
    </div>
  );
}

export function BillList({ bills, isLoading }: BillListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BillCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-t-2 border-dashed border-sepia-300 bg-paper py-16 text-center">
        <svg
          className="mb-4 h-12 w-12 text-sepia-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <h3 className="mb-2 font-serif text-xl font-semibold text-sepia-900">
          No bills found
        </h3>
        <p className="max-w-sm font-serif text-sm italic text-sepia-500">
          Try adjusting your search filters or check back later for new
          legislation.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </div>
  );
}
