import type { Metadata } from "next";
import "./globals.css";
import { PageViewTracker } from "@/components/page-view-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: env.appName,
  description: "3 Zone Sports production-ready starter built with Next.js, TypeScript, Tailwind CSS, and Supabase.",
  metadataBase: new URL(env.siteUrl),
  openGraph: {
    description: "A free-stack sports media platform starter with editorial workflows, search, and audience tools.",
    title: env.appName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <PageViewTracker />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
