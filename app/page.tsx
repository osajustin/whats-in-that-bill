import { Suspense } from "react";
import { BillList } from "@/components/bill-list";
import { SearchFilters } from "@/components/search-filters";
import { Pagination } from "@/components/pagination";
import type { BillsResponse } from "@/types";

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}

async function getBills(searchParams: {
  q?: string;
  status?: string;
  page?: string;
}): Promise<BillsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const params = new URLSearchParams();

  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.page) params.set("page", searchParams.page);

  const endpoint = searchParams.q
    ? `${baseUrl}/api/bills/search?${params.toString()}`
    : `${baseUrl}/api/bills?${params.toString()}`;

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bills");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching bills:", error);
    return {
      bills: [],
      pagination: { page: 1, limit: 20, hasMore: false },
    };
  }
}

async function BillsContent({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const data = await getBills(searchParams);

  return (
    <>
      <BillList bills={data.bills} />
      {data.bills.length > 0 && <Pagination pagination={data.pagination} />}
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-navy-900 sm:text-5xl">
          What&apos;s in that Bill?
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-navy-600">
          Understand Congressional legislation with AI-powered summaries.
          We analyze bills so you can stay informed about laws that affect your
          life.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="mb-8">
        <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-navy-100" />}>
          <SearchFilters />
        </Suspense>
      </section>

      {/* Bills Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-navy-900">
            {params.q
              ? `Search Results for "${params.q}"`
              : params.status
                ? `${params.status} Bills`
                : "Recent Bills"}
          </h2>
        </div>

        <Suspense fallback={<BillList bills={[]} isLoading />}>
          <BillsContent searchParams={params} />
        </Suspense>
      </section>

      {/* Footer Info */}
      <footer className="mt-16 border-t border-navy-200 pt-8 text-center">
        <p className="text-sm text-navy-500">
          Data sourced from{" "}
          <a
            href="https://api.congress.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-crimson-600 hover:text-crimson-700"
          >
            Congress.gov API
          </a>
          . AI summaries are generated for informational purposes and may contain
          errors. Always refer to official sources for authoritative information.
        </p>
      </footer>
    </main>
  );
}
