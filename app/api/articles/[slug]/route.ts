import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getArticleBySlug } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateArticleInput } from "@/lib/validators";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Configure Supabase environment variables before editing articles." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to update an article." }, { status: 401 });
  }

  let payload;

  try {
    payload = validateArticleInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid article payload." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .update({
      author: payload.author,
      author_slug: payload.authorSlug,
      category: payload.category,
      content: payload.content,
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
    })
    .eq("slug", slug)
    .eq("created_by", user.id)
    .select(
      "id, title, slug, excerpt, category, author, author_slug, read_time, published_at, content, image_url, tags, team, league, status, is_featured",
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "23505" ? 409 : 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  return NextResponse.json({
    article: {
      author: data.author,
      authorSlug: data.author_slug,
      category: data.category,
      content: data.content,
      excerpt: data.excerpt,
      id: data.id,
      imageUrl: data.image_url || "/window.svg",
      isFeatured: Boolean(data.is_featured),
      league: data.league,
      publishedAt: data.published_at || "",
      readTime: data.read_time,
      slug: data.slug,
      status: data.status,
      tags: data.tags || [],
      team: data.team || "",
      title: data.title,
    },
  });
}
