import { NextResponse } from "next/server";
import type { ArticlePayload } from "@/api/contracts";
import { getPublishedArticles } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateArticleInput } from "@/lib/validators";

type ArticleRow = {
  author: string;
  category: string;
  excerpt: string;
  id: string;
  published_at: string;
  read_time: string;
  slug: string;
  title: string;
};

type ArticleMutationGateway = {
  insert: (rows: Record<string, unknown>[]) => {
    select: () => {
      single: () => Promise<{
        data: Record<string, unknown> | null;
        error: { code?: string; message: string } | null;
      }>;
    };
  };
};

type ArticleRouteDependencies = {
  createSupabaseServerClient: () => Promise<{
    from: (table: string) => unknown;
  }>;
  getCurrentUser: () => Promise<{ id: string } | null>;
  isSupabaseConfigured: () => boolean;
};

const articleRouteDependencies: ArticleRouteDependencies = {
  createSupabaseServerClient,
  getCurrentUser,
  isSupabaseConfigured,
};

export async function GET() {
  const articles = await getPublishedArticles();
  return NextResponse.json({ articles, source: isSupabaseConfigured() ? "supabase" : "seed" });
}

export async function handleCreateArticle(
  request: Request,
  dependencies: ArticleRouteDependencies = articleRouteDependencies,
) {
  let payload: ArticlePayload;

  try {
    payload = validateArticleInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid article payload." }, { status: 400 });
  }

  if (!dependencies.isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Configure Supabase environment variables before creating articles." },
      { status: 503 },
    );
  }

  const user = await dependencies.getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to create an article." }, { status: 401 });
  }

  const supabase = await dependencies.createSupabaseServerClient();
  const articles = supabase.from("articles") as ArticleMutationGateway;
  const mutation = articles.insert([
    {
      author: payload.author,
      author_slug: payload.authorSlug,
      category: payload.category,
      content: payload.content,
      created_by: user.id,
      excerpt: payload.excerpt,
      image_url: payload.imageUrl,
      is_featured: payload.isFeatured,
      league: payload.league,
      published_at: payload.status === "published" ? payload.publishedAt || new Date().toISOString() : null,
      read_time: payload.readTime || "5 min read",
      slug: payload.slug,
      status: payload.status,
      tags: payload.tags,
      team: payload.team || null,
      title: payload.title,
    },
  ]);
  const result = await mutation.select().single();
  const { data, error } = result;

  if (error) {
    const status =
      error.code === "23505" ? 409 : error.code === "42501" || error.code === "PGRST301" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ article: data }, { status: 201 });
}

export async function POST(request: Request) {
  return handleCreateArticle(request);
}
