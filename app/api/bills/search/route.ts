import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { desc, ilike, or, and, gte, lte, eq, sql } from "drizzle-orm";
import { getSummariesForBills } from "@/lib/mongodb/summaries";
import type { BillsResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const status = searchParams.get("status");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [];

    // Text search on title and short_title
    if (query) {
      conditions.push(
        or(
          ilike(bills.title, `%${query}%`),
          ilike(bills.shortTitle, `%${query}%`),
          ilike(bills.sponsorName, `%${query}%`)
        )
      );
    }

    // Status filter
    if (status) {
      conditions.push(eq(bills.status, status));
    }

    // Date range filters
    if (fromDate) {
      conditions.push(gte(bills.introducedDate, fromDate));
    }
    if (toDate) {
      conditions.push(lte(bills.introducedDate, toDate));
    }

    // Execute query
    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select()
      .from(bills)
      .where(whereClause)
      .orderBy(desc(bills.introducedDate))
      .limit(limit)
      .offset(offset);

    // Get count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bills)
      .where(whereClause);
    const total = Number(countResult[0]?.count || 0);

    // Fetch summaries
    const billIds = results.map((b) => b.id);
    const summaries = await getSummariesForBills(billIds);

    const response: BillsResponse = {
      bills: results.map((bill) => {
        const summary = summaries[bill.id];
        return {
          ...bill,
          introducedDate: bill.introducedDate
            ? new Date(bill.introducedDate)
            : null,
          latestActionDate: bill.latestActionDate
            ? new Date(bill.latestActionDate)
            : null,
          subjects: bill.subjects || [],
          summary: summary
            ? {
                oneLiner: summary.summary.oneLiner,
                shortSummary: summary.summary.shortSummary,
              }
            : null,
        };
      }),
      pagination: {
        page,
        limit,
        hasMore: offset + results.length < total,
        total,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error searching bills:", error);
    return NextResponse.json(
      { error: "Failed to search bills" },
      { status: 500 }
    );
  }
}
