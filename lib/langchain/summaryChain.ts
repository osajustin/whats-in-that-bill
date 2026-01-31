import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import type { GeneratedSummary } from "@/types";

// Define the output structure with Zod
const summarySchema = z.object({
  oneLiner: z
    .string()
    .describe("A single sentence summary, max 280 characters"),
  shortSummary: z
    .string()
    .describe("2-3 sentence summary suitable for a card display"),
  detailedSummary: z
    .string()
    .describe("Full paragraph explanation of what the bill does"),
  keyPoints: z
    .array(z.string())
    .describe("3-5 key bullet points about the bill"),
  whoAffected: z
    .array(z.string())
    .describe("Groups of people or entities impacted by this bill"),
  potentialEffects: z
    .array(z.string())
    .describe("Likely outcomes if this bill becomes law"),
  bipartisanSupport: z
    .boolean()
    .describe("Whether this bill is likely to have bipartisan support"),
});

const PROMPT_TEMPLATE = `You are an expert at analyzing US Congressional bills and explaining them in plain language that any citizen can understand. Your goal is to be informative, accurate, and unbiased.

Analyze the following bill and provide a comprehensive summary:

BILL TITLE: {title}
BILL NUMBER: {billNumber}
INTRODUCED: {introducedDate}
SPONSOR: {sponsor}

FULL TEXT:
{billText}

Provide your analysis in JSON format with the following structure:
{{
  "oneLiner": "A single sentence summary, max 280 characters",
  "shortSummary": "2-3 sentence summary suitable for a card display",
  "detailedSummary": "Full paragraph explanation of what the bill does",
  "keyPoints": ["3-5 key bullet points about the bill"],
  "whoAffected": ["Groups of people or entities impacted by this bill"],
  "potentialEffects": ["Likely outcomes if this bill becomes law"],
  "bipartisanSupport": true/false
}}

Focus on:
1. What the bill actually does (not political spin)
2. Who would be affected and how
3. Key provisions in plain language
4. Potential real-world impacts

Be objective and avoid partisan language. If the bill text is truncated or unavailable, base your analysis on the title and any available context.

Respond ONLY with valid JSON, no additional text.`;

interface BillInput {
  title: string;
  billNumber: string;
  introducedDate: string;
  sponsor: string;
  billText: string;
}

interface SummaryResult {
  summary: GeneratedSummary;
  modelUsed: string;
  processingTimeMs: number;
}

function formatPrompt(input: BillInput): string {
  return PROMPT_TEMPLATE
    .replace("{title}", input.title)
    .replace("{billNumber}", input.billNumber)
    .replace("{introducedDate}", input.introducedDate)
    .replace("{sponsor}", input.sponsor)
    .replace("{billText}", input.billText);
}

async function generateWithClaude(input: BillInput): Promise<SummaryResult> {
  const startTime = Date.now();

  const model = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    temperature: 0.3,
    maxTokens: 2000,
  });

  const formattedPrompt = formatPrompt(input);
  const response = await model.invoke(formattedPrompt);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from Claude response");
  }

  const parsed = summarySchema.parse(JSON.parse(jsonMatch[0]));

  return {
    summary: parsed,
    modelUsed: "claude-3-5-sonnet-20241022",
    processingTimeMs: Date.now() - startTime,
  };
}

async function generateWithOpenAI(input: BillInput): Promise<SummaryResult> {
  const startTime = Date.now();

  const model = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.3,
    maxTokens: 2000,
  });

  const formattedPrompt = formatPrompt(input);
  const response = await model.invoke(formattedPrompt);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from OpenAI response");
  }

  const parsed = summarySchema.parse(JSON.parse(jsonMatch[0]));

  return {
    summary: parsed,
    modelUsed: "gpt-4-turbo-preview",
    processingTimeMs: Date.now() - startTime,
  };
}

export async function generateBillSummary(bill: {
  title: string;
  billNumber: string;
  introducedDate: string;
  sponsor: string;
  billText: string;
}): Promise<SummaryResult> {
  // Truncate bill text if too long (Claude has 200k context, but we want to be efficient)
  const maxTextLength = 50000;
  const truncatedText =
    bill.billText.length > maxTextLength
      ? bill.billText.substring(0, maxTextLength) + "\n\n[Text truncated...]"
      : bill.billText;

  const input: BillInput = {
    ...bill,
    billText: truncatedText || "Bill text not available.",
  };

  // Try Claude first, fall back to OpenAI
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (hasAnthropic) {
    try {
      return await generateWithClaude(input);
    } catch (error) {
      console.error("Claude generation failed:", error);
      if (hasOpenAI) {
        console.log("Falling back to OpenAI...");
        return await generateWithOpenAI(input);
      }
      throw error;
    }
  }

  if (hasOpenAI) {
    return await generateWithOpenAI(input);
  }

  throw new Error(
    "No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY."
  );
}

export { summarySchema };
