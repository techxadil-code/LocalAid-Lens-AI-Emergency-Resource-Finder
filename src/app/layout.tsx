import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Offbeat — AI Emergency Response Platform",
  description:
    "Turn emergency screenshots into actionable cards. AI-powered extraction from WhatsApp and Twitter messages to coordinate volunteer response in real-time.",
  keywords: [
    "emergency response",
    "AI",
    "volunteer coordination",
    "disaster relief",
    "real-time dashboard",
  ],
  openGraph: {
    title: "Offbeat — AI Emergency Response Platform",
    description:
      "Turn emergency screenshots into actionable cards for volunteers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
