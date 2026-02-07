export function Masthead() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="border-b-[3px] border-foreground">
      {/* Top rule line */}
      <div className="border-b border-foreground/30 px-6 py-2 flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          Legislative Transparency for the People
        </span>
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          {formattedDate}
        </span>
      </div>

      {/* Main masthead */}
      <div className="px-6 py-6 md:py-10 text-center">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-balance">
          {"What's in That Bill"}
        </h1>
        <div className="mt-3 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-24 bg-foreground/40" />
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Cut Through the Legalese
          </p>
          <div className="h-px flex-1 max-w-24 bg-foreground/40" />
        </div>
      </div>

      {/* Edition bar */}
      <div className="border-t border-foreground/30 px-6 py-2 flex items-center justify-between">
        <nav className="flex items-center gap-4 md:gap-6 flex-wrap">
          <a
            href="/bills"
            className="font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors"
          >
            All Bills
          </a>
          <a
            href="/senate-bills"
            className="font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors"
          >
            Senate
          </a>
          <a
            href="/house-bills"
            className="font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors"
          >
            House
          </a>
          <a
            href="/about"
            className="font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors hidden sm:inline"
          >
            About
          </a>
          <a
            href="/contact"
            className="font-mono text-xs tracking-widest uppercase text-foreground hover:text-urgent transition-colors hidden sm:inline"
          >
            Contact
          </a>
        </nav>
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground hidden md:block">
          119th Congress
        </span>
      </div>
    </header>
  )
}
