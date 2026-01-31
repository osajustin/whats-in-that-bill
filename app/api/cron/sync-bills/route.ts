import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  fetchRecentBills,
  fetchBillDetails,
  fetchBillText,
  fetchBillSubjects,
  getBillStatus,
  formatBillId,
} from "@/lib/congress-api";
import { generateBillSummary } from "@/lib/langchain/summaryChain";
import { saveSummary } from "@/lib/mongodb/summaries";

export const maxDuration = 300; // 5 minutes max for Vercel

export async function POST(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    processed: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // Fetch recent bills from Congress API (current congress is 119)
    console.log("Fetching recent bills from Congress API...");
    const recentBills = await fetchRecentBills(119, 50); // Limit to 50 for performance

    console.log(`Found ${recentBills.length} bills to process`);

    for (const apiBill of recentBills) {
      try {
        // Check if bill already exists
        const existingBill = await db
          .select()
          .from(bills)
          .where(
            and(
              eq(bills.congressNumber, apiBill.congress),
              eq(bills.billType, apiBill.type.toLowerCase()),
              eq(bills.billNumber, apiBill.number)
            )
          )
          .limit(1);

        if (existingBill.length > 0) {
          results.skipped++;
          continue;
        }

        // Fetch bill details
        console.log(
          `Processing ${apiBill.type}${apiBill.number} from Congress ${apiBill.congress}...`
        );
        const details = await fetchBillDetails(
          apiBill.congress,
          apiBill.type,
          apiBill.number
        );

        if (!details) {
          results.errors.push(
            `Could not fetch details for ${apiBill.type}${apiBill.number}`
          );
          continue;
        }

        // Fetch subjects
        const subjects = await fetchBillSubjects(
          apiBill.congress,
          apiBill.type,
          apiBill.number
        );

        // Determine status
        const status = getBillStatus(apiBill.latestAction?.text || "");

        // Insert bill into PostgreSQL
        const sponsor = details.sponsors?.[0];
        const insertedBills = await db
          .insert(bills)
          .values({
            congressNumber: apiBill.congress,
            billType: apiBill.type.toLowerCase(),
            billNumber: apiBill.number,
            title: details.title || apiBill.title,
            shortTitle: null,
            introducedDate: details.introducedDate || null,
            latestActionDate: apiBill.latestAction?.actionDate || null,
            latestActionText: apiBill.latestAction?.text || null,
            sponsorName: sponsor?.fullName || null,
            sponsorParty: sponsor?.party || null,
            sponsorState: sponsor?.state || null,
            status,
            subjects,
            congressUrl: apiBill.url || null,
            fullTextUrl: null,
          })
          .returning();

        const insertedBill = insertedBills[0];

        // Fetch full text and generate AI summary
        try {
          const billText = await fetchBillText(
            apiBill.congress,
            apiBill.type,
            apiBill.number
          );

          if (billText) {
            console.log(`Generating AI summary for ${apiBill.type}${apiBill.number}...`);
            const summaryResult = await generateBillSummary({
              title: details.title || apiBill.title,
              billNumber: `${apiBill.type.toUpperCase()} ${apiBill.number}`,
              introducedDate: details.introducedDate || "Unknown",
              sponsor: sponsor?.fullName || "Unknown",
              billText,
            });

            // Save summary to MongoDB
            await saveSummary(
              insertedBill.id,
              formatBillId(apiBill.congress, apiBill.type, apiBill.number),
              summaryResult.summary,
              summaryResult.modelUsed,
              summaryResult.processingTimeMs
            );
          } else {
            console.log(`No text available for ${apiBill.type}${apiBill.number}, generating summary from title only...`);
            // Generate summary from title only
            const summaryResult = await generateBillSummary({
              title: details.title || apiBill.title,
              billNumber: `${apiBill.type.toUpperCase()} ${apiBill.number}`,
              introducedDate: details.introducedDate || "Unknown",
              sponsor: sponsor?.fullName || "Unknown",
              billText: "Full bill text not available. Please base analysis on the title.",
            });

            await saveSummary(
              insertedBill.id,
              formatBillId(apiBill.congress, apiBill.type, apiBill.number),
              summaryResult.summary,
              summaryResult.modelUsed,
              summaryResult.processingTimeMs
            );
          }
        } catch (summaryError) {
          console.error(
            `Failed to generate summary for ${apiBill.type}${apiBill.number}:`,
            summaryError
          );
          // Bill is still saved, just without a summary
        }

        results.processed++;

        // Rate limiting - avoid overwhelming APIs
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (billError) {
        const errorMessage =
          billError instanceof Error ? billError.message : "Unknown error";
        results.errors.push(
          `Error processing ${apiBill.type}${apiBill.number}: ${errorMessage}`
        );
        console.error(`Error processing bill:`, billError);
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.processed,
      skipped: results.skipped,
      errors: results.errors.slice(0, 10), // Limit error output
      message: `Synced ${results.processed} new bills, skipped ${results.skipped} existing bills`,
    });
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also allow GET for manual testing (but still require auth)
export async function GET(request: NextRequest) {
  return POST(request);
}
