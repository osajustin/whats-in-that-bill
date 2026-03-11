/**
 * Backfill bill metadata from Congress.gov API into the database.
 * Congresses 115-119, bill types: hr, s (metadata only, no AI summaries).
 *
 * Usage:
 *   npm run backfill:phase1  - Bulk list insert (~10-15 min)
 *   npm run backfill:phase2  - Detail enrichment (~15-20 hours, resumable)
 *   npm run backfill         - Run both phases
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import {
  fetchBillsByCongressAndType,
  fetchBillDetails,
  getBillStatus,
} from "@/lib/congress-api";
import type { CongressApiBill } from "@/types";
import * as fs from "fs";
import * as path from "path";

const CONGRESSES = [115, 116, 117, 118, 119];
const BILL_TYPES = ["hr", "s"];
const LIST_LIMIT = 250;
const PHASE1_DELAY_MS = 500;
const PHASE2_DELAY_MS = 750;
const PROGRESS_FILE = path.join(__dirname, ".backfill-progress.json");

interface BackfillProgress {
  phase: number;
  lastCongress?: number;
  lastBillType?: string;
  lastOffset?: number;
  lastBillId?: number;
  totalInserted?: number;
  totalEnriched?: number;
}

function parseArgs(): {
  phase: 1 | 2 | "all";
  congressFilter?: number;
  resume: boolean;
} {
  const args = process.argv.slice(2);
  let phase: 1 | 2 | "all" = "all";
  let congressFilter: number | undefined;
  let resume = false;

  for (const arg of args) {
    if (arg.startsWith("--phase=")) {
      const val = arg.slice(8);
      if (val === "1") phase = 1;
      else if (val === "2") phase = 2;
    } else if (arg.startsWith("--congress=")) {
      congressFilter = parseInt(arg.slice(11), 10);
    } else if (arg === "--resume") {
      resume = true;
    }
  }

  return { phase, congressFilter, resume };
}

function loadProgress(): BackfillProgress | null {
  try {
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(data) as BackfillProgress;
  } catch {
    return null;
  }
}

function saveProgress(progress: BackfillProgress): void {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function apiBillToInsertValues(apiBill: CongressApiBill) {
  const status = getBillStatus(apiBill.latestAction?.text || "");
  return {
    congressNumber: apiBill.congress,
    billType: apiBill.type.toLowerCase(),
    billNumber: apiBill.number,
    title: apiBill.title || "Untitled",
    shortTitle: null,
    introducedDate: null,
    latestActionDate: apiBill.latestAction?.actionDate || null,
    latestActionText: apiBill.latestAction?.text || null,
    sponsorName: null,
    sponsorParty: null,
    sponsorState: null,
    status,
    subjects: null,
    congressUrl: apiBill.url || null,
    fullTextUrl: null,
  };
}

async function runPhase1(opts: {
  congressFilter?: number;
  resume: boolean;
}): Promise<void> {
  const congresses = opts.congressFilter
    ? CONGRESSES.filter((c) => c === opts.congressFilter)
    : CONGRESSES;

  let totalInserted = 0;
  let startCongress = congresses[0];
  let startType = BILL_TYPES[0];
  let startOffset = 0;

  if (opts.resume) {
    const prog = loadProgress();
    if (
      prog?.phase === 1 &&
      prog.lastCongress &&
      prog.lastBillType !== undefined &&
      prog.lastOffset !== undefined
    ) {
      startCongress = prog.lastCongress;
      startType = prog.lastBillType;
      startOffset = prog.lastOffset + LIST_LIMIT;
      totalInserted = prog.totalInserted ?? 0;
      console.log(
        `Resuming Phase 1 from Congress ${startCongress}, type ${startType}, offset ${startOffset}`
      );
    }
  }

  const congressIndex = congresses.indexOf(startCongress);
  const typeIndex = BILL_TYPES.indexOf(startType);

  for (let ci = congressIndex >= 0 ? congressIndex : 0; ci < congresses.length; ci++) {
    const congress = congresses[ci];
    for (let ti = ci === congressIndex ? typeIndex : 0; ti < BILL_TYPES.length; ti++) {
      const billType = BILL_TYPES[ti];
      let offset = ci === congressIndex && ti === typeIndex ? startOffset : 0;

      console.log(`\n--- Congress ${congress}, type ${billType} ---`);

      while (true) {
        const { bills: apiBills, pagination } = await fetchBillsByCongressAndType(
          congress,
          billType,
          LIST_LIMIT,
          offset
        );

        if (apiBills.length === 0) break;

        for (const apiBill of apiBills) {
          try {
            await db
              .insert(bills)
              .values(apiBillToInsertValues(apiBill))
              .onConflictDoUpdate({
                target: [bills.congressNumber, bills.billType, bills.billNumber],
                set: {
                  title: apiBill.title || "Untitled",
                  latestActionDate: apiBill.latestAction?.actionDate || null,
                  latestActionText: apiBill.latestAction?.text || null,
                  status: getBillStatus(apiBill.latestAction?.text || ""),
                  congressUrl: apiBill.url || null,
                  updatedAt: new Date(),
                },
              });
            totalInserted++;
          } catch (err) {
            console.error(
              `Failed to upsert ${apiBill.type}${apiBill.number}:`,
              err
            );
          }
        }

        console.log(
          `  Offset ${offset}: inserted/updated ${apiBills.length} bills (total: ${totalInserted})`
        );

        saveProgress({
          phase: 1,
          lastCongress: congress,
          lastBillType: billType,
          lastOffset: offset,
          totalInserted,
        });

        const totalCount = pagination?.totalCount;
        if (totalCount !== undefined && offset + apiBills.length >= totalCount) {
          break;
        }
        if (apiBills.length < LIST_LIMIT) break;

        offset += LIST_LIMIT;
        await new Promise((r) => setTimeout(r, PHASE1_DELAY_MS));
      }
    }
  }

  console.log(`\nPhase 1 complete. Total bills inserted/updated: ${totalInserted}`);
}

async function runPhase2(opts: {
  congressFilter?: number;
  resume: boolean;
}): Promise<void> {
  let lastBillId = 0;
  let totalEnriched = 0;

  if (opts.resume) {
    const prog = loadProgress();
    if (prog?.phase === 2 && prog.lastBillId) {
      lastBillId = prog.lastBillId;
      totalEnriched = prog.totalEnriched ?? 0;
      console.log(`Resuming Phase 2 from bill ID > ${lastBillId}`);
    }
  }

  const BATCH_SIZE = 100;

  while (true) {
    const whereClause = opts.congressFilter
      ? and(isNull(bills.sponsorName), eq(bills.congressNumber, opts.congressFilter))
      : isNull(bills.sponsorName);

    const toProcess = await db
      .select()
      .from(bills)
      .where(whereClause)
      .orderBy(bills.id)
      .limit(BATCH_SIZE);

    if (toProcess.length === 0) {
      console.log("No more bills to enrich.");
      break;
    }

    for (const bill of toProcess) {
      try {
        const details = await fetchBillDetails(
          bill.congressNumber,
          bill.billType,
          bill.billNumber
        );
        if (!details) continue;

        const sponsor = details.sponsors?.[0];
        await db
          .update(bills)
          .set({
            sponsorName: sponsor?.fullName ?? null,
            sponsorParty: sponsor?.party ?? null,
            sponsorState: sponsor?.state ?? null,
            introducedDate: details.introducedDate
              ? new Date(details.introducedDate)
              : null,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(bills.congressNumber, bill.congressNumber),
              eq(bills.billType, bill.billType),
              eq(bills.billNumber, bill.billNumber)
            )
          );

        totalEnriched++;
        lastBillId = bill.id;

        if (totalEnriched % 10 === 0) {
          console.log(
            `  Enriched ${totalEnriched} bills (last ID: ${lastBillId})`
          );
          saveProgress({
            phase: 2,
            lastBillId,
            totalEnriched,
          });
        }
      } catch (err) {
        console.error(`Failed to enrich bill ${bill.id}:`, err);
      }

      await new Promise((r) => setTimeout(r, PHASE2_DELAY_MS));
    }

    if (toProcess.length < BATCH_SIZE) break;
  }

  console.log(`\nPhase 2 complete. Total bills enriched: ${totalEnriched}`);
}

async function main(): Promise<void> {
  const { phase, congressFilter, resume } = parseArgs();

  if (!process.env.CONGRESS_API_KEY) {
    console.error("CONGRESS_API_KEY environment variable is required.");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  let interrupted = false;
  process.on("SIGINT", () => {
    interrupted = true;
    console.log("\nInterrupted. Progress saved. Run with --resume to continue.");
  });

  try {
    if (phase === 1 || phase === "all") {
      await runPhase1({ congressFilter, resume });
      if (interrupted) return;
    }
    if (phase === 2 || phase === "all") {
      await runPhase2({ congressFilter, resume });
    }
  } catch (err) {
    console.error("Backfill failed:", err);
    process.exit(1);
  }
}

main();
