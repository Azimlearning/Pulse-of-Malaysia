import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resilience Radar | Pulse of Malaysia",
  description:
    "A data-driven dashboard revealing the link between economic stress and mental health in Malaysia. Simulate policy interventions and explore vulnerability hotspots.",
  keywords: ["Malaysia", "mental health", "economic vulnerability", "suicide prevention", "SDG 3", "SDG 8", "data dashboard"],
  openGraph: {
    title: "Resilience Radar | Pulse of Malaysia",
    description: "Simulate policy interventions and explore Malaysia's mental health vulnerability landscape.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
