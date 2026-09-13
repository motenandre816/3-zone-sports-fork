import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 3 Zone Sports. Built on a free Next.js + Supabase + Vercel stack.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/search" className="hover:text-slate-800">
            Search
          </Link>
          <Link href="/dashboard" className="hover:text-slate-800">
            Editorial Dashboard
          </Link>
          <p>Launch local coverage, analysis, and player features with a $0/month starter platform.</p>
        </div>
      </div>
    </footer>
  );
}
