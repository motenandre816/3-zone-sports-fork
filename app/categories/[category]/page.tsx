import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { getPublishedArticles } from "@/lib/content";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    description: `Browse ${category} coverage on 3 Zone Sports.`,
    title: `${category} coverage`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const normalizedCategory = decodeURIComponent(category).toLowerCase();
  const articles = await getPublishedArticles();
  const filtered = articles.filter((article) => article.category.toLowerCase() === normalizedCategory);

  if (!filtered.length) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Category</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{filtered[0].category}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Explore the latest {filtered[0].category} stories, analysis, and player features from 3 Zone Sports.
        </p>
      </section>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
