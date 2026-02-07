"use client"

const items = [
  "H.R. 4821 — Digital Identity Verification Act moves to committee",
  "S. 1337 — Infrastructure Package passes Senate 62-38",
  "H.R. 5102 — Education Funding Amendment added at 3 AM markup",
  "S. 998 — Data Privacy Reform stalls in subcommittee",
  "H.R. 4400 — Defense Spending Bill receives 14 last-minute riders",
  "S. 2100 — Healthcare Expansion Act faces filibuster threat",
]

export function Ticker() {
  return (
    <div className="border-b border-foreground/30 bg-foreground text-background overflow-hidden">
      <div className="flex items-center">
        <span className="bg-urgent text-urgent-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-4 py-2 shrink-0 z-10">
          Live
        </span>
        <div className="flex animate-ticker whitespace-nowrap py-2">
          {[...items, ...items].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-mono text-xs tracking-wide px-8 inline-block"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
