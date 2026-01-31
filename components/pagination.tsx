"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { PaginationInfo } from "@/types";

interface PaginationProps {
  pagination: PaginationInfo;
}

export function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { page, hasMore, total } = pagination;

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const totalPages = total ? Math.ceil(total / pagination.limit) : undefined;

  return (
    <div className="flex items-center justify-between border-t border-navy-200 bg-white px-4 py-3 sm:px-6">
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1 || isPending}
          className="relative inline-flex items-center rounded-md border border-navy-300 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={!hasMore || isPending}
          className="relative ml-3 inline-flex items-center rounded-md border border-navy-300 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-navy-700">
            {total !== undefined ? (
              <>
                Showing page <span className="font-medium">{page}</span>
                {totalPages && (
                  <>
                    {" "}
                    of <span className="font-medium">{totalPages}</span>
                  </>
                )}
                {" • "}
                <span className="font-medium">{total}</span> total bills
              </>
            ) : (
              <>Page {page}</>
            )}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* Previous Button */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || isPending}
              className="relative inline-flex items-center rounded-l-md border border-navy-300 bg-white px-3 py-2 text-sm font-medium text-navy-500 hover:bg-navy-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Current Page */}
            <span className="relative inline-flex items-center border border-navy-300 bg-crimson-50 px-4 py-2 text-sm font-semibold text-crimson-600 focus:z-20">
              {page}
            </span>

            {/* Next Button */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={!hasMore || isPending}
              className="relative inline-flex items-center rounded-r-md border border-navy-300 bg-white px-3 py-2 text-sm font-medium text-navy-500 hover:bg-navy-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
