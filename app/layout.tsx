import type { Metadata } from "next";
import { Lora, Source_Sans_3, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "What's in that Bill? | AI-Powered Congressional Bill Analysis",
  description:
    "Understand what's really in Congressional bills with AI-powered summaries. Get plain-language explanations of legislation affecting your life.",
  keywords: [
    "congress",
    "bills",
    "legislation",
    "AI",
    "summary",
    "analysis",
    "government",
  ],
  openGraph: {
    title: "What's in that Bill?",
    description: "AI-powered Congressional bill analysis made accessible",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${sourceSans.variable} ${geistMono.variable} min-h-screen bg-cream font-sans antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
