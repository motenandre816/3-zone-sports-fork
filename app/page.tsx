import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { HomepageHero } from "@/components/homepage-hero";
import { featuredArticles } from "@/lib/articles";

const stackItems = [
  "Next.js App Router for frontend and backend routes",
  "Supabase PostgreSQL schema for articles and user profiles",
  "Supabase Auth for sign-in, sign-up, and session-aware pages",
  "Tailwind CSS for fast, free, production-ready styling",
  "Vercel deployment configuration for a $0/month launch path",
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10">
      <HomepageHero />

      <section className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Foundation</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            A clean starting point for content, membership, and newsroom workflows
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The repository now ships with the core structure needed to build 3 Zone Sports into a scalable
            sports media platform without introducing paid dependencies.
          </p>
        </div>
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {stackItems.map((item) => (
            <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="featured-content" className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Featured content</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Starter article cards ready for live stories
            </h2>
          </div>
          <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" href="/api/articles">
            View articles API
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
