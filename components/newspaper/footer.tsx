import Link from "next/link"

export function Footer() {
  return (
    <footer className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <Link href="/" className="font-serif text-lg font-bold hover:text-urgent transition-colors">
            {"What's in That Bill"}
          </Link>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Legislative transparency for the people
          </p>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/bills"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Bills
          </Link>
          <Link
            href="/about"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
