"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "Enacted", label: "Enacted" },
  { value: "Passed Both Chambers", label: "Passed Both Chambers" },
  { value: "Passed House", label: "Passed House" },
  { value: "Passed Senate", label: "Passed Senate" },
  { value: "In Committee", label: "In Committee" },
  { value: "Introduced", label: "Introduced" },
  { value: "Vetoed", label: "Vetoed" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const updateFilters = useCallback(
    (newQuery: string, newStatus: string) => {
      const params = new URLSearchParams();
      if (newQuery) params.set("q", newQuery);
      if (newStatus) params.set("status", newStatus);

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(query, status);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateFilters(query, newStatus);
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("");
    startTransition(() => {
      router.push("/");
    });
  };

  const hasFilters = query || status;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        {/* Search Input - Editorial Style */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, sponsor, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b-2 border-sepia-300 bg-transparent py-2.5 pl-8 pr-4 text-sepia-900 placeholder-sepia-400 transition-colors focus:border-sepia-800 focus:outline-none"
          />
          <svg
            className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-sepia-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Search Button - Coral Accent */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-coral-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Dropdown - Editorial Style */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border-b border-sepia-300 bg-transparent px-1 py-2 text-sm text-sepia-700 transition-colors focus:border-sepia-800 focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 border-b border-sepia-300 px-2 py-2 text-sm text-sepia-600 transition-colors hover:border-sepia-600 hover:text-sepia-900"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        )}

        {/* Loading Indicator */}
        {isPending && (
          <span className="text-sm italic text-sepia-500">Loading...</span>
        )}
      </div>
    </div>
  );
}
