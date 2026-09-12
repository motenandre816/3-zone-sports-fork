import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
        {article.category}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <span>{article.author}</span>
        <span>{article.readTime}</span>
      </div>
    </article>
  );
}
