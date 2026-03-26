import { NextRequest, NextResponse } from "next/server";
import {
  listBillsWithSummaries,
  parseChamberParam,
} from "@/lib/bills/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const status = searchParams.get("status");
    const chamber = parseChamberParam(searchParams.get("chamber"));
    const billType = searchParams.get("billType");

    const response = await listBillsWithSummaries({
      page,
      limit,
      status: status || undefined,
      chamber: billType ? "all" : chamber,
      billType: billType || undefined,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}
