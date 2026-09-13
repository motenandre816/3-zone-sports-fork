"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/types";

type EditorDashboardProps = {
  articles: Article[];
  selectedArticle: Article | null;
};

function tagsToString(tags: string[]) {
  return tags.join(", ");
}

export function EditorDashboard({ articles, selectedArticle }: EditorDashboardProps) {
  const [message, setMessage] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(selectedArticle?.slug || "");

  const activeArticle = useMemo(
    () => articles.find((article) => article.slug === selectedSlug) || selectedArticle || null,
    [articles, selectedArticle, selectedSlug],
  );

  async function handleSubmit(formData: FormData) {
    const payload = {
      author: String(formData.get("author") || ""),
      authorSlug: String(formData.get("authorSlug") || ""),
      category: String(formData.get("category") || ""),
      content: String(formData.get("content") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      isFeatured: formData.get("isFeatured") === "on",
      league: String(formData.get("league") || ""),
      publishedAt: String(formData.get("publishedAt") || "") || null,
      readTime: String(formData.get("readTime") || ""),
      slug: String(formData.get("slug") || ""),
      status: String(formData.get("status") || "draft"),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      team: String(formData.get("team") || ""),
      title: String(formData.get("title") || ""),
    };

    const isEditing = Boolean(activeArticle);
    const response = await fetch(isEditing ? `/api/articles/${activeArticle?.slug}` : "/api/articles", {
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
      method: isEditing ? "PUT" : "POST",
    });

    const result = await response.json();
    setMessage(result.error || (isEditing ? "Article updated." : "Article created."));

    if (result.article?.slug) {
      setSelectedSlug(result.article.slug);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Existing stories</h2>
        <p className="mt-2 text-sm text-slate-600">Select a story to edit publish status, metadata, and body copy.</p>
        <div className="mt-6 space-y-3">
          {articles.map((article) => (
            <button
              key={article.slug}
              className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-300"
              onClick={() => setSelectedSlug(article.slug)}
              type="button"
            >
              <div>
                <p className="font-semibold text-slate-900">{article.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {article.category} • {article.league}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
                {article.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      <form action={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{activeArticle ? "Edit article" : "Create article"}</h2>
          <p className="mt-2 text-sm text-slate-600">Manage rich sports article metadata, publishing status, and body content.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.title} name="title" placeholder="Title" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.slug} name="slug" placeholder="Slug" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.author} name="author" placeholder="Author" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.authorSlug} name="authorSlug" placeholder="Author slug" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.category} name="category" placeholder="Category" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.league} name="league" placeholder="League" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.team} name="team" placeholder="Team" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.readTime} name="readTime" placeholder="Read time" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" defaultValue={activeArticle?.imageUrl} name="imageUrl" placeholder="Image URL" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" defaultValue={activeArticle ? tagsToString(activeArticle.tags) : ""} name="tags" placeholder="Tags, comma separated" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" defaultValue={activeArticle?.excerpt} name="excerpt" placeholder="Excerpt" required />
        </div>
        <textarea className="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.content} name="content" placeholder="Full article content" required />
        <div className="grid gap-4 md:grid-cols-3">
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.status || "draft"} name="status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={activeArticle?.publishedAt} name="publishedAt" placeholder="2026-09-13T12:00:00.000Z" />
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700">
            <input defaultChecked={activeArticle?.isFeatured} name="isFeatured" type="checkbox" />
            Feature on homepage
          </label>
        </div>
        <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white" type="submit">
          {activeArticle ? "Save article" : "Create article"}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </div>
  );
}
