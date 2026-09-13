import { featuredArticles, featuredComments } from "@/lib/articles";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Article, ArticleFilters, AuthorSummary, Comment } from "@/lib/types";

type ArticleRow = {
  author: string;
  author_slug: string;
  category: string;
  content: string;
  excerpt: string;
  id: string;
  image_url: string | null;
  is_featured: boolean | null;
  league: string;
  published_at: string | null;
  read_time: string;
  slug: string;
  status: "draft" | "published";
  tags: string[] | null;
  team: string | null;
  title: string;
};

type CommentRow = {
  article_slug: string;
  author_name: string;
  body: string;
  created_at: string;
  id: string;
};

function mapArticle(row: ArticleRow): Article {
  return {
    author: row.author,
    authorSlug: row.author_slug,
    category: row.category,
    content: row.content,
    excerpt: row.excerpt,
    id: row.id,
    imageUrl: row.image_url || "/window.svg",
    isFeatured: Boolean(row.is_featured),
    league: row.league,
    publishedAt: row.published_at || "",
    readTime: row.read_time,
    slug: row.slug,
    status: row.status,
    tags: row.tags || [],
    team: row.team || "",
    title: row.title,
  };
}

function mapComment(row: CommentRow): Comment {
  return {
    articleSlug: row.article_slug,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
    id: row.id,
  };
}

function filterArticles(articles: Article[], filters: ArticleFilters = {}) {
  const query = filters.query?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();

  let results = articles.filter((article) => article.status === "published");

  if (category) {
    results = results.filter((article) => article.category.toLowerCase() === category);
  }

  if (query) {
    results = results.filter((article) =>
      [article.title, article.excerpt, article.category, article.author, article.league, article.team, article.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  return typeof filters.limit === "number" ? results.slice(0, filters.limit) : results;
}

export async function getPublishedArticles(filters: ArticleFilters = {}) {
  if (!isSupabaseConfigured()) {
    return filterArticles(featuredArticles, filters);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, category, author, author_slug, read_time, published_at, content, image_url, tags, team, league, status, is_featured",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) {
    return filterArticles(featuredArticles, filters);
  }

  return filterArticles((data as ArticleRow[]).map(mapArticle), filters);
}

export async function getHomepageArticles() {
  return getPublishedArticles({ limit: 6 });
}

export async function getDashboardArticles() {
  if (!isSupabaseConfigured()) {
    return featuredArticles;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, category, author, author_slug, read_time, published_at, content, image_url, tags, team, league, status, is_featured",
    )
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return featuredArticles;
  }

  return (data as ArticleRow[]).map(mapArticle);
}

export async function getArticleBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return featuredArticles.find((article) => article.slug === slug) || null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, category, author, author_slug, read_time, published_at, content, image_url, tags, team, league, status, is_featured",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return featuredArticles.find((article) => article.slug === slug) || null;
  }

  return mapArticle(data as ArticleRow);
}

export async function getArticlesByAuthor(authorSlug: string) {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.authorSlug === authorSlug);
}

export async function getAuthorSummary(authorSlug: string): Promise<AuthorSummary | null> {
  const articles = await getArticlesByAuthor(authorSlug);

  if (!articles.length) {
    return null;
  }

  return {
    articleCount: articles.length,
    author: articles[0].author,
    authorSlug,
    bio: `Coverage and analysis from ${articles[0].author} across ${articles[0].league} and ${articles[0].category}.`,
    favoriteTeam: articles[0].team,
    latestArticleTitle: articles[0].title,
  };
}

export async function getCategories() {
  const articles = await getPublishedArticles();
  return Array.from(new Set(articles.map((article) => article.category))).sort();
}

export async function getCommentsForArticle(articleSlug: string) {
  if (!isSupabaseConfigured()) {
    return featuredComments.filter((comment) => comment.articleSlug === articleSlug);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, article_slug, author_name, body, created_at")
    .eq("article_slug", articleSlug)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return featuredComments.filter((comment) => comment.articleSlug === articleSlug);
  }

  return (data as CommentRow[]).map(mapComment);
}

export async function getRelatedArticles(article: Article) {
  const articles = await getPublishedArticles();
  return articles
    .filter((candidate) => candidate.slug !== article.slug && candidate.category === article.category)
    .slice(0, 3);
}
