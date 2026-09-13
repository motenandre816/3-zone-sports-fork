import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateNewsletterInput } from "@/lib/validators";

export async function POST(request: Request) {
  let payload;

  try {
    payload = validateNewsletterInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid newsletter payload." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "Supabase not connected yet. Newsletter signup captured for local prototype review." }, { status: 202 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email: payload.email,
      name: payload.name || null,
    },
    { onConflict: "email" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Thanks for joining the newsletter." }, { status: 201 });
}
