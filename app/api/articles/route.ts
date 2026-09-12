import { NextResponse } from "next/server";
import type { ArticlePayload } from "@/api/contracts";
import { getCurrentUser } from "@/lib/auth";
import { featuredArticles } from "@/lib/articles";
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
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ articles: featuredArticles, source: "seed" });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, category, title, excerpt, author, published_at, read_time, slug")
    .order("published_at", { ascending: false });

  if (error) {
    return NextResponse.json({ articles: featuredArticles, error: error.message, source: "fallback" }, { status: 200 });
  }

  return NextResponse.json({
    articles: ((data || []) as ArticleRow[]).map((article) => ({
      author: article.author,
      category: article.category,
      excerpt: article.excerpt,
      id: article.id,
      publishedAt: article.published_at,
      readTime: article.read_time,
      slug: article.slug,
      title: article.title,
    })),
    source: "supabase",
  });
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
      category: payload.category,
      created_by: user.id,
      excerpt: payload.excerpt,
      published_at: new Date().toISOString(),
      read_time: payload.readTime || "5 min read",
      slug: payload.slug,
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
