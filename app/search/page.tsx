import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { getPublishedArticles } from "@/lib/content";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const metadata: Metadata = {
  description: "Search sports media coverage across articles, teams, leagues, and tags.",
  title: "Search coverage",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const articles = await getPublishedArticles({ query });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Search</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Find teams, players, leagues, and stories</h1>
        <form className="mt-6 flex flex-col gap-3 md:flex-row" method="get">
          <input
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            defaultValue={query}
            name="q"
            placeholder="Search coverage, tags, teams, or authors"
            type="search"
          />
          <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white" type="submit">
            Search
          </button>
        </form>
      </section>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.length ? (
          articles.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <p className="text-sm text-slate-600">No stories matched that search yet.</p>
        )}
      </div>
    </div>
  );
}
