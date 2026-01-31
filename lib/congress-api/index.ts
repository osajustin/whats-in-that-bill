import type { CongressApiBill, CongressApiBillDetail } from "@/types";

const BASE_URL = "https://api.congress.gov/v3";

function getApiKey(): string {
  const apiKey = process.env.CONGRESS_API_KEY;
  if (!apiKey) {
    throw new Error("CONGRESS_API_KEY environment variable is not set");
  }
  return apiKey;
}

export async function fetchRecentBills(
  congress: number = 119,
  limit: number = 250
): Promise<CongressApiBill[]> {
  const apiKey = getApiKey();
  const response = await fetch(
    `${BASE_URL}/bill/${congress}?format=json&limit=${limit}&api_key=${apiKey}`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch bills: ${response.statusText}`);
  }

  const data = await response.json();
  return data.bills || [];
}

export async function fetchBillDetails(
  congress: number,
  billType: string,
  billNumber: number
): Promise<CongressApiBillDetail | null> {
  const apiKey = getApiKey();
  const response = await fetch(
    `${BASE_URL}/bill/${congress}/${billType.toLowerCase()}/${billNumber}?format=json&api_key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch bill details: ${response.statusText}`);
  }

  const data = await response.json();
  return data.bill || null;
}

export async function fetchBillText(
  congress: number,
  billType: string,
  billNumber: number
): Promise<string | null> {
  const apiKey = getApiKey();

  // First, get the text versions available
  const textVersionsResponse = await fetch(
    `${BASE_URL}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/text?format=json&api_key=${apiKey}`
  );

  if (!textVersionsResponse.ok) {
    if (textVersionsResponse.status === 404) return null;
    throw new Error(
      `Failed to fetch bill text versions: ${textVersionsResponse.statusText}`
    );
  }

  const textData = await textVersionsResponse.json();
  const textVersions = textData.textVersions || [];

  if (textVersions.length === 0) {
    return null;
  }

  // Get the most recent text version
  const latestVersion = textVersions[0];
  const formats = latestVersion.formats || [];

  // Prefer formatted text, then plain text
  const textFormat =
    formats.find((f: { type: string; url: string }) => f.type === "Formatted Text") ||
    formats.find((f: { type: string; url: string }) => f.type === "Plain Text");

  if (!textFormat?.url) {
    return null;
  }

  // Fetch the actual text content
  const textResponse = await fetch(textFormat.url);
  if (!textResponse.ok) {
    return null;
  }

  const text = await textResponse.text();

  // Clean up HTML if it's formatted text
  if (textFormat.type === "Formatted Text") {
    return cleanHtmlText(text);
  }

  return text;
}

function cleanHtmlText(html: string): string {
  // Basic HTML tag removal for plain text extraction
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchBillSubjects(
  congress: number,
  billType: string,
  billNumber: number
): Promise<string[]> {
  const apiKey = getApiKey();
  const response = await fetch(
    `${BASE_URL}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/subjects?format=json&api_key=${apiKey}`
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const subjects = data.subjects?.legislativeSubjects || [];

  return subjects.map((s: { name: string }) => s.name);
}

export function getBillStatus(latestActionText: string): string {
  const text = latestActionText.toLowerCase();

  if (text.includes("became public law") || text.includes("signed by president")) {
    return "Enacted";
  }
  if (text.includes("passed house") && text.includes("passed senate")) {
    return "Passed Both Chambers";
  }
  if (text.includes("passed house")) {
    return "Passed House";
  }
  if (text.includes("passed senate")) {
    return "Passed Senate";
  }
  if (text.includes("vetoed")) {
    return "Vetoed";
  }
  if (text.includes("referred to")) {
    return "In Committee";
  }
  if (text.includes("introduced")) {
    return "Introduced";
  }

  return "Pending";
}

export function formatBillId(
  congress: number,
  type: string,
  number: number
): string {
  return `${congress}-${type.toLowerCase()}-${number}`;
}
