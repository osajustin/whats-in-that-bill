"use client"

import React from "react"

import { useState } from "react"

export function CtaSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="border-b-[3px] border-foreground">
      <div className="p-6 md:p-10 lg:p-16 text-center max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-2 justify-center">
          <div className="h-px w-12 bg-foreground/30" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Subscribe
          </span>
          <div className="h-px w-12 bg-foreground/30" />
        </div>

        <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight mb-4 text-balance">
          {"Don't Let Legislation Pass You By"}
        </h2>
        <p className="font-serif text-lg md:text-xl italic text-muted-foreground mb-8 max-w-lg mx-auto">
          Get the morning briefing delivered to your inbox. Every bill, decoded.
          No spin, no jargon &mdash; just the truth.
        </p>

        {submitted ? (
          <div className="border-2 border-foreground p-6">
            <p className="font-serif text-2xl font-bold mb-1">
              {"You're"} on the List
            </p>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              {"Watch your inbox for the first edition"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
            <label htmlFor="email-input" className="sr-only">
              Your email address
            </label>
            <input
              id="email-input"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-2 border-foreground bg-background text-foreground font-mono text-sm tracking-wide px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-urgent"
            />
            <button
              type="submit"
              className="bg-foreground text-background font-mono text-xs tracking-widest uppercase px-6 py-3 border-2 border-foreground hover:bg-urgent hover:border-urgent hover:text-urgent-foreground transition-colors font-bold"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
