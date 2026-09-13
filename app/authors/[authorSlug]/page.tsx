import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { getArticlesByAuthor, getAuthorSummary } from "@/lib/content";

type AuthorPageProps = {
  params: Promise<{
    authorSlug: string;
  }>;
};

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { authorSlug } = await params;
  const author = await getAuthorSummary(authorSlug);
  return { title: author ? `${author.author} | 3 Zone Sports` : "Author not found" };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { authorSlug } = await params;
  const [author, articles] = await Promise.all([getAuthorSummary(authorSlug), getArticlesByAuthor(authorSlug)]);

  if (!author) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Author profile</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{author.author}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{author.bio}</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{author.articleCount} published stories</span>
          <span>Favorite beat: {author.favoriteTeam}</span>
          <Link href="/search" className="font-semibold text-slate-700">
            Search all coverage
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Latest stories</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
