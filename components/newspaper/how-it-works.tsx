const steps = [
  {
    number: "I",
    headline: "Bill Introduced",
    body: "New legislation is filed in Congress. Our system ingests the full text within minutes of publication.",
  },
  {
    number: "II",
    headline: "AI Decodes It",
    body: "We parse every section, amendment, and rider. Dense legalese is translated into plain, honest language.",
  },
  {
    number: "III",
    headline: "You Read the Truth",
    body: "Get a clear, structured breakdown: what the bill does, who it affects, and what they don't want you to notice.",
  },
  {
    number: "IV",
    headline: "Stay Informed",
    body: "Track bills that matter to you. Receive alerts when amendments are added or votes are scheduled.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b-[3px] border-foreground">
      <div className="p-6 md:p-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-px flex-1 bg-foreground/30" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
            How It Works
          </span>
          <div className="h-px flex-1 bg-foreground/30" />
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-black text-center mb-10 tracking-tight">
          From Bill to Briefing in Minutes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`p-6 ${i < steps.length - 1 ? "md:border-r border-foreground/20" : ""} ${i < steps.length - 1 ? "border-b md:border-b-0 border-foreground/20" : ""}`}
            >
              <div className="flex gap-4">
                <span className="font-serif text-5xl md:text-6xl font-black text-foreground/15 leading-none shrink-0">
                  {step.number}
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-bold mb-1">{step.headline}</h3>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
