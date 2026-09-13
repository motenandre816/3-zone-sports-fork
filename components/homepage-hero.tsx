import Link from "next/link";

export function HomepageHero() {
  return (
    <section className="rounded-3xl bg-slate-900 px-8 py-14 text-white shadow-xl">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
          Production-ready sports media starter
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Publish local coverage, player stories, and league analysis from one free stack.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          Use Next.js App Router, Supabase Auth, and deploy to Vercel with a codebase that is ready for
          articles, profiles, and protected editorial workflows.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
            href="/signup"
          >
            Launch free account
          </Link>
          <Link
            className="rounded-full border border-slate-500 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300"
            href="#featured-content"
          >
            Explore layout
          </Link>
        </div>
      </div>
    </section>
  );
}
