"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "Enacted", label: "Enacted" },
  { value: "Passed Both Chambers", label: "Passed Both" },
  { value: "Passed House", label: "Passed House" },
  { value: "Passed Senate", label: "Passed Senate" },
  { value: "In Committee", label: "In Committee" },
  { value: "Introduced", label: "Introduced" },
  { value: "Vetoed", label: "Vetoed" },
];

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
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
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname]
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
      router.push(pathname);
    });
  };

  const hasFilters = query || status;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-0">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, sponsor, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-2 border-foreground bg-background py-3 pl-12 pr-4 font-mono text-sm tracking-wide text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-urgent sm:border-r-0"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-foreground text-background font-mono text-xs tracking-widest uppercase px-8 py-3 border-2 border-foreground hover:bg-urgent hover:border-urgent transition-colors font-bold disabled:opacity-50"
        >
          {isPending ? "..." : "Search"}
        </button>
      </form>

      {/* Filter Row */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          Filter by:
        </span>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                status === option.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-foreground/30 hover:border-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}

        {/* Loading Indicator */}
        {isPending && (
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground animate-pulse">
            Loading...
          </span>
        )}
      </div>
    </div>
  );
}
