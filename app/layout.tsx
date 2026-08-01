import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NULLSET — Decision Compiler",
  description:
    "Find the minimum evidence that can change a high-stakes decision. Causal simulation, local retrieval, and proof planning in one explainable instrument.",
  applicationName: "NULLSET",
  keywords: ["decision intelligence", "causal inference", "scenario planning", "evidence", "Monte Carlo"],
  openGraph: {
    title: "NULLSET — Find the fact that changes the decision.",
    description: "A local-first decision compiler for irreversible bets.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NULLSET — Decision Compiler",
    description: "Find the minimum evidence that can change a high-stakes decision.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
