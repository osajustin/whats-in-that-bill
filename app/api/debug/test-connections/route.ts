import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { db } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  // Check environment variables (show partial hostname for debugging)
  const dbUrl = process.env.DATABASE_URL || "";
  let dbHostname = "not set";
  try {
    const url = new URL(dbUrl);
    dbHostname = url.hostname;
  } catch {
    dbHostname = "invalid URL format";
  }

  results.envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DATABASE_HOSTNAME: dbHostname,
    MONGODB_URI: !!process.env.MONGODB_URI,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    CONGRESS_API_KEY: !!process.env.CONGRESS_API_KEY,
    CRON_SECRET: !!process.env.CRON_SECRET,
  };

  // Test PostgreSQL/Supabase connection
  try {
    const result = await db.execute(sql`SELECT 1 as test`);
    const billCount = await db.select({ count: sql<number>`count(*)` }).from(bills);
    
    results.postgres = {
      connected: true,
      billsCount: billCount[0]?.count ?? 0,
    };
  } catch (error) {
    results.postgres = {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      cause: error instanceof Error && error.cause ? String(error.cause) : undefined,
    };
  }

  // Test MongoDB connection
  try {
    const mongoDb = await getDatabase();
    const collections = await mongoDb.listCollections().toArray();
    const summariesCount = await mongoDb.collection("summaries").countDocuments();
    
    results.mongodb = {
      connected: true,
      database: mongoDb.databaseName,
      collections: collections.map((c) => c.name),
      summariesCount,
    };
  } catch (error) {
    results.mongodb = {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Test AI providers
  results.ai = {
    anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    preferredProvider: process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.OPENAI_API_KEY ? "openai" : "none",
  };

  return NextResponse.json(results);
}
