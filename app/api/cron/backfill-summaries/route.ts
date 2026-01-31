import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import {
  fetchBillText,
  formatBillId,
} from "@/lib/congress-api";
import { generateBillSummary } from "@/lib/langchain/summaryChain";
import { saveSummary, getSummaryByBillId } from "@/lib/mongodb/summaries";

export const maxDuration = 300; // 5 minutes max for Vercel

export async function POST(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam) : 10;

  const results = {
    checked: 0,
    generated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // Get bills from PostgreSQL
    console.log(`Fetching up to ${limit} bills from database...`);
    const allBills = await db
      .select()
      .from(bills)
      .orderBy(desc(bills.createdAt))
      .limit(limit);

    console.log(`Found ${allBills.length} bills to check`);

    for (const bill of allBills) {
      results.checked++;
      
      try {
        // Check if summary already exists in MongoDB
        const existingSummary = await getSummaryByBillId(bill.id);
        
        if (existingSummary) {
          console.log(`Bill ${bill.id} already has summary, skipping`);
          results.skipped++;
          continue;
        }

        console.log(`Generating summary for bill ${bill.id}: ${bill.billType.toUpperCase()} ${bill.billNumber}...`);

        // Try to fetch bill text
        let billText: string | null = null;
        try {
          billText = await fetchBillText(
            bill.congressNumber,
            bill.billType,
            bill.billNumber
          );
        } catch (e) {
          console.log(`Could not fetch bill text: ${e}`);
        }

        const textToUse = billText || "Full bill text not available. Please base analysis on the title.";
        
        console.log(`Text length: ${textToUse.length}`);
        
        // Generate summary
        const summaryResult = await generateBillSummary({
          title: bill.title,
          billNumber: `${bill.billType.toUpperCase()} ${bill.billNumber}`,
          introducedDate: bill.introducedDate || "Unknown",
          sponsor: bill.sponsorName || "Unknown",
          billText: textToUse,
        });

        console.log(`Summary generated using ${summaryResult.modelUsed}, saving to MongoDB...`);

        // Save to MongoDB
        await saveSummary(
          bill.id,
          formatBillId(bill.congressNumber, bill.billType, bill.billNumber),
          summaryResult.summary,
          summaryResult.modelUsed,
          summaryResult.processingTimeMs
        );

        console.log(`Summary saved for bill ${bill.id}`);
        results.generated++;

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error processing bill ${bill.id}:`, error);
        results.errors.push(`Bill ${bill.id}: ${errorMsg}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      message: `Generated ${results.generated} summaries, skipped ${results.skipped} existing, ${results.errors.length} errors`,
    });
  } catch (error) {
    console.error("Backfill failed:", error);
    return NextResponse.json(
      {
        error: "Backfill failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
