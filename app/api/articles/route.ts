import { NextResponse } from "next/server";
import type { ArticlePayload } from "@/api/contracts";
import { getCurrentUser } from "@/lib/auth";
import { featuredArticles } from "@/lib/articles";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateArticleInput } from "@/lib/validators";

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
    articles: (data || []).map((article) => ({
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

export async function POST(request: Request) {
  let payload: ArticlePayload;

  try {
    payload = validateArticleInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid article payload." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Configure Supabase environment variables before creating articles." },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to create an article." }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .insert([
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
    ])
    .select()
    .single();

  if (error) {
    const status =
      error.code === "23505" ? 409 : error.code === "42501" || error.code === "PGRST301" ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ article: data }, { status: 201 });
}
