import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { CommentForm } from "@/components/comment-form";
import { getArticleBySlug, getCommentsForArticle, getRelatedArticles } from "@/lib/content";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    description: article.excerpt,
    title: article.title,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const [comments, relatedArticles] = await Promise.all([
    getCommentsForArticle(article.slug),
    getRelatedArticles(article),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="relative aspect-[16/8]">
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
        </div>
        <div className="space-y-6 p-8">
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            <Link href={`/categories/${encodeURIComponent(article.category.toLowerCase())}`}>{article.category}</Link>
            <span>{article.league}</span>
            <span>{article.team}</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{article.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Link href={`/authors/${article.authorSlug}`} className="font-semibold text-slate-700">
              {article.author}
            </Link>
            <span>•</span>
            <span>{article.publishedAt || "Draft"}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <div className="space-y-4 text-base leading-8 text-slate-700">
            {article.content.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Community comments</h2>
          {comments.length ? (
            comments.map((comment) => (
              <article key={comment.id} className="rounded-2xl border border-slate-200 px-4 py-4">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <strong className="text-slate-900">{comment.authorName}</strong>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{comment.body}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-600">No comments yet. Be the first to respond.</p>
          )}
        </div>
        <CommentForm articleSlug={article.slug} />
      </section>

      {relatedArticles.length ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Related coverage</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
