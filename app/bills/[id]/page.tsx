import { notFound } from "next/navigation";
import { BillDetail } from "@/components/bill-detail";

interface BillPageProps {
  params: Promise<{ id: string }>;
}

async function getBill(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/bills/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch bill");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching bill:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BillPageProps) {
  const { id } = await params;
  const data = await getBill(id);

  if (!data) {
    return {
      title: "Bill Not Found | What's in that Bill?",
    };
  }

  const billNumber = `${data.bill.billType.toUpperCase()} ${data.bill.billNumber}`;
  const title = data.bill.shortTitle || data.bill.title;

  return {
    title: `${billNumber}: ${title} | What's in that Bill?`,
    description:
      data.summary?.oneLiner ||
      `Analysis of ${billNumber} - ${title}`,
    openGraph: {
      title: `${billNumber}: ${title}`,
      description:
        data.summary?.shortSummary ||
        `AI-powered analysis of Congressional bill ${billNumber}`,
    },
  };
}

export default async function BillPage({ params }: BillPageProps) {
  const { id } = await params;
  const data = await getBill(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BillDetail bill={data.bill} summary={data.summary} />
    </main>
  );
}
