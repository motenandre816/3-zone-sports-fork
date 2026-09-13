import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateCommentInput } from "@/lib/validators";

export async function POST(request: Request) {
  let payload;

  try {
    payload = validateCommentInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid comment payload." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "Supabase not connected yet. Comment captured for local prototype review." }, { status: 202 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comments").insert([
    {
      article_slug: payload.articleSlug,
      author_name: payload.authorName,
      body: payload.body,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment submitted successfully." }, { status: 201 });
}
