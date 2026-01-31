import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getSummariesForBills } from "@/lib/mongodb/summaries";
import type { BillsResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    // Build and execute query based on filters
    const whereClause = status ? eq(bills.status, status) : undefined;

    const results = await db
      .select()
      .from(bills)
      .where(whereClause)
      .orderBy(desc(bills.introducedDate))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bills)
      .where(whereClause);
    const total = Number(countResult[0]?.count || 0);

    // Fetch summaries for these bills
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
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}
