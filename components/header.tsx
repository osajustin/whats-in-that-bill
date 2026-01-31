"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur supports-backdrop-filter:bg-cream/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Location Tag - Editorial Style */}
        <span className="hidden text-sm text-sepia-600 sm:block">
          Washington, D.C.
        </span>

        {/* Centered Logo - Editorial Style */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-serif text-xl font-semibold tracking-tight text-sepia-900 sm:text-2xl">
            The Bill Tracker
          </h1>
        </Link>

        {/* Right Navigation */}
        <nav className="ml-auto flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-sepia-700 transition-colors hover:text-coral-600"
          >
            Browse
          </Link>
          <a
            href="https://congress.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-sm font-medium text-sepia-700 transition-colors hover:text-coral-600 sm:flex"
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
          {/* Hamburger Menu Icon */}
          <button className="flex flex-col gap-1" aria-label="Menu">
            <span className="h-0.5 w-5 bg-sepia-800"></span>
            <span className="h-0.5 w-5 bg-sepia-800"></span>
          </button>
        </nav>
      </div>
      {/* Editorial Divider Line */}
      <div className="h-px bg-sepia-800" />

      {/* Search Bar - Below Header */}
      <div className="border-b border-sepia-200 bg-cream/80 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="mx-auto max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bills by title, sponsor, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-b border-sepia-300 bg-transparent py-2 pl-8 pr-4 text-sm text-sepia-900 placeholder-sepia-500 transition-colors focus:border-coral-500 focus:outline-none"
              />
              <svg
                className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-sepia-500"
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
          </form>
        </div>
      </div>
    </header>
  );
}
