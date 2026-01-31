import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  // Check environment variables
  results.envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    MONGODB_URI: !!process.env.MONGODB_URI,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    CONGRESS_API_KEY: !!process.env.CONGRESS_API_KEY,
    CRON_SECRET: !!process.env.CRON_SECRET,
  };

  // Test MongoDB connection
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    const summariesCount = await db.collection("summaries").countDocuments();
    
    results.mongodb = {
      connected: true,
      database: db.databaseName,
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
