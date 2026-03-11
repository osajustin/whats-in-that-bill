import { getDatabase } from "./index";
import type { Summary, GeneratedSummary } from "@/types";

const COLLECTION_NAME = "summaries";

export async function getSummaryByBillId(
  billId: number
): Promise<Summary | null> {
  const db = await getDatabase();
  const collection = db.collection<Summary>(COLLECTION_NAME);
  return collection.findOne({ billId });
}

export async function getSummariesForBills(
  billIds: number[]
): Promise<Record<number, Summary>> {
  const db = await getDatabase();
  const collection = db.collection<Summary>(COLLECTION_NAME);

  const summaries = await collection
    .find({ billId: { $in: billIds } })
    .toArray();

  return summaries.reduce(
    (acc, summary) => {
      acc[summary.billId] = summary;
      return acc;
    },
    {} as Record<number, Summary>
  );
}

export async function saveSummary(
  billId: number,
  congressBillId: string,
  summary: GeneratedSummary,
  modelUsed: string,
  processingTimeMs: number,
  tokenCount: number = 0,
  cost: number = 0
): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection<Summary>(COLLECTION_NAME);

  const summaryDocument: Omit<Summary, "_id"> = {
    billId,
    congressBillId,
    generatedAt: new Date(),
    modelUsed,
    promptVersion: "1.0",
    summary: {
      oneLiner: summary.oneLiner,
      shortSummary: summary.shortSummary,
      detailedSummary: summary.detailedSummary,
      keyPoints: summary.keyPoints,
      impact: {
        whoAffected: summary.whoAffected,
        potentialEffects: summary.potentialEffects,
      },
      politicalContext: {
        bipartisanSupport: summary.bipartisanSupport,
        relatedBills: [],
        controversialAspects: [],
      },
    },
    metadata: {
      processingTimeMs,
      tokenCount,
      cost,
    },
  };

  await collection.updateOne(
    { billId },
    { $set: summaryDocument },
    { upsert: true }
  );
}

export async function deleteSummary(billId: number): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection<Summary>(COLLECTION_NAME);
  await collection.deleteOne({ billId });
}

export async function searchSummaries(query: string): Promise<Summary[]> {
  const db = await getDatabase();
  const collection = db.collection<Summary>(COLLECTION_NAME);

  return collection
    .find({
      $text: { $search: query },
    })
    .limit(50)
    .toArray();
}
