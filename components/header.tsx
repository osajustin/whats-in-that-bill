"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bills?q=${encodeURIComponent(searchQuery.trim())}`);
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
            What&apos;s in That Bill?
          </h1>
        </Link>

        {/* Right Navigation */}
        <nav className="ml-auto flex items-center gap-4 lg:gap-6">
          <Link
            href="/bills"
            className="hidden text-sm font-medium text-sepia-700 transition-colors hover:text-coral-600 md:block"
          >
            All Bills
          </Link>
          <Link
            href="/senate-bills"
            className="hidden text-sm font-medium text-sepia-700 transition-colors hover:text-coral-600 lg:block"
          >
            Senate
          </Link>
          <Link
            href="/house-bills"
            className="hidden text-sm font-medium text-sepia-700 transition-colors hover:text-coral-600 lg:block"
          >
            House
          </Link>
          <Link
            href="/about"
            className="hidden text-sm font-medium text-sepia-700 transition-colors hover:text-coral-600 md:block"
          >
            About
          </Link>
          {/* Hamburger Menu Button */}
          <button
            className="flex flex-col gap-1 lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="h-0.5 w-5 bg-sepia-800"></span>
            <span className="h-0.5 w-5 bg-sepia-800"></span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="border-b border-sepia-300 bg-cream py-4 lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-3">
            <Link
              href="/bills"
              className="text-sm font-medium text-sepia-700 hover:text-coral-600"
              onClick={() => setMenuOpen(false)}
            >
              All Bills
            </Link>
            <Link
              href="/senate-bills"
              className="text-sm font-medium text-sepia-700 hover:text-coral-600"
              onClick={() => setMenuOpen(false)}
            >
              Senate Bills
            </Link>
            <Link
              href="/house-bills"
              className="text-sm font-medium text-sepia-700 hover:text-coral-600"
              onClick={() => setMenuOpen(false)}
            >
              House Bills
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-sepia-700 hover:text-coral-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-sepia-700 hover:text-coral-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
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
