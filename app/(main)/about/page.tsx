import { FileText, Search, Eye, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Page Header Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              About Us
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-center mb-4 tracking-tight text-balance">
            Making Legislation Accessible
          </h1>

          <p className="font-serif text-lg md:text-xl italic text-center text-muted-foreground max-w-2xl mx-auto">
            Because democracy works better when citizens are informed about the laws that govern their lives.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Our Mission
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="font-serif text-xl leading-relaxed text-foreground mb-6">
              Every year, Congress passes thousands of pages of legislation that directly affects
              the lives of everyday Americans. Yet most citizens never read these bills — and
              frankly, they shouldn&apos;t have to wade through dense legal language to understand
              what their government is doing.
            </p>
            <p className="font-serif text-xl leading-relaxed text-foreground">
              <strong>What&apos;s in That Bill?</strong> exists to bridge this gap. We use advanced
              AI to analyze Congressional legislation and translate complex legalese into clear,
              honest summaries that anyone can understand.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              How We Work
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            <div className="p-6 md:border-r border-foreground/20 border-b md:border-b-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-4xl font-black text-foreground/20">I</span>
                <FileText className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Data Collection</h3>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                We pull bill data directly from the official Congress.gov API, ensuring
                accuracy and timeliness. New legislation is processed within minutes.
              </p>
            </div>

            <div className="p-6 md:border-r border-foreground/20 border-b md:border-b-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-4xl font-black text-foreground/20">II</span>
                <Search className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">AI Analysis</h3>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Our AI reads and analyzes the full text of each bill, identifying key provisions
                and potential implications that might otherwise go unnoticed.
              </p>
            </div>

            <div className="p-6 md:border-r border-foreground/20 border-b md:border-b-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-4xl font-black text-foreground/20">III</span>
                <Eye className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Plain Language</h3>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Complex legislative language is translated into clear, accessible summaries.
                We highlight what matters and explain the real-world impact.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-4xl font-black text-foreground/20">IV</span>
                <Shield className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Transparency</h3>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                We&apos;re committed to non-partisan analysis. Our summaries focus on what bills
                actually do, not political spin. We always link to official sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Our Sources
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <div className="max-w-3xl mx-auto border-2 border-foreground p-6 md:p-8">
            <h3 className="font-serif text-2xl font-bold mb-6">Data Attribution</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="font-bold text-urgent">•</span>
                <p className="text-foreground">
                  <strong>Bill Data:</strong> Sourced from the official{" "}
                  <a
                    href="https://api.congress.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-urgent hover:underline"
                  >
                    Congress.gov API
                  </a>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-urgent">•</span>
                <p className="text-foreground">
                  <strong>AI Summaries:</strong> Generated using advanced language models
                  (Claude by Anthropic)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-urgent">•</span>
                <p className="text-foreground">
                  <strong>Updates:</strong> Bill data synced regularly to ensure currency
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10 text-center">
          <p className="font-serif text-lg italic text-muted-foreground">
            AI-generated summaries are for informational purposes only.
            <br />
            Always refer to official sources for authoritative legal information.
          </p>
        </div>
      </section>
    </>
  );
}
