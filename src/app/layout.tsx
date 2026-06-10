import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Send Signal — WhatsApp Outreach & Campaign Automation",
  description: "Automate personalized WhatsApp outreach campaigns with lead import, templates, tracking, and analytics.",
  keywords: ["WhatsApp marketing automation", "WhatsApp outreach tool", "WhatsApp bulk messaging software", "WhatsApp lead generation tool", "WhatsApp campaign automation", "WhatsApp CRM automation", "WhatsApp Business API messaging", "send bulk WhatsApp messages legally", "WhatsApp sales automation"],
  authors: [{ name: "Send Signal" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
