"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Page Header Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Get in Touch
            </span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-center mb-4 tracking-tight text-balance">
            Contact Us
          </h1>

          <p className="font-serif text-lg md:text-xl italic text-center text-muted-foreground max-w-2xl mx-auto">
            Have a question, feedback, or tip? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Form */}
            <div className="lg:col-span-8 lg:border-r border-foreground/30 lg:pr-10 pb-10 lg:pb-0">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-foreground" />
                <h2 className="font-serif text-2xl font-bold">Send a Message</h2>
              </div>

              {submitted ? (
                <div className="border-2 border-foreground p-8 text-center">
                  <Send className="h-12 w-12 text-urgent mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    We&apos;ll get back to you soon
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-2 border-foreground/30 bg-background px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-foreground/30 bg-background px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-2 border-foreground/30 bg-background px-4 py-3 font-sans text-foreground focus:border-foreground focus:outline-none"
                    >
                      <option value="">Select a topic...</option>
                      <option value="feedback">General Feedback</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="press">Press Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border-2 border-foreground/30 bg-background px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background font-mono text-xs tracking-widest uppercase px-6 py-4 hover:bg-urgent hover:text-urgent-foreground transition-colors font-bold"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 lg:pl-10 pt-10 lg:pt-0">
              <div className="border-2 border-foreground p-6 mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:hello@whatsinthatbill.com"
                      className="font-serif text-lg text-urgent hover:underline"
                    >
                      hello@whatsinthatbill.com
                    </a>
                  </div>
                  <div className="h-px bg-foreground/20" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Response Time
                    </p>
                    <p className="font-sans text-sm text-foreground">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-urgent p-4 bg-urgent/5">
                <p className="font-serif text-sm italic text-foreground">
                  &quot;Sunlight is said to be the best of disinfectants.&quot;
                </p>
                <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mt-2">
                  — Louis Brandeis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="border-b-[3px] border-foreground">
        <div className="p-6 md:p-10 text-center">
          <p className="font-serif text-lg italic text-muted-foreground">
            Your feedback helps us improve transparency in government.
          </p>
        </div>
      </section>
    </>
  );
}
