import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BillList } from "@/components/bill-list";
import { SearchFilters } from "@/components/search-filters";
import { Pagination } from "@/components/pagination";
import type { BillsResponse } from "@/types";

interface SenateBillsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}

async function getSenateBills(searchParams: {
  q?: string;
  status?: string;
  page?: string;
}): Promise<BillsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const params = new URLSearchParams();

  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.page) params.set("page", searchParams.page);
  params.set("chamber", "senate");

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

    const data: BillsResponse = await response.json();

    // Filter for Senate bills (bill type starts with 's')
    const senateBills = data.bills.filter(bill =>
      bill.billType?.toLowerCase().startsWith('s')
    );

    return {
      bills: senateBills,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching Senate bills:", error);
    return {
      bills: [],
      pagination: { page: 1, limit: 20, hasMore: false },
    };
  }
}

async function SenateBillsContent({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const data = await getSenateBills(searchParams);

  return (
    <>
      <BillList bills={data.bills} />
      {data.bills.length > 0 && <Pagination pagination={data.pagination} />}
    </>
  );
}

export default async function SenateBillsPage({ searchParams }: SenateBillsPageProps) {
  const params = await searchParams;

  return (
    <>
      {/* Page Header Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              United States Senate
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-center mb-4 tracking-tight text-balance">
            {params.q
              ? `Senate Results for "${params.q}"`
              : params.status
                ? `${params.status} Senate Bills`
                : "Senate Bills"}
          </h1>

          <p className="font-serif text-lg md:text-xl italic text-center text-muted-foreground max-w-2xl mx-auto">
            Legislation introduced in the upper chamber — where every state has an equal voice.
            Bills prefixed with S. originate in the Senate.
          </p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="border-b border-foreground/30">
        <div className="p-6 md:p-10">
          <Suspense fallback={<div className="h-16 animate-pulse bg-muted" />}>
            <SearchFilters />
          </Suspense>
        </div>
      </section>

      {/* Bills Grid Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              {params.q ? "Search Results" : "Recent Senate Legislation"}
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <Suspense fallback={<BillList bills={[]} isLoading />}>
            <SenateBillsContent searchParams={params} />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10 text-center">
          <p className="font-serif text-lg italic text-muted-foreground mb-4">
            Want to explore legislation from the other chamber?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/house-bills"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors group border-2 border-foreground px-4 py-2"
            >
              House Bills
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/bills"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors group border-2 border-foreground px-4 py-2"
            >
              All Bills
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
