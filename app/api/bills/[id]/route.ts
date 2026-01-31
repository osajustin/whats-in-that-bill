import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSummaryByBillId } from "@/lib/mongodb/summaries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const billId = parseInt(id);

    if (isNaN(billId)) {
      return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 });
    }

    // Fetch bill from PostgreSQL
    const billResults = await db
      .select()
      .from(bills)
      .where(eq(bills.id, billId))
      .limit(1);

    if (billResults.length === 0) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    const bill = billResults[0];

    // Fetch summary from MongoDB
    const summary = await getSummaryByBillId(billId);

    return NextResponse.json({
      bill: {
        ...bill,
        introducedDate: bill.introducedDate
          ? new Date(bill.introducedDate)
          : null,
        latestActionDate: bill.latestActionDate
          ? new Date(bill.latestActionDate)
          : null,
        subjects: bill.subjects || [],
      },
      summary: summary
        ? {
            oneLiner: summary.summary.oneLiner,
            shortSummary: summary.summary.shortSummary,
            detailedSummary: summary.summary.detailedSummary,
            keyPoints: summary.summary.keyPoints,
            impact: summary.summary.impact,
            politicalContext: summary.summary.politicalContext,
            generatedAt: summary.generatedAt,
            modelUsed: summary.modelUsed,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}
