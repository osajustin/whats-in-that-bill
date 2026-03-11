import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <>
      {/* Back Navigation */}
      <section className="border-b border-foreground/30">
        <div className="px-6 py-4">
          <Link
            href="/bills"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Bills
          </Link>
        </div>
      </section>

      {/* Bill Content */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          <BillDetail bill={data.bill} summary={data.summary} />
        </div>
      </section>

      {/* Source Link */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10 text-center">
          <p className="font-serif text-sm italic text-muted-foreground">
            AI-generated summary for informational purposes only.
          </p>
          <a
            href={data.bill.congressUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 font-mono text-xs tracking-widest uppercase text-urgent hover:underline"
          >
            View official bill on Congress.gov →
          </a>
        </div>
      </section>
    </>
  );
}
