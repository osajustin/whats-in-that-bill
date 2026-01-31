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
      {/* Editorial Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="editorial-headline-caps mb-6 font-serif text-5xl text-sepia-900 sm:text-6xl lg:text-7xl">
          ALL BILLS!
        </h1>
        <p className="mx-auto max-w-xl font-serif text-xl italic text-sepia-700 sm:text-2xl">
          A curated selection of Congressional legislation — 
          <br className="hidden sm:block" />
          spanning the current session.
        </p>
        <p className="mt-4 text-sm text-sepia-500">
          TIP! Use filters to explore by status
        </p>
      </section>

      {/* Horizontal Divider */}
      <div className="mb-8 h-px bg-sepia-800" />

      {/* Search and Filters */}
      <section className="mb-8">
        <Suspense fallback={<div className="h-16 animate-pulse bg-sepia-100" />}>
          <SearchFilters />
        </Suspense>
      </section>

      {/* Section Divider */}
      <div className="mb-8 h-px bg-sepia-300" />

      {/* Bills Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-sepia-900 sm:text-3xl">
            {params.q
              ? `Results for "${params.q}"`
              : params.status
                ? `${params.status} Bills`
                : "Recent Bills"}
          </h2>
        </div>

        <Suspense fallback={<BillList bills={[]} isLoading />}>
          <BillsContent searchParams={params} />
        </Suspense>
      </section>

      {/* Footer Divider */}
      <div className="mt-16 h-px bg-sepia-800" />

      {/* Editorial Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-sepia-600">
          Data sourced from{" "}
          <a
            href="https://api.congress.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-coral-600 hover:text-coral-700"
          >
            Congress.gov API
          </a>
          . AI summaries are generated for informational purposes.
        </p>
        <p className="mt-2 font-serif text-xs italic text-sepia-500">
          Always refer to official sources for authoritative information.
        </p>
      </footer>
    </main>
  );
}
