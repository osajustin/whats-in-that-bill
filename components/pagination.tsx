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
    <div className="mt-8 flex items-center justify-between border-t border-sepia-300 bg-paper px-4 py-4 sm:px-6">
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1 || isPending}
          className="relative inline-flex items-center border-b border-sepia-400 px-4 py-2 text-sm font-medium text-sepia-700 hover:border-sepia-800 hover:text-sepia-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={!hasMore || isPending}
          className="relative ml-3 inline-flex items-center border-b border-sepia-400 px-4 py-2 text-sm font-medium text-sepia-700 hover:border-sepia-800 hover:text-sepia-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-sepia-600">
            {total !== undefined ? (
              <>
                Page <span className="font-serif font-semibold text-sepia-900">{page}</span>
                {totalPages && (
                  <>
                    {" "}
                    of <span className="font-serif font-semibold text-sepia-900">{totalPages}</span>
                  </>
                )}
                {" — "}
                <span className="font-serif font-semibold text-sepia-900">{total}</span> total bills
              </>
            ) : (
              <>Page <span className="font-serif font-semibold">{page}</span></>
            )}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex items-center gap-1"
            aria-label="Pagination"
          >
            {/* Previous Button */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || isPending}
              className="relative inline-flex items-center border-b border-transparent px-3 py-2 text-sm font-medium text-sepia-600 hover:border-sepia-800 hover:text-sepia-900 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="mr-1 h-4 w-4"
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
              Previous
            </button>

            {/* Divider */}
            <span className="mx-2 h-4 w-px bg-sepia-300" />

            {/* Current Page */}
            <span className="relative inline-flex items-center border-b-2 border-sepia-800 px-4 py-2 font-serif text-sm font-bold text-sepia-900">
              {page}
            </span>

            {/* Divider */}
            <span className="mx-2 h-4 w-px bg-sepia-300" />

            {/* Next Button */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={!hasMore || isPending}
              className="relative inline-flex items-center border-b border-transparent px-3 py-2 text-sm font-medium text-sepia-600 hover:border-sepia-800 hover:text-sepia-900 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <svg
                className="ml-1 h-4 w-4"
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
