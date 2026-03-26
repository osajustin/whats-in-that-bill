import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import {
  and,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import {
  getSummariesForBills,
  getSummaryByBillId,
} from "@/lib/mongodb/summaries";
import type { Bill, BillWithSummary, BillsResponse } from "@/types";
import {
  HOUSE_BILL_TYPES,
  SENATE_BILL_TYPES,
  type ChamberFilter,
} from "./chamber";

export interface ListBillsOptions {
  page?: number;
  limit?: number;
  status?: string | null;
  /** Full-text-ish search on title, short title, sponsor */
  q?: string | null;
  chamber?: ChamberFilter;
  /** Exact `bill_type` row value, e.g. `hr` or `s` (overrides chamber if both set) */
  billType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

function normalizeChamber(value: string | null | undefined): ChamberFilter {
  if (value === "senate" || value === "house") return value;
  return "all";
}

/** Parse chamber from query string (supports legacy `chamber=` from pages). */
export function parseChamberParam(
  chamber: string | null | undefined
): ChamberFilter {
  return normalizeChamber(chamber);
}

function mapRowToBillWithSummary(
  bill: typeof bills.$inferSelect,
  summary: BillWithSummary["summary"]
): BillWithSummary {
  return {
    ...bill,
    introducedDate: bill.introducedDate
      ? new Date(bill.introducedDate)
      : null,
    latestActionDate: bill.latestActionDate
      ? new Date(bill.latestActionDate)
      : null,
    subjects: bill.subjects || [],
    createdAt: new Date(bill.createdAt),
    updatedAt: new Date(bill.updatedAt),
    summary,
  };
}

/**
 * Shared list query for Postgres bills + Mongo summary cards.
 * Used by API routes and server components.
 */
export async function listBillsWithSummaries(
  opts: ListBillsOptions
): Promise<BillsResponse> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(Math.max(1, opts.limit ?? 20), 100);
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (opts.billType?.trim()) {
    conditions.push(eq(bills.billType, opts.billType.trim().toLowerCase()));
  } else if (opts.chamber === "senate") {
    conditions.push(inArray(bills.billType, [...SENATE_BILL_TYPES]));
  } else if (opts.chamber === "house") {
    conditions.push(inArray(bills.billType, [...HOUSE_BILL_TYPES]));
  }

  if (opts.status) {
    conditions.push(eq(bills.status, opts.status));
  }

  if (opts.q?.trim()) {
    const term = opts.q.trim();
    const searchCond = or(
      ilike(bills.title, `%${term}%`),
      ilike(bills.shortTitle, `%${term}%`),
      ilike(bills.sponsorName, `%${term}%`)
    );
    if (searchCond) conditions.push(searchCond);
  }

  if (opts.fromDate) {
    conditions.push(gte(bills.introducedDate, opts.fromDate));
  }
  if (opts.toDate) {
    conditions.push(lte(bills.introducedDate, opts.toDate));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(bills)
    .where(whereClause)
    .orderBy(desc(bills.introducedDate))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(bills)
    .where(whereClause);
  const total = Number(countResult[0]?.count || 0);

  const billIds = results.map((b) => b.id);
  const summaries = await getSummariesForBills(billIds);

  const billsOut: BillWithSummary[] = results.map((bill) => {
    const s = summaries[bill.id];
    return mapRowToBillWithSummary(
      bill,
      s
        ? {
            oneLiner: s.summary.oneLiner,
            shortSummary: s.summary.shortSummary,
          }
        : null
    );
  });

  return {
    bills: billsOut,
    pagination: {
      page,
      limit,
      hasMore: offset + results.length < total,
      total,
    },
  };
}

export async function getBillDetailPayload(id: string): Promise<{
  bill: Bill;
  summary: {
    oneLiner: string;
    shortSummary: string;
    detailedSummary: string;
    keyPoints: string[];
    impact: {
      whoAffected: string[];
      potentialEffects: string[];
    };
    politicalContext: {
      bipartisanSupport: boolean;
      relatedBills: string[];
      controversialAspects: string[];
    };
    generatedAt: Date;
    modelUsed: string;
  } | null;
} | null> {
  const billId = parseInt(id, 10);
  if (Number.isNaN(billId)) return null;

  const billResults = await db
    .select()
    .from(bills)
    .where(eq(bills.id, billId))
    .limit(1);

  if (billResults.length === 0) return null;

  const row = billResults[0];
  const summaryDoc = await getSummaryByBillId(billId);

  const bill: Bill = {
    ...row,
    introducedDate: row.introducedDate ? new Date(row.introducedDate) : null,
    latestActionDate: row.latestActionDate
      ? new Date(row.latestActionDate)
      : null,
    subjects: row.subjects || [],
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };

  const summary = summaryDoc
    ? {
        oneLiner: summaryDoc.summary.oneLiner,
        shortSummary: summaryDoc.summary.shortSummary,
        detailedSummary: summaryDoc.summary.detailedSummary,
        keyPoints: summaryDoc.summary.keyPoints,
        impact: summaryDoc.summary.impact,
        politicalContext: summaryDoc.summary.politicalContext,
        generatedAt:
          summaryDoc.generatedAt instanceof Date
            ? summaryDoc.generatedAt
            : new Date(summaryDoc.generatedAt),
        modelUsed: summaryDoc.modelUsed,
      }
    : null;

  return { bill, summary };
}

export interface HomeLatestBill {
  id: number;
  billLabel: string;
  introducedDate: Date | null;
  title: string;
  teaser: string;
  urgent: boolean;
  image: string;
  imageAlt: string;
}

/**
 * Recent bills that already have an AI summary (for homepage hero cards).
 */
export async function getLatestBillsWithSummariesForHome(
  count: number
): Promise<HomeLatestBill[]> {
  const rows = await db
    .select()
    .from(bills)
    .orderBy(desc(bills.introducedDate))
    .limit(120);

  if (rows.length === 0) return [];

  const summaries = await getSummariesForBills(rows.map((r) => r.id));
  const withSummary = rows.filter((r) => summaries[r.id]);
  const picked = withSummary.slice(0, count);

  return picked.map((b, i) => {
    const s = summaries[b.id]!;
    const introduced = b.introducedDate
      ? new Date(b.introducedDate)
      : null;
    const teaser =
      s.summary.shortSummary || s.summary.oneLiner || "Read the AI breakdown.";
    const images = [
      {
        image: "/images/legislative-gavel.webp",
        imageAlt:
          "A judge's gavel on a wooden desk with scattered legal documents",
      },
      {
        image: "/images/state-of-union.webp",
        imageAlt: "A legislative chamber floor with rows of desks and chairs",
      },
    ] as const;
    const img = images[i % images.length];
    return {
      id: b.id,
      billLabel: `${b.billType.toUpperCase()} ${b.billNumber}`,
      introducedDate: introduced,
      title: b.shortTitle || b.title,
      teaser,
      urgent: false,
      image: img.image,
      imageAlt: img.imageAlt,
    };
  });
}
