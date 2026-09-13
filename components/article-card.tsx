import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
        <Link href={`/categories/${encodeURIComponent(article.category.toLowerCase())}`}>{article.category}</Link>
        <span className="text-slate-300">•</span>
        <span>{article.league}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <Link href={`/authors/${article.authorSlug}`}>{article.author}</Link>
        <span>{article.readTime}</span>
      </div>
    </article>
  );
}
