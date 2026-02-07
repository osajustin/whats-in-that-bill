export function Footer() {
  return (
    <footer className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-serif text-lg font-bold">{"What's in That Bill"}</p>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Legislative transparency for the people
          </p>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Sources
          </a>
          <a
            href="#"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </nav>
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
